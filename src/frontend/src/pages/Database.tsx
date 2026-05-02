import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Database as DbIcon,
  Edit2,
  Trash2,
  Plus,
  LayoutList,
  Bot,
  Phone,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

export default function Database() {
  const role = useAuthStore((state) => state.role);

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // ✅ NEW: toggle state
  const [view, setView] = useState<"tickets" | "volunteers">("tickets");

  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [volunteers, setVolunteers] = useState<any[]>([]);
  useEffect(() => {
    console.log("VOLUNTEERS:", volunteers);
  }, [volunteers]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await api.get("/volunteers");
        setVolunteers(
          Array.isArray(res.data) ? res.data : res.data?.data || [],
        );
      } catch (err) {
        console.error("Failed to fetch volunteers:", err);
      } finally {
        setLoadingVolunteers(false);
      }
    };

    fetchVolunteers();
    const interval = setInterval(fetchVolunteers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get("/tickets");
        setTickets(res.data || []);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
    const intervalId = setInterval(fetchTickets, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async (ticket_id: string) => {
    if (!window.confirm(`Are you sure you want to delete ticket ${ticket_id}?`))
      return;
    try {
      await api.delete(`/tickets/${ticket_id}`);
      setTickets((prev) => prev.filter((t) => t.ticket_id !== ticket_id));
    } catch (error) {
      console.error("Failed to delete ticket:", error);
      alert("Failed to delete ticket.");
    }
  };

  const handleEditStatus = async (ticket_id: string, currentStatus: string) => {
    const input = window.prompt(
      "Enter new status (Open, In Progress, Resolved):",
      currentStatus,
    );
    if (!input) return;

    const validStatuses = ["Open", "In Progress", "Resolved"];
    const formattedInput = input.trim();

    const newStatus = validStatuses.find(
      (s) => s.toUpperCase() === formattedInput.toUpperCase(),
    );

    if (!newStatus) {
      alert("Invalid status.");
      return;
    }

    if (newStatus === currentStatus) return;

    try {
      await api.patch(`/tickets/${ticket_id}/status`, { status: newStatus });
      setTickets((prev) =>
        prev.map((t) =>
          t.ticket_id === ticket_id ? { ...t, status: newStatus } : t,
        ),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Latest");

  const filteredTickets = tickets
    .filter(
      (t) =>
        filterStatus === "All" ||
        t.status?.toUpperCase() === filterStatus.toUpperCase(),
    )
    .sort((a, b) => {
      if (sortBy === "Latest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "Oldest")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      if (sortBy === "Priority")
        return (b.priority_score || 0) - (a.priority_score || 0);
      return 0;
    });

  // ✅ OPTIONAL: sort volunteers (no UI change)
  const sortedVolunteers = [...volunteers].sort(
    (a, b) => (a.current_tickets || 0) - (b.current_tickets || 0),
  );

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "EXTREME":
      case "P1":
        return "bg-red-50 text-red-600 border-red-200 shadow-sm shadow-red-500/10";
      case "STRONG":
      case "P2":
        return "bg-orange-50 text-orange-600 border-orange-200 shadow-sm shadow-orange-500/10";
      case "MEDIUM":
      case "P3":
        return "bg-amber-50 text-amber-600 border-amber-200 shadow-sm shadow-amber-500/10";
      default:
        return "bg-blue-50 text-blue-600 border-blue-200";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-500";
      case "In Progress":
        return "bg-amber-500";
      case "Resolved":
        return "bg-emerald-500";
      default:
        return "bg-slate-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col relative reveal min-h-[calc(100vh-7rem)] pb-20">
      {/* HEADER */}
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center mt-12 mb-10">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl mb-6">
          <DbIcon className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-[40px] sm:text-[56px] font-semibold tracking-tight mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500">
            Incident Database
          </span>
        </h1>

        {/* ✅ TOGGLE (minimal styling, consistent) */}
        <div className="mt-6 flex gap-2 bg-white border border-slate-200 rounded-full p-1 shadow-sm">
          <button
            onClick={() => setView("tickets")}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
              view === "tickets" ? "bg-blue-500 text-white" : "text-slate-500"
            }`}
          >
            Tickets
          </button>

          <button
            onClick={() => setView("volunteers")}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
              view === "volunteers"
                ? "bg-emerald-500 text-white"
                : "text-slate-500"
            }`}
          >
            Volunteers
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 space-y-12">
        {/* Incident Tickets Section */}

        {/* ✅ TICKETS */}
        {view === "tickets" && (
          <section className="reveal reveal-d1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 px-4">
              <div className="flex items-center gap-2.5">
                <LayoutList className="w-5 h-5 text-blue-500" />
                <h3 className="text-[14px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                  AI-Triaged Tickets
                </h3>
                {isLoading && (
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin ml-2" />
                )}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-full px-4 py-2 outline-none focus:border-blue-300 shadow-sm"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-full px-4 py-2 outline-none focus:border-blue-300 shadow-sm"
                >
                  <option value="Latest">Latest First</option>
                  <option value="Oldest">Oldest First</option>
                  <option value="Priority">Highest Priority</option>
                </select>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(59,130,246,0.08)] hover:border-blue-200 group">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[1200px]">
                  <thead>
                    <tr className="text-[11px] text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                      <th className="px-6 py-5 font-bold">Ticket Details</th>
                      <th className="px-6 py-5 font-bold">
                        Reporter & Location
                      </th>
                      <th className="px-6 py-5 font-bold">Incident Summary</th>
                      <th className="px-6 py-5 font-bold">
                        AI Triage Analysis
                      </th>
                      <th className="px-6 py-5 font-bold">Priority & Status</th>
                      <th className="px-6 py-5 font-bold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {filteredTickets.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-slate-400 text-[14px] font-medium"
                        >
                          No tickets found matching the current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredTickets.map((t) => (
                        <tr
                          key={t.ticket_id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Ticket Details */}
                          <td className="px-6 py-6 align-top">
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[13px] font-extrabold text-slate-700 font-mono bg-slate-100 px-2.5 py-1 rounded-md w-fit border border-slate-200/80 shadow-sm">
                                {t.ticket_id}
                              </span>
                              <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mt-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(t.created_at)}
                              </span>
                            </div>
                          </td>

                          {/* Reporter & Location */}
                          <td className="px-6 py-6 align-top">
                            <div className="flex flex-col gap-3">
                              <div>
                                <p className="text-[14px] font-bold text-text-primary">
                                  {t.raised_by}
                                </p>
                                <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 mt-0.5">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  {t.phone_no}
                                </span>
                              </div>
                              <div>
                                <p className="text-[13px] font-bold text-slate-600">
                                  {t.village}, {t.district}
                                </p>
                                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 mt-0.5">
                                  <MapPin className="w-3 h-3" />
                                  {t.latitude.toFixed(4)},{" "}
                                  {t.longitude.toFixed(4)}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Incident Summary */}
                          <td className="px-6 py-6 align-top max-w-[280px]">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 mb-2 shadow-sm">
                              {t.category}
                            </span>
                            <p className="text-[14px] font-medium text-text-secondary leading-relaxed">
                              {t.description}
                            </p>
                          </td>

                          {/* AI Triage Analysis */}
                          <td className="px-6 py-6 align-top max-w-[280px]">
                            <div className="flex items-start gap-3 bg-white border border-slate-200 shadow-sm rounded-xl p-3.5">
                              <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                <Bot className="w-3.5 h-3.5 text-blue-600" />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[12px] font-bold text-text-primary bg-slate-100 px-1.5 rounded border border-slate-200">
                                    Score: {t.priority_score}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                                    LLM: {t.llm_score} • Rule: {t.rule_score}
                                  </span>
                                </div>
                                <p className="text-[12px] font-medium text-slate-500 italic leading-snug">
                                  "{t.llm_reason}"
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Priority & Status */}
                          <td className="px-6 py-6 align-top">
                            <div className="flex flex-col gap-2.5 items-start">
                              <span
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${getPriorityStyle(t.priority)}`}
                              >
                                {t.priority}
                              </span>
                              <span className="inline-flex items-center gap-2 text-[12px] font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                                <span
                                  className={`w-2 h-2 rounded-full shadow-sm ${getStatusStyle(t.status)}`}
                                />
                                {t.status}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-6 align-top text-right">
                            <div className="flex items-center justify-end gap-1 opacity-40 hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  handleEditStatus(t.ticket_id, t.status)
                                }
                                title="Edit Status"
                                className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(t.ticket_id)}
                                title="Delete Ticket"
                                className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ✅ VOLUNTEERS */}
        {view === "volunteers" && (
          <section className="reveal reveal-d2">
            <div className="flex items-center gap-2.5 mb-5 px-4">
              <h3 className="text-[14px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                Volunteers Database
              </h3>
              {loadingVolunteers && (
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin ml-2" />
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow rounded-[2rem] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                  <thead>
                    <tr className="text-[11px] text-slate-400 uppercase tracking-widest border-b bg-slate-50/50">
                      <th className="px-6 py-5 font-bold">Volunteer</th>
                      <th className="px-6 py-5 font-bold">Contact</th>
                      <th className="px-6 py-5 font-bold">Location</th>
                      <th className="px-6 py-5 font-bold">Skills</th>
                      <th className="px-6 py-5 font-bold">Workload</th>
                      <th className="px-6 py-5 font-bold">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {volunteers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-10 text-center text-slate-400"
                        >
                          No volunteers found.
                        </td>
                      </tr>
                    ) : (
                      volunteers.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50/50">
                          {/* Name */}
                          <td className="px-6 py-5">
                            <p className="font-bold text-slate-700">{v.name}</p>
                          </td>

                          {/* Contact */}
                          <td className="px-6 py-5">
                            <span className="text-sm text-slate-500">
                              {v.phone_no}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="px-6 py-5">
                            <span className="text-sm text-slate-600">
                              {v.district}
                            </span>
                          </td>

                          {/* Skills */}
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-1">
                              {v.skills?.map((skill: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-100"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Workload */}
                          <td className="px-6 py-5">
                            <span className="font-bold text-slate-700">
                              {v.current_tickets}/2
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                v.availability
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {v.availability ? "Available" : "Busy"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
