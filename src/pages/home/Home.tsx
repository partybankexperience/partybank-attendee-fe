import DefaultButton from "../../components/buttons/DefaultButton";
import EventCard from "../../components/cards/EventCard";
import DefaultInput from "../../components/inputs/DefaultInput";
import HomeLayout from "../../components/layouts/HomeLayout";
import { useEffect, useRef, useState, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { getEvents } from "../../containers/eventsApi";
import EventCardSkeleton from "../../components/common/LoadingSkeleton";

const normalizeDate = (v?: string | null): string => {
  // Input type="date" already gives "YYYY-MM-DD"; we just normalize/guard
  if (!v) return "";
  // keep first 10 chars to be safe (YYYY-MM-DD)
  return v.slice(0, 10);
};

const buildDateRange = (fromRaw: string, toRaw: string) => {
  const from = normalizeDate(fromRaw);
  const to = normalizeDate(toRaw);
  if (from && to && from > to) {
    // swap if inverted
    return { from: to, to: from };
  }
  return { from, to };
};

const Home = () => {
  const [search, setSearch] = useState("");
  const [selectState, setSelectState] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);     // initial load / refetch
  const [isAppending, setIsAppending] = useState(false); // loading more pages
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Memoized, sanitized dates (and auto-swap if needed)
  const { from: fromISO, to: toISO } = useMemo(
    () => buildDateRange(fromDate, toDate),
    [fromDate, toDate]
  );

  // Fetch events
  async function fetchEvents(currentPage = 1, append = false) {
    if (append) setIsAppending(true);
    else setIsLoading(true);

    try {
      const res = await getEvents(
        search || "",                               // ok; function trims/omits
        selectState === "All" ? "" : selectState,   // ok; function trims/omits
        currentPage,
        perPage,
        fromISO || undefined,
        toISO || undefined
      );

      // Expected API shape (from your sample):
      // { data: [...], page, per_page, total, totalPages }
      const data = res?.data ?? [];
      const apiTotal = res?.total ?? res?.totalCount ?? 0;
      const apiPerPage = res?.per_page ?? perPage;
      const apiTotalPages = res?.totalPages ?? Math.max(1, Math.ceil(apiTotal / apiPerPage));

      setTotalCount(apiTotal);
      setPerPage(apiPerPage);
      setTotalPages(apiTotalPages);

      if (append) {
        setEvents(prev => [...prev, ...data]);
      } else {
        setEvents(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (append) setIsAppending(false);
      else setIsLoading(false);
    }
  }

  // Refetch when filters/perPage change (reset to page 1)
  useEffect(() => {
    setPage(1);
    setEvents([]);
    // If you want to require both dates before filtering, you could gate with:
    // if ((fromISO && toISO) || (!fromISO && !toISO) || (fromISO && !toISO) || (!fromISO && toISO)) { ... }
    fetchEvents(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectState, fromISO, toISO, perPage]);

  // Fetch when page changes (append)
  useEffect(() => {
    if (page === 1) return; // page 1 handled above
    fetchEvents(page, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          !isLoading &&
          !isAppending &&
          page < totalPages &&
          events.length > 0
        ) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [isLoading, isAppending, page, totalPages, events.length]);

  const handleManualLoadMore = () => {
    if (!isLoading && !isAppending && page < totalPages) {
      setPage((p) => p + 1);
    }
  };

  return (
    <HomeLayout>
      {/* Search Card — narrower on wide screens, compact button on desktop */}
      <section className="relative -mt-[9.5rem] md:-mt-[4.5rem] z-40">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 xl:px-12">
          <form
            onSubmit={(e) => {
              e.preventDefault(); // no page reload
              setPage(1);
              setEvents([]);
              fetchEvents(1, false);
            }}
            className="mx-auto w-full max-w-5xl bg-white shadow-md rounded-xl p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end lg:[grid-template-columns:1fr_1fr_auto_auto_auto]"
          >
            <DefaultInput
              id="search"
              label="Search"
              value={search}
              setValue={setSearch}
              style="!w-full"
              placeholder="Search events"
            />

            <DefaultInput
              id="selectState"
              label="Select State"
              value={selectState}
              setValue={setSelectState}
              style="!w-full"
              showDropdown={true}
              dropdownOptions={["All", "State 1", "State 2", "State 3"]}
              placeholder="Select a state"
            />

            <DefaultInput
              id="fromDate"
              label="From"
              value={fromDate}
              setValue={(val: string) => {
                const v = normalizeDate(val);
                setFromDate(v);
                // optional UX: auto-correct toDate if user picks an earlier fromDate
                if (toDate && v && v > toDate) setToDate(v);
              }}
              style="!w-full"
              type="date"
            />

            <DefaultInput
              id="toDate"
              label="To"
              value={toDate}
              setValue={(val: string) => {
                const v = normalizeDate(val);
                setToDate(v);
                // optional UX: auto-correct fromDate if user picks an earlier toDate
                if (fromDate && v && fromDate > v) setFromDate(v);
              }}
              style="!w-full"
              type="date"
            />

            <DefaultButton
              icon={<CiSearch className="text-[1.2rem]" />}
              type="icon-left"
              className="w-full sm:w-auto !h-[44px] !rounded-md !px-5 !py-2.5 !text-[15px] !font-semibold justify-self-start"
              submitType="submit"
            >
              Search
            </DefaultButton>
          </form>

          {/* Optional small helper for invalid range (after auto-swap this should rarely show) */}
          {fromDate && toDate && fromDate > toDate && (
            <p className="max-w-5xl mx-auto mt-2 text-sm text-red-600">
              Your date range looks inverted. We’ll use a corrected range automatically.
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="relative pt-8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 xl:px-12">
          {/* Status / Controls row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <p className="text-[#918F90] text-sm">
              Showing <span className="font-medium">{events.length}</span> of{" "}
              <span className="font-medium">{totalCount}</span> event{totalCount === 1 ? "" : "s"}
              {fromISO || toISO ? (
                <span className="ml-2 text-gray-500">
                  ({fromISO || "…"} — {toISO || "…"})
                </span>
              ) : null}
            </p>

            <div className="flex items-center gap-2">
              <label htmlFor="perPage" className="text-sm text-gray-700">
                Results per fetch:
              </label>
              <select
                id="perPage"
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
              >
                {[8, 12, 16, 24, 32].map((count) => (
                  <option key={count} value={count} className="cursor-pointer">
                    {count}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(isLoading && events.length === 0)
              ? Array.from({ length: perPage }).map((_, i) => <EventCardSkeleton key={i} />)
              : events.map((event, index) => (
                  <EventCard
                    key={`${event.id}-${index}`}
                    name={event.name}
                    startDate={event.startDate}
                    startTime={event.startTime}
                    endTime={event.endTime}
                    location={event.venueName}
                    price={event.priceMin}
                    image={event.bannerImage}
                    slug={event.slug}
                    id={event.id}
                  />
                ))}
          </div>

          {/* Appending spinner */}
          {isAppending && (
            <div className="flex justify-center py-8">
              <div className="h-7 w-7 rounded-full border-2 border-gray-300 border-t-primary animate-spin" />
            </div>
          )}

          {/* Load more (fallback) */}
          {!isLoading && !isAppending && events.length > 0 && page < totalPages && (
            <div className="flex justify-center py-6">
              <DefaultButton
                onClick={handleManualLoadMore}
                className="!px-6 !py-3 !rounded-lg !font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Load more
              </DefaultButton>
            </div>
          )}

          {/* Sentinel for IntersectionObserver */}
          <div ref={sentinelRef} className="h-px w-full" />
        </div>
      </section>
    </HomeLayout>
  );
};

export default Home;
