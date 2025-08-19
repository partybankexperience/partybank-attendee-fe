// stores/useAuthStore.ts
import { create } from 'zustand';
import { Storage } from './InAppStorage';

interface AuthState {
  user: any;
  setUser: (state: any) => void;
  logout: () => void;
  checkoutStage: string;
  setCheckoutStage: (stage: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: Storage.getItem('user'),
  checkoutStage: Storage.getItem('checkoutStage') || null,
  setUser: (state) => {
    Storage.setItem('user', state.user);
    Storage.setItem('token', state?.accessToken || '');
    set({ user: state.user });
  },
  setCheckoutStage: (stage) => {
    Storage.setItem('checkoutStage', stage);
    set({ checkoutStage: stage });
  },
  logout: () => {
    Storage.removeItem('user');
    Storage.removeItem('token');
    set({ user: null });
  },
}));
