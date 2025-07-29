import DefaultButton from "../../components/buttons/DefaultButton";
import EventCard from "../../components/cards/EventCard";
import DefaultInput from "../../components/inputs/DefaultInput";
import HomeLayout from "../../components/layouts/HomeLayout";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";

const Home = () => {

    const [search, setSearch] = useState("");
    const [selectState, setSelectState] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
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
<p className="text-[#918F90] text-[.9rem]">08 events</p>
     
      <div className="grid md:grid-cols-4 gap-[20px]">
        <EventCard name='Canvas and Beats' date='12 Apr 2025' startTime="8:15 " endTime="08:30" location="Victoria Island, Lagos " price='₦10,000'/>
        <EventCard/>
        <EventCard/>
        <EventCard/>
        <EventCard/>
        <EventCard/>
        <EventCard/>
        <EventCard/>
      </div>
   </div>
    </HomeLayout>
  );
};

export default Home;
