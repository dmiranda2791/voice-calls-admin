"use client"

import { CalendarIcon, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useState } from "react"

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

// Evaluation status options
const EVALUATION_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pendiente", label: "Pendiente" },
  { value: "done", label: "Done" },
  { value: "feedback_not_clear", label: "Feedback Not clear" },
  { value: "old", label: "Old" },
  { value: "ai_limitation", label: "AI limitation" },
  { value: "na", label: "NA" },
  { value: "go_deeper", label: "Go Deeper with this issue" },
  { value: "transcriber", label: "Transcriber" },
  { value: "edge_case", label: "Edge Case" },
  { value: "interruption", label: "Interruption" },
]

export function EvaluationsHeader() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 gap-2">
        <h1 className="text-lg font-semibold mr-4">Evaluations</h1>

        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 pt-2 no-scrollbar">
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

          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {EVALUATION_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
