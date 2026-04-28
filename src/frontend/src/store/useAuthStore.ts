import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Role = 'ADMIN' | 'USER' | null;

interface AuthState {
  role: Role;
  user: any | null;
  isInitialized: boolean;
  login: (role: Role, user: any) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  user: null,
  isInitialized: false,

  login: (role, user) => set({ role, user }),
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ role: null, user: null });
  },

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const userRole = session.user.user_metadata?.role || 'ADMIN';
      set({ role: userRole as Role, user: session.user, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userRole = session.user.user_metadata?.role || 'ADMIN';
        set({ role: userRole as Role, user: session.user });
      } else {
        set({ role: null, user: null });
      }
    });
  }
}));

