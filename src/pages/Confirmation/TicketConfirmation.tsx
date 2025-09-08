import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import xtasyGroove from "../../assets/images/XtasyGroove.png";
import checkmark from "../../assets/images/checkmark.png";
import { useNavigate } from "react-router-dom";
import HomeLayout from "../../components/layouts/HomeLayout";
import { useConfirmationStore } from "../../stores/confirmationStore";
import { formatDate, formatTimeRange } from "../../components/helpers/dateTimeHelpers";
import { useEffect } from "react";

const Confirmation = () => {
  const { ticketsC, eventDetailsC, quantityC, clearConfirmation } = useConfirmationStore();

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;
  const navigate = useNavigate();

  // Animations
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };
  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.15 } },
  };
  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  useEffect(() => {
    const currentPath = location.pathname;
    return () => {
      if (location.pathname !== currentPath) clearConfirmation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!eventDetailsC || !ticketsC) {
    return (
      <HomeLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-textBlack mb-3">No Confirmation Details</h2>
            <p className="text-gray-600 mb-5">
              It seems there are no ticket details to display. Please book a ticket first.
            </p>
            <button
              onClick={() => navigate("/search")}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="min-h-screen bg-gray-50 py-6 md:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Success Header */}
            <motion.div
              className="px-5 py-6 md:px-8 md:py-10 text-center relative"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#00C452]/20 to-transparent pointer-events-none" />
              <motion.div className="inline-flex items-center justify-center rounded-full mb-4 relative" variants={scaleIn}>
                <img src={checkmark} alt="" className="w-10 h-10" />
              </motion.div>

              <motion.h1 className="text-xl md:text-2xl font-semibold text-textBlack mb-2" variants={fadeInUp}>
                Your tickets have been confirmed.
              </motion.h1>

              <motion.p className="text-[#6B7280] font-medium" variants={fadeInUp}>
                Tickets confirmed and sent to your email.
              </motion.p>
            </motion.div>

            <hr className="border-t border-[#EDECEC]" />

            {/* Details */}
            <div className="p-5 md:p-8">
              <div className="lg:flex lg:items-start lg:gap-6">
                {/* Event Details */}
                <motion.div
                  className="flex-1 mb-6 lg:mb-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  {/* Image + Title */}
                  <div className="flex items-start gap-4 mb-5">
                    {/* Responsive image */}
                    <div className="relative rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                      {/* fixed box with object-cover for consistent look on mobile */}
                      <div className="w-40 h-28 md:w-56 md:h-36">
                        <img
                          src={eventDetailsC?.bannerImage || xtasyGroove}
                          alt={eventDetailsC?.name || "Event"}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-bold text-textBlack mb-3 break-words">
                        {eventDetailsC?.name}
                      </h2>

                      {/* Meta */}
                      <div className="space-y-3 text-textBlack font-semibold">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-sm md:text-base">
                              {formatDate(eventDetailsC?.startDate)}
                              {eventDetailsC.endDate ? ` - ${formatDate(eventDetailsC.endDate)}` : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm md:text-base">
                              {formatTimeRange(eventDetailsC.startTime, eventDetailsC.endTime)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-primary mt-0.5" />
                          <span className="text-sm md:text-base">{eventDetailsC.venueName || "TBD"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Summary */}
                  <motion.div
                    className="rounded-xl p-4 md:p-5 border border-gray-200 bg-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                  >
                    <div className="w-full">
                      <div className="flex items-center gap-3 mb-3">
                        <Ticket className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-textBlack">
                          x {quantityC} — {ticketsC.name}
                        </span>
                        <span className="ml-auto font-bold">
                          {typeof quantityC === "number" && formatPrice(ticketsC.price * quantityC)}
                        </span>
                      </div>

                      <div className="text-sm text-[#6B7280] mb-4 font-medium">
                        • Booking fee per ticket: {formatPrice(ticketsC.price)}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-base md:text-lg font-bold text-textBlack">Total :</span>
                          <span className="text-lg md:text-xl font-bold text-primary">
                            {typeof quantityC === "number" && formatPrice(ticketsC.price * quantityC)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Back Button */}
              <motion.div
                className="mt-6 flex justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <motion.button
                  className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-red-600 hover:bg-red-700 text-white font-semibold md:font-bold rounded-xl text-base md:text-lg transition-colors shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/search")}
                >
                  Back to Events
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.div
            className="text-center mt-6 md:mt-8 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <p className="text-sm md:text-base">
              Keep this confirmation safe. You'll need it for event entry.
            </p>
          </motion.div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Confirmation;