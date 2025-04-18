import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // TODO: Replace with actual authentication logic
    // This is just a mock implementation
    if (email === "test@example.com" && password === "password") {
      const user = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "user",
      }

      const token = sign(user, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: "1d",
      })

      cookies().set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      })

      return NextResponse.json({ user })
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    )
  }
} 