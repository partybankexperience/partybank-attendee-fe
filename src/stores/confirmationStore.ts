// stores/confirmationStore.ts
import { create } from "zustand";

interface ConfirmationState {
  eventDetail: any | null;
  ticket: any | null;
  quantity: number | null;
  setConfirmationDetails: (eventDetail: any, ticket: any, quantity: number) => void;
  clearConfirmation: () => void;
}

export const useConfirmationStore = create<ConfirmationState>((set) => ({
  eventDetail: null,
  ticket: null,
  quantity: null,

  setConfirmationDetails: (eventDetail, ticket, quantity) =>
    set({ eventDetail, ticket, quantity }),

  clearConfirmation: () =>
    set({ eventDetail: null, ticket: null, quantity: null }),
}));
