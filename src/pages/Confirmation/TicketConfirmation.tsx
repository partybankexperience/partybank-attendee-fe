import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import xtasyGroove from "../../assets/images/XtasyGroove.png";
// import barcode from "../../assets/images/barcode.png"; // removed
import checkmark from "../../assets/images/checkmark.png";
import { useNavigate } from "react-router-dom";
import HomeLayout from "../../components/layouts/HomeLayout";
import { useConfirmationStore } from "../../stores/confirmationStore";
import {
  formatDate,
  formatTimeRange,
} from "../../components/helpers/dateTimeHelpers";
import { useEffect } from "react";

const Confirmation = () => {
  const { ticketsC, eventDetailsC, quantityC, clearConfirmation } =
    useConfirmationStore();

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

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

  useEffect(() => {
    const currentPath = location.pathname;
    return () => {
      if (location.pathname !== currentPath) {
        clearConfirmation();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!eventDetailsC || !ticketsC) {
    return (
      <HomeLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-textBlack mb-4">
              No Confirmation Details
            </h2>
            <p className="text-gray-600 mb-6">
              It seems there are no ticket details to display. Please book a
              ticket first.
            </p>
            <button
              onClick={() => navigate("/search")}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
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
      <div className=" bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="shadow-lg overflow-hidden bg-gray-50 rounded-2xl bg-clip-padding 
          backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 relative 
          top-[-8rem] z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Success Header */}
            <motion.div
              className="bg-white px-6 py-8 lg:px-8 lg:py-12 text-center  rounded-md
             bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border
              border-gray-100 relative"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <div
                className=" w-full h-[35%] md:h-1/2 bg-gradient-to-b from-[#00C452]/50  to-[#00C452]/2
              absolute top-0 left-0 rounded-md blur-3xl backdrop-blur-sm "
              ></div>
              <motion.div
                className="inline-flex items-center justify-center
                rounded-full mb-6 relative"
                variants={scaleIn}
              >
                <div>
                  <img src={checkmark} alt="" className="w-[3rem]" />
                </div>
              </motion.div>

              <motion.h1
                className="text-2xl lg:text-3xl font-semibold text-textBlack mb-3"
                variants={fadeInUp}
              >
                Your tickets has been confirmed.
              </motion.h1>

              <motion.p
                className="text-[#A9ABAE] font-medium text-lg"
                variants={fadeInUp}
              >
                Tickets confirmed and sent to your email.
              </motion.p>
            </motion.div>

            {/* horizontal rule */}
            <hr className=" mx-5 bg-[#EDECEC] border border-[#EDECEC]" />

            {/* Ticket Details */}
            <div className="p-6 lg:p-8 bg-white">
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
                    {/* Improved responsive image */}
                    <div className="relative rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                      <div className="w-40 h-28 md:w-56 md:h-36">
                        <img
                          src={eventDetailsC?.bannerImage || xtasyGroove}
                          alt={eventDetailsC?.name || "Event"}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl lg:text-2xl font-bold text-textBlack mb-4">
                        {eventDetailsC?.name}
                      </h2>

                      {/* Event Info */}
                      <div className="space-y-3 text-textBlack font-semibold">
                        <div className="lg:flex lg:gap-5">
                          <div className="flex items-center gap-3 ">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-sm lg:text-base">
                              {formatDate(eventDetailsC?.startDate)}
                              {eventDetailsC.endDate &&
                                ` - ${formatDate(eventDetailsC.endDate)}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 ">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm lg:text-base">
                              {formatTimeRange(
                                eventDetailsC.startTime,
                                eventDetailsC.endTime
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 ">
                          <MapPin className="w-4 h-4 text-primary mt-0.5" />
                          <span className="text-sm lg:text-base">
                            {eventDetailsC.venueName || "TBD"}
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
                        <Ticket className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-textBlack">
                          x {quantityC} - {ticketsC.name}
                        </span>
                        <span className="ml-auto font-bold text-lg">
                          {typeof quantityC === "number" &&
                            formatPrice(ticketsC.price * quantityC)}
                        </span>
                      </div>

                      <div className="text-sm text-[#918F90] mb-4 font-medium">
                        • Booking fee per ticket: {formatPrice(ticketsC.price)}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-textBlack">
                            Total :
                          </span>
                          <span className="text-xl font-bold text-primary">
                            {typeof quantityC === "number" &&
                              formatPrice(ticketsC.price * quantityC)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* QR code blocks removed */}
              </div>

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
                  onClick={() => navigate("/search")}
                >
                  Back to Events
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Additional Success Message */}
          <motion.div
            className="text-center text-gray-600"
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
