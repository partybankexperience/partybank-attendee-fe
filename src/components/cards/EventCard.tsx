// import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiMapPinBold } from "react-icons/pi";
import { formatDate, formatTimeRange } from "../helpers/dateTimeHelpers";
import FallbackImage from "../common/FallbackImage";
// import { getEventsBySlug } from '../../Containers/eventApi';
// import { useEventStore } from '../../stores/useEventStore';
import { IoCalendarOutline } from "react-icons/io5";
import { getFallbackImage } from "../../config/fallbackImages";
import { FaRegClock } from "react-icons/fa6";
import { formatPrice } from "../helpers/numberFormatHelpers";
// import { getFallbackImage } from '../../config/fallbackImages';
type StageType = "upcoming" | "active" | "past" | "draft" | "";
const EventCard = ({
  name = "Canvas and Beats",
  location = "To Be Disclosed",
  startDate,
  startTime,
  endTime,
  // progress = 0,
  // ticketSold = 0,
  // totalTicket = 0,
  // // onEdit,
  // onDuplicate,
  // onDelete,
  // stage = "",
  slug = "1",
  id = "",
  // timingStatus = "",
  bannerImage = getFallbackImage("default"),
  price = "",
  // date = "",
  image = "",
}: {
  name?: string;
  location?: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  progress?: number;
  ticketSold?: number;
  totalTicket?: number;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  bannerImage?: string;
  stage?: StageType;
  slug?: string;
  id?: string;
  timingStatus?: string;
  price?: string;
  date?: string;
  image?: string;
}) => {


  const navigate = useNavigate();
 

  // Format the date and time for display
  const formattedDate = startDate && formatDate(startDate);
  const timeDisplay = startTime && formatTimeRange(startTime, endTime);


  const cardItems = [
    {
      icon: <FaRegClock className="text-primary" />,
      text: timeDisplay || "Time not set",
    },
    {
      icon: <IoCalendarOutline className="text-primary" />,
      text: formattedDate || "Date not set",
    },
    {
      icon: <PiMapPinBold className="text-primary" />,
      text: location || "To Be Disclosed",
    },
  ];
  return (
    <div
      className="relative rounded-[15px] border min-h-fit border-[#E1E1E1] h-[17.5rem] min-w-[180px] w-full hover:shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer "
      onClick={() => navigate(`/event-details/${slug}`, { state: { id: id } })}
    >

      <div className="h-[150px] rounded-t-[9px] w-full bg-gray-100">
        <FallbackImage
          src={image || bannerImage}
          alt={`${name} banner image`}
          className="w-full h-full object-cover rounded-t-[9px]"
          fallbackType="event"
        />
      </div>
      <div className="p-[15px]  grid gap-[12px]">
        <div className="grid gap-[5px]">
          <p
            className="text-black text-[18px]  font-bold truncate max-w-full"
            title={name}
          >
            {name}
          </p>

          {cardItems.map((item, index) => (
            <div key={index} className="flex items-center gap-[9px] min-w-0">
              {item.icon}
              <p
                className="text-black text-[.8rem] truncate flex-1 "
                title={item.text}
              >
                {item.text}
              </p>
            </div>
          ))}

          <div className="flex items-center gap-[9px]">
            <p className="text-black font-bold text-[1.2rem]">
              {formatPrice(price)}
            </p>
            <p className="text-[.8rem] text-[#A9ABAE]">Lowest Price</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
