"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import QRCode from "qrcode.react"

export function TwoFactorSetup() {
  const [secret, setSecret] = useState<string>("")
  const [qrCode, setQrCode] = useState<string>("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSetup = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to setup 2FA")
      }

      const data = await response.json()
      setSecret(data.secret)
      setQrCode(data.qrCode)
      toast.success("2FA setup initiated")
    } catch (error) {
      toast.error("Failed to setup 2FA")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      })

      if (!response.ok) {
        throw new Error("Invalid verification code")
      }

      toast.success("2FA enabled successfully")
      // Close modal or redirect
    } catch (error) {
      toast.error("Invalid verification code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {!secret ? (
        <Button onClick={handleSetup} disabled={isLoading}>
          {isLoading ? "Setting up..." : "Setup 2FA"}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <QRCode value={qrCode} size={200} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <Input
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
            />
          </div>
          <Button onClick={handleVerify} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify and Enable"}
          </Button>
        </div>
      )}
    </div>
  )
} 