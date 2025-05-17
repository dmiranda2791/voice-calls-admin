"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Download } from "lucide-react";
import { useState } from "react";
import type { Call, Evaluation } from "@/lib/types";

const EVALUATION_STATUS_OPTIONS = [
  { value: "pendiente", label: "Pendiente", color: "bg-red-200 text-red-800" },
  { value: "done", label: "Done", color: "bg-green-200 text-green-800" },
  {
    value: "feedback_not_clear",
    label: "Feedback Not clear",
    color: "bg-yellow-200 text-yellow-800",
  },
  { value: "old", label: "Old", color: "bg-gray-100 text-gray-800" },
  {
    value: "ai_limitation",
    label: "AI limitation",
    color: "bg-blue-600 text-white",
  },
  { value: "na", label: "NA", color: "bg-purple-200 text-purple-800" },
  {
    value: "go_deeper",
    label: "Go Deeper with this issue",
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: "transcriber",
    label: "Transcriber",
    color: "bg-blue-200 text-blue-800",
  },
  {
    value: "edge_case",
    label: "Edge Case",
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: "interruption",
    label: "Interruption",
    color: "bg-purple-200 text-purple-800",
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Pending Review
        </Badge>
      );
    case "reviewed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Reviewed
        </Badge>
      );
    case "flagged":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Flagged
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getEndReasonBadge(reason: string) {
  switch (reason) {
    case "customer-ended":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Customer Ended
        </Badge>
      );
    case "forwarded":
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200"
        >
          Forwarded
        </Badge>
      );
    case "silence":
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200"
        >
          Silence
        </Badge>
      );
    case "agent-ended":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Agent Ended
        </Badge>
      );
    case "system-error":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          System Error
        </Badge>
      );
    default:
      return <Badge variant="outline">{reason}</Badge>;
  }
}

function getSentimentBadge(sentiment: string) {
  switch (sentiment) {
    case "very_positive":
      return (
        <Badge
          variant="outline"
          className="bg-green-700 text-white border-green-800"
        >
          Very Positive
        </Badge>
      );
    case "positive":
      return (
        <Badge
          variant="outline"
          className="bg-green-500 text-white border-green-600"
        >
          Positive
        </Badge>
      );
    case "neutral":
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-700 border-gray-200"
        >
          Neutral
        </Badge>
      );
    case "negative":
      return (
        <Badge
          variant="outline"
          className="bg-red-500 text-white border-red-600"
        >
          Negative
        </Badge>
      );
    case "very_negative":
      return (
        <Badge
          variant="outline"
          className="bg-red-700 text-white border-red-800"
        >
          Very Negative
        </Badge>
      );
    default:
      return <Badge variant="outline">{sentiment}</Badge>;
  }
}

function getEvaluationStatusBadge(status: string) {
  const statusOption = EVALUATION_STATUS_OPTIONS.find(
    (option) => option.value === status
  );
  if (!statusOption) return <Badge variant="outline">{status}</Badge>;
  return (
    <Badge variant="outline" className={statusOption.color}>
      {statusOption.label}
    </Badge>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function CallDetails({
  call,
  evaluation,
  loading,
}: {
  call: Call | null;
  evaluation: Evaluation | null;
  loading?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">Loading...</div>
    );
  }
  if (!call) {
    return (
      <div className="flex justify-center items-center p-8">
        Call not found.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Call Details: {call.call_id}</h1>
      <div className="mb-2 text-muted-foreground">
        {call.agent_type?.name} - {call.company?.name} -{" "}
        {formatDate(call.start_time)}
      </div>
      <Tabs defaultValue="summary" className="mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="llm-evaluation">LLM Evaluation</TabsTrigger>
          <TabsTrigger value="qa-evaluation">QA Evaluation</TabsTrigger>
          <TabsTrigger value="engineer-evaluation">
            Engineer Evaluation
          </TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-4">
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium mb-2">Call Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Company:</span>
                    <span className="text-sm">{call.company?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Call Type:</span>
                    <span className="text-sm">{call.call_type?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Date & Time:</span>
                    <span className="text-sm">
                      {formatDate(call.start_time)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">
                      {formatDuration(call.duration_seconds)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Status Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <span className="text-sm">
                      {getStatusBadge(call.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">End Reason:</span>
                    <span className="text-sm">
                      {getEndReasonBadge(call.end_reason)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Sentiment:</span>
                    <span className="text-sm">
                      {getSentimentBadge(call.sentiment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Reviewer:</span>
                    <span className="text-sm">
                      {call.reviewer || (
                        <span className="text-muted-foreground">
                          Unassigned
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Call Summary</h3>
              <p className="text-sm">{call.summary}</p>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Shareable URL</h3>
              <div className="flex items-center gap-2">
                <Input
                  value={`https://call-qa.example.com/calls/${call.call_id}`}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `https://call-qa.example.com/calls/${call.call_id}`
                    )
                  }
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Share this URL to give others access to this call evaluation.
              </p>
            </div>
          </Card>
          <div className="mt-4">
            <Card className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Call Recording</h3>
                  <div className="text-sm text-muted-foreground">
                    {currentTime}s / {formatDuration(call.duration_seconds)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[currentTime]}
                    max={call.duration_seconds}
                    step={1}
                    className="flex-1"
                    onValueChange={(value) => setCurrentTime(value[0])}
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      0.5x
                    </Button>
                    <Button variant="outline" size="sm">
                      1.0x
                    </Button>
                    <Button variant="outline" size="sm">
                      1.5x
                    </Button>
                    <Button variant="outline" size="sm">
                      2.0x
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download Recording
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="llm-evaluation" className="mt-4 space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-2">LLM Evaluation</h3>
            {evaluation ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <div className="mb-2">
                    {evaluation.llm_status ? (
                      getEvaluationStatusBadge(evaluation.llm_status.value)
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Feedback</h4>
                  <p className="text-sm text-muted-foreground">
                    {evaluation.llm_feedback || "No feedback provided"}
                  </p>
                </div>
                {evaluation.llm_comment && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Comment</h4>
                    <p className="text-sm text-muted-foreground">
                      {evaluation.llm_comment}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  No evaluation data available
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="qa-evaluation" className="mt-4 space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-2">QA Evaluation</h3>
            {evaluation ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <div className="mb-2">
                    {evaluation.qa_status ? (
                      getEvaluationStatusBadge(evaluation.qa_status.value)
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Result</h4>
                  <div className="mb-2">
                    {evaluation.qa_passed === null ? (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Pending
                      </Badge>
                    ) : evaluation.qa_passed ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Passed
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                      >
                        Failed
                      </Badge>
                    )}
                  </div>
                </div>
                {evaluation.qa_comment && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Comment</h4>
                    <p className="text-sm text-muted-foreground">
                      {evaluation.qa_comment}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  No evaluation data available
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="engineer-evaluation" className="mt-4 space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-2">Engineer Evaluation</h3>
            {evaluation ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <div className="mb-2">
                    {evaluation.engineer_status ? (
                      getEvaluationStatusBadge(evaluation.engineer_status.value)
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
                {evaluation.engineer_comment && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Comment</h4>
                    <p className="text-sm text-muted-foreground">
                      {evaluation.engineer_comment}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  No evaluation data available
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
