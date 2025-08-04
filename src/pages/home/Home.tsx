import DefaultButton from "../../components/buttons/DefaultButton";
import EventCard from "../../components/cards/EventCard";
import DefaultInput from "../../components/inputs/DefaultInput";
import HomeLayout from "../../components/layouts/HomeLayout";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { getEvents } from "../../containers/eventsApi";
import EventCardSkeleton from "../../components/common/LoadingSkeleton";

const Home = () => {

    const [search, setSearch] = useState("");
    const [selectState, setSelectState] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setisLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [totalCount, setTotalCount] = useState(0);
    async function getEvent() {
        setisLoading(true);
        try {
            const res = await getEvents(search, selectState ,page, perPage, fromDate, toDate);
            setEvents(res.data);
            setTotalCount(res.totalCount || 0)
        } catch (error:any) {
            
        }finally{
            setisLoading(false);
        }
    }

    useEffect(() => {
      getEvent()
    }, [search, selectState, fromDate, toDate]);
    
  const totalPages = Math.ceil(totalCount / perPage);

  const PaginationControls = () => (
    <div className="flex flex-wrap justify-between items-center gap-4 my-6">
      <div className="flex items-center gap-2">
        <label htmlFor="perPage" className="text-sm text-gray-600">Events per page:</label>
        <select
          id="perPage"
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1); // reset to first page when perPage changes
          }}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {[4, 8, 12, 16].map((count) => (
            <option key={count} value={count}>{count}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded border text-sm disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1 rounded border text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
  return (
    <HomeLayout>

   <div className="bg-white rounded-lg min-h-[9rem] py-[1.6rem] px-[1.8rem] min-w-fit md:w-[67vw] mx-[10px] grid md:mx-auto relative top-[-10rem] md:top-[-4.5rem] z-50 gap-[20px] md:flex shadow-md items-end">
    <DefaultInput 
        id="search" 
        label="Search" 
        value={search} 
        setValue={setSearch} 
        style="!w-full md:!w-[12rem]" 
    />
    <DefaultInput 
        id="selectState" 
        label="Select State" 
        value={selectState} 
        setValue={setSelectState} 
        style="!w-full md:!w-[12rem]" 
        showDropdown={true}
        dropdownOptions={["All", "State 1", "State 2", "State 3"]}
        placeholder="Select a state"
    />
    <DefaultInput 
        id="fromDate" 
        label="From" 
        value={fromDate} 
        setValue={setFromDate} 
        style="!w-full md:!w-[12rem]" 
        type='date'
    />
    <DefaultInput 
        id="toDate" 
        label="To" 
        value={toDate} 
        setValue={setToDate} 
        style="!w-full md:!w-[12rem]" 
        type='date'

    />
    <DefaultButton icon={<CiSearch className="text-[1.5rem]" />} type="icon-left" className="!w-full md:!w-[9rem] !h-fit !py-[8px] !rounded-[5px] !mb-[5px]" submitType="submit">
        Search
    </DefaultButton>
    {/* <div className=" flex items-end">

    </div> */}
   </div>
   <div className="h-fit  top-[-10rem] relative md:top-[-4.5rem] pt-[30px] px-[10px] md:px-[9rem]">

        {/* Top Pagination */}
        <PaginationControls />
<p className="text-[#918F90] text-[.9rem]">{events?.length || 0} events</p>
     
      <div className="grid md:grid-cols-4 gap-[20px]">
        {isLoading
  ? [...Array(8)].map((_, i) => <EventCardSkeleton key={i} />)
  :events.map((event, index) => (
          <EventCard 
            key={index}
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
      {/* bottom Pagination */}
      <PaginationControls />
   </div>
    </HomeLayout>
  );
};

export default Home;
