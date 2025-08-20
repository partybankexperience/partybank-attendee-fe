import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { X, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import xtasyGroove from "../../assets/images/XtasyGroove.png";
import cards from "../../assets/images/cards.png";
import visa from "../../assets/images/visa-logo.png";
import HomeLayout from "../../components/layouts/HomeLayout";
import { useCheckoutStore } from "../../stores/checkoutStore";
import DefaultButton from "../../components/buttons/DefaultButton";

interface FormData {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  paymentMethod: "card" | "bank";
}

interface TicketData {
  eventName: string;
  date: string;
  time: string;
  location: string;
  ticketType: string;
  quantity: number;
  pricePerTicket: number;
  total: number;
}
// interface CheckoutComponentType {
//   onClose: () => void;
// }

// const CheckoutComponent: React.FC<CheckoutComponentType> = ({ onClose }) => {
const Checkout: React.FC = () => {
  // Timer state for checkout countdown
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60 + 37); // 15:37 in seconds
  const navigate = useNavigate();

  // Payment Method
  const [paymentMethodType, setPaymentMthodType] = useState<"card" | "bank">(
    "card"
  );
  // Form state
  const [formData, setFormData] = useState<FormData>({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "card",
  });

  // Ticket data
  const ticketData: TicketData = {
    eventName: "Xtasy Groove",
    date: "12 Apr 2025",
    time: "4:00 PM - 2:00 AM",
    location: "Port Harcourt, Nigeria EL-CIELO HOMES",
    ticketType: "XTAS PASS",
    quantity: 3,
    pricePerTicket: 5000,
    total: 15000,
  };

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

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentMethodType = (method: "card" | "bank") => {
    setPaymentMthodType(method);
  };

  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts: string[] = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };
  const [isLoading, setisLoading] = useState(false)
  const { paymentLink } = useCheckoutStore();

  function handleCheckout() {
    setisLoading(true)
    try {
      paymentLink && window.open(paymentLink, "_blank");
    } catch (error) {
      console.log(error)
    } finally{
      setisLoading(false)
    }
  }

  return (
    <>
      <HomeLayout>
        <div
          className="relative flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          // style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <div
            className=" bg-white py-4 px-4 lg:py-8 w-[95vw] md:w-[80vw] lg:w-[85vw] relative top-[-5rem]
         rounded-2xl z-50"
          >
            <div className="max-w-6xl mx-auto w-full">
              <motion.div
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                {/* Header */}
                <motion.div
                  className="flex items-center justify-between p-6 lg:p-8"
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
                  {/* //  Payment Methods Section - Left Side  */}
                  {/*<motion.div
                    className="lg:w-1/2 p-6 lg:p-8 border-r-[2px] border-[#EDEDED]"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    <motion.h2
                      className="text-xl font-semibold text-textBlack mb-6 red-hat-display"
                      variants={slideIn}
                    >
                      Payment methods
                    </motion.h2>

                    //  Credit/Debit Card Option 
                    <motion.div className="mb-6" variants={slideIn}>
                      <label className="flex items-center gap-3 mb-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethodType === "card"}
                          onChange={() => handlePaymentMethodType("card")}
                          className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="font-medium text-textBlack red-hat-display">
                          Credit / Debit card
                        </span>
                        <div className="flex gap-2 ml-auto">
                          <div>
                            <img src={cards} alt="" />
                          </div>
                        </div>
                      </label>

                      {paymentMethodType === "card" && (
                        <motion.div
                          className="space-y-4 font-medium text-textBlack red-hat-display"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          //  Card Holder Name 
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Card Holder Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter card holder name"
                              value={formData.cardHolderName}
                              onChange={(e) =>
                                handleInputChange(
                                  "cardHolderName",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none
                              focus:ring-[0.1px] focus:ring-primary focus:border-primary transition-colors"
                            />
                          </div>

                           Card Number 
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Card Number
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="1234 5678 9101 8112"
                                value={formData.cardNumber}
                                onChange={(e) =>
                                  handleInputChange(
                                    "cardNumber",
                                    formatCardNumber(e.target.value)
                                  )
                                }
                                maxLength={19}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none
                                focus:ring-[0.1px] focus:ring-primary focus:border-primary transition-colors"
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 
                              border border-[#E9E9E9] p-3 rounded-md">
                                <div>
                                  <img src={visa} alt="" />
                                </div>
                              </div>
                            </div>
                          </div>

                          // {/* Expiry Date and CVV 
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry date
                              </label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={(e) => {
                                  let value = e.target.value.replace(/\D/g, "");
                                  if (value.length >= 2) {
                                    value =
                                      value.substring(0, 2) +
                                      "/" +
                                      value.substring(2, 4);
                                  }
                                  handleInputChange("expiryDate", value);
                                }}
                                maxLength={5}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none
                                focus:ring-[0.1px] focus:ring-primary focus:border-primary transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                placeholder="XXX"
                                value={formData.cvv}
                                onChange={(e) =>
                                  handleInputChange(
                                    "cvv",
                                    e.target.value
                                      .replace(/\D/g, "")
                                      .substring(0, 3)
                                  )
                                }
                                maxLength={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none
                                focus:ring-[0.1px] focus:ring-primary focus:border-primary transition-colors"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    // {/* Bank Transfer Option 
                    <motion.div variants={slideIn}>
                      <label className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={paymentMethodType === "bank"}
                          onChange={() => handlePaymentMethodType("bank")}
                          className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="font-medium text-gray-900">
                          Bank Transfer
                        </span>
                      </label>
                    </motion.div>
                  </motion.div>*/}

                  {/* Ticket Info Section - Right Side */}
                  <motion.div
                    className="lg:w-1/2  p-6 lg:p-8 bg-[#FFF2F4] rounded-[12px] mr-5 ml-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <h2 className="text-xl font-semibold text-textBlack mb-6 red-hat-display">
                      Ticket Info
                    </h2>

                    {/* Event Details */}
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="rounded-lg overflow-hidden flex-shrink-0">
                          <div>
                            <img
                              src={xtasyGroove}
                              alt=""
                              className="w-[5rem] md:w-[10rem] h-auto 
                          max-h-[45rem] lg:w-[8rem] lg:h-[10rem]"
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-textBlack mb-3">
                            {ticketData.eventName}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6 font-semibold text-textBlack">
                        <div className="flex items-center gap-3 ">
                          <Calendar className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{ticketData.date}</span>
                        </div>

                        <div className="flex items-center gap-3 ">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{ticketData.time}</span>
                        </div>

                        <div className="flex items-start gap-3 text-gray-700">
                          <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                          <span className="text-sm">{ticketData.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-primary" />
                          <span className="font-semibold ">
                            x {ticketData.quantity} - {ticketData.ticketType}
                          </span>
                        </div>
                        <span className="font-bold text-lg">
                          {formatPrice(ticketData.total)}
                        </span>
                      </div>

                      <div className="text-sm md:text-[14px] text-[#918F90] font-medium ml-6">
                        • Booking fee per ticket:{" "}
                        {formatPrice(ticketData.pricePerTicket)}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-red-200 pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-textBlack">
                          Total :
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(ticketData.total)}
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
          </div>
        </div>
      </HomeLayout>
    </>
  );
};

export default Checkout;
