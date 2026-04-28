import { useEffect, useState, useMemo } from "react";
import { MapPin } from "lucide-react";
import api from "../services/api";
import MapLayer from "../components/MapLayer";
import TicketList from "../components/TicketList";

export default function Heatmap() {
  const [heatData, setHeatData] = useState<Record<string, any>>({});
  const [rawTickets, setRawTickets] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch GeoJSON Data
  useEffect(() => {
    fetch("/data/ap-districts.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
        setIsLoading(false);
      })
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  // 2. Fetch Tickets Data
  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets");
      const tickets = res.data || [];
      const openTickets = tickets.filter(
        (t: any) => t.status === "Open" && t.volunteer_assigned === false
      );

      setRawTickets(openTickets);

      const newHeatData: Record<string, any> = {};
      openTickets.forEach((t: any) => {
        const dist = t.district?.toUpperCase();
        if (!dist) return;

        if (!newHeatData[dist]) {
          newHeatData[dist] = { score: 0, count: 0 };
        }

        // Sum up the priority scores for the heatmap intensity
        newHeatData[dist].score += t.priority_score || 0;
        newHeatData[dist].count += 1;
      });

      setHeatData(newHeatData);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
    // Poll every 1 seconds for live updates
    const interval = setInterval(fetchTickets, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Memoize filtered results
  const filteredTickets = useMemo(() => {
    return rawTickets.filter((t) => t.district?.toUpperCase() === selectedDistrict?.toUpperCase());
  }, [rawTickets, selectedDistrict]);

  const handleAssign = async (ticketId: string) => {
    try {
      await api.patch(`/tickets/${ticketId}/status`, { status: "In Progress" });
      await fetchTickets(); // Refresh immediately after assigning
    } catch (error) {
      console.error("Failed to assign ticket:", error);
    }
  };

  return (
    <div
      className="flex flex-col gap-4 reveal"
      style={{ height: "calc(100vh - 8rem)" }}
    >
      <div className="flex items-center justify-between bg-white/40 glass px-6 py-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50 border border-red-100 shadow-sm">
            <MapPin className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-text-primary">
              Live Aid Map
            </h1>
            <p className="text-text-secondary text-[13px] mt-0.5">
              Real-time incident & resources visualization
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-slow shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">
            LIVE
          </span>
        </div>
      </div>

      <div className="relative flex-1 glass rounded-3xl overflow-hidden shadow-sm flex">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            zIndex: 0,
          }}
        />

        <div className="w-full h-full relative z-10">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-text-secondary font-medium">
              Initializing live crisis map...
            </div>
          ) : (
            <MapLayer
              heatData={heatData}
              geoJsonData={geoData}
              onDistrictSelect={(name) => setSelectedDistrict(name)}
            />
          )}
        </div>

        <TicketList
          district={selectedDistrict}
          tickets={filteredTickets}
          onAssign={handleAssign}
        />
      </div>
    </div>
  );
}