"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server";

// Types for our data structures
interface Company {
  id: number
  name: string
}

interface CallType {
  id: number
  name: string
}

interface AgentType {
  id: number
  name: string
}

interface EvaluationStatus {
  id: number
  value: string
  label: string
  color: string
}

interface Call {
  id: number
  call_id: string
  company_id: number
  agent_type_id: number
  call_type_id: number
  start_time: string
  duration_seconds: number
  summary: string
  status: string
  end_reason: string
  sentiment: string
  reviewer: string | null
  recording_url: string | null
}

type Evaluation = {
  call_id: number
  llm_score: number
  llm_feedback: string
  llm_status_id: number
  llm_comment: string
  qa_status_id: number
  qa_passed: boolean | null
  qa_comment: string
  engineer_status_id: number
  engineer_comment: string
}

export async function seedInitialData() {
  console.log("Starting seedInitialData function")
  const supabase = await createServerSupabaseClient()

  try {
    console.log("Seeding agent types...")
    // Seed agent types
    const agentTypes = [{ name: "Inbound" }, { name: "Outbound" }]

    for (const agentType of agentTypes) {
      console.log(`Inserting agent type: ${agentType.name}`)
      const { data, error } = await supabase
        .from("agent_types")
        .upsert({ name: agentType.name }, { onConflict: "name" })
        .select()

      if (error) {
        console.error("Error seeding agent type:", error)
        throw new Error(`Failed to seed agent type: ${error.message}`)
      }
      console.log("Agent type inserted:", data)
    }

    console.log("Seeding call types...")
    // Seed call types
    const callTypes = [
      { name: "Appointment adjustment" },
      { name: "Billing" },
      { name: "General inquiry" },
      { name: "General inquiry transfer" },
      { name: "Looking for someone" },
      { name: "Miscellaneous" },
      { name: "Missed call" },
      { name: "New appointment existing client" },
      { name: "New client English" },
      { name: "New client Spanish" },
      { name: "Time sensitive" },
    ]

    for (const callType of callTypes) {
      console.log(`Inserting call type: ${callType.name}`)
      const { data, error } = await supabase
        .from("call_types")
        .upsert({ name: callType.name }, { onConflict: "name" })
        .select()

      if (error) {
        console.error("Error seeding call type:", error)
        throw new Error(`Failed to seed call type: ${error.message}`)
      }
      console.log("Call type inserted:", data)
    }

    console.log("Seeding evaluation statuses...")
    // Seed evaluation statuses
    const evaluationStatuses = [
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

    for (const status of evaluationStatuses) {
      console.log(`Inserting evaluation status: ${status.value}`)
      const { data, error } = await supabase
        .from("evaluation_statuses")
        .upsert(
          {
            value: status.value,
            label: status.label,
            color: status.color,
          },
          { onConflict: "value" },
        )
        .select()

      if (error) {
        console.error("Error seeding evaluation status:", error)
        throw new Error(`Failed to seed evaluation status: ${error.message}`)
      }
      console.log("Evaluation status inserted:", data)
    }

    console.log("Seeding companies...")
    // Seed companies
    const companies = [
      { name: "Acme Corp" },
      { name: "Globex Inc" },
      { name: "Initech LLC" },
      { name: "Umbrella Corp" },
      { name: "Stark Industries" },
    ]

    for (const company of companies) {
      console.log(`Inserting company: ${company.name}`)
      const { data, error } = await supabase
        .from("companies")
        .upsert({ name: company.name }, { onConflict: "name" })
        .select()

      if (error) {
        console.error("Error seeding company:", error)
        throw new Error(`Failed to seed company: ${error.message}`)
      }
      console.log("Company inserted:", data)
    }

    console.log("Initial data seeding completed successfully")
    return { success: true }
  } catch (error) {
    console.error("Error in seedInitialData:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function seedSampleData() {
  console.log("Starting seedSampleData function")
  const supabase = await createServerSupabaseClient()

  try {
    // Step 1: Fetch reference data
    console.log("Fetching reference data...")

    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("*")
      .returns<Company[]>()

    if (companiesError) {
      console.error("Error fetching companies:", companiesError)
      throw new Error(`Failed to fetch companies: ${companiesError.message}`)
    }
    console.log(`Found ${companies?.length || 0} companies`)

    const { data: callTypes, error: callTypesError } = await supabase
      .from("call_types")
      .select("*")
      .returns<CallType[]>()

    if (callTypesError) {
      console.error("Error fetching call types:", callTypesError)
      throw new Error(`Failed to fetch call types: ${callTypesError.message}`)
    }
    console.log(`Found ${callTypes?.length || 0} call types`)

    const { data: agentTypes, error: agentTypesError } = await supabase
      .from("agent_types")
      .select("*")
      .returns<AgentType[]>()

    if (agentTypesError) {
      console.error("Error fetching agent types:", agentTypesError)
      throw new Error(`Failed to fetch agent types: ${agentTypesError.message}`)
    }
    console.log(`Found ${agentTypes?.length || 0} agent types`)

    const { data: evaluationStatuses, error: statusesError } = await supabase
      .from("evaluation_statuses")
      .select("*")
      .returns<EvaluationStatus[]>()

    if (statusesError) {
      console.error("Error fetching evaluation statuses:", statusesError)
      throw new Error(`Failed to fetch evaluation statuses: ${statusesError.message}`)
    }
    console.log(`Found ${evaluationStatuses?.length || 0} evaluation statuses`)

    if (!companies?.length || !callTypes?.length || !agentTypes?.length || !evaluationStatuses?.length) {
      throw new Error("Reference data not found. Please seed initial data first.")
    }

    // Helper functions
    const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]

    const getRandomDate = () => {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))
      return date.toISOString()
    }

    const getRandomDuration = () => Math.floor(Math.random() * 540) + 60 // 60 to 600 seconds

    // Sample data arrays
    const callSummaries = [
      "Customer inquired about premium plan features and pricing.",
      "Technical support for account access issues.",
      "Complaint about billing discrepancy.",
      "Product return request and refund policy discussion.",
      "Upgrade request from basic to premium plan.",
    ]

    const llmFeedback = [
      "The AI agent provided accurate information about the premium plan features and pricing.",
      "The AI agent correctly followed the identity verification protocol.",
      "The AI agent correctly identified the billing error but failed to maintain connection.",
      "The AI agent showed excellent judgment by offering store credit.",
      "The AI agent provided comprehensive information about the upgrade process.",
    ]

    const endReasons = ["customer-ended", "forwarded", "silence", "agent-ended", "system-error"]
    const sentiments = ["very_positive", "positive", "neutral", "negative", "very_negative"]
    const callStatuses = ["pending", "reviewed", "flagged"]
    const reviewers = ["John Doe", "Jane Smith", null]

    // Create sample calls
    console.log("Creating sample calls...")
    const callCount = 10 // Reduced for testing
    const sampleCalls: Omit<Call, "id">[] = []

    for (let i = 0; i < callCount; i++) {
      const company = getRandomItem(companies)
      const callType = getRandomItem(callTypes)
      const agentType = getRandomItem(agentTypes)

      const call = {
        call_id: `CALL-${1000 + i}`,
        company_id: company.id,
        agent_type_id: agentType.id,
        call_type_id: callType.id,
        start_time: getRandomDate(),
        duration_seconds: getRandomDuration(),
        summary: getRandomItem(callSummaries),
        status: getRandomItem(callStatuses),
        end_reason: getRandomItem(endReasons),
        sentiment: getRandomItem(sentiments),
        reviewer: getRandomItem(reviewers),
        recording_url: null,
      }

      sampleCalls.push(call)
      console.log(`Created sample call ${i + 1}:`, call)
    }

    // Insert calls
    console.log("Inserting sample calls into database...")
    const { data: insertedCalls, error: callsError } = await supabase
      .from("calls")
      .insert(sampleCalls)
      .select()
      .returns<Call[]>()

    if (callsError) {
      console.error("Error inserting sample calls:", callsError)
      throw new Error(`Failed to insert sample calls: ${callsError.message}`)
    }

    console.log(`Successfully inserted ${insertedCalls?.length || 0} calls`)

    // Create evaluations for the inserted calls
    if (insertedCalls && insertedCalls.length > 0) {
      console.log("Creating evaluations for inserted calls...")
      const sampleEvaluations: Evaluation[] = insertedCalls.map((call) => {
        const llmStatusValue = getRandomItem(["done", "pendiente", "feedback_not_clear"])
        const qaStatusValue = getRandomItem(["done", "pendiente", "na"])
        const engineerStatusValue = getRandomItem(["na", "ai_limitation", "edge_case"])

        const llmStatus = evaluationStatuses.find((s) => s.value === llmStatusValue)
        const qaStatus = evaluationStatuses.find((s) => s.value === qaStatusValue)
        const engineerStatus = evaluationStatuses.find((s) => s.value === engineerStatusValue)

        if (!llmStatus || !qaStatus || !engineerStatus) {
          console.error("Could not find status:", { llmStatusValue, qaStatusValue, engineerStatusValue })
          throw new Error("Could not find required evaluation status")
        }

        return {
          call_id: call.id,
          llm_score: Math.floor(Math.random() * 30 + 70) / 10, // 7.0 to 10.0
          llm_feedback: getRandomItem(llmFeedback),
          llm_status_id: llmStatus.id,
          llm_comment: "",
          qa_status_id: qaStatus.id,
          qa_passed: qaStatusValue === "done" ? Math.random() > 0.3 : null,
          qa_comment: "",
          engineer_status_id: engineerStatus.id,
          engineer_comment: "",
        }
      })

      console.log("Inserting evaluations into database...")
      const { data: insertedEvals, error: evalError } = await supabase
        .from("evaluations")
        .insert(sampleEvaluations as Record<string, unknown>[])
        .select()
        .returns<Evaluation[]>()

      if (evalError) {
        console.error("Error inserting sample evaluations:", evalError)
        throw new Error(`Failed to insert sample evaluations: ${evalError.message}`)
      }

      console.log(`Successfully inserted ${insertedEvals?.length || 0} evaluations`)
    }

    console.log("Sample data seeding completed successfully")
    return {
      success: true,
      message: `Successfully created ${insertedCalls?.length || 0} sample calls with evaluations`,
    }
  } catch (error) {
    console.error("Error in seedSampleData:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
