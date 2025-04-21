"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { formatEther, parseEther } from "ethers"

interface WithdrawModalProps {
  pool: {
    id: string
    name: string
    totalLiquidity: string
    apy: number
  }
  isOpen: boolean
  onClose: () => void
  userInvestment: {
    amount: string
    returns: string
  }
}

export function WithdrawModal({
  pool,
  isOpen,
  onClose,
  userInvestment,
}: WithdrawModalProps) {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)

  const handleWithdraw = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/pools/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          poolId: pool.id,
          amount: parseEther(amount).toString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to withdraw")
      }

      toast.success("Withdrawal successful")
      router.refresh()
      onClose()
    } catch (error) {
      toast.error("Failed to withdraw")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0])
    const maxAmount = Number(formatEther(userInvestment.amount))
    const calculatedAmount = (maxAmount * value[0]) / 100
    setAmount(calculatedAmount.toString())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw from {pool.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Withdrawal Amount (ETH)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className="space-y-2">
            <Label>Percentage of Investment</Label>
            <Slider
              value={[sliderValue]}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>{sliderValue}%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Current Position</Label>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span>Total Investment</span>
                <span>{formatEther(userInvestment.amount)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Total Returns</span>
                <span className="text-green-600">
                  +{formatEther(userInvestment.returns)} ETH
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Withdrawal Details</Label>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span>Withdrawal Amount</span>
                <span>{amount || "0"} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining Investment</span>
                <span>
                  {Number(formatEther(userInvestment.amount)) - Number(amount || "0")} ETH
                </span>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={handleWithdraw}
            disabled={isLoading || !amount}
          >
            {isLoading ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 