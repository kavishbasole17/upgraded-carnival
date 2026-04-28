import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

if (!import.meta.env.VITE_API_URL) {
  console.warn(
    '⚠️ VITE_API_URL is not set! API calls will go to localhost.\n' +
    'Set VITE_API_URL in your Vercel environment variables to your Render backend URL.'
  );
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

