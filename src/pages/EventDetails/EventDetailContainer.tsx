import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import xtasyGroove from "../../assets/images/XtasyGroove.png";
import TicketCard from "./TicketCard";
import { useNavigate, useParams } from "react-router";
import { Storage } from "../../stores/InAppStorage";
import HomeLayout from "../../components/layouts/HomeLayout";
import DefaultButton from "../../components/buttons/DefaultButton";
import { useTicketStore } from "../../stores/cartStore";
import { errorAlert } from "../../components/alerts/ToastService";
import { checkticketAvailability, getEventBySlug } from "../../containers/eventsApi";
import { EventDetailsSkeleton } from "../../components/common/LoadingSkeleton";
import {
  formatDate,
  formatTimeRange,
} from "../../components/helpers/dateTimeHelpers";
import { useAuthStore } from "../../stores/useAuthStore";
import { runPipeline } from "../../utils/axiosFormat";
import { useCheckoutStore } from "../../stores/checkoutStore";
// import { useCheckoutStore } from "../../stores/checkoutStore";
// import { createHash } from "crypto"; // Node.js; if browser, use SubtleCrypto
const EventDetails: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { setCheckoutStage } = useAuthStore();
  const { slug } = useParams();
  // const { startCheckout } = useCheckoutStore();
  const {
    selectedTicketId,
    quantity,
    selectTicket,
    increaseQuantity,
    decreaseQuantity,
    getTotal,
  } = useTicketStore();
  const {createAndStoreReservation}= useCheckoutStore()
  const [eventDetail, seteventDetail] = useState<any>("");

  // const [isOpen, setIsOpen] = useState<boolean>(false)

  const navigate = useNavigate();
  

  async function getIdentity(user?: { id?: string }) {
    if (user?.id) {
      return { userId: user.id };
    }
  
    // fallback to ipHash
    const { ip } = await fetch("https://api64.ipify.org?format=json")
      .then(r => r.json());
  
    // hash the IP (MD5 as in your example, but could be SHA256)
    // const ipHash = createHash("md5").update(ip).digest("hex");
  
    return { ipHash:ip };
  }
  
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

  // function handleNext() {
  //   if (!selectedTicketId){
  //     errorAlert("Error", "Please select a ticket first!");
  //   return}
  //   const user = Storage.getItem("user");
  //   console.log(user, "user in event details");
  //   // startCheckout(selectedTicketId,quantity)
  //   if (!user) {
  //     Storage.setItem("redirectPath", "/checkout");
  //     setCheckoutStage("eventDetails");
  //     navigate("/login");
  //     // Storage.setItem("checkoutStage", "eventDetails");
  //   } else navigate("/checkout");
  // }
  
  async function handleNext() {
    if (!selectedTicketId) {
      errorAlert("Error", "Please select a ticket first!");
      return;
    }
  
    const user = Storage.getItem("user");
    // const identity = user?.id ?? (await fetch("https://api64.ipify.org?format=json").then(r => r.json()).then(d => d.ip));
    const identity = await getIdentity(user);
    try {
      await runPipeline([
        // Step 1: check availability
        async () => {
          const res = await checkticketAvailability(selectedTicketId, quantity);
          if (!res?.available) errorAlert("Error", res.message || "Ticket is not available");;
          return res;
        },
  
        // Step 2: create reservation
        async () => {
          const reservation = await createAndStoreReservation(
            eventDetail.id, // from props/context
            selectedTicketId,
            quantity,
            identity
          );
          return reservation;
        },
  
        // Step 3: navigate
        async () => {
          if (!user) {
            Storage.setItem("redirectPath", "/checkout");
            setCheckoutStage("eventDetails");
            navigate("/login");
          } else {
            navigate("/checkout");
          }
          return null;
        },
      ]);
    } catch (err) {
      console.error("Pipeline failed:", err);
      errorAlert("Error", (err as Error).message || "Something went wrong");
    }
  }
  
  async function getEventDetail() {
    setLoading(true);
    try {
      const res = await getEventBySlug(slug as string);
      console.log(res);
      seteventDetail(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getEventDetail();
  }, []);
  const [hasPassed, setHasPassed] = useState(false);

  useEffect(() => {
    const now = new Date();
    const start = new Date(eventDetail.startDate);
    const end = eventDetail.endDate ? new Date(eventDetail.endDate) : undefined;

    if (end) {
      setHasPassed(now > end);
    } else {
      setHasPassed(now > start);
    }
  }, []);
  
  if (loading) {
    return (
      <HomeLayout>
        <EventDetailsSkeleton />
      </HomeLayout>
    );
  }

  // Handle the case where the event is not found
  if (!eventDetail) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-[80vh] text-center">
          <p className="text-xl font-bold text-red-500">Event not found.</p>
        </div>
      </HomeLayout>
    );
  }
 

  return (
    <HomeLayout>
      <div
        className="min-h-[80vh]  mx-auto md:px-[2rem] md:py-8 lg:py-[2rem] bg-white w-[90vw] rounded-xl
              relative top-[-5rem] z-20 md:shadow-md grid  md:grid-cols-[3fr_1.5fr] gap-8 items-start justify-between "
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <motion.div
          // className="space-y-6 grid lg:grid-cols-2 gap-4 items-start justify-center"
          className="space-y-6 gap-4 items-start justify-center w-full"
          // className="space-y-6 grid lg:grid-cols-2 gap-4 items-start justify-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Event Image */}
          <motion.div
            className="relative rounded-xl overflow-hidden shadow-2xl"
            variants={fadeInUp}
          >
            <div>
              <img
                src={eventDetail?.bannerImage || xtasyGroove}
                alt="Xtasy Groove Event"
                className="w-full h-auto max-h-[30rem] object-cover rounded-xl"
              />
            </div>
          </motion.div>
        </motion.div>
        {/* Event Info */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-xl px-6 text-black"
          variants={fadeInUp}
        >
          <motion.h2
            className="text-[2.2rem]  font-bold mb-4 "
            variants={fadeInUp}
          >
            {eventDetail.name}
          </motion.h2>

          <div className="space-y-3 mb-6 text-[#231F20] font-semibold red-hat-display">
            <motion.div className="flex items-center gap-3" variants={fadeInUp}>
              <Calendar className="w-5 h-5 text-primary/80" />
              <span className="r">
                {" "}
                {formatDate(eventDetail?.startDate)}{" "}
                {eventDetail.endDate && `- ${formatDate(eventDetail.endDate)}`}{" "}
              </span>
            </motion.div>
            <motion.div className="flex items-center gap-3" variants={fadeInUp}>
              <Clock className="w-5 h-5 text-primary/80" />
              <span>
                {formatTimeRange(eventDetail.startTime, eventDetail.endTime)}
              </span>
            </motion.div>
            <motion.div className="flex items-center gap-3" variants={fadeInUp}>
              <MapPin className="w-5 h-5 text-primary/80" />
              <span> {eventDetail.venueName || "TBD"}</span>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp}>
            <h3 className="text-xl font-semibold mb-3 text-black">
              About Event
            </h3>
            <p className="text-[#918F90] leading-relaxed font-medium red-hat-display">
              {eventDetail.description ||
                "Join us for an unforgettable night of music, dance, and celebration at Xtasy Groove! Experience the best DJs, live performances, and a vibrant atmosphere that will keep you dancing all night long. Don't miss out on the ultimate party of the year!"}
            </p>
          </motion.div>
        </motion.div>

        </div>
        {/* Ticket Purchase Section */}
        <motion.div
          className="w-full  ml-auto  bg-gradient-to-b from-[#FFF2F4] from-0% via-[#FFF2F4] via-70% to-[#ffffff]/50 to-90%
              rounded-xl shadow-2xl 
              p-6  top-8"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h3 className="text-[1.3rem] font-semibold text-[#231F20] mb-2 red-hat-display">
           {!hasPassed?'View Tickets':'Get Tickets'} 
          </h3>
          <p className="text-[#979595] text-[1rem]  mb-6 red-hat-display">
           {!hasPassed?'Event has concluded':'Which ticket type are you going for?'} 
          </p>

          <div className="space-y-4 mb-8 max-h-[50vh] overflow-auto min-w-full">
            {eventDetail.tickets.map((ticket: any) => (
              <TicketCard
                key={ticket.id}
                isSelected={selectedTicketId === ticket.id}
                quantity={selectedTicketId === ticket.id ? quantity : 0}
                selectTicket={() => selectTicket(ticket,slug as string,eventDetail)}
                increaseQuantity={()=>increaseQuantity(ticket.purchaseLimit)}
                decreaseQuantity={decreaseQuantity}
                ticket={ticket}
              />
            ))}
          </div>

          {/* Total and Purchase Button */}
          {hasPassed && (

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className=" font-bold text-gray-900">Total:</span>
              <span className="text-[1.1rem] font-bold text-primary">
                {formatPrice(getTotal())}
              </span>
            </div>
            <DefaultButton className="!w-full" onClick={() => handleNext()}>
              Next
            </DefaultButton>
          </div>
          )}
        </motion.div>
      </div>
    </HomeLayout>
  );
};

export default EventDetails;
