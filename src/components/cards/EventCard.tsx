import { useNavigate } from "react-router-dom";
import { PiMapPinBold } from "react-icons/pi";
import { IoCalendarOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";

import { formatDate, formatTimeRange } from "../helpers/dateTimeHelpers";
import { formatPrice } from "../helpers/numberFormatHelpers";
import FallbackImage from "../common/FallbackImage";
import { getFallbackImage } from "../../config/fallbackImages";

type StageType = "upcoming" | "active" | "past" | "draft" | "";

const EventCard = ({
  name = "Canvas and Beats",
  location = "To Be Disclosed",
  startDate,
  startTime,
  endTime,
  slug = "1",
  id = "",
  bannerImage = getFallbackImage("default"),
  price, // can be number | string | null | undefined
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
  price?: number | string | null; // <-- widened type
  date?: string;
  image?: string;
}) => {
  const navigate = useNavigate();

  // Format the date and time for display
  const formattedDate = startDate && formatDate(startDate);
  const timeDisplay = startTime && formatTimeRange(startTime, endTime);

  // Normalize price to a number (or null)
  const priceNum =
    typeof price === "string"
      ? (Number.isNaN(Number(price)) ? null : Number(price))
      : price ?? null;

  // Decide label
  const isFree = priceNum === 0;
  const priceLabel =
    priceNum === 0
      ? "FREE"
      : priceNum == null
      ? "Price TBD"
      : formatPrice(priceNum); // uses your helper (e.g., NGN)

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
      className="relative rounded-[15px] border min-h-fit border-[#E1E1E1] h-[17.5rem] min-w-[180px] w-full hover:shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/event-details/${slug}`, { state: { id } })}
      role="button"
      aria-label={`View details for ${name}`}
    >
      {/* Image */}
      <div className="h-[150px] rounded-t-[9px] w-full bg-gray-100 relative">
        <FallbackImage
          src={image || bannerImage}
          alt={`${name} banner image`}
          className="w-full h-full object-cover rounded-t-[9px]"
          fallbackType="event"
        />

        {/* FREE badge */}
        {isFree && (
          <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
            FREE
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-[15px] grid gap-[12px]">
        <div className="grid gap-[5px]">
          <p
            className="text-black text-[18px] font-bold truncate max-w-full"
            title={name}
          >
            {name}
          </p>

          {cardItems.map((item, index) => (
            <div key={index} className="flex items-center gap-[9px] min-w-0">
              {item.icon}
              <p className="text-black text-[.8rem] truncate flex-1" title={item.text}>
                {item.text}
              </p>
            </div>
          ))}

          <div className="flex items-center gap-[9px]">
            <p
              className={`font-bold text-[1.05rem] ${
                isFree ? "text-green-700" : "text-black"
              }`}
            >
              {priceLabel}
            </p>
            <p className="text-[.8rem] text-[#A9ABAE]">
              {isFree ? "General Admission" : "Lowest Price"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
