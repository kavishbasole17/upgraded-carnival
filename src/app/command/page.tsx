import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Navigation from "@/components/Navigation";
import LLMPanel from "./LLMPanel";
import DatabasePanel from "./DatabasePanel";
import { Brain, Database } from "lucide-react";

export default async function CommandPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#faf8f5" }}>
      <Navigation user={session} />

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: "#2c2c2c" }}>
            Command Center
          </h1>
          <p className="text-sm" style={{ color: "#6b6560" }}>
            AI-powered priority assignment and database management
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {session.role === "ADMIN" && (
            <div
              className="rounded-2xl p-6 flex flex-col"
              style={{
                backgroundColor: "#f0ebe3",
                border: "1px solid #ddd5c8",
                minHeight: "600px",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: "#c1704a" }}
                >
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold" style={{ color: "#2c2c2c" }}>
                  AI Priority Engine
                </span>
              </div>
              <LLMPanel />
            </div>
          )}

          <div
            className={`rounded-2xl p-6 flex flex-col ${session.role !== "ADMIN" ? "lg:col-span-2" : ""}`}
            style={{
              backgroundColor: "#f0ebe3",
              border: "1px solid #ddd5c8",
              minHeight: "600px",
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ backgroundColor: "#c1704a" }}
              >
                <Database className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold" style={{ color: "#2c2c2c" }}>
                Organization Database
              </span>
            </div>
            <DatabasePanel user={session} />
          </div>
        </div>
      </main>
    </div>
  );
}
