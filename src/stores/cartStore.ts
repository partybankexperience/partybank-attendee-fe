// import { create } from 'zustand'

// interface TicketState {
//     selectedTicketId: string | null;
//     quantity: number;
//     selectTicket: (ticketId: string) => void;
//     increaseQuantity: () => void;
//     decreaseQuantity: () => void;
//     reset: () => void;
//     getTotal: () => number;
//     ticketPrices: Record<string, number>;
//   }

// export const useTicketStore = create<TicketState>((set,get) => ({
//   selectedTicketId: null,
//   quantity: 0,
//   ticketPrices: {
//     xtasyPass: 5000,
//     godMode: 10000,
//     xtasy: 15000,
//   },
//   // Select a ticket type
//   selectTicket: (ticketId:any) =>
//     set((state:any) => {
//       // If selecting the same ticket, keep quantity
//       if (state.selectedTicketId === ticketId) {
//         return state
//       }
//       // If switching to a different ticket, reset quantity to 1
//       return {
//         selectedTicketId: ticketId,
//         quantity: 1
//       }
//     }),

//   // Increase quantity
//   increaseQuantity: () =>
//     set((state:any) => {
//       if (!state.selectedTicketId) return state // no ticket selected
//       return { quantity: state.quantity + 1 }
//     }),

//   // Decrease quantity
//   decreaseQuantity: () =>
//     set((state:any) => {
//       if (!state.selectedTicketId) return state
//       const newQty = Math.max(state.quantity - 1, 0)
//       return { quantity: newQty }
//     }),

//   // Reset store
//   reset: () => set({ selectedTicketId: null, quantity: 0 }),

//   getTotal: () => {
//     const state = get();
//     if (!state.selectedTicketId) return 0;
//     const price = state.ticketPrices[state.selectedTicketId] || 0;
//     return price * state.quantity;
//   }
// }))
import { create } from 'zustand';
import { Storage } from './InAppStorage'; // your utility

interface TicketState {
  selectedTicketId: string | null;
  quantity: number;
  ticketPrices: Record<string, number>;
  selectTicket: (ticketId: string) => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  reset: () => void;
  getTotal: () => number;
  price: number | null;
  selectedTicketName?: string | null;
}

// Helper key for localStorage
const STORAGE_KEY = 'selectedTicket';

export const useTicketStore = create<TicketState>((set, get) => ({
  // Try to load from localStorage initially
  selectedTicketId: Storage.getItem(STORAGE_KEY)?.selectedTicketId || null,
  price: Storage.getItem(STORAGE_KEY)?.price || null,
  selectedTicketName: Storage.getItem(STORAGE_KEY)?.selectedTicketName || null,
  quantity: Storage.getItem(STORAGE_KEY)?.quantity || 0,

  ticketPrices: {
    xtasyPass: 5000,
    godMode: 10000,
    xtasy: 15000,
  },

  selectTicket: (ticket:any) => {
    set((state) => {
      const newState = state.selectedTicketId === ticket.id
        ? state
        : { selectedTicketId: ticket.id, quantity: 1, selectedTicketName: ticket.name, price:ticket.price };

      // Persist to localStorage
      Storage.setItem(STORAGE_KEY, {
        selectedTicketId: newState.selectedTicketId,
        quantity: newState.quantity,
        selectedTicketName: newState.selectedTicketName, price:newState.price
      });

      return newState;
    });
  },

  increaseQuantity: () => {
    set((state) => {
      if (!state.selectedTicketId) return state;

      const newQty = state.quantity + 1;
      Storage.setItem(STORAGE_KEY, {
        selectedTicketId: state.selectedTicketId,
        quantity: newQty,
      });

      return { quantity: newQty };
    });
  },

  decreaseQuantity: () => {
    set((state) => {
      if (!state.selectedTicketId) return state;

      const newQty = Math.max(state.quantity - 1, 1); // minimum 1
      Storage.setItem(STORAGE_KEY, {
        selectedTicketId: state.selectedTicketId,
        quantity: newQty,
      });

      return { quantity: newQty };
    });
  },

  reset: () => {
    Storage.removeItem(STORAGE_KEY);
    set({ selectedTicketId: null, quantity: 0 });
  },

  getTotal: () => {
    const state = get();
    if (!state.selectedTicketId) return 0;
    const price = state.price || 0;
    return price * state.quantity;
  },
}));
