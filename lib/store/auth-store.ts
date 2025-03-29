import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define settings store to remember user preferences
interface AuthSettingsState {
  isPersistent: boolean;
  setPersistentLogin: (isPersistent: boolean) => void;
}

export const useAuthSettingsStore = create<AuthSettingsState>()(
  persist(
    (set) => ({
      isPersistent: false,
      setPersistentLogin: (isPersistent) => set({ isPersistent }),
    }),
    {
      name: "auth-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Main auth store - remains in-memory
interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: any | null;

  // Actions
  setAccessToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  login: (token: string, user: any, isPersistent?: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  user: null,

  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: !!token }),

  setUser: (user) => set({ user }),

  login: (token, user, isPersistent = false) => {
    // Store user preference in settings store
    useAuthSettingsStore.getState().setPersistentLogin(isPersistent);
    
    // Store actual auth data in memory only
    set({
      accessToken: token,
      isAuthenticated: true,
      user,
    });
  },

  logout: () => {
    set({
      accessToken: null,
      isAuthenticated: false,
      user: null,
    });
  },
}));
