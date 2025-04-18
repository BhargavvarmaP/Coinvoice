"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TokenizationWizard } from "@/components/tokenization-wizard"

interface CreateInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateInvoiceModal({ open, onOpenChange }: CreateInvoiceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Tokenize Invoice</DialogTitle>
        </DialogHeader>
        <TokenizationWizard onComplete={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
