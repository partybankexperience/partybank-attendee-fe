import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import xtasyGroove from "../../assets/images/XtasyGroove.png";
import barcode from "../../assets/images/barcode.png";
import checkmark from "../../assets/images/checkmark.png";
import { useNavigate } from "react-router-dom";
import HomeLayout from "../../components/layouts/HomeLayout";

const Confirmation = () => {
  // Sample ticket data - this would typically come from props or state
  const ticketData = {
    eventName: "Xtasy Groove",
    date: "12 Apr 2025",
    time: "4:00 PM - 2:00 AM",
    location: "Port Harcourt, Nigeria EL-CIELO HOMES",
    ticketType: "XTAS PASS",
    quantity: 3,
    pricePerTicket: 5000,
    total: 15000,
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="shadow-lg overflow-hidden bg-gray-50 rounded-2xl bg-clip-padding 
          backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 relative 
          top-[-8rem] z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Success Header */}
            <motion.div
              className="bg-green-50/80 px-6 py-8 lg:px-8 lg:py-12 text-center  rounded-md
             bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border
              border-gray-100"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div
                className="inline-flex items-center justify-center
                rounded-full mb-6"
                variants={scaleIn}
              >
                <div>
                  <img src={checkmark} alt="" className="w-[3rem]" />
                </div>
              </motion.div>

              <motion.h1
                className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3"
                variants={fadeInUp}
              >
                Your tickets has been confirmed.
              </motion.h1>

              <motion.p className="text-gray-600 text-lg" variants={fadeInUp}>
                Tickets confirmed and sent to your email.
              </motion.p>
            </motion.div>

            {/* Ticket Details */}
            <div className="p-6 lg:p-8">
              <div className="lg:flex lg:gap-8 lg:items-start">
                {/* Left Side - Event Details */}
                <motion.div
                  className="flex-1 mb-8 lg:mb-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {/* Event Image and Title */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="  rounded-xl overflow-hidden flex-shrink-0">
                      <div>
                        <img src={xtasyGroove} alt="" className="w-[5rem] md:w-[10rem] h-auto 
                          max-h-[45rem] lg:w-[8rem] lg:h-[10rem]" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                        {ticketData.eventName}
                      </h2>

                      {/* Event Info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Calendar className="w-4 h-4 text-red-500" />
                          <span className="text-sm lg:text-base">
                            {ticketData.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span className="text-sm lg:text-base">
                            {ticketData.time}
                          </span>
                        </div>

                        <div className="flex items-start gap-3 text-gray-700">
                          <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                          <span className="text-sm lg:text-base">
                            {ticketData.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Details */}

                  <motion.div
                    className="bg-gary-50 rounded-xl p-4 lg:p-6 lg:flex justify-center 
                  lg:w-[50rem]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <div className="w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <Ticket className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-gray-900">
                          x {ticketData.quantity} - {ticketData.ticketType}
                        </span>
                        <span className="ml-auto font-bold text-lg">
                          {formatPrice(ticketData.total)}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        • Booking fee per ticket:{" "}
                        {formatPrice(ticketData.pricePerTicket)}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">
                            Total :
                          </span>
                          <span className="text-xl font-bold text-red-600">
                            {formatPrice(ticketData.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Side - QR Code (Desktop) */}
                <motion.div
                  className="hidden lg:block flex-shrink-0 relative right-[8rem]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <div>
                    <img src={barcode} alt="" className="w-[100%]" />
                  </div>
                </motion.div>
              </div>

              {/* QR Code (Mobile) */}
              <motion.div
                className="lg:hidden flex justify-center mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div>
                  <img src={barcode} alt="" className="w-[100%]" />
                </div>
              </motion.div>

              {/* Back Button */}
              <motion.div
                className="text-center my-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <motion.button
                  className="w-full lg:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg transition-colors shadow-lg min-w-[200px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/");
                    // Handle navigation back to events
                    console.log("Navigate back to events");
                  }}
                >
                  Back to Events
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Additional Success Message */}
          <motion.div
            className="text-center mt-8 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <p className="text-sm lg:text-base">
              Keep this confirmation safe. You'll need it for event entry.
            </p>
          </motion.div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Confirmation;
