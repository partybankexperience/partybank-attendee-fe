import React, { useState } from "react";
import { motion } from "framer-motion";
// import { MapPin, Calendar, Clock, Plus, Minus } from "lucide-react";
import { MapPin, Calendar, Clock } from "lucide-react";
import xtasyGroove from "../../assets/images/XtasyGroove.png";
// import { Modal } from '../../components/modal/Modal';
// import CheckoutComponent from '../checkout/CheckoutComponent';
import TicketCard from "./TicketCard";
import { useNavigate } from "react-router";
import { Storage } from "../../stores/InAppStorage";
import HomeLayout from "../../components/layouts/HomeLayout";

type TicketType = "xtasyPass" | "godMode" | "xtasy";
type Tickets = Record<TicketType, number>;

const EventDetails: React.FC = () => {
  const [tickets, setTickets] = useState<Tickets>({
    xtasyPass: 1,
    godMode: 1,
    xtasy: 0,
  });

  // const [isOpen, setIsOpen] = useState<boolean>(false)

  const navigate = useNavigate();
  const ticketPrices: Tickets = {
    xtasyPass: 5000,
    godMode: 10000,
    xtasy: 15000,
  };

  // const updateTicketQuantity = (type: TicketType, change: number) => {
  const updateTicketQuantity = (type: TicketType, change: number) => {
    setTickets((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + change),
    }));
  };

  const calculateTotal = (tickets: Tickets, ticketPrices: Tickets): number => {
    return Object.entries(tickets).reduce((total, [type, quantity]) => {
      return total + ticketPrices[type as TicketType] * quantity;
    }, 0);
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

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // const onClose = ()=>{
  //   setIsOpen(false)
  // }
  function handleNext() {
    const user = Storage.getItem("user");
    if (!user) {
      navigate("/login");
      Storage.setItem("redirectPath", "/checkout");
    } else navigate("/checkout");
  }
  return (
    <HomeLayout>
      <div className="min-h-screen bg-white rounded-b-3xl shadow-2xl max-w-7xl mx-auto  ">
        
        {/* <div className="container mx-auto px-4 py-8 lg:py-16 bg-green-200 w-[90vw] rounded-3xl */}
        <div className="container mx-auto px-4 py-8 lg:py-16 bg-[#FFFFFF] w-[90vw] rounded-3xl
              relative top-[-5rem] z-20 shadow-md">
          {/* <div className="lg:flex gap-8 lg:gap-16 items-start justify-center"> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 
          items-start justify-center w-full">
          {/* items-start justify-center w-full bg-red-400"> */}
            {/* Event Details Section */}
            <motion.div
              // className="space-y-6 grid lg:grid-cols-2 gap-4 items-start justify-center"
              className="space-y-6 gap-4 items-start justify-center"
              // className="space-y-6 grid lg:grid-cols-2 gap-4 items-start justify-center"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Event Image */}
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                variants={fadeInUp}
              >
                <div>
                  <img
                    src={xtasyGroove}
                    alt="Xtasy Groove Event"
                    className="w-full h-auto max-h-[45rem] object-cover rounded-xl"
                  />
                </div>
              </motion.div>

              {/* Event Info */}
              <motion.div
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-black"
                variants={fadeInUp}
              >
                <motion.h2
                  className="text-[40px] lg:text-4xl font-bold mb-4 font-redhat red-hat-display"
                  variants={fadeInUp}
                >
                  Xtasy Groove
                </motion.h2>

                <div className="space-y-3 mb-6 text-[#231F20] font-semibold red-hat-display">
                  <motion.div
                    className="flex items-center gap-3"
                    variants={fadeInUp}
                  >
                    <Calendar className="w-5 h-5 text-primary/80" />
                    <span className="r">12 Apr 2025</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3"
                    variants={fadeInUp}
                  >
                    <Clock className="w-5 h-5 text-primary/80" />
                    <span>4:00 PM - 2:00 AM</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3"
                    variants={fadeInUp}
                  >
                    <MapPin className="w-5 h-5 text-primary/80" />
                    <span>Port Harcourt, Nigeria EL-CIELO HOMES</span>
                  </motion.div>
                </div>

                <motion.div variants={fadeInUp}>
                  <h3 className="text-xl font-semibold mb-3 text-black">
                    About Event
                  </h3>
                  <p className="text-[#918F90] leading-relaxed font-medium red-hat-display">
                    Dive into the seductive heartbeat of the night – a world
                    where basslines flirt with your soul and every pulse of
                    light teases your wild side. Xtasy Groove isn't just a
                    party. It's a movement. A euphoric escape into music,
                    mystery, and magnetic energy. Step through the doors and
                    leave reality behind. Here, the rules don't exist – only the
                    rhythm does. From hypnotic amapiano drops to fiery afrobeat
                    bangers, this is the playground of the bold, the sexy, and
                    the free 🔥
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Ticket Purchase Section */}
            <motion.div
              className="w-full lg:w-[31rem] bg-gradient-to-b from-[#FFF2F4] from-0% via-[#FFF2F4] via-70% to-[#ffffff]/50 to-90%
              rounded-2xl shadow-2xl 
              p-6 lg:p-8 sticky top-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-[#231F20] mb-2 red-hat-display">
                Get Tickets
              </h3>
              <p className="text-[#979595] font-semibold mb-6 red-hat-display">
                Which ticket type are you going for?
              </p>

              <div className="space-y-4 mb-8">
                <TicketCard
                  ticketName="XTASY PASS"
                  price={5000}
                  currency="₦"
                  updateTicketQuantity={updateTicketQuantity}
                  tickets={tickets}
                  ticketTitle="xtasyPass"
                  // setTickets={setTickets}
                />
                <TicketCard
                  ticketName="GOD MODE- A two bedroom apartment and..."
                  price={10000}
                  currency="₦"
                  updateTicketQuantity={updateTicketQuantity}
                  tickets={tickets}
                  ticketTitle="godMode"
                  // setTickets={setTickets}
                />
                {/* XTASY PASS
              <motion.div
                className="border-2 border-primary/80 rounded-xl p-4 bg-white"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">XTASY PASS</h4>
                    <p className="text-red-600 font-bold text-lg">
                      {formatPrice(ticketPrices.xtasyPass)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateTicketQuantity("xtasyPass", -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      disabled={tickets.xtasyPass === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-lg w-8 text-center">
                      {tickets.xtasyPass}
                    </span>
                    <button
                      onClick={() => updateTicketQuantity("xtasyPass", 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div> */}

                {/* GOD MODE
              <motion.div
                className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">
                      GOD MODE- A two bedroom apartment and...
                    </h4>
                    <p className="text-red-600 font-bold text-lg">
                      {formatPrice(ticketPrices.godMode)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateTicketQuantity("godMode", -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      disabled={tickets.godMode === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-lg w-8 text-center">
                      {tickets.godMode}
                    </span>
                    <button
                      onClick={() => updateTicketQuantity("godMode", 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div> */}

                {/* XTASY - Sold Out */}
                <motion.div
                  className="border-2 border-gray-200 rounded-xl p-4 bg-gray-100 opacity-60"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-600">XTASY</h4>
                      <p className="text-gray-500 font-bold text-lg">
                        {formatPrice(ticketPrices.xtasy)}
                      </p>
                    </div>
                    <div className="text-primary font-semibold">Sold out</div>
                  </div>
                </motion.div>
              </div>

              {/* Total and Purchase Button */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(calculateTotal(tickets, ticketPrices))}
                  </span>
                </div>

                <motion.button
                  className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNext()}
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default EventDetails;
