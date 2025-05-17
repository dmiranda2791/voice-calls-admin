"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  ExternalLink,
  Flag,
  MoreHorizontal,
  Pause,
  Play,
  Download,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getCalls } from "@/app/actions/calls";
import {
  getEvaluationByCallId,
  updateEvaluation,
  getEvaluationStatuses,
} from "@/app/actions/evaluations";
import type { Call, Evaluation, EvaluationStatus } from "@/lib/types";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export function CallsTable() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<Evaluation | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluationStatuses, setEvaluationStatuses] = useState<
    EvaluationStatus[]
  >([]);

  useEffect(() => {
    async function fetchCalls() {
      try {
        const data = await getCalls();
        setCalls(data);
      } catch (error) {
        console.error("Error fetching calls:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCalls();
  }, []);

  useEffect(() => {
    if (openDialog) {
      getEvaluationStatuses().then((statuses) =>
        setEvaluationStatuses(statuses as EvaluationStatus[])
      );
    }
  }, [openDialog]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = (status: string) => {
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
  };

  const getEndReasonBadge = (reason: string) => {
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
  };

  const getSentimentBadge = (sentiment: string) => {
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
  };

  const getEvaluationStatusBadge = (status: string) => {
    const statusOption = evaluationStatuses.find(
      (option) => option.value === status
    );
    if (!statusOption) return <Badge variant="outline">{status}</Badge>;
    return (
      <Badge variant="outline" className={`${statusOption.color}`}>
        {statusOption.label}
      </Badge>
    );
  };

  const handleOpenDetails = async (call: Call) => {
    setSelectedCall(call);
    setOpenDialog(true);

    try {
      const evaluation = await getEvaluationByCallId(call.id);
      setSelectedEvaluation(evaluation);
    } catch (error) {
      console.error("Error fetching evaluation:", error);
      setSelectedEvaluation(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading calls...</span>
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">No calls found</p>
        <p className="text-sm text-muted-foreground">
          Use the &apos;Seed Database&apos; button in the Analytics page to add
          sample data.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent Type</TableHead>
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
            {calls.map((call) => (
              <React.Fragment key={call.id}>
                <TableRow
                  key={call.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    setExpandedRow(expandedRow === call.id ? null : call.id)
                  }
                >
                  <TableCell>{call.agent_type?.name}</TableCell>
                  <TableCell>{call.company?.name}</TableCell>
                  <TableCell>{call.call_type?.name}</TableCell>
                  <TableCell>{formatDate(call.start_time)}</TableCell>
                  <TableCell>{formatDuration(call.duration_seconds)}</TableCell>
                  <TableCell>{getSentimentBadge(call.sentiment)}</TableCell>
                  <TableCell>{getStatusBadge(call.status)}</TableCell>
                  <TableCell>
                    {call.reviewer || (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetails(call);
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" />
                          <span>Play Recording</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          <span>Mark as Reviewed</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Flag className="mr-2 h-4 w-4" />
                          <span>Flag Call</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {expandedRow === call.id && (
                  <TableRow>
                    <TableCell colSpan={9} className="bg-muted/30 p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Call Summary</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {call.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <Button onClick={() => handleOpenDetails(call)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Full Details
                          </Button>
                          <Button variant="outline">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark as Reviewed
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedCall && (
            <>
              <DialogHeader>
                <DialogTitle>Call Details: {selectedCall.call_id}</DialogTitle>
                <DialogDescription>
                  {selectedCall.agent_type?.name} - {selectedCall.company?.name}{" "}
                  - {formatDate(selectedCall.start_time)}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="summary" className="mt-4">
                <TabsList className="flex gap-x-2">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="llm-evaluation">
                    LLM Evaluation
                  </TabsTrigger>
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
                            <span className="text-sm font-medium">
                              Company:
                            </span>
                            <span className="text-sm">
                              {selectedCall.company?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Call Type:
                            </span>
                            <span className="text-sm">
                              {selectedCall.call_type?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Date & Time:
                            </span>
                            <span className="text-sm">
                              {formatDate(selectedCall.start_time)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Duration:
                            </span>
                            <span className="text-sm">
                              {formatDuration(selectedCall.duration_seconds)}
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
                              {getStatusBadge(selectedCall.status)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              End Reason:
                            </span>
                            <span className="text-sm">
                              {getEndReasonBadge(selectedCall.end_reason)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Sentiment:
                            </span>
                            <span className="text-sm">
                              {getSentimentBadge(selectedCall.sentiment)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Reviewer:
                            </span>
                            <span className="text-sm">
                              {selectedCall.reviewer || (
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
                      <p className="text-sm">{selectedCall.summary}</p>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Shareable URL</h3>
                      <div className="flex items-center gap-2">
                        <Input
                          value={`https://call-qa.example.com/calls/${selectedCall.call_id}`}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `https://call-qa.example.com/calls/${selectedCall.call_id}`
                            );
                            // You could add a toast notification here
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Share this URL to give others access to this call
                        evaluation.
                      </p>
                    </div>
                  </Card>
                  <div className="mt-4">
                    <Card className="p-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Call Recording</h3>
                          <div className="text-sm text-muted-foreground">
                            {currentTime}s /{" "}
                            {formatDuration(selectedCall.duration_seconds)}
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
                            max={selectedCall.duration_seconds}
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
                    {selectedEvaluation ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Status</h4>
                          <div className="mb-2">
                            {selectedEvaluation.llm_status ? (
                              getEvaluationStatusBadge(
                                selectedEvaluation.llm_status.value
                              )
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
                            {selectedEvaluation.llm_feedback ||
                              "No feedback provided"}
                          </p>
                        </div>

                        {selectedEvaluation.llm_comment && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              Comment
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {selectedEvaluation.llm_comment}
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
                    {selectedEvaluation ? (
                      <QAEditableSection
                        evaluation={selectedEvaluation}
                        onSaved={setSelectedEvaluation}
                        evaluationStatuses={evaluationStatuses}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">
                          No evaluation data available
                        </p>
                      </div>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent
                  value="engineer-evaluation"
                  className="mt-4 space-y-4"
                >
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Engineer Evaluation</h3>
                    {selectedEvaluation ? (
                      <EngineerEditableSection
                        evaluation={selectedEvaluation}
                        onSaved={setSelectedEvaluation}
                        evaluationStatuses={evaluationStatuses}
                      />
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function QAEditableSection({
  evaluation,
  onSaved,
  evaluationStatuses,
}: {
  evaluation: Evaluation;
  onSaved: (e: Evaluation) => void;
  evaluationStatuses: EvaluationStatus[];
}) {
  const [statusId, setStatusId] = useState(evaluation.qa_status_id || "");
  const [result, setResult] = useState(
    evaluation.qa_passed === null
      ? "pending"
      : evaluation.qa_passed
      ? "passed"
      : "failed"
  );
  const [comment, setComment] = useState(evaluation.qa_comment || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await updateEvaluation(evaluation.id, {
        qa_status_id: statusId,
        qa_passed: result === "pending" ? null : result === "passed",
        qa_comment: comment,
      });
      if (updated) onSaved(updated);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-1">Status</h4>
        <Select value={statusId} onValueChange={setStatusId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {evaluationStatuses.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-1">Result</h4>
        <Select value={result} onValueChange={setResult}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-1">Comment</h4>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

function EngineerEditableSection({
  evaluation,
  onSaved,
  evaluationStatuses,
}: {
  evaluation: Evaluation;
  onSaved: (e: Evaluation) => void;
  evaluationStatuses: EvaluationStatus[];
}) {
  const [statusId, setStatusId] = useState(evaluation.engineer_status_id || "");
  const [comment, setComment] = useState(evaluation.engineer_comment || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await updateEvaluation(evaluation.id, {
        engineer_status_id: statusId,
        engineer_comment: comment,
      });
      if (updated) onSaved(updated);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-1">Status</h4>
        <Select value={statusId} onValueChange={setStatusId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {evaluationStatuses.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-1">Comment</h4>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
