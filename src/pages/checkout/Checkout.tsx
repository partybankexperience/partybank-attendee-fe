import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import xtasyGroove from "../../assets/images/XtasyGroove.png";
import HomeLayout from "../../components/layouts/HomeLayout";
import { useCheckoutStore } from "../../stores/checkoutStore";
import DefaultButton from "../../components/buttons/DefaultButton";
import { useTicketStore } from "../../stores/cartStore";
import { useCheckoutLeaveGuards } from "./CancelCheckout";
import { Storage } from "../../stores/InAppStorage";
import {
  formatDate,
  formatTimeRange,
} from "../../components/helpers/dateTimeHelpers";
import { errorAlert } from "../../components/alerts/ToastService";
import { useNavigate } from "react-router";
import { formatTimer, usePaymentTimer } from "../../components/helpers/timer";
import { useAuthStore } from "../../stores/useAuthStore";
import { formatPrice } from "../../components/helpers/numberFormatHelpers";
import { useConfirmationStore } from "../../stores/confirmationStore";

const Checkout: React.FC = () => {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const [isLoading, setisLoading] = useState(false);
  const { startCheckout } = useCheckoutStore();
  const {setConfirmationDetails}= useConfirmationStore()
  const { selectedTicketId, quantity, eventDetail, ticket, getTotal} =
    useTicketStore();
  const { reservationId,resetCheckout } = useCheckoutStore();
  const eventName = Storage.getItem("eventName");
 const { checkoutStage } = useAuthStore();
  const navigate=useNavigate()
  // const redirect = Storage?.getItem("redirectPath") || null;
    const [endTime, setEndTime] = useState<Date | null>(null);
  const [timersInitialized, setTimersInitialized] = useState(false);
    const timeLeft = usePaymentTimer(endTime, () => {
      setEndTime(null);
    });
  
    const startTimer = (durationInMinutes: number) => {
      // Calculate the end time based on the input duration
      const targetTime = new Date(new Date().getTime() + durationInMinutes * 60 * 1000);
      setEndTime(targetTime);
    };
  async function handleCheckout() {
    setisLoading(true);
    
    try {
      if (!selectedTicketId) {
        navigate(`/event-details/${eventName}`);
        errorAlert("Error", "No ticket selected. Please go back!");
        console.error("No ticket selected");
        return;
      }
      if (!reservationId) {
        navigate(`/event-details/${eventName}`);
        return errorAlert("Error", "No reservation ID found. Please go back!");
      }
      const res = await startCheckout(reservationId);
      
      if (res?.paystackLink && ticket?.type === "paid") {
        window.location.href = res.paystackLink;
      } else if (ticket?.type === "free") {
    setConfirmationDetails(eventDetail, ticket, quantity);
    resetCheckout()
    navigate("/confirmation");
  }
  useCheckoutLeaveGuards({ active: true, backTo: `/event-details/${eventName}` });
    } catch (error) {
      console.log(error);
      useCheckoutLeaveGuards({ active: true, backTo: `/event-details/${eventName}` });
      // navigate(`/event-details/${eventDetail?.slug}`)
    } finally {
      setisLoading(false);
    }

  }

  useEffect(() => {
    if( checkoutStage === 'checkout' && selectedTicketId) {
      startTimer(10); // Start the timer with 10 minutes
      setTimersInitialized(true);
    }
  }, [checkoutStage])
  useEffect(() => {
    if (!timersInitialized) return; // Prevent running before timers are set
    if (timeLeft === 0&& endTime === null) {
      // Cancel the checkout process
      useCheckoutLeaveGuards({ active: true, backTo: `/event-details/${eventName}` });

    }
  }, [timeLeft, eventName,timersInitialized,endTime]);
  // useCancelOnLeave(eventName);
  useCheckoutLeaveGuards({ active: true, backTo: `/event-details/${eventName}` });

  if(!reservationId ){
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
          <DefaultButton
            variant="primary"
            onClick={() => navigate(`/search`)}
          >
            Back to Events
          </DefaultButton>
        </div>
      </HomeLayout>
    );
  }
  return (
    <>
      <HomeLayout>
        <div
          className=" bg-white py-2 px-4 lg:py-8 w-[95vw] md:w-[80vw] lg:w-[85vw] relative top-[-5rem]
         rounded-2xl z-50 max-w-6xl mx-auto "
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between pb-6 "
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="text-center flex-1">
                <h1 className="text-2xl lg:text-3xl font-medium text-textBlack mb-2">
                  Checkout
                </h1>
                <motion.div
                  className="inline-block bg-[#FFF2F4] text-primary px-4 py-2 
                      rounded-[10px] text-sm font-medium border-2 border-primary/10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Time left {formatTimer(timeLeft)}
                </motion.div>
              </div>
            </motion.div>

            <div className="lg:flex justify-center gap-1 mb-[4rem]">
              {/* Ticket Info Section - Right Side */}
              <motion.div
                className=" p-6 lg:p-8 bg-[#FFF2F4] md:rounded-[12px] "
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {/* <h2 className="text-xl font-semibold text-textBlack mb-6 red-hat-display">
                      Ticket Info
                    </h2> */}

                {/* Event Details */}
                <div className="grid gap-2">
                  <h2 className="text-lg font-bold text-textBlack ">
                    {eventDetail.name}
                  </h2>
                  <div className="flex flex-col md:flex-row  gap-4 ">
                    <div className="rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={eventDetail.bannerImage || xtasyGroove}
                        alt={eventDetail.name}
                        className="w-[5rem] md:w-[10rem] h-auto 
                          max-h-[45rem] lg:w-[8rem] lg:h-[10rem]"
                      />
                    </div>
                    <div className="space-y-3 font-semibold text-textBlack">
                      <div className="flex items-center gap-3 ">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-sm">
                          {" "}
                          {formatDate(eventDetail?.startDate)}{" "}
                          {eventDetail.endDate &&
                            `- ${formatDate(eventDetail.endDate)}`}{" "}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 ">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="text-sm">
                          {formatTimeRange(
                            eventDetail.startTime,
                            eventDetail.endTime
                          )}
                        </span>
                      </div>

                      <div className="flex items-start gap-3 text-gray-700">
                        <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                        <span className="text-sm">
                          {eventDetail.venueName || "TBD"}
                        </span>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="py-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-primary" />
                      <span className="font-semibold ">
                        x {quantity} - {ticket.name}
                      </span>
                    </div>
                    {/* <span className="font-bold text-lg">
                          {formatPrice(getTotal())}
                        </span> */}
                  </div>

                  <div className="text-sm md:text-[14px] text-[#918F90] font-medium ml-6">
                    • Booking fee per ticket: {formatPrice(ticket.price)}
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
                  isLoading={isLoading}
                  variant="primary"
                  onClick={handleCheckout}
                  className="w-full mt-4"
                >
                  Proceed to Payment
                </DefaultButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </HomeLayout>
    </>
  );
};

export default Checkout;
