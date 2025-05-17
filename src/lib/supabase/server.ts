"use server"

import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key for server-side operations
export const createServerSupabaseClient = async (): Promise<ReturnType<typeof createClient>> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables:", {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
    })
    throw new Error("Missing required Supabase environment variables")
  }

  console.log("Creating server Supabase client with URL:", supabaseUrl)

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}
