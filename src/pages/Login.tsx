import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Shield, User, Building, ArrowRight } from 'lucide-react';

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (role: 'ADMIN' | 'USER') => {
    login(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="scene">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] reveal">
        <div className="glass-strong rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute top-0 left-6 right-6 h-px bg-white/[0.06]" />

          <div className="flex gap-2 mb-10">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]/90" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]/90" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]/90" />
          </div>

          <div className="text-center mb-10">
            <div className="w-[72px] h-[72px] glass rounded-[20px] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_-8px_rgba(99,102,241,0.3)]">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-[26px] font-bold tracking-tight">Command Center</h1>
            <p className="text-text-secondary mt-2 text-sm">Select your access level</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleLogin('ADMIN')}
              className="group w-full btn-primary justify-between py-4 px-6 rounded-2xl text-[15px]"
            >
              <span className="flex items-center gap-3">
                <Building className="w-5 h-5 opacity-70" />
                Organization Admin
              </span>
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </button>

            <button
              onClick={() => handleLogin('USER')}
              className="group w-full btn-ghost justify-between py-4 px-6 rounded-2xl text-[15px]"
            >
              <span className="flex items-center gap-3">
                <User className="w-5 h-5 opacity-70" />
                Team Member
              </span>
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-white/[0.06] text-center">
            <button className="text-xs text-text-muted hover:text-accent transition-colors">
              Register a new organization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
