import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/admin/data-table"
import { columns } from "./columns"

export default async function InvoicesPage() {
  const invoices = await prisma.transaction.findMany({
    include: {
      fromWallet: true,
      toWallet: true,
      user: true,
    },
  })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
      </div>
      <DataTable columns={columns} data={invoices} />
    </div>
  )
} 