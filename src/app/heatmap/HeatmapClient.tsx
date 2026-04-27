"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Task } from "@/types";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

export default function HeatmapClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((d) => {
        setTasks(d.tasks ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ color: "#6b6560" }}
      >
        Loading map data…
      </div>
    );
  }

  return <MapComponent tasks={tasks} />;
}
