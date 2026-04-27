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
    critical: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.35)', dot: '#ef4444' },
    high:     { bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.3)', dot: '#f97316' },
    medium:   { bg: 'rgba(245,158,11,0.05)', border: 'rgba(245,158,11,0.25)', dot: '#f59e0b' },
    low:      { bg: 'rgba(59,130,246,0.04)', border: 'rgba(59,130,246,0.2)', dot: '#3b82f6' },
  };

  return (
    <div className="flex flex-col gap-4 reveal" style={{ height: 'calc(100vh - 7.5rem)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)' }}>
            <MapPin className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Live Crisis Map</h1>
            <p className="text-text-muted text-xs">Real-time incident visualization</p>
          </div>
        </div>
        <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-slow" />
          <span className="text-[11px] text-emerald-400 font-semibold tracking-wide">LIVE</span>
        </div>
      </div>

      <div className="relative flex-1 glass rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-white/[0.02] rounded-full"
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
                  border: `1.5px solid ${c.border}`,
                  boxShadow: `0 0 ${p.r}px ${p.r / 3}px ${c.bg}`,
                }}
              >
                <div className="w-3 h-3 rounded-full" style={{ background: c.dot, boxShadow: `0 0 12px 2px ${c.dot}` }} />
              </div>

              {p.severity === 'critical' && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                  <div className="flex items-center gap-1 glass-inset rounded-lg px-2 py-1 text-[10px] font-bold text-red-400 whitespace-nowrap">
                    <AlertTriangle className="w-3 h-3" />
                    CRITICAL
                  </div>
                </div>
              )}

              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 whitespace-nowrap">
                <div className="glass-strong rounded-lg px-3 py-2 text-xs font-medium shadow-2xl">
                  <span className="text-white">{p.label}</span>
                  <span className="text-text-muted ml-1.5">— {p.count} reports</span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute top-5 right-5 w-64 glass-strong rounded-2xl p-5 z-10 space-y-3.5 reveal reveal-d2">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.14em] flex items-center gap-2">
            <Activity className="w-3 h-3 text-accent" />
            Regional Metrics
          </h3>
          {[
            { icon: Siren, label: 'Critical Zones', value: '1', color: '#ef4444' },
            { icon: Users, label: 'Active Units', value: '24', color: '#3b82f6' },
            { icon: Radio, label: 'Avg. Response', value: '4.2m', color: '#22c55e' },
          ].map((m) => (
            <div key={m.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
              <span className="flex items-center gap-2 text-xs text-text-secondary">
                <m.icon className="w-3 h-3" style={{ color: m.color }} />
                {m.label}
              </span>
              <span className="text-base font-bold" style={{ color: m.color }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
