"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Call, Company, AgentType, CallType } from "@/lib/types"

type SupabaseCall = {
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
  company: Company | null
  agent_type: AgentType | null
  call_type: CallType | null
}

export async function getCalls() {
  const supabase = await createServerSupabaseClient()

  const { data: calls, error } = await supabase
    .from("calls")
    .select(`
      *,
      company:companies(*),
      agent_type:agent_types(*),
      call_type:call_types(*)
    `)
    .order("start_time", { ascending: false })

  if (error) {
    console.error("Error fetching calls:", error)
    return []
  }

  return (calls as unknown as SupabaseCall[]).map(call => ({
    ...call,
    company: call.company || undefined,
    agent_type: call.agent_type || undefined,
    call_type: call.call_type || undefined
  })) as Call[]
}

export async function getCallById(id: string) {
  const supabase = await createServerSupabaseClient()

  const { data: call, error } = await supabase
    .from("calls")
    .select(`
      *,
      company:companies(*),
      agent_type:agent_types(*),
      call_type:call_types(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching call:", error)
    return null
  }

  return {
    ...(call as unknown as SupabaseCall),
    company: (call as unknown as SupabaseCall).company || undefined,
    agent_type: (call as unknown as SupabaseCall).agent_type || undefined,
    call_type: (call as unknown as SupabaseCall).call_type || undefined
  } as Call
}

export async function getCallByCallId(call_id: string) {
  const supabase = await createServerSupabaseClient();
  const { data: call, error } = await supabase
    .from("calls")
    .select(`
      *,
      company:companies(*),
      agent_type:agent_types(*),
      call_type:call_types(*)
    `)
    .eq("call_id", call_id)
    .single();

  if (error) {
    console.error("Error fetching call by call_id:", error);
    return null;
  }

  return {
    ...(call as unknown as SupabaseCall),
    company: (call as unknown as SupabaseCall).company || undefined,
    agent_type: (call as unknown as SupabaseCall).agent_type || undefined,
    call_type: (call as unknown as SupabaseCall).call_type || undefined
  } as Call;
}

export async function createCall(call: Omit<Call, "id" | "created_at" | "updated_at">) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.from("calls").insert(call).select().single()

  if (error) {
    console.error("Error creating call:", error)
    return null
  }

  return data as Call
}

export async function updateCall(id: string, call: Partial<Call>) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("calls")
    .update({ ...call, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating call:", error)
    return null
  }

  return data as Call
}
