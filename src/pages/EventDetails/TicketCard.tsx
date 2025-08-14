import { motion } from "framer-motion";

interface TicketCardProps {
  ticketId: string;
  name: string;
  price: number;
  soldOut?: boolean;
  isSelected: boolean;
  quantity: number;
  selectTicket: () => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticketId,
  name,
  price,
  soldOut,
  isSelected,
  quantity,
  selectTicket,
  increaseQuantity,
  decreaseQuantity,
}) => {
  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <div
      className={`relative w-full bg-white rounded-xl overflow-hidden md:h-[5rem] flex items-center ${isSelected ? "border-1 border-primary" : "border-gray-200"} 
         ${
        soldOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={() => !soldOut && selectTicket()}
    >
      <div className="w-full h-full flex relative">
        {/* Pink border overlay */}
        <div className={`"absolute inset-0  border-primary pointer-events-none rounded-xl" `}></div>

        {/* Content */}
        <motion.div
          className="p-4 flex items-center justify-between w-full h-full"
        >
          {/* Ticket name & price */}
          <div className="flex flex-col h-full">
            <span
              className="text-[.9rem] font-semibold text-[#231F20] uppercase cursor-pointer red-hat-display"
              title={name}
            >
              {truncateWords(name, 2)}
            </span>
            <span className="text-[.8rem] font-semibold text-primary mt-1 red-hat-display">
              ₦{price.toLocaleString()}
            </span>
          </div>

          {/* Vertical dashed line */}
          <div className="absolute right-[48%] md:right-[15rem] lg:left-[11.15rem] top-0 bottom-0 flex items-center justify-center">
            <div className="border-l-2 border-dashed border-pink-300 h-full my-2"></div>
          </div>

          {/* Perforation circles */}
          <div className="absolute right-[45%] lg:left-[11rem] lg:w-[60%] top-0 bottom-0 flex flex-col justify-between h-full">
            <div className="w-5 h-5 bg-faintPink rounded-full -ml-2 -mt-2 border-1 border-primary"></div>
            <div className="w-5 h-5 bg-faintPink rounded-full -ml-2 -mb-2 border-1 border-primary"></div>
          </div>

          {/* Quantity controls */}
          {isSelected && !soldOut && (
            <div className="flex items-center space-x-2 ml-auto relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  decreaseQuantity();
                }}
                disabled={quantity <= 1}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-xl font-bold transition-colors duration-200 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                −
              </button>
              <span className="text-lg font-semibold text-gray-800 w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  increaseQuantity();
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-xl font-bold transition-colors duration-200 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                +
              </button>
            </div>
          )}

          {soldOut && <span className="text-red-500 font-bold text-[.9rem]">Sold Out</span>}
        </motion.div>
      </div>
    </div>
  );
};

export default TicketCard;
