"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Task } from "@/types";

interface MapComponentProps {
  tasks: Task[];
}

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: "#e05050",
  MEDIUM: "#d4900a",
  LOW: "#3a8a5a",
};

export default function MapComponent({ tasks }: MapComponentProps) {
  const center: [number, number] =
    tasks.length > 0
      ? [tasks[0].lat, tasks[0].lng]
      : [20.5937, 78.9629];

  return (
    <div className="flex-1" style={{ minHeight: "500px" }}>
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", minHeight: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tasks.map((task) => (
          <CircleMarker
            key={task.id}
            center={[task.lat, task.lng]}
            radius={task.priority === "HIGH" ? 18 : task.priority === "MEDIUM" ? 12 : 8}
            pathOptions={{
              fillColor: PRIORITY_COLORS[task.priority] ?? "#c1704a",
              fillOpacity: 0.55,
              color: PRIORITY_COLORS[task.priority] ?? "#c1704a",
              weight: 2,
            }}
          >
            <Tooltip>
              <div style={{ maxWidth: 200 }}>
                <p style={{ fontWeight: 600, marginBottom: 2 }}>
                  {task.priority} Priority
                </p>
                <p style={{ fontSize: 12 }}>{task.description}</p>
                <p style={{ fontSize: 11, marginTop: 4, color: "#888" }}>
                  Status: {task.status.replace("_", " ")}
                </p>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
