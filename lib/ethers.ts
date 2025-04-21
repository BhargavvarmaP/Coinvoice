import { ethers } from "ethers"

export async function verifyMessage(
  address: string,
  signature: string,
  message: string
): Promise<boolean> {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)
    return recoveredAddress.toLowerCase() === address.toLowerCase()
  } catch (error) {
    console.error("Message verification error:", error)
    return false
  }
} 