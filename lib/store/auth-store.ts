import { create } from "zustand";
import { refreshToken } from "@/lib/api/requests/auth.requests";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: any | null;

  // Actions
  setAccessToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  user: null,

  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: !!token }),

  setUser: (user) => set({ user }),

  login: (token, user) =>
    set({
      accessToken: token,
      isAuthenticated: true,
      user,
    }),

  logout: () =>
    set({
      accessToken: null,
      isAuthenticated: false,
      user: null,
    }),
}));
