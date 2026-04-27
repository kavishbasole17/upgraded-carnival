"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("ADMIN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, organizationName, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
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
      className="min-h-screen flex items-center justify-center py-10"
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
          <h1 className="text-2xl font-semibold" style={{ color: "#2c2c2c" }}>
            Create Account
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6b6560" }}>
            Register your NGO on the platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#2c2c2c" }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#2c2c2c" }}>
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
            <label className="block text-sm font-medium mb-1" style={{ color: "#2c2c2c" }}>
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
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#2c2c2c" }}>
              Organization Name
            </label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
              placeholder="Relief India Foundation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#2c2c2c" }}>
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
            >
              <option value="ADMIN">Admin (NGO Head)</option>
              <option value="USER">Member</option>
            </select>
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
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "#6b6560" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-medium" style={{ color: "#c1704a" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
