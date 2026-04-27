import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, Map as MapIcon, Database, LogOut, Shield } from 'lucide-react';

export default function DashboardLayout() {
  const { role, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ...(role === 'ADMIN' ? [{ to: '/heatmap', icon: MapIcon, label: 'Heatmap' }] : []),
    { to: '/database', icon: Database, label: 'Database' },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="scene">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="island rounded-2xl px-1.5 py-1.5 flex items-center gap-1 transition-transform duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-2.5 px-3">
            <div className="w-7 h-7 rounded-lg bg-accent-dim/20 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="text-[13px] font-semibold tracking-tight hidden lg:block">Command Center</span>
          </div>

          <div className="w-px h-5 bg-white/[0.06] mx-0.5" />

          <nav className="flex items-center gap-0.5 px-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-[7px] rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.1] text-white shadow-[inset_0_0.5px_0_rgba(255,255,255,0.1)]'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                  }`
                }
              >
                <item.icon className="w-[14px] h-[14px]" />
                <span className="hidden sm:block">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="w-px h-5 bg-white/[0.06] mx-0.5" />

          <div className="flex items-center gap-1 px-1.5">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-accent-dim/15 text-accent px-2.5 py-1 rounded-lg hidden sm:block">
              {role}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="w-[14px] h-[14px]" />
            </button>
          </div>
        </div>
      </div>

      <main className="relative z-10 pt-[5.5rem] pb-10 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
