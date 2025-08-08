import { create } from 'zustand';

type User = { id: number; email: string; name: string; role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' } | null;

type AuthState = {
  user: User;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));


