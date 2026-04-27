import { createClient } from '@supabase/supabase-js';

// Fallbacks prevent the entire app from white-screening if env vars are missing on Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
