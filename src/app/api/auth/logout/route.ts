import { SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const headers = new Headers();
  headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers,
  });
}
