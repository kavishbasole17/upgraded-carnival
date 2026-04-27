import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AlertCircle, CheckCircle2, Clock4, Map as MapIcon, Database, ArrowUpRight, Zap, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const role = useAuthStore((state) => state.role);

  const stats = [
    {
      label: 'Open Alerts',
      value: '142',
      delta: '+12',
      trend: 'up' as const,
      icon: AlertCircle,
      accent: '#ef4444',
    },
    {
      label: 'In Progress',
      value: '38',
      delta: '+6',
      trend: 'up' as const,
      icon: Clock4,
      accent: '#f59e0b',
    },
    {
      label: 'Resolved',
      value: '89',
      delta: '+7',
      trend: 'up' as const,
      icon: CheckCircle2,
      accent: '#22c55e',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between reveal">
        <div>
          <p className="text-text-muted text-xs font-medium uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight">Good evening</h1>
          <p className="text-text-secondary text-sm mt-1">Operational overview for your organization</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-slow" />
          <span className="text-xs text-emerald-400/80 font-medium">All systems online</span>
        </div>
      </div>

      <section className="glass rounded-2xl p-7 reveal reveal-d1">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-base font-semibold mb-1.5">Mission Statement</h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
              Our command center drastically improves crisis management efficiency through
              real-time resource allocation and precise tracking. We bridge the gap between
              on-the-ground reports and actionable deployment, ensuring resources reach the highest
              priority zones immediately.
            </p>
          </div>
        </div>
      </section>

      <section>
        <p className="text-text-muted text-[11px] font-bold uppercase tracking-[0.12em] mb-4 reveal reveal-d2">
          Real-Time Tracking
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`glass rounded-2xl p-6 transition-all duration-300 hover:border-white/[0.12] hover:-translate-y-0.5 cursor-default group reveal reveal-d${i + 2}`}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.accent}15` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.accent }} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: stat.accent }}>
                  {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.delta}
                </div>
              </div>
              <div className="text-[40px] font-bold tracking-tighter leading-none mb-1">{stat.value}</div>
              <div className="text-text-secondary text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-3 pt-2 reveal reveal-d5">
        {role === 'ADMIN' && (
          <Link to="/heatmap" className="btn-primary group">
            <MapIcon className="w-4 h-4" />
            Launch Heatmap
            <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Link>
        )}
        <Link to="/database" className="btn-ghost group">
          <Database className="w-4 h-4" />
          Open Database
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 transition-opacity" />
        </Link>
      </section>
    </div>
  );
}
