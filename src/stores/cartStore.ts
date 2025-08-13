import { create } from 'zustand'

export const useTicketStore = create((set) => ({
  selectedTicketId: null,
  quantity: 0,

  // Select a ticket type
  selectTicket: (ticketId:any) =>
    set((state:any) => {
      // If selecting the same ticket, keep quantity
      if (state.selectedTicketId === ticketId) {
        return state
      }
      // If switching to a different ticket, reset quantity to 1
      return {
        selectedTicketId: ticketId,
        quantity: 1
      }
    }),

  // Increase quantity
  increaseQuantity: () =>
    set((state:any) => {
      if (!state.selectedTicketId) return state // no ticket selected
      return { quantity: state.quantity + 1 }
    }),

  // Decrease quantity
  decreaseQuantity: () =>
    set((state:any) => {
      if (!state.selectedTicketId) return state
      const newQty = Math.max(state.quantity - 1, 0)
      return { quantity: newQty }
    }),

  // Reset store
  reset: () => set({ selectedTicketId: null, quantity: 0 })
}))
