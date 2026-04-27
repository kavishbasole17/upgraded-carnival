import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { HeartHandshake, ShieldCheck, Users, ArrowRight, Mail, Lock, AlertCircle, Globe } from 'lucide-react';

import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role: 'ADMIN' | 'USER') => {
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email and password.');
      return;
    }
    
    setLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      // Auto-signup for demo convenience
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: role }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      
      useAuthStore.getState().login(role, signUpData.user);
      setLoading(false);
      navigate('/');
      return;
    }
    
    const userRole = data.user.user_metadata?.role || role;
    useAuthStore.getState().login(userRole, data.user);
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div className="scene">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="relative z-10 w-full max-w-[960px] reveal flex flex-col md:flex-row glass-strong rounded-[2.5rem] overflow-hidden shadow-sm">
        
        {/* Left Side: Branding */}
        <div className="hidden md:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden border-r border-white/60 bg-white/40">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="font-bold tracking-tight text-text-primary">Humanitarian Aid</span>
            </div>

            <div className="space-y-4 mt-12">
              <h1 className="text-[36px] font-extrabold tracking-tight leading-[1.1] text-text-primary">
                Relief Portal<span className="text-emerald-500">.</span>
              </h1>
              <p className="text-text-secondary text-[15px] leading-relaxed max-w-[280px]">
                Coordinate volunteer efforts, manage critical resources, and track field missions in real-time.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-20">
            <div className="glass-inset bg-white/60 rounded-2xl p-4 flex items-start gap-4">
               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                 <Globe className="w-4 h-4 text-blue-600" />
               </div>
               <div>
                 <p className="text-sm font-bold text-text-primary">Global Reach</p>
                 <p className="text-[13px] text-text-secondary mt-0.5">Connecting organizations worldwide.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 lg:p-16 relative flex flex-col justify-center bg-white/60">
          <div className="max-w-[380px] w-full mx-auto">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight mb-2 text-text-primary">Welcome back</h2>
              <p className="text-[15px] text-text-secondary">Sign in to coordinate aid and resources</p>
            </div>

            {error && (
              <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-sm text-red-600">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            <div className="space-y-5 mb-10">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.05em] ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-accent" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-inset bg-white/60 rounded-2xl py-3.5 pl-11 pr-4 text-[15px] focus:bg-white transition-all shadow-sm border-white"
                    placeholder="volunteer@ngo.org"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.05em]">Password</label>
                  <button className="text-[11px] font-bold text-accent hover:text-blue-700 transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-accent" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-inset bg-white/60 rounded-2xl py-3.5 pl-11 pr-4 text-[15px] focus:bg-white transition-all shadow-sm border-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em]">Select Role</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleLogin('ADMIN')}
                className="flex-1 relative group overflow-hidden glass bg-white/60 hover:bg-white border border-white hover:border-blue-200 rounded-[1.25rem] p-4.5 transition-all shadow-sm hover:-translate-y-1 hover:shadow-md text-left"
              >
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-[15px] font-bold text-text-primary mb-0.5">Admin</h3>
                  <p className="text-[11px] font-medium text-text-secondary">Coordination access</p>
                </div>
              </button>

              <button
                onClick={() => handleLogin('USER')}
                className="flex-1 relative group overflow-hidden glass bg-white/60 hover:bg-white border border-white hover:border-emerald-200 rounded-[1.25rem] p-4.5 transition-all shadow-sm hover:-translate-y-1 hover:shadow-md text-left"
              >
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-[15px] font-bold text-text-primary mb-0.5">Volunteer</h3>
                  <p className="text-[11px] font-medium text-text-secondary">Field access</p>
                </div>
              </button>
            </div>
            
            <div className="mt-10 text-center md:text-left">
              <p className="text-[12px] font-medium text-text-secondary">
                Want to register as a partner? <button className="text-accent hover:text-blue-700 font-bold transition-colors ml-1">Apply here</button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
