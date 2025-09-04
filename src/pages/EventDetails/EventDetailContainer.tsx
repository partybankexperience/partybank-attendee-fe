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
import { checkticketAvailability, getEventBySlug } from "../../containers/eventsApi";
import { EventDetailsSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate, formatTimeRange } from "../../components/helpers/dateTimeHelpers";
import { useAuthStore } from "../../stores/useAuthStore";
import { runPipeline } from "../../utils/axiosFormat";
import { useCheckoutStore } from "../../stores/checkoutStore";

const EventDetails: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { setCheckoutStage } = useAuthStore();
  const { slug } = useParams();

  const {
    selectedTicketId,
    quantity,
    selectTicket,
    increaseQuantity,
    decreaseQuantity,
    getTotal,
  } = useTicketStore();

  const { createAndStoreReservation } = useCheckoutStore();
  const [eventDetail, setEventDetail] = useState<any>(null);
  const [hasPassed, setHasPassed] = useState(false);

  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  async function getIdentity(user?: { id?: string }) {
    if (user?.id) return { userId: user.id };
    try {
      const { ip } = await fetch("https://api64.ipify.org?format=json").then((r) => r.json());
      return { ipHash: ip };
    } catch {
      return { ipHash: "anonymous" };
    }
  }

  async function handleNext() {
    if (!selectedTicketId) {
      errorAlert("Error", "Please select a ticket first!");
      return;
    }
    const user = Storage.getItem("user");
    const identity = await getIdentity(user);

    try {
      await runPipeline([
        async () => {
          const res = await checkticketAvailability(selectedTicketId, quantity);
          if (!res || res?.available === 0) {
            errorAlert("Error", "Ticket is not available");
            throw new Error("Ticket unavailable");
          }
          return res;
        },
        async () => {
          return await createAndStoreReservation(
            eventDetail.id,
            selectedTicketId,
            quantity,
            identity
          );
        },
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
      console.error("Checkout pipeline aborted:", err);
    }
  }

  async function loadEvent() {
    setLoading(true);
    try {
      const res = await getEventBySlug(slug as string);
      setEventDetail(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!eventDetail) return;
    const now = new Date();
    const start = eventDetail.startDate ? new Date(eventDetail.startDate) : null;
    const end = eventDetail.endDate ? new Date(eventDetail.endDate) : null;
    setHasPassed(end ? now > end : start ? now > start : false);
  }, [eventDetail]);

  const sortedTickets = useMemo(() => {
    const list: any[] = Array.isArray(eventDetail?.tickets) ? [...eventDetail.tickets] : [];
    const statusRank = (t: any) => {
      const soldOut = t?.available === 0 || t?.available == null;
      const buyable = t?.purchasable && !soldOut;
      if (buyable) return 0;
      if (soldOut) return 1;
      return 2;
    };
    const getPrice = (t: any) => (t?.type === "paid" ? Number(t.price) || 0 : 0);

    return list.sort((a, b) => {
      const ra = statusRank(a);
      const rb = statusRank(b);
      if (ra !== rb) return ra - rb;
      if (ra === 0) {
        const pa = getPrice(a);
        const pb = getPrice(b);
        if (pa !== pb) return pa - pb;
      }
      return 0;
    });
  }, [eventDetail?.tickets]);

  if (loading) {
    return (
      <HomeLayout>
        <EventDetailsSkeleton />
      </HomeLayout>
    );
  }

  if (!eventDetail) {
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
            {/* Outer grid: keep two columns from md; narrower panel on md for iPad, wider on lg+ */}
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
                    src={eventDetail?.bannerImage || xtasyGroove}
                    alt={eventDetail?.name || "Event image"}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>

                {/* Inner layout: stack on md (iPad), split image/details only from xl up */}
                <div className="grid xl:grid-cols-[360px_minmax(0,1fr)] gap-4 md:gap-5 lg:gap-6 items-start">
                  {/* Sticky image on web/tablet */}
                  <aside className="hidden md:block md:sticky md:top-6 md:self-start md:mb-4 xl:mb-0 xl:mr-3">
                    <div className="relative">
                      <img
                        src={eventDetail?.bannerImage || xtasyGroove}
                        alt={eventDetail?.name || "Event image"}
                        className="w-full h-auto object-cover rounded-[20px] border border-[#E5E7EB]"
                        loading="eager"
                      />
                    </div>
                  </aside>

                  {/* Details */}
                  <motion.article
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    className="min-w-0"
                  >
                    <h1 className="text-[1.75rem] md:text-[2rem] font-bold tracking-tight text-gray-900 mb-4">
                      {eventDetail.name}
                    </h1>

                    <div className="space-y-3 mb-6 text-gray-800 font-medium">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary/80 shrink-0" />
                        <span>
                          {formatDate(eventDetail?.startDate)}
                          {eventDetail.endDate && ` - ${formatDate(eventDetail.endDate)}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary/80 shrink-0" />
                        <span>{formatTimeRange(eventDetail.startTime, eventDetail.endTime)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary/80 shrink-0" />
                        <span>{eventDetail.venueName || "To Be Disclosed"}</span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                        About Event
                      </h2>
                      <p className="text-[#6B7280] leading-relaxed">
                        {eventDetail.description ||
                          "Join us for an unforgettable experience—great music, great people, and the best vibes. Don’t miss it!"}
                      </p>
                    </div>
                  </motion.article>
                </div>
              </section>

              {/* RIGHT: Ticket panel (fits viewport; list scrolls vertically only) */}
              <aside className="md:sticky md:top-6 md:self-start">
                <motion.div
                  className="
                    bg-gradient-to-b from-[#FFF2F4] via-[#FFF2F4] to-white
                    rounded-2xl shadow-lg p-5 md:p-5
                    md:flex md:flex-col
                    md:max-h-[calc(100vh-16.5rem)]   /* tune if your header height differs */
                    min-h-[420px]
                  "
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                >
                  {/* Header */}
                  <div className="mb-3 shrink-0">
                    <h3 className="text-[1.15rem] md:text-[1.25rem] font-semibold text-[#231F20]">
                      {hasPassed ? "View Tickets" : "Get Tickets"}
                    </h3>
                    <p className="text-[#979595] text-sm md:text-[0.95rem]">
                      {hasPassed ? "Event has concluded" : "Which ticket type are you going for?"}
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
                    {sortedTickets.length === 0 && (
                      <div className="text-gray-500 text-sm">No tickets available.</div>
                    )}

                    {sortedTickets.map((ticket) => (
                      <div key={ticket.id} className="w-full [&>*]:!w-full">
                        <TicketCard
                          isSelected={selectedTicketId === ticket.id}
                          quantity={selectedTicketId === ticket.id ? quantity : 0}
                          selectTicket={() => selectTicket(ticket, slug as string, eventDetail)}
                          increaseQuantity={() => increaseQuantity(ticket.purchaseLimit)}
                          decreaseQuantity={decreaseQuantity}
                          ticket={ticket}
                          hasPassed={hasPassed}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  {!hasPassed && (
                    <div className="pt-5 mt-3 border-t border-gray-200 shrink-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-[1.05rem] md:text-[1.15rem] font-bold text-primary">
                          {getTotal()}
                        </span>
                      </div>
                      <DefaultButton className="!w-full" onClick={handleNext}>
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
