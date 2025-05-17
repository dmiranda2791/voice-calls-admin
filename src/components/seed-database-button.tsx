"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { seedInitialData } from "@/app/actions/seed-data"
import { seedSampleData } from "@/app/actions/seed-data"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export function SeedDatabaseButton() {
  const [loading, setLoading] = useState(false)
  const [initialSeeded, setInitialSeeded] = useState(false)
  const [sampleSeeded, setSampleSeeded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message])
    console.log(message)
  }

  const handleSeedInitial = async () => {
    setLoading(true)
    setError(null)
    setLogs([])
    addLog("Starting initial data seeding...")

    try {
      const result = await seedInitialData()

      if (result.success) {
        addLog("Initial data seeded successfully")
        setInitialSeeded(true)
      } else {
        addLog(`Error: ${result.error || "Unknown error"}`)
        setError(result.error || "Failed to seed initial data")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error("Error seeding initial data:", error)
      addLog(`Exception: ${errorMessage}`)
      setError(`Failed to seed initial data: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSeedSample = async () => {
    if (!initialSeeded) {
      setError("Please seed initial data first")
      return
    }

    setLoading(true)
    setError(null)
    setLogs([])
    addLog("Starting sample data seeding...")

    try {
      const result = await seedSampleData()

      if (result.success) {
        addLog(`Sample data seeded successfully: ${result.message}`)
        setSampleSeeded(true)
      } else {
        addLog(`Error: ${result.error || "Unknown error"}`)
        setError(result.error || "Failed to seed sample data")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error("Error seeding sample data:", error)
      addLog(`Exception: ${errorMessage}`)
      setError(`Failed to seed sample data: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Seed Database</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seed Database</DialogTitle>
          <DialogDescription>Populate the database with initial reference data and sample call data.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Step 1: Seed Reference Data</span>
              <Button
                onClick={handleSeedInitial}
                disabled={loading || initialSeeded}
                variant={initialSeeded ? "outline" : "default"}
                size="sm"
              >
                {loading && !initialSeeded && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialSeeded ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Completed
                  </>
                ) : (
                  "Seed Reference Data"
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Creates companies, call types, agent types, and evaluation statuses.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Step 2: Seed Sample Call Data</span>
              <Button
                onClick={handleSeedSample}
                disabled={loading || !initialSeeded || sampleSeeded}
                variant={sampleSeeded ? "outline" : "default"}
                size="sm"
              >
                {loading && initialSeeded && !sampleSeeded && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {sampleSeeded ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Completed
                  </>
                ) : (
                  "Seed Sample Data"
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Creates sample calls and evaluations using the reference data.
            </p>
          </div>

          {logs.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Logs</h4>
              <div className="bg-muted p-2 rounded-md max-h-40 overflow-y-auto text-xs font-mono">
                {logs.map((log, index) => (
                  <div key={index} className="py-0.5">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
