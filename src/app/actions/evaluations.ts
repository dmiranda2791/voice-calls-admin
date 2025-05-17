"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Evaluation } from "@/lib/types"

export async function getEvaluations() {
  const supabase = await createServerSupabaseClient()

  const { data: evaluations, error } = await supabase
    .from("evaluations")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching evaluations:", error)
    return []
  }

  return evaluations as Evaluation[]
}

export async function getEvaluationByCallId(callId: string) {
  const supabase = await createServerSupabaseClient()

  const { data: evaluation, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("call_id", callId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No evaluation found for this call
      return null
    }
    console.error("Error fetching evaluation:", error)
    return null
  }

  return evaluation as Evaluation
}

export async function createEvaluation(evaluation: Omit<Evaluation, "id" | "created_at" | "updated_at">) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.from("evaluations").insert(evaluation).select().single()

  if (error) {
    console.error("Error creating evaluation:", error)
    return null
  }

  return data as Evaluation
}

export async function updateEvaluation(id: string, evaluation: Partial<Evaluation>) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("evaluations")
    .update({ ...evaluation, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating evaluation:", error)
    return null
  }

  return data as Evaluation
}

export async function getEvaluationStatuses() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("evaluation_statuses")
    .select("*")
    .order("label", { ascending: true });
  if (error) {
    console.error("Error fetching evaluation statuses:", error);
    return [];
  }
  return data;
}
