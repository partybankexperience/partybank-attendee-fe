import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import xtasyGroove from "../../assets/images/XtasyGroove.png";
import HomeLayout from "../../components/layouts/HomeLayout";
import DefaultButton from "../../components/buttons/DefaultButton";
import { Storage } from "../../stores/InAppStorage";
import { useNavigate } from "react-router";
import { useCheckoutStore } from "../../stores/checkoutStore";
import { useTicketStore } from "../../stores/cartStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useConfirmationStore } from "../../stores/confirmationStore";
import { useCancelCheckout, useCheckoutLeaveGuards } from "./CancelCheckout";
import { errorAlert } from "../../components/alerts/ToastService";
import { formatDate, formatTimeRange } from "../../components/helpers/dateTimeHelpers";
import { formatTimer, usePaymentTimer } from "../../components/helpers/timer";
import { formatPrice } from "../../components/helpers/numberFormatHelpers";

const Checkout: React.FC = () => {
  // Animations
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const navigate = useNavigate();

  // Stores
  const { startCheckout, reservationId, resetCheckout } = useCheckoutStore();
  const {
    selectedTicketId,
    quantity,
    eventDetail,
    ticket,
    getTotal,
    reset: resetCart,
  } = useTicketStore();
  const { checkoutStage } = useAuthStore();
  const { setConfirmationDetails } = useConfirmationStore();

  // Local UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);

  // Payment hold timer
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timersInitialized, setTimersInitialized] = useState(false);
  const timeLeft = usePaymentTimer(endTime, () => setEndTime(null));
  const startTimer = (mins: number) =>
    setEndTime(new Date(Date.now() + mins * 60 * 1000));

  // Leave guards
  const { handleCancelCheckout, ModalForceComponent } = useCancelCheckout();
  const eventName = Storage.getItem("eventName");
  const { ModalComponent } = useCheckoutLeaveGuards({
    active: true,
    backTo: `/event-details/${eventName}`,
  });

  // Timer boot
  useEffect(() => {
    if (checkoutStage === "checkout" && selectedTicketId) {
      startTimer(15);
      setTimersInitialized(true);
    }
  }, [checkoutStage, selectedTicketId]);

  // Timer expiry
  useEffect(() => {
    if (!timersInitialized) return;
    if (timeLeft === 0 && endTime === null) {
      handleCancelCheckout(
        `/event-details/${eventName}`,
        "Session Timed Out",
        "Your ticket hold has expired. Please restart the booking process."
      );
    }
  }, [timeLeft, endTime, timersInitialized, eventName, handleCancelCheckout]);

  // Smooth checkout handler
  async function handleCheckout() {
    setIsLoading(true);

    try {
      // Guards
      if (!selectedTicketId) {
        errorAlert("Error", "No ticket selected. Please go back!");
        navigate(`/event-details/${eventName}`);
        return;
      }
      if (!reservationId) {
        errorAlert("Error", "No reservation ID found. Please go back!");
        navigate(`/event-details/${eventName}`);
        return;
      }

      const response = await startCheckout(reservationId);

      // Paid flow → redirect to Paystack (defer cleanup to page unload)
      if (ticket?.type === "paid" && response?.paystackLink) {
        setIsNavigating(true);
        setOverlayMessage("Opening Paystack…");

        const onPageHide = () => {
          try {
            resetCheckout();
            resetCart();
          } finally {
            window.removeEventListener("pagehide", onPageHide);
          }
        };
        window.addEventListener("pagehide", onPageHide, { once: true });

        window.location.replace(response.paystackLink);
        return;
      }

      // Free flow → finalize locally (no overlay)
      if (ticket?.type === "free" && response) {
        setConfirmationDetails(eventDetail, ticket, quantity);
        navigate("/confirmation");
        // Clear stores after navigation to avoid flicker
        setTimeout(() => {
          resetCheckout();
          resetCart();
        }, 0);
        return;
      }

      errorAlert("Error", "Unable to start checkout. Please try again.");
    } catch (err) {
      console.error(err);
      handleCancelCheckout(
        `/event-details/${eventName}`,
        "Oops! Something went wrong",
        "We encountered an issue while processing your request. Please try again in a moment. You'll be redirected to the event page."
      );
    } finally {
      // Keep spinner while navigating so UI doesn't flash an empty state
      if (!isNavigating) setIsLoading(false);
    }
  }

  // Avoid showing the "No active checkout" page while loading/redirecting
  if (!reservationId && !isLoading && !isNavigating) {
    return (
      <HomeLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-semibold text-textBlack mb-4">
            No active checkout session
          </h2>
          <p className="text-gray-600 mb-6">
            It seems like you don't have an active checkout session. Please go
            back to the event page and select your tickets.
          </p>
          <DefaultButton variant="primary" onClick={() => navigate(`/search`)}>
            Back to Events
          </DefaultButton>
        </div>
      </HomeLayout>
    );
  }

  return (
    <>
      {ModalComponent}
      {ModalForceComponent}

      <HomeLayout>
        <div className="bg-white py-2 px-4 lg:py-8 w-[95vw] md:w-[80vw] lg:w-[85vw] relative top-[-5rem] rounded-2xl z-40 max-w-6xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between pb-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="text-center flex-1">
                <h1 className="text-2xl lg:text-3xl font-medium text-textBlack mb-2">
                  Checkout
                </h1>
                <motion.div
                  className="inline-block bg-[#FFF2F4] text-primary px-4 py-2 rounded-[10px] text-sm font-medium border-2 border-primary/10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Time left {formatTimer(timeLeft)}
                </motion.div>
              </div>
            </motion.div>

            <div className="lg:flex justify-center gap-1 mb-[4rem]">
              {/* Ticket Info */}
              <motion.div
                className="p-6 lg:p-8 bg-[#FFF2F4] md:rounded-[12px]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {/* Event Details */}
                <div className="grid gap-2">
                  <h2 className="text-lg font-bold text-textBlack ">
                    {eventDetail?.name}
                  </h2>
                  <div className="flex flex-col md:flex-row gap-4 ">
                    <div className="rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={eventDetail?.bannerImage || xtasyGroove}
                        alt={eventDetail?.name || "Event banner"}
                        className="w-[5rem] md:w-[10rem] h-auto max-h-[45rem] lg:w-[8rem] lg:h-[10rem]"
                      />
                    </div>

                    <div className="space-y-3 font-semibold text-textBlack">
                      <div className="flex items-center gap-3 ">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-sm">
                          {formatDate(eventDetail?.startDate)}
                          {eventDetail?.endDate
                            ? ` - ${formatDate(eventDetail?.endDate)}`
                            : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 ">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="text-sm">
                          {formatTimeRange(
                            eventDetail?.startTime,
                            eventDetail?.endTime
                          )}
                        </span>
                      </div>

                      <div className="flex items-start gap-3 text-gray-700">
                        <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                        <span className="text-sm">
                          {eventDetail?.venueName || "TBD"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="py-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-primary" />
                      <span className="font-semibold">
                        x {quantity} — {ticket?.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm md:text-[14px] text-[#918F90] font-medium ml-6">
                    • Booking fee per ticket: {formatPrice(ticket?.price ?? 0)}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-red-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-textBlack">
                      Total :
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {getTotal()}
                    </span>
                  </div>
                </div>

                {/* Terms */}
                <p className="text-xs md:text-[14px] text-[#A9ABAE] mb-6 font-medium">
                  By selecting Transfer Completed/Proceed to Payment, I agree to
                  the Partybank Terms of Service.
                </p>

                {/* Proceed Button */}
                <DefaultButton
                  isLoading={isLoading || isNavigating}
                  disabled={isLoading || isNavigating}
                  variant="primary"
                  onClick={handleCheckout}
                  className="w-full mt-4"
                >
                  {ticket?.type === "paid" ? "Proceed to Payment" : "Get Ticket"}
                </DefaultButton>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Blocking overlay — show ONLY when redirecting to Paystack */}
        {isNavigating && (
          <div className="fixed inset-0 z-[9999] bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <div className="rounded-xl px-6 py-4 shadow bg-white">
              <p className="text-sm font-medium">
                {overlayMessage ?? "Please wait…"}
              </p>
            </div>
          </div>
        )}
      </HomeLayout>
    </>
  );
};

export default Checkout;
