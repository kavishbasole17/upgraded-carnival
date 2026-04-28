import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Safe fallback to prevent crash
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase env variables");
}

export const supabase = createClient(
  supabaseUrl || "https://dummy.supabase.co",
  supabaseKey || "dummy-key"
);