'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface AuthStore {
  userId: string | null;
  isAuthenticated: boolean;
  setAuth: (userId: string | null) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      userId: null,
      isAuthenticated: false,

      setAuth: (userId: string | null) => {
        set({
          userId,
          isAuthenticated: !!userId,
        });
      },

      clearAuth: () => {
        set({
          userId: null,
          isAuthenticated: false,
        });
      },

      initializeAuth: async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.user) {
            set({
              userId: session.user.id,
              isAuthenticated: true,
            });
          } else {
            set({
              userId: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({
            userId: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'rescope-auth-store',
      partialize: (state) => ({
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Setup auth state listener
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      useAuthStore.getState().setAuth(session.user.id);
    } else {
      useAuthStore.getState().clearAuth();
    }
  });
}
