import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Heart, CheckCircle2, Clock4, Map as MapIcon, Database, ArrowUpRight, ShieldCheck, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const role = useAuthStore((state) => state.role);

  const stats = [
    {
      label: 'Active Requests',
      value: '142',
      delta: '+12 today',
      icon: Heart,
      accent: '#ef4444',
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-100'
    },
    {
      label: 'Units Deployed',
      value: '38',
      delta: 'Active now',
      icon: Clock4,
      accent: '#f59e0b',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100'
    },
    {
      label: 'Missions Completed',
      value: '89',
      delta: '+7 this week',
      icon: CheckCircle2,
      accent: '#10b981',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between reveal">
        <div>
          <p className="text-text-muted text-[11px] font-bold uppercase tracking-widest mb-2">Coordination Overview</p>
          <h1 className="text-[32px] font-extrabold tracking-tight text-text-primary leading-none">Welcome back</h1>
          <p className="text-text-secondary text-[15px] mt-2">Daily snapshot of our humanitarian efforts and active missions.</p>
        </div>
        <div className="flex items-center gap-2.5 bg-white/60 border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-slow shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[12px] text-emerald-700 font-bold uppercase tracking-wide">Network Online</span>
        </div>
      </div>

      <section className="glass-strong rounded-3xl p-8 reveal reveal-d1">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 border border-blue-100 shadow-sm">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Our Mission Focus</h2>
            <p className="text-text-secondary text-[15px] leading-relaxed max-w-4xl">
              This portal streamlines coordination between volunteer teams, supply logistics, and resource centers to ensure aid reaches those in need as efficiently as possible. We prioritize transparency, safety, and rapid response in every single operation.
            </p>
          </div>
        </div>
      </section>

      <section>
        <p className="text-text-muted text-[11px] font-bold uppercase tracking-[0.1em] mb-4 reveal reveal-d2 ml-1">
          Field Operations
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`glass rounded-3xl p-7 transition-all duration-300 hover:bg-white hover:-translate-y-1 hover:shadow-lg cursor-default group reveal reveal-d${i + 2}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stat.bg} ${stat.border}`}>
                  <stat.icon className={`w-6 h-6 ${stat.text}`} />
                </div>
                <div className={`flex items-center gap-1.5 text-[12px] font-bold ${stat.text} bg-white px-2.5 py-1 rounded-full shadow-sm border ${stat.border}`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                  {stat.delta}
                </div>
              </div>
              <div className="text-[48px] font-black tracking-tighter leading-none mb-2 text-text-primary group-hover:scale-[1.02] transition-transform origin-left">{stat.value}</div>
              <div className="text-text-secondary text-[15px] font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-4 pt-4 reveal reveal-d5">
        {role === 'ADMIN' && (
          <Link to="/heatmap" className="btn-primary group text-[15px] px-6 py-3.5">
            <MapIcon className="w-5 h-5" />
            Launch Aid Map
            <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>
        )}
        <Link to="/database" className="btn-ghost group text-[15px] px-6 py-3.5 bg-white">
          <Database className="w-5 h-5 text-accent" />
          Browse Resources
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-accent" />
        </Link>
      </section>
    </div>
  );
}
