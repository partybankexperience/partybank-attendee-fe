import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useTicketStore } from "./cartStore";

interface ConfirmationState {
  eventDetailsC: any | null;
  ticketsC: any | null;
  quantityC: number | null;
  setConfirmationDetails: (eventDetailsC: any, ticketsC: any, quantityC: number) => void;
  clearConfirmation: () => void;
}

export const useConfirmationStore = create<ConfirmationState>()(
  persist(
    (set) => ({
      eventDetailsC: null,
      ticketsC: null,
      quantityC: null,

      setConfirmationDetails: (eventDetailsC, ticketsC, quantityC) =>
        set({ eventDetailsC, ticketsC, quantityC }),

      clearConfirmation: () => {
        const { reset } = useTicketStore.getState();
        reset(); // reset cart
        localStorage.removeItem("confirmation-storage"); // clear persisted confirmation data
        set({ eventDetailsC: null, ticketsC: null, quantityC: null });
      },
    }),
    {
      name: "confirmation-storage", // key in localStorage
      storage: {
        getItem: (name: string) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name: string, value: any) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
