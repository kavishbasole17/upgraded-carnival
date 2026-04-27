"use client";

import { useState, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import type { PromptHistoryItem, Priority } from "@/types";

const PRIORITY_COLORS: Record<Priority, string> = {
  HIGH: "#e05050",
  MEDIUM: "#d4900a",
  LOW: "#3a8a5a",
};

export default function LLMPanel() {
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("20.5937");
  const [lng, setLng] = useState("78.9629");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [lastResult, setLastResult] = useState<Priority | null>(null);
  const [error, setError] = useState("");

  function loadHistory() {
    fetch("/api/prompt-history")
      .then((r) => r.json())
      .then((d) => {
        if (d.history) setHistory(d.history);
      })
      .catch(() => {});
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setError("");
    setLoading(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, lat: parseFloat(lat), lng: parseFloat(lng) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to process");
        return;
      }
      setLastResult(data.priority as Priority);
      setDescription("");
      loadHistory();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-base font-semibold mb-1" style={{ color: "#2c2c2c" }}>
          AI Priority Assignment
        </h2>
        <p className="text-xs" style={{ color: "#6b6560" }}>
          Describe a task and the system will assign it a priority and save it
          to the database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 mb-5">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe the crisis or task in natural language…"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={{
            backgroundColor: "#faf8f5",
            border: "1px solid #ddd5c8",
            color: "#2c2c2c",
          }}
        />
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs mb-1" style={{ color: "#6b6560" }}>
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs mb-1" style={{ color: "#6b6560" }}>
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        {lastResult && (
          <div
            className="px-4 py-3 rounded-xl text-sm font-medium"
            style={{
              backgroundColor: `${PRIORITY_COLORS[lastResult]}22`,
              border: `1px solid ${PRIORITY_COLORS[lastResult]}44`,
              color: PRIORITY_COLORS[lastResult],
            }}
          >
            Assigned Priority: <strong>{lastResult}</strong> — Task saved to
            database.
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !description.trim()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            backgroundColor: "#c1704a",
            color: "#fff",
            opacity: loading || !description.trim() ? 0.6 : 1,
          }}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {loading ? "Processing…" : "Assign Priority & Save"}
        </button>
      </form>

      <div
        className="flex-1 overflow-y-auto rounded-xl"
        style={{
          border: "1px solid #ddd5c8",
        }}
      >
        <div
          className="px-4 py-3 sticky top-0"
          style={{
            backgroundColor: "#e8e0d5",
            borderBottom: "1px solid #ddd5c8",
          }}
        >
          <h3 className="text-xs font-semibold" style={{ color: "#6b6560" }}>
            PROMPT HISTORY ({history.length})
          </h3>
        </div>
        {history.length === 0 ? (
          <div className="p-4 text-sm" style={{ color: "#6b6560" }}>
            No history yet. Submit a prompt above.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#ddd5c8" }}>
            {history.map((item) => (
              <div key={item.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p
                    className="text-sm leading-snug"
                    style={{ color: "#2c2c2c" }}
                  >
                    {item.input}
                  </p>
                  <span
                    className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-lg"
                    style={{
                      backgroundColor: `${PRIORITY_COLORS[item.assignedPriority]}22`,
                      color: PRIORITY_COLORS[item.assignedPriority],
                    }}
                  >
                    {item.assignedPriority}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "#6b6560" }}>
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
