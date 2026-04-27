import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Navigation from "@/components/Navigation";
import HeatmapClient from "./HeatmapClient";
import { MapPin } from "lucide-react";

export default async function HeatmapPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#faf8f5" }}
    >
      <Navigation user={session} />

      <main className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ backgroundColor: "#c1704a" }}
          >
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ color: "#2c2c2c" }}
            >
              Command Center Heatmap
            </h1>
            <p className="text-sm" style={{ color: "#6b6560" }}>
              Geospatial visualization of active tasks and crisis zones
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          {[
            { color: "#e05050", label: "High Priority" },
            { color: "#d4900a", label: "Medium Priority" },
            { color: "#3a8a5a", label: "Low Priority" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs" style={{ color: "#6b6560" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div
          className="flex-1 rounded-2xl overflow-hidden"
          style={{
            border: "1px solid #ddd5c8",
            minHeight: "500px",
          }}
        >
          <HeatmapClient />
        </div>
      </main>
    </div>
  );
}
