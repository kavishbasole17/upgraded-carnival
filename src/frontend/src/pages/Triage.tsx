import { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle, Clock, MapPin, Activity, ChevronRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

export default function Triage() {
  const [prompt, setPrompt] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Custom Reporter & Location State
  const [showModal, setShowModal] = useState(false);
  const [raisedBy, setRaisedBy] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [lat, setLat] = useState('16.5');
  const [lng, setLng] = useState('80.6');

  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [prompt]);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = () => {
    if (!prompt.trim() || isSubmitting) return;
    setShowModal(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const defaultName = user?.email ? user.email.split('@')[0] : (role === 'ADMIN' ? 'Command Center' : 'Field Volunteer');
      const payload = {
        raised_by: raisedBy.trim() || defaultName,
        phone_no: phoneNo.trim() || "+910000000000",
        description: prompt,
        created_at: new Date().toISOString(),
        location: {
          district: district.trim() || "Unspecified",
          village: village.trim() || "Current Location",
          lat: parseFloat(lat) || 16.5,
          lng: parseFloat(lng) || 80.6
        }
      };

      await api.post('/create-ticket', payload);
      setPrompt('');
      setShowModal(false);
      await fetchTickets(); // Refresh feed immediately
    } catch (error) {
      console.error("Failed to submit prompt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleOpenModal();
    }
  };

  const suggestions = [
    { icon: AlertTriangle, text: "Report an emergency" },
    { icon: MapPin, text: "Update field conditions" },
    { icon: Activity, text: "Request supply airdrop" },
    { icon: Clock, text: "Log volunteer hours" },
  ];

  return (
    <div className="flex flex-col items-center relative reveal" style={{ height: 'calc(100vh - 7rem)' }}>

      <div className="flex-[0.8] w-full" />

      {/* Central Greeting */}
      <div className="w-full max-w-2xl px-6 flex flex-col items-center text-center shrink-0">
        <h1 className="text-[40px] sm:text-[56px] font-semibold tracking-tight mb-2 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400">
            Hello, {role === 'ADMIN' ? 'Commander' : 'Responder'}
          </span>
        </h1>
        <h2 className="text-[28px] sm:text-[40px] font-medium text-slate-400 tracking-tight leading-tight">
          How can I help you today?
        </h2>
      </div>

      <div className="flex-[1.2] w-full min-h-[40px]" />

      {/* Main Input Area */}
      <div className="w-full max-w-2xl px-4 z-20 reveal reveal-d1 shrink-0 pb-12">
        <div className="relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-100 via-sky-50 to-emerald-50 rounded-[2rem] blur-md opacity-60 transition-opacity duration-500 group-focus-within:opacity-100"></div>

          <div className="relative bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2rem] p-3 pl-6 pr-3 flex flex-col transition-all duration-300 group-focus-within:shadow-[0_12px_40px_rgba(2,132,199,0.08)] group-focus-within:border-blue-200">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a field report or emergency request..."
              rows={1}
              disabled={isSubmitting}
              className="w-full bg-transparent border-none focus:ring-0 text-[16px] text-text-primary placeholder:text-slate-400 py-3 outline-none resize-none disabled:opacity-50"
              style={{ minHeight: '56px', maxHeight: '150px' }}
            />

            <div className="flex items-center justify-end mt-1">
              <button
                onClick={handleOpenModal}
                disabled={!prompt.trim() || isSubmitting}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${prompt.trim() && !isSubmitting ? 'bg-accent hover:bg-blue-600 text-white shadow-md hover:shadow-lg' : 'bg-slate-100 text-slate-400'}`}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setPrompt(s.text)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/60 border border-slate-200/80 text-slate-600 text-[13px] font-medium hover:bg-white hover:text-text-primary hover:shadow-sm hover:border-slate-300 transition-all shadow-sm backdrop-blur-sm"
            >
              <s.icon className="w-4 h-4 text-accent" />
              {s.text}
            </button>
          ))}
        </div>
      </div>

      {/* Pop-up Modal for Details */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.1)] rounded-[2rem] p-6 sm:p-8 w-full max-w-lg flex flex-col reveal-d2">
            <div className="mb-6 text-center">
              <h3 className="text-[24px] font-bold tracking-tight text-slate-800">Final Details</h3>
              <p className="text-[14px] text-slate-500 mt-1">Please confirm your contact and location information.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Reporter Name</label>
                <input type="text" placeholder={user?.email ? user.email.split('@')[0] : 'Auto'} value={raisedBy} onChange={e => setRaisedBy(e.target.value)} className="bg-white/60 border border-slate-200/60 rounded-xl py-2.5 px-3.5 text-[14px] text-slate-700 focus:bg-white outline-none focus:border-blue-300 shadow-sm transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                <input type="text" placeholder="+91..." value={phoneNo} onChange={e => setPhoneNo(e.target.value)} className="bg-white/60 border border-slate-200/60 rounded-xl py-2.5 px-3.5 text-[14px] text-slate-700 focus:bg-white outline-none focus:border-blue-300 shadow-sm transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-[14px] text-slate-700 outline-none focus:border-blue-300 cursor-pointer"
                >
                  <option value="">Unspecified</option>
                  <option>Alluri Sitharama Raju</option>
                  <option>Anakapalli</option>
                  <option>Anantapur</option>
                  <option>Annamayya</option>
                  <option>Bapatla</option>
                  <option>Chittoor</option>
                  <option>Dr. B.R. Ambedkar Konaseema</option>
                  <option>East Godavari</option>
                  <option>Eluru</option>
                  <option>Guntur</option>
                  <option>Kakinada</option>
                  <option>Krishna</option>
                  <option>Kurnool</option>
                  <option>Nandyal</option>
                  <option>NTR</option>
                  <option>Palnadu</option>
                  <option>Parvathipuram Manyam</option>
                  <option>Prakasam</option>
                  <option>Sri Potti Sriramulu Nellore</option>
                  <option>Sri Sathya Sai</option>
                  <option>Srikakulam</option>
                  <option>Tirupati</option>
                  <option>Visakhapatnam</option>
                  <option>Vizianagaram</option>
                  <option>West Godavari</option>
                  <option>YSR Kadapa</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Village/Area</label>
                <input type="text" placeholder="Current Location" value={village} onChange={e => setVillage(e.target.value)} className="bg-white/60 border border-slate-200/60 rounded-xl py-2.5 px-3.5 text-[14px] text-slate-700 focus:bg-white outline-none focus:border-blue-300 shadow-sm transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Latitude</label>
                <input type="text" placeholder="16.5" value={lat} onChange={e => setLat(e.target.value)} className="bg-white/60 border border-slate-200/60 rounded-xl py-2.5 px-3.5 text-[14px] text-slate-700 focus:bg-white outline-none focus:border-blue-300 shadow-sm transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Longitude</label>
                <input type="text" placeholder="80.6" value={lng} onChange={e => setLng(e.target.value)} className="bg-white/60 border border-slate-200/60 rounded-xl py-2.5 px-3.5 text-[14px] text-slate-700 focus:bg-white outline-none focus:border-blue-300 shadow-sm transition-all" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl text-[14px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-white bg-accent hover:bg-blue-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Right Notifications */}
      <div className="fixed bottom-8 right-6 xl:right-8 z-30 w-[280px] flex flex-col gap-3 reveal reveal-d3 hidden xl:flex">
        <div className="flex items-center justify-between mb-1 px-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">Live Priorities</span>
          </div>
          {isLoading && <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />}
        </div>

        {notifications.slice(0, 4).map((n) => {
          const isP1 = n.priority?.toUpperCase() === 'EXTREME' || n.priority === 'Critical' || n.priority === 'P1';
          const isP2 = n.priority?.toUpperCase() === 'STRONG' || n.priority === 'High' || n.priority === 'P2';

          return (
            <div key={n.ticket_id} className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-[1.25rem] p-4 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${isP1 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : isP2 ? 'bg-orange-500' : 'bg-amber-500'}`} />
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">{n.ticket_id}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-accent shrink-0 transition-colors" />
                  </div>
                  <p className="text-[13px] text-text-primary font-bold leading-[1.4] mb-2 line-clamp-2">{n.description}</p>
                  <div className="flex items-center gap-1.5 mb-3 text-[11px] text-slate-500 font-medium truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{n.village}, {n.district}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md ${isP1 ? 'bg-red-50 text-red-600 border border-red-100' : isP2 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                      {n.priority} {n.priority_score ? `(${n.priority_score})` : ''}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
