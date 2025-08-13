import { motion } from "framer-motion";

type TicketType = "xtasyPass" | "godMode" | "xtasy";
type Tickets = Record<TicketType, number>;
interface TicketCardType {
  ticketName: string;
  price: number;
  currency: "₦";
  updateTicketQuantity: (tickets: TicketType, change: number) => void;
  tickets: Tickets;
  ticketTitle: TicketType;
  // setTickets: React.Dispatch<React.SetStateAction<Tickets>>;
}

// TicketCard component to display a single ticket with quantity controls
const TicketCard = ({
  ticketName,
  price,
  currency,
  updateTicketQuantity,
  tickets,
  ticketTitle,
}: TicketCardType) => {
  // I am  truncating words and adding ellipsis
  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <div
      className="relative w-full bg-white rounded-xl overflow-hidden 
          md:h-[5rem] flex items-center"
    >
      <div className=" w-full h-full flex">
        {/* Ticket border with rounded corners and pink outline */}
        <div className="absolute inset-0 border-2 border-primary rounded-xl poin ter-events-none"></div>

        {/* Content wrapper with padding */}
        <motion.div
          className="p-4 flex items-center justify-between w-full h-full "
          // whileHover={{ scale: 1.02 }}
          // transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Ticket details: name and price */}
          <div className="flex flex-col  h-full">
            <span className="text-[.9rem] font-semibold text-[#231F20] uppercase cursor-pointer red-hat-display"
             title={ticketName}
            >
              {/* {ticketName} */}
              {truncateWords(ticketName, 2)}
            </span>
            <span className="text-[.8rem] font-semibold text-primary mt-1 red-hat-display">
              {currency}
              {price.toLocaleString()}
            </span>
          </div>

          {/* Vertical dashed line separator */}
          <div className="absolute right-[48%] md:right-[46.5%] lg:right-[10rem] top-0 bottom-0 flex items-center justify-center ">
            <div className="border-l-2 border-dashed border-pink-300 h-full my-2"></div>
          </div>

          {/* Ticket tear-off perforations */}
          <div className="absolute right-[45%] lg:left-[16.8rem] lg:w-[60%] top-0 bottom-0 flex flex-col justify-between h-full">
            <div className="w-5 h-5 bg-faintPink rounded-full -ml-2 -mt-2 border-2 border-pink-400"></div>
            <div className="w-5 h-5 bg-faintPink rounded-full -ml-2 -mb-2 border-2 border-pink-400"></div>
          </div>

          {/* Quantity control */}
          <div className="flex items-center space-x-2 ml-auto relative">
            {/* Decrease button */}
            <button
              onClick={() => updateTicketQuantity(ticketTitle, -1)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-xl font-bold transition-colors duration-200 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              aria-label="Decrease quantity"
              disabled={tickets[ticketTitle] === 0}
            >
              −
            </button>
            {/* Quantity display */}
            <span className="text-lg font-semibold text-gray-800 w-6 text-center">
              {tickets[ticketTitle]}
            </span>
            {/* Increase button */}
            <button
              onClick={() => updateTicketQuantity(ticketTitle, 1)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-xl font-bold transition-colors duration-200 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TicketCard;
