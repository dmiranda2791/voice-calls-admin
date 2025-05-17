-- Drop existing tables if they exist (in correct order to handle foreign key constraints)
DROP TABLE IF EXISTS evaluations;

DROP TABLE IF EXISTS calls;

DROP TABLE IF EXISTS evaluation_statuses;

DROP TABLE IF EXISTS call_types;

DROP TABLE IF EXISTS agent_types;

DROP TABLE IF EXISTS companies;

-- Create companies table if it doesn't exist
CREATE TABLE
  IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW (),
      updated_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW ()
  );

-- Create agent_types table if it doesn't exist
CREATE TABLE
  IF NOT EXISTS agent_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW ()
  );

-- Create call_types table if it doesn't exist
CREATE TABLE
  IF NOT EXISTS call_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW ()
  );

-- Create evaluation_statuses table if it doesn't exist
CREATE TABLE
  IF NOT EXISTS evaluation_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    value TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW ()
  );

-- Create calls table if it doesn't exist
CREATE TABLE
  IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    call_id TEXT NOT NULL UNIQUE,
    company_id UUID NOT NULL REFERENCES companies (id),
    agent_type_id UUID NOT NULL REFERENCES agent_types (id),
    call_type_id UUID NOT NULL REFERENCES call_types (id),
    start_time TIMESTAMP
    WITH
      TIME ZONE NOT NULL,
      duration_seconds INTEGER NOT NULL,
      summary TEXT,
      status TEXT NOT NULL,
      end_reason TEXT NOT NULL,
      sentiment TEXT NOT NULL,
      reviewer TEXT,
      recording_url TEXT,
      created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW (),
      updated_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW ()
  );

-- Create evaluations table if it doesn't exist
CREATE TABLE
  IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    call_id UUID NOT NULL REFERENCES calls (id),
    llm_score NUMERIC,
    llm_feedback TEXT,
    llm_status_id UUID REFERENCES evaluation_statuses (id),
    llm_comment TEXT,
    qa_status_id UUID REFERENCES evaluation_statuses (id),
    qa_passed BOOLEAN,
    qa_comment TEXT,
    engineer_status_id UUID REFERENCES evaluation_statuses (id),
    engineer_comment TEXT,
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW (),
      updated_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW ()
  );