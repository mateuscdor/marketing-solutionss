import create from "zustand";

export type LoggedUser = {
  email: string;
  emailVerified: boolean;
  jwtToken: string;
  id: string;
};
export type AuthState = {
  user: LoggedUser | null;
  setUser: (user: LoggedUser | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set((state) => ({ ...state, user })),
}));
