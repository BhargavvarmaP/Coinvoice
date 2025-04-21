import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, email, twoFactorEnabled } = body

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        email,
        twoFactorEnabled,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 