import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Remove any trailing slashes and ensure proper URL format
const SUPABASE_URL = "https://aaflrqcpyusowtvxmtug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhZmxycWNweXVzb3d0dnhtdHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NjQzMDgsImV4cCI6MjA1MTA0MDMwOH0.tpvSFlo3-q7UQAlNVJJqnAVUbciBn5CDV7DSAUo25-s";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);