import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Role = 'ADMIN' | 'USER' | null;

interface AuthState {
  role: Role;
  user: any | null;
  orgId: string | null;
  isInitialized: boolean;
  login: (role: Role, user: any) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  user: null,
  orgId: null,
  isInitialized: false,

  login: (role, user) => set({
    role,
    user,
    orgId: user?.user_metadata?.org_id || null,
  }),
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ role: null, user: null, orgId: null });
  },

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const userRole = session.user.user_metadata?.role || 'ADMIN';
      const orgId = session.user.user_metadata?.org_id || null;
      set({ role: userRole as Role, user: session.user, orgId, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userRole = session.user.user_metadata?.role || 'ADMIN';
        const orgId = session.user.user_metadata?.org_id || null;
        set({ role: userRole as Role, user: session.user, orgId });
      } else {
        set({ role: null, user: null, orgId: null });
      }
    });
  }
}));


