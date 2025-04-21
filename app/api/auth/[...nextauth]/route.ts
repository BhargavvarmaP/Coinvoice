import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { ethers } from "ethers"
import LinkedInProvider from "next-auth/providers/linkedin"
import { NextAuthOptions } from "next-auth"

// Create NextAuth handler
const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID!,
      clientSecret: process.env.LINKEDIN_SECRET!,
    }),
    // Add credentials provider for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        
        if (!user) {
          throw new Error("User not found")
        }
        
        // In a real app, you would check the password hash
        // For now, we'll just return the user
        return user
      },
    }),
    // Add wallet provider for wallet-based authentication
    CredentialsProvider({
      name: "dynamic",
      credentials: {
        address: { label: "Wallet Address", type: "text" },
        signature: { label: "Signature", type: "text" },
        message: { label: "Message", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Missing credentials")
        }

        try {
          const { address, signature, message } = credentials

          if (!address || !signature || !message) {
            throw new Error("Missing required fields")
          }

          // Verify the signature
          const recoveredAddress = ethers.verifyMessage(message, signature)
          
          if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            throw new Error("Invalid signature")
          }

          // Check if user exists
          let user = await prisma.user.findFirst({
            where: { 
              OR: [
                { address: address.toLowerCase() },
                { wallets: { some: { address: address.toLowerCase() } } }
              ]
            },
            include: { wallets: true }
          })

          // If user doesn't exist, create a new one
          if (!user) {
            user = await prisma.user.create({
              data: {
                address: address.toLowerCase(),
                name: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
                role: "user",
                wallets: {
                  create: {
                    address: address.toLowerCase(),
                    provider: "dynamic",
                  }
                }
              },
              include: { wallets: true }
            })
          }

          return user
        } catch (error: any) {
          console.error("Authentication error:", error)
          throw new Error(error.message || "Authentication failed")
        }
      },
    }),
    CredentialsProvider({
      id: "dynamic",
      name: "Dynamic",
      credentials: {
        address: { label: "Address", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.address || !credentials?.signature) {
          throw new Error("Missing credentials")
        }

        try {
          // Verify the signature
          const message = "Sign in to CoInvoice"
          const recoveredAddress = ethers.verifyMessage(message, credentials.signature)

          if (recoveredAddress.toLowerCase() !== credentials.address.toLowerCase()) {
            throw new Error("Invalid signature")
          }

          // Find or create user
          let user = await prisma.user.findFirst({
            where: { 
              OR: [
                { address: credentials.address.toLowerCase() },
                { wallets: { some: { address: credentials.address.toLowerCase() } } }
              ]
            },
            include: { wallets: true }
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                address: credentials.address.toLowerCase(),
                name: `${credentials.address.slice(0, 6)}...${credentials.address.slice(-4)}`,
                role: "user",
                wallets: {
                  create: {
                    address: credentials.address.toLowerCase(),
                    isDefault: true,
                    type: "dynamic",
                    name: "Dynamic Wallet"
                  }
                }
              },
              include: { wallets: true }
            })
          } else if (!user.wallets.some(w => w.address.toLowerCase() === credentials.address.toLowerCase())) {
            // If user exists but wallet is not linked, add it
            await prisma.wallet.create({
              data: {
                address: credentials.address.toLowerCase(),
                userId: user.id,
                isDefault: false,
                type: "dynamic",
                name: "Additional Dynamic Wallet"
              }
            })
          }

          return {
            id: user.id,
            address: user.address,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Dynamic authentication error:", error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.address = token.address as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role = user.role
        token.address = user.address
      }
      return token
    },
    signIn: async ({ user, account, profile }) => {
      if (account?.provider === "Wallet") {
        // Additional checks for wallet sign-in if needed
        return true
      }
      return true
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Web3Auth",
      credentials: {
        address: { label: "Address", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.address || !credentials?.signature) {
          throw new Error("Missing credentials")
        }

        try {
          // Verify the signature
          const message = "Sign in to CoInvoice"
          const recoveredAddress = ethers.verifyMessage(message, credentials.signature)

          if (recoveredAddress.toLowerCase() !== credentials.address.toLowerCase()) {
            throw new Error("Invalid signature")
          }

          // Find or create user
          let user = await prisma.user.findUnique({
            where: { address: credentials.address },
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                address: credentials.address,
                name: credentials.address.slice(0, 6) + "..." + credentials.address.slice(-4),
              },
            })
          }

          // Create or update wallet
          await prisma.wallet.upsert({
            where: { address: credentials.address },
            create: {
              address: credentials.address,
              userId: user.id,
              isDefault: true,
            },
            update: {
              userId: user.id,
            },
          })

          return {
            id: user.id,
            address: user.address,
            name: user.name,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          throw new Error("Authentication failed")
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
        session.user.address = token.address
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.address = user.address
      }
      return token
    },
  },
}