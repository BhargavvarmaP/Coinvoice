import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || "Unknown"
    const ip = headersList.get("x-forwarded-for") || "Unknown"

    return NextResponse.json({
      userAgent,
      ip,
    })
  } catch (error) {
    console.error("[SESSION_DETAILS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 