import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, Map as MapIcon, Database, LogOut, HeartHandshake, Sparkles } from 'lucide-react';

export default function DashboardLayout() {
  const { role, user, isInitialized, logout } = useAuthStore();
  const navigate = useNavigate();

  // Wait for the Supabase session check to complete before deciding
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-slate-200 border-t-accent animate-spin" />
          <span className="text-sm text-text-secondary font-medium">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Overview' },
    { to: '/triage', icon: Sparkles, label: 'Triage' },
    ...(role === 'ADMIN' ? [
      { to: '/heatmap', icon: MapIcon, label: 'Aid Map' },
      { to: '/database', icon: Database, label: 'Resources' }
    ] : []),
  ];

  return (
    <div className="min-h-screen relative bg-bg">
      <div className="scene">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
        <div className="island rounded-full px-2 py-2 flex items-center justify-between gap-1 transition-transform duration-300 hover:scale-[1.01]">
          <div className="flex items-center gap-2.5 px-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[14px] font-extrabold tracking-tight text-text-primary hidden md:block">Relief Portal</span>
          </div>

          <div className="w-px h-6 bg-slate-200 mx-2" />

          <nav className="flex items-center gap-1.5 px-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-accent shadow-sm border border-slate-100'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
                  }`
                }
              >
                <item.icon className="w-[16px] h-[16px]" />
                <span className="hidden sm:block">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="w-px h-6 bg-slate-200 mx-2" />

          <div className="flex items-center gap-3 px-2">
            <div className="hidden sm:flex flex-col items-end justify-center">
              {user?.user_metadata?.org_name && (
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider leading-none mb-1">{user.user_metadata.org_name}</span>
              )}
              <span className="text-[11px] font-extrabold tracking-widest uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md leading-none">
                {role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full text-text-secondary hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all duration-200"
              title="Sign Out"
            >
              <LogOut className="w-[16px] h-[16px]" />
            </button>
          </div>
        </div>
      </div>

      <main className="relative z-10 pt-[7rem] pb-10 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
