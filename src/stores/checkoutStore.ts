// // stores/useCheckoutStore.ts
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { cancelCheckout, checkoutStatus, initiateCheckout } from "../containers/checkoutApi";
// import { generateIdempotencyKey } from "../components/helpers/idempotencyKey";

// type CheckoutState = {
//   checkoutId: string | null;
//   transactionId: string | null;
//   holdToken: string | null;
//   status: "idle" | "pending" | "success" | "failed" | "cancelled";
//   paymentLink: string | null;
//   expiresAt: number | null; // for countdown timer
//   reservationId: string | null; // to store reservation ID if needed

//   // actions
//   startCheckout: (ticketId: string, quantity: number) => Promise<void>;
//   pollStatus: () => Promise<void>;
//   cancelCheckout: (reason?: string) => Promise<void>;
//   resetCheckout: () => void;
// };

// export const useCheckoutStore = create<CheckoutState>()(
//   persist(
//     (set, get) => ({
//       checkoutId: null,
//       transactionId: null,
//       holdToken: null,
//       status: "idle",
//       paymentLink: null,
//       expiresAt: null,
//       reservationId: null, // Initialize reservationId

//       startCheckout: async (ticketId, quantity) => {
//         set({ status: "pending" });
//        const idempotencyKey= generateIdempotencyKey(ticketId, quantity);
//         try {
//           const res = await initiateCheckout(ticketId, idempotencyKey);

//           set({
//             checkoutId: res?.checkoutId ?? null,
//             transactionId: res?.transactionId ?? null,
//             holdToken: res?.holdToken ?? null,
//             paymentLink: res?.paystackLink ?? null,
//             expiresAt: res?.expiresAt ?? null,
//             status: "pending",
//           });
//           return res

//         } catch (err) {
//           console.error("Checkout initiation failed", err);
//           set({ status: "failed" });
//         }
//       },

//       pollStatus: async () => {
//         const { reservationId,holdToken } = get();
//         if (!reservationId) return;
//         try {
//           const res = await checkoutStatus(reservationId,holdToken);

//           if (res?.status === "success") {
//             set({ status: "success", paymentLink: res?.paymentLink ?? null });
//           } else if (res?.status === "failed") {
//             set({ status: "failed" });
//           }
//         } catch (err) {
//           console.error("Polling checkout status failed", err);
//         }
//       },

//       cancelCheckout:async(reason = "User abandoned") => {
//         const { transactionId, holdToken } = get();
//         if (!transactionId || !holdToken) return;

//         // Prepare payload
//         const payload = JSON.stringify({ transactionId, reason, holdToken });

//         // Use sendBeacon to safely call backend even if user leaves
//         const baseUrl = import.meta.env.VITE_BASE_URL;
//         const url = `${baseUrl}/checkout/cancel`;
//         navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));

//         // Reset state locally
//         set({
//           checkoutId: null,
//           transactionId: null,
//           holdToken: null,
//           status: "cancelled",
//           paymentLink: null,
//           expiresAt: null,
//         });
//       },
//       // cancelCheckout: async (reason = "User abandoned") => {
//       //   const { transactionId, holdToken } = get();
//       //   if (!transactionId || !holdToken) return;

//       //   try {
//       //     await cancelCheckout(transactionId, reason, holdToken);
//       //     set({ status: "cancelled" });
//       //     set({
//       //       checkoutId: null,
//       //       transactionId: null,
//       //       holdToken: null,
//       //       status: "cancelled",
//       //       paymentLink: null,
//       //       expiresAt: null,
//       //     })
//       //   } catch (err) {
//       //     console.error("Cancel checkout failed", err);
//       //   }
//       // },

//       resetCheckout: () =>
//         set({
//           checkoutId: null,
//           transactionId: null,
//           holdToken: null,
//           status: "idle",
//           paymentLink: null,
//           expiresAt: null,
//         }),
//     }),
//     {
//         name: "checkout-storage",
//         storage: {
//           getItem: (name) => {
//             const str = sessionStorage.getItem(name);
//             return str ? JSON.parse(str) : null;
//           },
//           setItem: (name, value) => {
//             sessionStorage.setItem(name, JSON.stringify(value));
//           },
//           removeItem: (name) => {
//             sessionStorage.removeItem(name);
//           },
//         },}
//   )
// );
// stores/useCheckoutStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initiateCheckout, checkoutStatus, createReservation, cancelReservation } from "../containers/checkoutApi";
import { generateIdempotencyKey } from "../components/helpers/idempotencyKey";

type CheckoutState = {
  checkoutId: string | null;
  transactionId: string | null;
  holdToken: string | null;
  status: "idle" | "pending" | "success" | "failed" | "cancelled";
  paymentLink: string | null;
  expiresAt: number | null;
  reservationId: string | null;
  eventId: string | null; // ✅ track event
  ticketId: string | null; // ✅ track ticket
  quantity: number | null;

  // actions
  createAndStoreReservation: (
    eventId: string,
    ticketId: string,
    quantity: number,
    identity:{}
  ) => Promise<any>;
  startCheckout: (reservationId: string) => Promise<any>;
  pollStatus: () => Promise<void>;
  cancelCheckout: (reason?: string) => Promise<void>;
  resetCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      checkoutId: null,
      transactionId: null,
      holdToken: null,
      status: "idle",
      paymentLink: null,
      expiresAt: null,
      reservationId:'',
      eventId: null,
      ticketId: null,
      quantity: null,

      // ✅ Reservation pipeline
      createAndStoreReservation: async (eventId, ticketId, quantity, identity) => {
        const idempotencyKey = generateIdempotencyKey(ticketId, quantity);
        try {
          const res = await createReservation(eventId, ticketId, quantity, idempotencyKey, identity);

          set({
            reservationId: res?.reservationId ?? null,
            holdToken: res?.holdToken ?? null,
            expiresAt: res?.expiresAt ?? null,
            status: res.status,
          });

          return res;
        } catch (err) {
          console.error("Reservation failed", err);
          set({ status: "failed" });
          throw err; // propagate for pipeline to stop
        }
      },

      // ✅ Checkout
      startCheckout: async (reservationId) => {
        const idempotencyKey = generateIdempotencyKey(reservationId, Date.now());
        try {
          const res = await initiateCheckout(reservationId, idempotencyKey);

          set({
            checkoutId: res?.checkoutId ?? null,
            transactionId: res?.transactionId ?? null,
            paymentLink: res?.paystackLink ?? null,
            expiresAt: res?.expiresAt ?? null,
            status: "pending",
          });

          return res;
        } catch (err) {
          console.error("Checkout initiation failed", err);
          set({ status: "failed" });
          throw err;
        }
      },

      pollStatus: async () => {
        const { reservationId, holdToken } = get();
        if (!reservationId) return;
        try {
          const res = await checkoutStatus(reservationId, holdToken);

          if (res?.status === "success") {
            set({ status: "success", paymentLink: res?.paymentLink ?? null });
          } else if (res?.status === "failed") {
            set({ status: "failed" });
          }
        } catch (err) {
          console.error("Polling checkout status failed", err);
        }
      },

      cancelCheckout: async () => {
        const { transactionId, holdToken, reservationId} = get();
        if (!transactionId || !holdToken) return;

        try {
          await cancelReservation(reservationId, holdToken);
          set({ status: "cancelled" });
        } catch (err) {
          console.error("Cancel checkout failed", err);
        }

        // reset state
        set({
          checkoutId: null,
          transactionId: null,
          holdToken: null,
          paymentLink: null,
          expiresAt: null,
          reservationId: null,
          eventId: null,
          ticketId: null,
          quantity: null,
        });
      },

      resetCheckout: () =>
        set({
          checkoutId: null,
          transactionId: null,
          holdToken: null,
          status: "idle",
          paymentLink: null,
          expiresAt: null,
          reservationId: null,
          eventId: null,
          ticketId: null,
          quantity: null,
        }),
    }),
    {
      name: "checkout-storage",
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
