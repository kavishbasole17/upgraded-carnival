import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '⚠️ Supabase environment variables are missing!\n' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in your Vercel project settings.\n' +
    `Current values — URL: "${supabaseUrl}", KEY: "${supabaseKey ? '***' : undefined}"`
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);
