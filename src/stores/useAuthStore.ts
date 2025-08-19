// stores/useAuthStore.ts
import { create } from 'zustand';
import { Storage } from './InAppStorage';

interface AuthState {
  user: any;
  verificationToken: string | null;
  setUser: (state: any) => void;
  setVerificationToken: (token: string) => void;
  logout: () => void;
  checkoutStage: string;
  setCheckoutStage: (stage: string) => void;
  email: string ;
  otpSent: boolean;
  setEmail: (email: string) => void;
  markOtpSent: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: Storage.getItem('user'),
  checkoutStage: Storage.getItem('checkoutStage') || null,
  verificationToken: Storage.getItem("verificationToken") || null,
  token: null,
  email: '',
  otpSent: false,

  setEmail: (email:string) => set({ email }),
  markOtpSent: () => set({ otpSent: true }),
  clearAuth: () => set({ verificationToken: null, email: '', otpSent: false }),
  setUser: (state) => {
    Storage.setItem('user', state.user);
    Storage.setItem('token', state?.accessToken || '');
    set({ user: state.user });
     // Clear verification token after full login
     Storage.removeItem("verificationToken");
     set({ verificationToken: null });
  },
  setCheckoutStage: (stage) => {
    Storage.setItem('checkoutStage', stage);
    set({ checkoutStage: stage });
  },
  setVerificationToken: (token: string) => {
    Storage.setItem("verificationToken", token);
    set({ verificationToken: token });
  },
  logout: () => {
    Storage.removeItem('user');
    Storage.removeItem('token');
    set({ user: null });
  },
}));
