"use client"

import { useState } from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for recent calls
const recentCalls = [
  {
    id: "CALL-1234",
    aiAgent: "Customer Support AI",
    company: "Acme Corp",
    startTime: "2023-05-14T10:30:00",
    duration: "4:32",
    summary: "Customer inquired about premium plan features and pricing",
    status: "pending",
    endReason: "customer-ended",
    sentiment: "positive",
    reviewer: "John Doe",
    callType: "General inquiry",
  },
  {
    id: "CALL-1235",
    aiAgent: "Technical Support AI",
    company: "Globex Inc",
    startTime: "2023-05-14T11:15:00",
    duration: "2:47",
    summary: "Technical support for account access issues",
    status: "reviewed",
    endReason: "forwarded",
    sentiment: "neutral",
    reviewer: "Jane Smith",
    callType: "General inquiry transfer",
  },
  {
    id: "CALL-1236",
    aiAgent: "Billing Support AI",
    company: "Initech LLC",
    startTime: "2023-05-14T12:05:00",
    duration: "6:18",
    summary: "Complaint about billing discrepancy",
    status: "flagged",
    endReason: "silence",
    sentiment: "negative",
    reviewer: "John Doe",
    callType: "Billing",
  },
  {
    id: "CALL-1237",
    aiAgent: "Customer Support AI",
    company: "Acme Corp",
    startTime: "2023-05-14T13:22:00",
    duration: "3:51",
    summary: "Product return request and refund policy discussion",
    status: "pending",
    endReason: "customer-ended",
    sentiment: "very_positive",
    reviewer: null,
    callType: "General inquiry",
  },
  {
    id: "CALL-1238",
    aiAgent: "Sales AI",
    company: "Globex Inc",
    startTime: "2023-05-14T14:10:00",
    duration: "5:03",
    summary: "Upgrade request from basic to premium plan",
    status: "reviewed",
    endReason: "customer-ended",
    sentiment: "very_negative",
    reviewer: "Jane Smith",
    callType: "New appointment existing client",
  },
]

export function RecentCallsTable() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

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

  const getEndReasonBadge = (reason: string) => {
    switch (reason) {
      case "customer-ended":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Customer Ended
          </Badge>
        )
      case "forwarded":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Forwarded
          </Badge>
        )
      case "silence":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Silence
          </Badge>
        )
      default:
        return <Badge variant="outline">{reason}</Badge>
    }
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "very_positive":
        return (
          <Badge variant="outline" className="bg-green-700 text-white border-green-800">
            Very Positive
          </Badge>
        )
      case "positive":
        return (
          <Badge variant="outline" className="bg-green-500 text-white border-green-600">
            Positive
          </Badge>
        )
      case "neutral":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
            Neutral
          </Badge>
        )
      case "negative":
        return (
          <Badge variant="outline" className="bg-red-500 text-white border-red-600">
            Negative
          </Badge>
        )
      case "very_negative":
        return (
          <Badge variant="outline" className="bg-red-700 text-white border-red-800">
            Very Negative
          </Badge>
        )
      default:
        return <Badge variant="outline">{sentiment}</Badge>
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Call ID</TableHead>
          <TableHead>AI Agent</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Sentiment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reviewer</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentCalls.map((call) => (
          <>
            <TableRow
              key={call.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setExpandedRow(expan\
