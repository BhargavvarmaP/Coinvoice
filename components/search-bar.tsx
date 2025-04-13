import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search transactions, invoices, users..."
        className="w-[300px] pl-9 bg-background/95 backdrop-blur-sm"
      />
    </div>
  )
} 