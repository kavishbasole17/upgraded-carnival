import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navigation from "@/components/Navigation";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Target,
  Users,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [openCount, inProgressCount, resolvedCount, memberCount] =
    await Promise.all([
      prisma.task.count({
        where: { organizationId: session.organizationId, status: "OPEN" },
      }),
      prisma.task.count({
        where: {
          organizationId: session.organizationId,
          status: "IN_PROGRESS",
        },
      }),
      prisma.task.count({
        where: {
          organizationId: session.organizationId,
          status: "RESOLVED",
        },
      }),
      prisma.user.count({
        where: { organizationId: session.organizationId },
      }),
    ]);

  const totalTasks = openCount + inProgressCount + resolvedCount;
  const resolutionRate =
    totalTasks > 0 ? Math.round((resolvedCount / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f5" }}>
      <Navigation user={session} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: "#2c2c2c" }}>
            Mission Dashboard
          </h1>
          <p className="text-base" style={{ color: "#6b6560" }}>
            {session.organizationName}
          </p>
        </div>

        <section
          className="rounded-2xl p-8 mb-8"
          style={{
            backgroundColor: "#f0ebe3",
            border: "1px solid #ddd5c8",
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
              style={{ backgroundColor: "#c1704a" }}
            >
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2
                className="text-xl font-semibold mb-1"
                style={{ color: "#2c2c2c" }}
              >
                Mission Statement
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>
                The NGO Command Center is a real-time crisis coordination
                platform designed to streamline emergency response, optimize
                resource allocation, and empower field teams with actionable
                intelligence. Our mission is to reduce response times, eliminate
                communication gaps, and ensure every critical task is tracked
                from identification to resolution — enabling NGOs to operate
                with the precision of military coordination and the compassion
                of humanitarian service.
              </p>
            </div>
          </div>

          <div
            className="flex flex-wrap gap-3 mt-6 pt-5"
            style={{ borderTop: "1px solid #ddd5c8" }}
          >
            {[
              "Real-Time Tracking",
              "AI Priority Assignment",
              "Geospatial Heatmap",
              "Role-Based Access",
              "CRUD Operations",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: "#e8e0d5",
                  color: "#6b6560",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "#2c2c2c" }}
          >
            Real-Time Resource Tracking
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Open Tasks"
              value={openCount}
              accentColor="#e05050"
              bgColor="#fdf0f0"
              borderColor="#f5d0d0"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              label="In Progress"
              value={inProgressCount}
              accentColor="#d4900a"
              bgColor="#fdf7ed"
              borderColor="#f0e0b8"
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              label="Resolved"
              value={resolvedCount}
              accentColor="#3a8a5a"
              bgColor="#f0faf4"
              borderColor="#c0e8d0"
            />
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Team Members"
              value={memberCount}
              accentColor="#c1704a"
              bgColor="#f0ebe3"
              borderColor="#ddd5c8"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "#f0ebe3",
              border: "1px solid #ddd5c8",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5" style={{ color: "#c1704a" }} />
              <h3
                className="text-base font-semibold"
                style={{ color: "#2c2c2c" }}
              >
                Resolution Rate
              </h3>
            </div>
            <div className="flex items-end gap-3">
              <span
                className="text-4xl font-bold"
                style={{ color: "#2c2c2c" }}
              >
                {resolutionRate}%
              </span>
              <span className="text-sm mb-1" style={{ color: "#6b6560" }}>
                of all tasks resolved
              </span>
            </div>
            <div
              className="mt-4 h-2 rounded-full"
              style={{ backgroundColor: "#ddd5c8" }}
            >
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${resolutionRate}%`,
                  backgroundColor: "#3a8a5a",
                }}
              />
            </div>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "#f0ebe3",
              border: "1px solid #ddd5c8",
            }}
          >
            <h3
              className="text-base font-semibold mb-4"
              style={{ color: "#2c2c2c" }}
            >
              Task Distribution
            </h3>
            {totalTasks === 0 ? (
              <p className="text-sm" style={{ color: "#6b6560" }}>
                No tasks recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                <BarRow
                  label="Open"
                  count={openCount}
                  total={totalTasks}
                  color="#e05050"
                />
                <BarRow
                  label="In Progress"
                  count={inProgressCount}
                  total={totalTasks}
                  color="#d4900a"
                />
                <BarRow
                  label="Resolved"
                  count={resolvedCount}
                  total={totalTasks}
                  color="#3a8a5a"
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accentColor,
  bgColor,
  borderColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accentColor: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl mb-3"
        style={{ backgroundColor: accentColor, color: "#fff" }}
      >
        {icon}
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: "#2c2c2c" }}>
        {value}
      </p>
      <p className="text-xs font-medium" style={{ color: "#6b6560" }}>
        {label}
      </p>
    </div>
  );
}

function BarRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ color: "#6b6560" }}>
        <span>{label}</span>
        <span>
          {count} ({pct}%)
        </span>
      </div>
      <div
        className="h-2 rounded-full"
        style={{ backgroundColor: "#ddd5c8" }}
      >
        <div
          className="h-2 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
