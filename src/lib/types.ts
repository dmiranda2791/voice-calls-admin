export type Company = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export type CallType = {
  id: string
  name: string
  created_at: string
}

export type AgentType = {
  id: string
  name: string
  created_at: string
}

export type EvaluationStatus = {
  id: string
  value: string
  label: string
  color: string
  created_at: string
}

export type Call = {
  id: string
  call_id: string
  company_id: string
  agent_type_id: string
  call_type_id: string
  start_time: string
  duration_seconds: number
  summary: string | null
  status: string
  end_reason: string
  sentiment: string
  reviewer: string | null
  recording_url: string | null
  created_at: string
  updated_at: string

  // Joined fields
  company?: Company
  agent_type?: AgentType
  call_type?: CallType
}

export type Evaluation = {
  id: string
  call_id: string
  llm_score: number | null
  llm_feedback: string | null
  llm_status_id: string | null
  llm_comment: string | null
  qa_status_id: string | null
  qa_passed: boolean | null
  qa_comment: string | null
  engineer_status_id: string | null
  engineer_comment: string | null
  created_at: string
  updated_at: string

  // Joined fields
  call?: Call
  llm_status?: EvaluationStatus
  qa_status?: EvaluationStatus
  engineer_status?: EvaluationStatus
}
