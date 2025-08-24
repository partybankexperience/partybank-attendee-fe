// import { create } from "zustand";
// import { Storage } from "./InAppStorage";

// interface TicketState {
//   selectedTicketId: string | null;
//   quantity: number;
//   price: number | null;
//   selectedTicketName?: string | null;
//   selectTicket: (ticket: any,eventName:String) => void;
//   // Update the function signature to accept a limit
//   increaseQuantity: (limit?: number) => void;
//   decreaseQuantity: () => void;
//   reset: () => void;
//   getTotal: () => number;
// }

// // Helper key for localStorage
// const STORAGE_KEY = "selectedTicket";

// export const useTicketStore = create<TicketState>((set, get) => ({
//   // Try to load from localStorage initially
//   selectedTicketId: Storage.getItem(STORAGE_KEY)?.selectedTicketId || null,
//   price: Storage.getItem(STORAGE_KEY)?.price || null,
//   selectedTicketName: Storage.getItem(STORAGE_KEY)?.selectedTicketName || null,
//   quantity: Storage.getItem(STORAGE_KEY)?.quantity || 0,

//   selectTicket: (ticket: any,eventName:String) => {
//     set((state) => {
//       const isSameTicket = state.selectedTicketId === ticket.id;
//       const newState = {
//         selectedTicketId: ticket.id,
//         quantity: isSameTicket ? state.quantity : 1, // Keep quantity if same, else reset to 1
//         selectedTicketName: ticket.name,
//         price: ticket.price,
//       };

//       // Persist to localStorage
//       Storage.setItem(STORAGE_KEY, newState);
//       Storage.setItem('eventName', eventName);
//       // console.log(eventName, "Event Name in Ticket Store");

//       return newState;
//     });
//   },

//   // The key change is here 👇
//   increaseQuantity: (limit?: number) => {
//     set((state) => {
//       if (!state.selectedTicketId) return state;

//       // If a limit is provided and the quantity is already at the limit, do nothing.
//       if (limit && state.quantity >= limit) {
//         return state;
//       }

//       const newQty = state.quantity + 1;
//       // Update localStorage if you use it
//       Storage.setItem(STORAGE_KEY, {
//         selectedTicketId: state.selectedTicketId,
//         quantity: newQty,
//         price: state.price,
//       });

//       return { quantity: newQty };
//     });
//   },

//   decreaseQuantity: () => {
//     set((state) => {
//       if (!state.selectedTicketId) return state;
//       const newQty = Math.max(state.quantity - 1, 1); // Minimum is 1
//       Storage.setItem(STORAGE_KEY, {
//         selectedTicketId: state.selectedTicketId,
//         quantity: newQty,
//         price: state.price,
//       });
//       return { quantity: newQty };
//     });
//   },

//   reset: () => {
//     Storage.removeItem(STORAGE_KEY);
//     set({
//       selectedTicketId: null,
//       quantity: 0,
//       price: null,
//       selectedTicketName: null,
//     });
//   },

//   getTotal: () => {
//     const state = get();
//     if (!state.selectedTicketId || !state.price) return 0;
//     return state.price * state.quantity;
//   },
// }));
import { create } from "zustand";
import { Storage } from "./InAppStorage";

interface TicketState {
  selectedTicketId: string | null;
  quantity: number;
  price: number | null;
  selectedTicketName: string | null;
  eventDetail: any | null; // 🔑 store event data here
  selectTicket: (ticket: any,eventName:any, eventDetail: any) => void;
  increaseQuantity: (limit?: number) => void;
  decreaseQuantity: () => void;
  reset: () => void;
  getTotal: () => number;
  eventName: string | null;
  ticket:any|null
}

const STORAGE_KEY = "selectedTicket";

export const useTicketStore = create<TicketState>((set, get) => {
  // Load persisted state
  const persisted = Storage.getItem(STORAGE_KEY);

  return {
    selectedTicketId: persisted?.selectedTicketId || null,
    price: persisted?.price || null,
    selectedTicketName: persisted?.selectedTicketName || null,
    quantity: persisted?.quantity || 0,
    eventDetail: persisted?.eventDetail || null, // load event back in
    eventName: Storage.getItem('eventName') || null,
    ticket: persisted?.ticket || null, // Store the full ticket object

    selectTicket: (ticket: any,eventName:String, eventDetail: any) => {
      set((state) => {
        const isSameTicket = state.selectedTicketId === ticket.id;
        const newState = {
          selectedTicketId: ticket.id,
          quantity: isSameTicket ? state.quantity : 1,
          selectedTicketName: ticket.name,
          price: ticket.price,
          eventDetail, // ✅ persist full event details here
          ticket: ticket, // Store the full ticket object
        };

        Storage.setItem(STORAGE_KEY, newState);
        Storage.setItem('eventName', eventName);
        return newState;
      });
    },

    increaseQuantity: (limit?: number) => {
      set((state) => {
        if (!state.selectedTicketId) return state;

        if (limit && state.quantity >= limit) return state;

        const newQty = state.quantity + 1;
        Storage.setItem(STORAGE_KEY, {
          ...state,
          quantity: newQty,
        });
        return { quantity: newQty };
      });
    },

    decreaseQuantity: () => {
      set((state) => {
        if (!state.selectedTicketId) return state;
        const newQty = Math.max(state.quantity - 1, 1);
        Storage.setItem(STORAGE_KEY, {
          ...state,
          quantity: newQty,
        });
        return { quantity: newQty };
      });
    },

    reset: () => {
      Storage.removeItem(STORAGE_KEY);
      set({
        selectedTicketId: null,
        quantity: 0,
        price: null,
        selectedTicketName: null,
        eventDetail: null, // ✅ wipe event
        ticket: null, // Clear ticket object
      });
      Storage.removeItem('eventName');
      // Clear event name and detail from storage
      set({ eventName: null });
    },

    getTotal: () => {
      const state = get();
      if (!state.selectedTicketId || !state.price) return 0;
      return state.price * state.quantity;
    },
  };
});
