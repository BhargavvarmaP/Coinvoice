import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { authenticator } from "otplib"
import QRCode from "qrcode"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Generate secret
    const secret = authenticator.generateSecret()
    
    // Generate QR code
    const otpauth = authenticator.keyuri(
      session.user.email || "",
      "CoInvoice",
      secret
    )
    
    const qrCode = await QRCode.toDataURL(otpauth)

    // Store secret in database
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        twoFactorSecret: secret,
      },
    })

    return NextResponse.json({ secret, qrCode })
  } catch (error) {
    console.error("[2FA_SETUP]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 