import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Send, Bot, Database as DbIcon, Edit2, Trash2, Plus, Users, LayoutList, Sparkles } from 'lucide-react';

export default function Database() {
  const role = useAuthStore((state) => state.role);
  const [prompt, setPrompt] = useState('');

  const [feed] = useState([
    { id: 1, input: "Need water supplies at sector 4 immediately", priority: "CRITICAL", status: "Assigned", ts: "2 min ago" },
    { id: 2, input: "Road blocked near main highway entrance", priority: "HIGH", status: "Pending", ts: "14 min ago" },
    { id: 3, input: "Medical team required at shelter B", priority: "MEDIUM", status: "Queued", ts: "31 min ago" },
  ]);

  const [members] = useState([
    { id: 1, name: "Sarah Connor", role: "Field Medic", status: "Active", initials: "SC" },
    { id: 2, name: "John Smith", role: "Logistics Coordinator", status: "Active", initials: "JS" },
    { id: 3, name: "Maya Patel", role: "Crisis Analyst", status: "On Leave", initials: "MP" },
  ]);

  const [tasks] = useState([
    { id: 101, title: "Deliver Medical Kits", assignee: "Sarah Connor", priority: "High" },
    { id: 102, title: "Clear Debris — Route 7", assignee: "Unassigned", priority: "Medium" },
    { id: 103, title: "Establish Comm Relay", assignee: "John Smith", priority: "Critical" },
  ]);

  const priStyle: Record<string, string> = {
    CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/20',
    HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 reveal" style={{ height: 'calc(100vh - 7.5rem)' }}>
      <div className="w-full lg:w-[340px] glass rounded-2xl flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">AI Priority Engine</h2>
            <p className="text-[11px] text-text-muted">Natural language triage</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {feed.map((item, i) => (
            <div key={item.id} className={`glass-inset rounded-xl p-4 space-y-3 reveal reveal-d${i + 1}`}>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(99,102,241,0.12)' }}>
                  <Bot className="w-3.5 h-3.5 text-accent" />
                </div>
                <p className="text-[13px] text-white/80 leading-relaxed">{item.input}</p>
              </div>
              <div className="flex items-center justify-between pl-[34px]">
                <div className="flex gap-1.5">
                  <span className={`badge ${priStyle[item.priority]}`}>{item.priority}</span>
                  <span className="badge bg-white/[0.04] text-text-muted border-white/[0.06]">{item.status}</span>
                </div>
                <span className="text-[10px] text-text-muted">{item.ts}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/[0.06]">
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe a situation..."
              className="input-field pr-10"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-accent-dim hover:bg-accent text-white flex items-center justify-center transition-all duration-200 active:scale-90 shadow-[0_0_16px_-4px_rgba(99,102,241,0.4)]">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)' }}>
              <DbIcon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Database</h2>
              <p className="text-xs text-text-muted">Organization records</p>
            </div>
          </div>
          {role === 'ADMIN' && (
            <button className="btn-primary text-xs">
              <Plus className="w-3.5 h-3.5" />
              Add Record
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-3.5 h-3.5 text-text-muted" />
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.14em]">Personnel</h3>
            </div>
            <div className="glass-inset rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-text-muted uppercase tracking-wider border-b border-white/[0.04]">
                    <th className="px-5 py-3 font-semibold">Member</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    {role === 'ADMIN' && <th className="px-5 py-3 font-semibold text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-accent" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.15)' }}>
                            {m.initials}
                          </div>
                          <span className="text-[13px] font-medium">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-text-secondary">{m.role}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                          <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'}`}
                            style={{ boxShadow: m.status === 'Active' ? '0 0 6px rgba(34,197,94,0.4)' : '0 0 6px rgba(245,158,11,0.4)' }}
                          />
                          {m.status}
                        </span>
                      </td>
                      {role === 'ADMIN' && (
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            <button className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/[0.06] transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <LayoutList className="w-3.5 h-3.5 text-text-muted" />
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.14em]">Active Tasks</h3>
            </div>
            <div className="glass-inset rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-text-muted uppercase tracking-wider border-b border-white/[0.04]">
                    <th className="px-5 py-3 font-semibold">Task</th>
                    <th className="px-5 py-3 font-semibold">Assignee</th>
                    <th className="px-5 py-3 font-semibold">Priority</th>
                    {role === 'ADMIN' && <th className="px-5 py-3 font-semibold text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {tasks.map((t) => (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-[13px] font-medium">{t.title}</td>
                      <td className="px-5 py-3.5 text-[13px] text-text-secondary">{t.assignee}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${priStyle[t.priority]}`}>{t.priority}</span>
                      </td>
                      {role === 'ADMIN' && (
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            <button className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/[0.06] transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
