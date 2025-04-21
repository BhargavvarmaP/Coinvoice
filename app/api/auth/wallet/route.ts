import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { prisma } from '@/lib/prisma';
import { sign } from 'jsonwebtoken';
import { cookies } from "next/headers"
import { verifyMessage } from "@/lib/ethers"

// Secret key for JWT signing - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Wallet authentication API route
 * This handles wallet-based authentication by verifying the signature
 * and creating or retrieving a user based on the wallet address
 */
export async function POST(request: NextRequest) {
  try {
    const { address, signature, message } = await request.json()

    // Verify the signature
    const isValid = await verifyMessage(address, signature, message)
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      )
    }

    // Create user object
    const user = {
      id: address,
      address,
      name: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
      role: "user",
    }

    // Generate tokens
    const accessToken = sign(user, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "1d",
    })

    const refreshToken = sign(user, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    // Set cookies
    cookies().set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    })

    cookies().set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      accessToken,
      refreshToken,
      user,
    })
  } catch (error) {
    console.error("Wallet authentication error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}