"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle2, ExternalLink, Flag, MoreHorizontal, Play, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getEvaluations } from "@/app/actions/evaluations"
import type { Evaluation } from "@/lib/types"

// Evaluation status options
const EVALUATION_STATUS_OPTIONS = [
  { value: "pendiente", label: "Pendiente", color: "bg-red-200 text-red-800" },
  { value: "done", label: "Done", color: "bg-green-200 text-green-800" },
  { value: "feedback_not_clear", label: "Feedback Not clear", color: "bg-yellow-200 text-yellow-800" },
  { value: "old", label: "Old", color: "bg-gray-100 text-gray-800" },
  { value: "ai_limitation", label: "AI limitation", color: "bg-blue-600 text-white" },
  { value: "na", label: "NA", color: "bg-purple-200 text-purple-800" },
  { value: "go_deeper", label: "Go Deeper with this issue", color: "bg-gray-100 text-gray-800" },
  { value: "transcriber", label: "Transcriber", color: "bg-blue-200 text-blue-800" },
  { value: "edge_case", label: "Edge Case", color: "bg-gray-100 text-gray-800" },
  { value: "interruption", label: "Interruption", color: "bg-purple-200 text-purple-800" },
]

export function EvaluationsTable() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvaluations() {
      try {
        const data = await getEvaluations()
        setEvaluations(data)
      } catch (error) {
        console.error("Error fetching evaluations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluations()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending Review
          </Badge>
        )
      case "reviewed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Reviewed
          </Badge>
        )
      case "flagged":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Flagged
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground"
    if (score >= 9) return "text-green-600"
    if (score >= 8) return "text-blue-600"
    if (score >= 7) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreProgress = (score: number | null) => {
    if (score === null) return 0
    return score * 10
  }

  const getEvaluationStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>

    const statusOption = EVALUATION_STATUS_OPTIONS.find((option) => option.value === status)
    if (!statusOption) return <Badge variant="outline">{status}</Badge>

    return (
      <Badge variant="outline" className={`${statusOption.color}`}>
        {statusOption.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading evaluations...</span>
      </div>
    )
  }

  if (evaluations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">No evaluations found</p>
        <p className="text-sm text-muted-foreground">
          Use the "Seed Database" button in the Analytics page to add sample data.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Call ID</TableHead>
            <TableHead>AI Agent</TableHead>
            <TableHead>Call Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>LLM Score</TableHead>
            <TableHead>LLM Status</TableHead>
            <TableHead>QA Status</TableHead>
            <TableHead>Engineer Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations.map((evaluation) => (
            <TableRow key={evaluation.id}>
              <TableCell className="font-medium">{evaluation.call?.call_id}</TableCell>
              <TableCell>{evaluation.call?.agent_type?.name}</TableCell>
              <TableCell>{evaluation.call?.call_type?.name}</TableCell>
              <TableCell>{evaluation.call ? formatDate(evaluation.call.start_time) : "N/A"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={getScoreProgress(evaluation.llm_score)} className="h-2 w-[60px]" />
                  <span className={getScoreColor(evaluation.llm_score)}>
                    {evaluation.llm_score ? evaluation.llm_score.toFixed(1) : "N/A"}/10
                  </span>
                </div>
              </TableCell>
              <TableCell>{getEvaluationStatusBadge(evaluation.llm_status?.value)}</TableCell>
              <TableCell>{getEvaluationStatusBadge(evaluation.qa_status?.value)}</TableCell>
              <TableCell>{getEvaluationStatusBadge(evaluation.engineer_status?.value)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Play className="mr-2 h-4 w-4" />
                      <span>Play Call Recording</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      <span>Complete Evaluation</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Flag className="mr-2 h-4 w-4" />
                      <span>Flag Evaluation</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
