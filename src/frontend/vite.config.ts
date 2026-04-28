import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load from the root .env (2 levels up) for local development
  const fileEnv = loadEnv(mode, path.resolve(process.cwd(), '../../'), '');

  // Prefer Vercel's process.env (VITE_ prefixed), then root .env values, then empty string
  const supabaseUrl = process.env.VITE_SUPABASE_URL || fileEnv.SUPABASE_URL || '';
  const supabaseKey = process.env.VITE_SUPABASE_KEY || fileEnv.SUPABASE_KEY || '';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_KEY': JSON.stringify(supabaseKey),
    }
  };
});
