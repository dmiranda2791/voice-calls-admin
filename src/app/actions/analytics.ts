"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Call } from "@/lib/types"

export async function getCallVolumeAndScores(days = 14) {
  const supabase = await createServerSupabaseClient()

  // Calculate the date range
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Format dates for PostgreSQL
  const startDateStr = startDate.toISOString()
  const endDateStr = endDate.toISOString()

  try {
    // Get call volume by day
    const { data: volumeData, error: volumeError } = await supabase
      .from("calls")
      .select("start_time")
      .gte("start_time", startDateStr)
      .lte("start_time", endDateStr)

    if (volumeError) {
      console.error("Error fetching call volume:", volumeError)
      return []
    }

    // Get evaluation scores by day
    const { data: scoreData, error: scoreError } = await supabase
      .from("evaluations")
      .select("llm_score, call:calls(start_time)")
      .gte("call.start_time", startDateStr)
      .lte("call.start_time", endDateStr)

    if (scoreError) {
      console.error("Error fetching evaluation scores:", scoreError)
      return []
    }

    // Process data to group by day
    const dateMap = new Map()

    // Initialize the map with all dates in the range
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]
      dateMap.set(dateStr, { date: dateStr, calls: 0, totalScore: 0, scoreCount: 0 })
    }

    // Count calls by day
    if (volumeData && volumeData.length > 0) {
      (volumeData as Pick<Call, "start_time">[]).forEach((call) => {
        if (call && call.start_time) {
          const dateStr = new Date(call.start_time).toISOString().split("T")[0]
          if (dateMap.has(dateStr)) {
            const entry = dateMap.get(dateStr)
            entry.calls += 1
            dateMap.set(dateStr, entry)
          }
        }
      })
    }

    // Calculate average scores by day
    if (scoreData && scoreData.length > 0) {
      ((scoreData as unknown) as Array<{
        llm_score: number | null;
        call: { start_time: string } | null;
      }>).forEach((evaluation) => {
        if (evaluation?.llm_score != null && evaluation?.call?.start_time) {
          const dateStr = new Date(evaluation.call.start_time).toISOString().split("T")[0]
          if (dateMap.has(dateStr)) {
            const entry = dateMap.get(dateStr)
            entry.totalScore += evaluation.llm_score
            entry.scoreCount += 1
            dateMap.set(dateStr, entry)
          }
        }
      })
    }

    // Convert map to array and calculate average scores
    const result = Array.from(dateMap.values()).map((entry) => ({
      date: entry.date,
      calls: entry.calls,
      avgScore: entry.scoreCount > 0 ? Number((entry.totalScore / entry.scoreCount).toFixed(1)) : null,
    }))

    return result.sort((a, b) => a.date.localeCompare(b.date))
  } catch (error) {
    console.error("Error in getCallVolumeAndScores:", error)
    return []
  }
}

export async function getAverageCallDuration() {
  const supabase = await createServerSupabaseClient()

  // Get companies
  const { data: companies, error: companiesError } = await supabase.from("companies").select("id, name")

  if (companiesError) {
    console.error("Error fetching companies:", companiesError)
    return []
  }

  // Get agent types
  const { data: agentTypes, error: agentTypesError } = await supabase.from("agent_types").select("id, name")

  if (agentTypesError) {
    console.error("Error fetching agent types:", agentTypesError)
    return []
  }

  // Get call durations
  const { data: calls, error: callsError } = await supabase
    .from("calls")
    .select("company_id, agent_type_id, duration_seconds")

  if (callsError) {
    console.error("Error fetching call durations:", callsError)
    return []
  }

  // Process data to calculate average durations by company and agent type
  const result = []

  for (const company of companies) {
    const companyData = {
      name: company.name,
      inboundDuration: 0,
      outboundDuration: 0,
    }

    // Filter calls for this company
    const companyCalls = (calls as Pick<Call, "company_id" | "agent_type_id" | "duration_seconds">[]).filter(
      (call) => call.company_id === company.id
    )

    // Calculate average duration by agent type
    for (const agentType of agentTypes) {
      const agentTypeCalls = companyCalls.filter((call) => call.agent_type_id === agentType.id)

      if (agentTypeCalls.length > 0) {
        const totalDuration = agentTypeCalls.reduce((sum, call) => sum + (call.duration_seconds || 0), 0)
        const avgDuration = Number((totalDuration / agentTypeCalls.length / 60).toFixed(1)) // Convert to minutes

        if (agentType.name === "Inbound") {
          companyData.inboundDuration = avgDuration
        } else if (agentType.name === "Outbound") {
          companyData.outboundDuration = avgDuration
        }
      }
    }

    result.push(companyData)
  }

  return result
}
