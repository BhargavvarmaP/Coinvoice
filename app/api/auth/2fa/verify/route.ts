import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { authenticator } from "otplib"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { code } = body

    // Get user's 2FA secret
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        twoFactorSecret: true,
      },
    })

    if (!user?.twoFactorSecret) {
      return new NextResponse("2FA not set up", { status: 400 })
    }

    // Verify code
    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    })

    if (!isValid) {
      return new NextResponse("Invalid code", { status: 400 })
    }

    // Enable 2FA
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        twoFactorEnabled: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[2FA_VERIFY]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 