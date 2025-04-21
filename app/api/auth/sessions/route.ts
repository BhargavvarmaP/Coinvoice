import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const headersList = headers()
    const currentSessionId = headersList.get("x-session-id")

    // Get all sessions for the user
    const sessions = await prisma.session.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        expires: true,
        sessionToken: true,
      },
    })

    // Get user agent and IP for each session
    const sessionsWithDetails = await Promise.all(
      sessions.map(async (session) => {
        const response = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/sessions/${session.id}/details`,
          {
            headers: {
              "x-session-id": session.sessionToken,
            },
          }
        )

        if (!response.ok) {
          return {
            id: session.id,
            expires: session.expires,
            userAgent: "Unknown",
            ip: "Unknown",
            current: session.id === currentSessionId,
          }
        }

        const details = await response.json()
        return {
          id: session.id,
          expires: session.expires,
          userAgent: details.userAgent,
          ip: details.ip,
          current: session.id === currentSessionId,
        }
      })
    )

    return NextResponse.json(sessionsWithDetails)
  } catch (error) {
    console.error("[SESSIONS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 