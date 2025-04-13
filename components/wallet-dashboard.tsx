import { useAppStore } from '../stores/appStore'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { DollarSign, Lock, Wallet } from 'lucide-react'

const { assets, transactions, walletBalance } = useAppStore()

<div className="grid gap-4 md:grid-cols-3">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
      <DollarSign className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">${walletBalance.total.toFixed(2)}</div>
      <p className="text-xs text-muted-foreground">
        Available: ${walletBalance.available.toFixed(2)}
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Locked Balance</CardTitle>
      <Lock className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">${walletBalance.locked.toFixed(2)}</div>
      <p className="text-xs text-muted-foreground">
        In escrow or pending transactions
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
      <Wallet className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-sm font-mono truncate">{walletBalance.walletAddress}</div>
      <p className="text-xs text-muted-foreground">
        Connected wallet
      </p>
    </CardContent>
  </Card>
</div> 