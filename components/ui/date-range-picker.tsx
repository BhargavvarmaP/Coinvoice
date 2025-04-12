"use client"

import * as React from "react"
import { format,Locale } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const predefinedRanges = [
  { label: "Today", days: 0 },
  { label: "Yesterday", days: 1 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "This month", type: "thisMonth" },
  { label: "Last month", type: "lastMonth" },
  { label: "This year", type: "thisYear" },
  { label: "Custom", type: "custom" },
]

export interface DatePickerWithRangeProps {
  className?: string
  value?: DateRange | undefined
  onChange?: (date: DateRange | undefined) => void
  showPresets?: boolean
  align?: "start" | "center" | "end"
  locale?: Locale
  disabled?: boolean | { from?: boolean; to?: boolean }
  placeholder?: string
}

export function DatePickerWithRange({
  className,
  value,
  onChange,
  showPresets = true,
  align = "start",
  locale,
  disabled = false,
  placeholder = "Select date range",
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value)
  const [selectedPreset, setSelectedPreset] = React.useState<string>("custom")
  const [isOpen, setIsOpen] = React.useState(false)

  // Update internal state when external value changes
  React.useEffect(() => {
    if (value) {
      setDate(value)
    }
  }, [value])

  // Handle date change from calendar
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate)
    setSelectedPreset("custom")
    
    if (onChange) {
      onChange(newDate)
    }
  }

  // Calculate the start date for a preset range
  const getStartDate = (days: number): Date => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - days)
    return date
  }

  // Apply a predefined date range based on user selection
  const applyPreset = (preset: string) => {
    setSelectedPreset(preset)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let from: Date | undefined
    let to: Date = new Date(today)
    to.setHours(23, 59, 59, 999)
    
    const foundPreset = predefinedRanges.find(r => r.label === preset)
    
    if (!foundPreset) return
    
    // Initialize from with a default value
    from = undefined
    
    if (foundPreset.days !== undefined) {
      if (foundPreset.days === 0) {
        // Today
        from = new Date(today)
      } else if (foundPreset.days === 1) {
        // Yesterday
        from = getStartDate(1)
        to = new Date(from)
        to.setHours(23, 59, 59, 999)
      } else {
        // Last X days
        from = getStartDate(foundPreset.days - 1)
      }
    } else if (foundPreset.type === "thisMonth") {
      from = new Date(today.getFullYear(), today.getMonth(), 1)
    } else if (foundPreset.type === "lastMonth") {
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      to = new Date(today.getFullYear(), today.getMonth(), 0)
      to.setHours(23, 59, 59, 999)
    } else if (foundPreset.type === "thisYear") {
      from = new Date(today.getFullYear(), 0, 1)
    } else if (foundPreset.type === "custom") {
      // For custom, just leave the date as is and allow manual selection
      return
    }
    
    if (!from) return
    
    const newRange = { from, to }
    setDate(newRange)
    
    if (onChange) {
      onChange(newRange)
    }
    
    if (preset !== "Custom") {
      setIsOpen(false)
    }
  }

  const formattedDateRange = React.useMemo(() => {
    if (!date?.from) {
      return placeholder
    }

    if (date.to) {
      return `${format(date.from, "LLL dd, yyyy")} - ${format(date.to, "LLL dd, yyyy")}`
    }
    
    return format(date.from, "LLL dd, yyyy")
  }, [date, placeholder])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled === true}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formattedDateRange}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          {showPresets && (
            <div className="border-b border-border/50 px-3 py-2">
              <Select
                value={selectedPreset}
                onValueChange={applyPreset}
              >
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {predefinedRanges.map((range) => (
                    <SelectItem key={range.label} value={range.label}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
         <Calendar
  initialFocus
  mode="range"
  defaultMonth={date?.from}
  selected={date}
  onSelect={handleDateChange}
  numberOfMonths={2}
  locale={locale}
  disabled={typeof disabled === 'boolean' ? disabled : undefined}
  className="p-3"
/>
          <div className="flex items-center justify-between border-t border-border/50 p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDate(undefined)
                if (onChange) onChange(undefined)
                setSelectedPreset("custom")
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}