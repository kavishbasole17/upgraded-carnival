import { Activity, MapPin, Radio, Users, Siren, AlertTriangle } from 'lucide-react';

export default function Heatmap() {
  const incidents = [
    { id: 1, x: '22%', y: '28%', r: 80, label: 'Sector A-7', severity: 'high', count: 12 },
    { id: 2, x: '55%', y: '42%', r: 50, label: 'Highway Block', severity: 'medium', count: 5 },
    { id: 3, x: '76%', y: '20%', r: 110, label: 'Zone Red', severity: 'critical', count: 34 },
    { id: 4, x: '16%', y: '72%', r: 35, label: 'Outpost Delta', severity: 'low', count: 2 },
    { id: 5, x: '40%', y: '75%', r: 65, label: 'Sector C-2', severity: 'high', count: 18 },
    { id: 6, x: '65%', y: '65%', r: 45, label: 'River Crossing', severity: 'medium', count: 7 },
  ];

  const sevColors: Record<string, { bg: string; border: string; dot: string }> = {
    critical: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', dot: '#dc2626' },
    high:     { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)', dot: '#ea580c' },
    medium:   { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', dot: '#d97706' },
    low:      { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', dot: '#2563eb' },
  };

  return (
    <div className="flex flex-col gap-4 reveal" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="flex items-center justify-between bg-white/40 glass px-6 py-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50 border border-red-100 shadow-sm">
            <MapPin className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-text-primary">Live Aid Map</h1>
            <p className="text-text-secondary text-[13px] mt-0.5">Real-time incident & resources visualization</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-slow shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">LIVE</span>
        </div>
      </div>

      <div className="relative flex-1 glass rounded-3xl overflow-hidden shadow-sm">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-slate-300/40 rounded-full"
            style={{
              width: `${160 + i * 140}px`,
              height: `${160 + i * 140}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {incidents.map((p) => {
          const c = sevColors[p.severity];
          return (
            <div
              key={p.id}
              className="absolute group"
              style={{ left: p.x, top: p.y, transform: 'translate(-50%, -50%)' }}
            >
              <div
                className={`rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${p.severity === 'critical' ? 'pulse-slow' : ''}`}
                style={{
                  width: `${p.r * 2}px`,
                  height: `${p.r * 2}px`,
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  boxShadow: `0 0 ${p.r}px ${p.r / 4}px ${c.bg}`,
                }}
              >
                <div className="w-3 h-3 rounded-full" style={{ background: c.dot, boxShadow: `0 0 12px 2px ${c.dot}` }} />
              </div>

              {p.severity === 'critical' && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                  <div className="flex items-center gap-1 bg-red-50 border border-red-200 shadow-sm rounded-lg px-2 py-1 text-[10px] font-bold text-red-600 whitespace-nowrap">
                    <AlertTriangle className="w-3 h-3" />
                    CRITICAL
                  </div>
                </div>
              )}

              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 whitespace-nowrap">
                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[13px] font-medium shadow-lg">
                  <span className="text-text-primary font-bold">{p.label}</span>
                  <span className="text-text-secondary ml-1.5">— {p.count} reports</span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute top-6 right-6 w-64 glass-strong bg-white/60 rounded-3xl p-5 z-10 space-y-4 reveal reveal-d2 shadow-sm border border-white">
          <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.1em] flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            Regional Metrics
          </h3>
          {[
            { icon: Siren, label: 'Critical Zones', value: '1', color: '#dc2626' },
            { icon: Users, label: 'Active Units', value: '24', color: '#2563eb' },
            { icon: Radio, label: 'Avg. Response', value: '4.2m', color: '#16a34a' },
          ].map((m) => (
            <div key={m.label} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
              <span className="flex items-center gap-2.5 text-[13px] font-medium text-text-secondary">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white shadow-sm border border-slate-100">
                  <m.icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                </div>
                {m.label}
              </span>
              <span className="text-[15px] font-bold" style={{ color: m.color }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
