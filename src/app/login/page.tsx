"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Users } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"org" | "member">("org");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#faf8f5" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          backgroundColor: "#f0ebe3",
          border: "1px solid #ddd5c8",
        }}
      >
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{ backgroundColor: "#c1704a" }}
          >
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: "#2c2c2c" }}
          >
            NGO Command Center
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6b6560" }}>
            Crisis management & coordination platform
          </p>
        </div>

        <div
          className="flex rounded-xl mb-6 p-1"
          style={{ backgroundColor: "#ddd5c8" }}
        >
          <button
            type="button"
            onClick={() => setTab("org")}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all"
            style={
              tab === "org"
                ? { backgroundColor: "#c1704a", color: "#fff" }
                : { color: "#6b6560", backgroundColor: "transparent" }
            }
          >
            <Shield className="w-4 h-4" />
            Organization Login
          </button>
          <button
            type="button"
            onClick={() => setTab("member")}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all"
            style={
              tab === "member"
                ? { backgroundColor: "#c1704a", color: "#fff" }
                : { color: "#6b6560", backgroundColor: "transparent" }
            }
          >
            <Users className="w-4 h-4" />
            Member Login
          </button>
        </div>

        <div
          className="text-xs mb-4 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "#e8e0d5", color: "#6b6560" }}
        >
          {tab === "org"
            ? "Login as an NGO Administrator with full access."
            : "Login as a team member with read-only access."}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#2c2c2c" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#2c2c2c" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity"
            style={{
              backgroundColor: "#c1704a",
              color: "#fff",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "#6b6560" }}>
          New organization?{" "}
          <Link
            href="/register"
            className="font-medium"
            style={{ color: "#c1704a" }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
