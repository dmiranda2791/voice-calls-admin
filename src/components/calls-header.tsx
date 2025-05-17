"use client"

import { CalendarIcon, Filter, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useState } from "react"
import { Input } from "@/components/ui/input"

// Call types
const CALL_TYPES = [
  "All Types",
  "Appointment adjustment",
  "Billing",
  "General inquiry",
  "General inquiry transfer",
  "Looking for someone",
  "Miscellaneous",
  "Missed call",
  "New appointment existing client",
  "New client English",
  "New client Spanish",
  "Time sensitive",
]

export function CallsHeader() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 gap-2">
        <h1 className="text-lg font-semibold mr-4">Call Logs</h1>

        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 pt-2 no-scrollbar">
          <div className="relative min-w-[200px] max-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search calls..." className="w-full pl-8" />
          </div>

          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="company1">Acme Corp</SelectItem>
              <SelectItem value="company2">Globex Inc</SelectItem>
              <SelectItem value="company3">Initech LLC</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="All Types">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Call type" />
            </SelectTrigger>
            <SelectContent>
              {CALL_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PP") : <span>Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <Button variant="outline" size="icon" className="md:hidden">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>

          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
