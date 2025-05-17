"use client"

import { Menu, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileHeader() {
  return (
    <div className="flex items-center h-16 border-b px-4 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={() => {
          // This will be handled by the Sheet component
          const event = new CustomEvent("toggle-sidebar-mobile")
          window.dispatchEvent(event)
        }}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Phone className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold">Call QA</span>
      </div>
    </div>
  )
}
