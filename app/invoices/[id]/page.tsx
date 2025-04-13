import { notFound } from 'next/navigation'

interface InvoicePageProps {
  params: {
    id: string
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  // In a real application, you would fetch the invoice data here
  // using the params.id
  const invoiceId = params.id

  // Example of handling non-existent invoices
  if (!invoiceId) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Invoice #{invoiceId}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Add your invoice details here */}
        <p>Invoice details for ID: {invoiceId}</p>
      </div>
    </div>
  )
} 