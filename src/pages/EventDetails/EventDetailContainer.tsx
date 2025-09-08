import React, { useEffect, useMemo, useState } from "react";
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
import {
  checkticketAvailability as checkTicketAvailability, // alias to fix naming
  getEventBySlug,
} from "../../containers/eventsApi";
import { EventDetailsSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate, formatTimeRange } from "../../components/helpers/dateTimeHelpers";
import { useAuthStore } from "../../stores/useAuthStore";
import { runPipeline } from "../../utils/axiosFormat";
import { useCheckoutStore } from "../../stores/checkoutStore";

const EventDetails: React.FC = () => {
  // Router / navigation
  const navigate = useNavigate();
  const { slug: eventSlug } = useParams();

  // Global stores
  const { setCheckoutStage } = useAuthStore();
  const { createAndStoreReservation } = useCheckoutStore();
  const {
    selectedTicketId,
    quantity,
    selectTicket,
    increaseQuantity,
    decreaseQuantity,
    getTotal,
  } = useTicketStore();

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [hasEventPassed, setHasEventPassed] = useState(false);
  const [hasAutoSelectedTicket, setHasAutoSelectedTicket] = useState(false);

  // Animations
  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  // Always select the first ticket once per page load
  useEffect(() => {
    // reset auto-select guard when slug changes
    setHasAutoSelectedTicket(false);
  }, [eventSlug]);

  useEffect(() => {
    if (!eventDetails) return;
    if (hasAutoSelectedTicket) return;

    const firstTicket = (eventDetails?.tickets ?? [])[0];
    if (firstTicket) {
      // Select the very first ticket on initial load
      selectTicket(firstTicket, eventSlug as string, eventDetails);
      setHasAutoSelectedTicket(true);
    }
  }, [eventDetails, eventSlug, hasAutoSelectedTicket, selectTicket]);

  // Helpers
  async function getReservationIdentity(user?: { id?: string }) {
    if (user?.id) return { userId: user.id };
    try {
      const response = await fetch("https://api64.ipify.org?format=json");
      const data = await response.json();
      return { ipHash: data.ip as string };
    } catch {
      return { ipHash: "anonymous" };
    }
  }

  async function handleProceedToCheckout() {
    if (!selectedTicketId) {
      errorAlert("Error", "Please select a ticket first!");
      return;
    }

    const currentUser = Storage.getItem("user");
    const reservationIdentity = await getReservationIdentity(currentUser);

    try {
      await runPipeline([
        // 1) Check availability
        async () => {
          const availabilityResponse = await checkTicketAvailability(selectedTicketId, quantity);
          if (!availabilityResponse || availabilityResponse?.available === 0) {
            errorAlert("Error", "Ticket is not available");
            throw new Error("Ticket unavailable");
          }
          return availabilityResponse;
        },
        // 2) Create reservation
        async () => {
          return await createAndStoreReservation(
            eventDetails.id,
            selectedTicketId,
            quantity,
            reservationIdentity
          );
        },
        // 3) Navigate
        async () => {
          if (!currentUser) {
            Storage.setItem("redirectPath", "/checkout");
            setCheckoutStage("eventDetails");
            navigate("/login");
          } else {
            navigate("/checkout");
          }
          return null;
        },
      ]);
    } catch (error) {
      console.error("Checkout pipeline aborted:", error);
    }
  }

  // Data loaders
  async function loadEventDetails() {
    setIsLoading(true);
    try {
      const response = await getEventBySlug(eventSlug as string);
      setEventDetails(response);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSlug]);

  // Compute event passed flag
  useEffect(() => {
    if (!eventDetails) return;
    const now = new Date();
    const startDate = eventDetails.startDate ? new Date(eventDetails.startDate) : null;
    const endDate = eventDetails.endDate ? new Date(eventDetails.endDate) : null;
    setHasEventPassed(endDate ? now > endDate : startDate ? now > startDate : false);
  }, [eventDetails]);

  // Sorted tickets (buyable first, then sold out, then others; within buyable, cheaper first)
  const sortedTicketsByStatusAndPrice = useMemo(() => {
    const tickets: any[] = Array.isArray(eventDetails?.tickets)
      ? [...eventDetails.tickets]
      : [];
  
    const getStatusRank = (ticket: any) => {
      const isSoldOut = ticket?.available === 0 || ticket?.available == null;
      const isPurchasable = ticket?.purchasable && !isSoldOut;
      if (isPurchasable) return 0; // buyable first
      if (isSoldOut) return 1;     // then sold out
      return 2;                    // then everything else
    };
  
    const getPaidPrice = (ticket: any) =>
      ticket?.type === "paid" ? Number(ticket.price) || 0 : 0;
  
    return tickets.sort((firstTicket, secondTicket) => {
      const firstStatusRank = getStatusRank(firstTicket);
      const secondStatusRank = getStatusRank(secondTicket);
  
      if (firstStatusRank !== secondStatusRank) {
        return firstStatusRank - secondStatusRank;
      }
  
      // Within "buyable", sort cheaper first
      if (firstStatusRank === 0) {
        const firstPrice = getPaidPrice(firstTicket);
        const secondPrice = getPaidPrice(secondTicket);
        if (firstPrice !== secondPrice) {
          return firstPrice - secondPrice;
        }
      }
  
      return 0;
    });
  }, [eventDetails?.tickets]);
  

  // Loading state
  if (isLoading) {
    return (
      <HomeLayout>
        <EventDetailsSkeleton />
      </HomeLayout>
    );
  }

  // Not found state
  if (!eventDetails) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-[50vh] text-center">
          <p className="text-lg md:text-xl font-semibold text-red-500">Event not found.</p>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="relative -mt-[4.5rem] z-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 xl:px-12">
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 lg:p-8">
            {/* Outer grid */}
            <div className="grid gap-8 lg:gap-10 md:grid-cols-[minmax(0,1fr)_380px] lg:grid-cols-[minmax(0,1fr)_420px]">
              {/* LEFT: image + details */}
              <section className="min-w-0">
                {/* Mobile image */}
                <motion.div
                  className="md:hidden relative rounded-[20px] overflow-hidden border border-[#E5E7EB] mb-4"
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <img
                    src={eventDetails?.bannerImage || xtasyGroove}
                    alt={eventDetails?.name || "Event image"}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>

                {/* Inner layout */}
                <div className="grid xl:grid-cols-[360px_minmax(0,1fr)] gap-4 md:gap-5 lg:gap-6 items-start">
                  {/* Sticky image on larger screens */}
                  <aside className="hidden md:block md:sticky md:top-6 md:self-start md:mb-4 xl:mb-0 xl:mr-3">
                    <div className="relative">
                      <img
                        src={eventDetails?.bannerImage || xtasyGroove}
                        alt={eventDetails?.name || "Event image"}
                        className="w-full h-auto object-cover rounded-[20px] border border-[#E5E7EB]"
                        loading="eager"
                      />
                    </div>
                  </aside>

                  {/* Details */}
                  <motion.article variants={fadeInUp} initial="initial" animate="animate" className="min-w-0">
                    <h1 className="text-[1.75rem] md:text-[2rem] font-bold tracking-tight text-gray-900 mb-4">
                      {eventDetails.name}
                    </h1>

                    <div className="space-y-3 mb-6 text-gray-800 font-medium">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary/80 shrink-0" />
                        <span>
                          {formatDate(eventDetails?.startDate)}
                          {eventDetails.endDate && ` - ${formatDate(eventDetails.endDate)}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary/80 shrink-0" />
                        <span>{formatTimeRange(eventDetails.startTime, eventDetails.endTime)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary/80 shrink-0" />
                        <span>{eventDetails.venueName || "To Be Disclosed"}</span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                        About Event
                      </h2>
                      <p className="text-[#6B7280] leading-relaxed">
                        {eventDetails.description ||
                          "Join us for an unforgettable experience—great music, great people, and the best vibes. Don’t miss it!"}
                      </p>
                    </div>
                  </motion.article>
                </div>
              </section>

              {/* RIGHT: Ticket panel */}
              <aside className="md:sticky md:top-6 md:self-start">
                <motion.div
                  className="
                    bg-gradient-to-b from-[#FFF2F4] via-[#FFF2F4] to-white
                    rounded-2xl shadow-lg p-5 md:p-5
                    md:flex md:flex-col
                    md:max-h[calc(100vh-16.5rem)]
                    min-h-[420px]
                  "
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                >
                  {/* Header */}
                  <div className="mb-3 shrink-0">
                    <h3 className="text-[1.15rem] md:text-[1.25rem] font-semibold text-[#231F20]">
                      {hasEventPassed ? "View Tickets" : "Get Tickets"}
                    </h3>
                    <p className="text-[#979595] text-sm md:text-[0.95rem]">
                      {hasEventPassed ? "Event has concluded" : "Which ticket type are you going for?"}
                    </p>
                  </div>

                  {/* Tickets */}
                  <div
                    className="
                      mt-2 space-y-4 flex-1
                      overflow-y-auto overflow-x-hidden pr-1
                      [scrollbar-width:thin]
                      [&::-webkit-scrollbar]:w-2
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:bg-gray-300
                    "
                  >
                    {sortedTicketsByStatusAndPrice.length === 0 && (
                      <div className="text-gray-500 text-sm">No tickets available.</div>
                    )}

                    {sortedTicketsByStatusAndPrice.map((ticketItem) => (
                      <div key={ticketItem.id} className="w-full [&>*]:!w-full">
                        <TicketCard
                          isSelected={selectedTicketId === ticketItem.id}
                          quantity={selectedTicketId === ticketItem.id ? quantity : 0}
                          selectTicket={() => selectTicket(ticketItem, eventSlug as string, eventDetails)}
                          increaseQuantity={() => increaseQuantity(ticketItem.purchaseLimit)}
                          decreaseQuantity={decreaseQuantity}
                          ticket={ticketItem}
                          hasPassed={hasEventPassed}
                          isSoldOut={ticketItem.isSoldOut}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  {!hasEventPassed && (
                    <div className="pt-5 mt-3 border-t border-gray-200 shrink-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-[1.05rem] md:text-[1.15rem] font-bold text-primary">
                          {getTotal()}
                        </span>
                      </div>
                      <DefaultButton className="!w-full" onClick={handleProceedToCheckout}>
                        Next
                      </DefaultButton>
                    </div>
                  )}
                </motion.div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default EventDetails;