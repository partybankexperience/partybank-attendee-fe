import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Clock, MapPin, Ticket } from "lucide-react";
 import { useNavigate } from 'react-router-dom';

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
interface CheckoutComponentType {
  onClose: () => void;
}

const CheckoutComponent: React.FC<CheckoutComponentType> = ({ onClose }) => {
  // Timer state for checkout countdown
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60 + 37); // 15:37 in seconds
  const navigate = useNavigate();

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

  return (
    <>
      <div
        className="fixed z-50 inset-0 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <div
          className=" bg-gray-50 py-4 px-4 lg:py-8 w-[80vw] h-[95vh] overflow-y-scroll">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Header */}
              <motion.div
                className="flex items-center justify-between p-6 lg:p-8 border-b"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <div className="text-center flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Checkout
                  </h1>
                  <motion.div
                    className="inline-block bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Time left {formatTime(timeLeft)}
                  </motion.div>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
                >
                  <X className="w-6 h-6" />
                </button>
              </motion.div>

              <div className="lg:flex">
                {/* Payment Methods Section - Left Side */}
                <motion.div
                  className="lg:w-1/2 p-6 lg:p-8 lg:border-r"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  <motion.h2
                    className="text-xl font-bold text-gray-900 mb-6"
                    variants={slideIn}
                  >
                    Payment methods
                  </motion.h2>

                  {/* Credit/Debit Card Option */}
                  <motion.div className="mb-6" variants={slideIn}>
                    <label className="flex items-center gap-3 mb-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={(e) =>
                          handleInputChange("paymentMethod", e.target.value)
                        }
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="font-medium text-gray-900">
                        Credit / Debit card
                      </span>
                      <div className="flex gap-2 ml-auto">
                        <div className="w-8 h-5 bg-orange-500 rounded flex items-center justify-center">
                          <div className="w-3 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          stripe
                        </div>
                        <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center">
                          <div className="w-2 h-3 bg-white rounded"></div>
                        </div>
                      </div>
                    </label>

                    {formData.paymentMethod === "card" && (
                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Card Holder Name */}
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          />
                        </div>

                        {/* Card Number */}
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
                              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                VISA
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expiry Date and CVV */}
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Bank Transfer Option */}
                  <motion.div variants={slideIn}>
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === "bank"}
                        onChange={(e) =>
                          handleInputChange("paymentMethod", e.target.value)
                        }
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="font-medium text-gray-900">
                        Bank Transfer
                      </span>
                    </label>
                  </motion.div>
                </motion.div>

                {/* Ticket Info Section - Right Side */}
                <motion.div
                  className="lg:w-1/2 p-6 lg:p-8 bg-red-50"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Ticket Info
                  </h2>

                  {/* Event Details */}
                  <div className="mb-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-purple-800 flex items-center justify-center">
                          <div className="text-white text-xs font-black text-center leading-tight">
                            XTASY
                            <br />
                            GROOVE
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          {ticketData.eventName}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-sm">{ticketData.date}</span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-700">
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
                        <Ticket className="w-4 h-4 text-red-500" />
                        <span className="font-medium">
                          x {ticketData.quantity} - {ticketData.ticketType}
                        </span>
                      </div>
                      <span className="font-bold text-lg">
                        {formatPrice(ticketData.total)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 ml-6">
                      • Booking fee per ticket:{" "}
                      {formatPrice(ticketData.pricePerTicket)}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-red-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Total :
                      </span>
                      <span className="text-2xl font-bold text-red-600">
                        {formatPrice(ticketData.total)}
                      </span>
                    </div>
                  </div>

                  {/* Terms */}
                  <p className="text-xs text-gray-500 mb-6">
                    By selecting Transfer Completed/Proceed to Payment, I agree
                    to the Partybank Terms of Service.
                  </p>

                  {/* Proceed Button */}
                  <motion.button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate('/login')
                      console.log("Processing payment...", formData);
                    }}
                  >
                    Proceed to Payment
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutComponent;
