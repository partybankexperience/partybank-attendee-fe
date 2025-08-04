import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiMapPinBold } from "react-icons/pi";
import { formatDate, formatTimeRange } from "../helpers/dateTimeHelpers";
import FallbackImage from "../common/FallbackImage";
// import { getEventsBySlug } from '../../Containers/eventApi';
import { Storage } from "../../stores/InAppStorage";
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
  progress = 0,
  ticketSold = 0,
  totalTicket = 0,
  // onEdit,
  onDuplicate,
  onDelete,
  stage = "",
  slug = "1",
  id = "",
  timingStatus = "",
  bannerImage = getFallbackImage("default"),
  price = "",
  date = "",
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  // const { setStage, prefillEventData, mapBackendStepToFrontend } = useEventStore();

  // console.log(onDuplicate);
  // const buttonOptions = [];
  // async function getEvent() {
  //   try {
  //     // setLoading(true);
  //     const res = await getEventsBySlug(slug as string);
  //     console.log('🔥 raw event payload:', res);
  //     Storage.setItem('eventId', res.id);

  //     // Prefill form data using the store method
  //     prefillEventData(res);

  //     // Map backend step to frontend stage and set it
  //     const frontendStage = mapBackendStepToFrontend(res.currentStep);
  //     setStage(frontendStage);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // function handleEdit() {
  //   try {
  //     getEvent();
  //     navigate('/dashboard/create-event');
  //   } catch (error) {}
  //   // if (onEdit) {
  //   //   onEdit();
  //   // } else {
  //   // }
  // }

  // if (stage !== 'draft') {
  //   buttonOptions.push({
  //     name: 'Preview',
  //     onClick: () => navigate(`/manage-events/${slug}`, { state: { id: id } }),
  //     icon: <MdOutlinePreview />,
  //   });
  // }

  // if (timingStatus !== 'past' || stage === 'draft') {
  //   buttonOptions.push({
  //     name: 'Edit',
  //     onClick: () => handleEdit(),
  //     icon: <LuPencilLine />,
  //   });
  //   buttonOptions.push({
  //     name: 'Delete',
  //     onClick: () => onDelete?.(),
  //     icon: <AiOutlineDelete />,
  //   });
  // }

  // const buttonOptions = [
  //   {
  //     name: "Edit",
  //     onClick: () => (onEdit ? onEdit() : navigate("/manage-events/:id")),
  //     icon: <LuPencilLine />,
  //   },
  //   // {
  //   //   name: "Duplicate",
  //   //   onClick: () => onDuplicate?.(),
  //   //   icon: <FiCopy />,
  //   // },
  //   {
  //     name: "Delete",
  //     onClick: () => onDelete?.(),
  //     icon: <AiOutlineDelete />,
  //   },
  // ];

  // Format the date and time for display
  const formattedDate = startDate && formatDate(startDate);
  const timeDisplay = startTime && formatTimeRange(startTime, endTime);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

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
      {/* Dropdown */}
      {/* <div className="absolute top-[15px] right-[15px] z-10" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="w-[32px] h-[32px] p-[5px] rounded-[5px] cursor-pointer bg-white hover:bg-[#eaeaea] flex items-center justify-center"
        >
          <HiOutlineDotsVertical size={20} />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md w-[140px] z-20">
            {buttonOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setDropdownOpen(false);
                  option.onClick();
                }}
                className="items-center cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex gap-2"
              >
                {option.icon}
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div> */}

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
