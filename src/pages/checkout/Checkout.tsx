import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import xtasyGroove from "../../assets/images/XtasyGroove.png";
import HomeLayout from "../../components/layouts/HomeLayout";
import { useCheckoutStore } from "../../stores/checkoutStore";
import DefaultButton from "../../components/buttons/DefaultButton";
import { useTicketStore } from "../../stores/cartStore";
import useCancelOnLeave from "./CancelCheckout";
import { Storage } from "../../stores/InAppStorage";
import { formatDate, formatTimeRange } from "../../components/helpers/dateTimeHelpers";



// interface CheckoutComponentType {
//   onClose: () => void;
// }

// const CheckoutComponent: React.FC<CheckoutComponentType> = ({ onClose }) => {
const Checkout: React.FC = () => {
  // Timer state for checkout countdown
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60 + 37); // 15:37 in seconds
  // const navigate = useNavigate();

  // Ticket data

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format timer display
  interface FormatTimeFn {
    (seconds: number): string;
  }

  const formatTime: FormatTimeFn = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPrice = (price: number): string => {
    return `₦${price.toLocaleString()}`;
  };


  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const [isLoading, setisLoading] = useState(false)
  const { paymentLink,startCheckout } = useCheckoutStore();
const {selectedTicketId,quantity,eventDetail,ticket,getTotal} = useTicketStore()
  function handleCheckout() {
    setisLoading(true)
    if (!selectedTicketId) {
      console.error("No ticket selected");
      return;
    }
    try {
      startCheckout(selectedTicketId, quantity);
      
    } catch (error) {
      console.log(error)
    } finally{
      setisLoading(false)
    // paymentLink&& window.open(paymentLink, "_blank");
 // Redirect in the same tab
 if (paymentLink) {
  window.location.href = paymentLink; // opens in the same tab
} else {
  console.error("Payment link not available");
}
    }
  }
    const eventName=Storage.getItem('eventName')
  useCancelOnLeave(eventName);
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
                      Time left {formatTime(timeLeft)}
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
                              src={eventDetail.bannerImage|| xtasyGroove}
                              alt={eventDetail.name}
                              className="w-[5rem] md:w-[10rem] h-auto 
                          max-h-[45rem] lg:w-[8rem] lg:h-[10rem]"
                            />
                        </div>
                        <div className="space-y-3 font-semibold text-textBlack">
                        <div className="flex items-center gap-3 ">
                          <Calendar className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{" "}
                                          {formatDate(eventDetail?.startDate)}{" "}
                                          {eventDetail.endDate && `- ${formatDate(eventDetail.endDate)}`}{" "}</span>
                        </div>

                        <div className="flex items-center gap-3 ">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{formatTimeRange(eventDetail.startTime, eventDetail.endTime)}</span>
                        </div>

                        <div className="flex items-start gap-3 text-gray-700">
                          <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                          <span className="text-sm">{eventDetail.venueName || "TBD"}</span>
                        </div>
                      </div>
                        <div>
                         
                        </div>
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
                        • Booking fee per ticket:{" "}
                        {formatPrice(ticket.price)}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-red-200 pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-textBlack">
                          Total :
                        </span>
                        <span className="text-2xl font-bold text-primary">
                        {formatPrice(getTotal())}
                        </span>
                      </div>
                    </div>

                    {/* Terms */}
                    <p className="text-xs md:text-[14px] text-[#A9ABAE] mb-6 font-medium">
                      By selecting Transfer Completed/Proceed to Payment, I
                      agree to the Partybank Terms of Service.
                    </p>

                    {/* Proceed Button */}
                    {/* <motion.button
                      className="w-full bg-primary hover:bg-red-700 text-white font-bold
                       py-4 px-6 rounded-xl text-lg transition-colors shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate("/confirmation");
                        console.log("Processing payment...", formData);
                      }}
                    >
                      Proceed to Payment
                    </motion.button> */}
                    <DefaultButton isLoading={isLoading} variant="primary" onClick={handleCheckout} className="w-full mt-4">
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
