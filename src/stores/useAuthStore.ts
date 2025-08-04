// stores/useAuthStore.ts
import { create } from 'zustand';
import { Storage } from './InAppStorage';

interface AuthState {
  user: any;
  setUser: (state: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: Storage.getItem('user'),

  setUser: (state) => {
    Storage.setItem('user', state.user);
    Storage.setItem('token', state?.accessToken || '');
    set({ user: state.user });
  },

  logout: () => {
    Storage.removeItem('user');
    Storage.removeItem('token');
    set({ user: null });
  },
}));
