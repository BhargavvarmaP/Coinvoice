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

interface InvestModalProps {
  pool: {
    id: string
    name: string
    totalLiquidity: string
    apy: number
  }
  isOpen: boolean
  onClose: () => void
}

export function InvestModal({ pool, isOpen, onClose }: InvestModalProps) {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)

  const handleInvest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/pools/invest", {
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
        throw new Error("Failed to invest")
      }

      toast.success("Investment successful")
      router.refresh()
      onClose()
    } catch (error) {
      toast.error("Failed to invest")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0])
    const maxAmount = Number(formatEther(pool.totalLiquidity))
    const calculatedAmount = (maxAmount * value[0]) / 100
    setAmount(calculatedAmount.toString())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invest in {pool.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Investment Amount (ETH)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className="space-y-2">
            <Label>Percentage of Pool</Label>
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
            <Label>Estimated Returns</Label>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span>APY</span>
                <span>{pool.apy}%</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Return</span>
                <span>
                  {((Number(amount) * pool.apy) / 100).toFixed(4)} ETH
                </span>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={handleInvest}
            disabled={isLoading || !amount}
          >
            {isLoading ? "Investing..." : "Invest"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 