import { motion } from "framer-motion";
import { FiUsers, FiShoppingBag } from "react-icons/fi";
import { IoTicketSharp } from "react-icons/io5";

interface Ticket {
  id: string;
  name: string;
  price: number;
  isSoldOut: boolean;
  perks: string[];
  groupSize: number;
  purchaseLimit: number;
  isUnlimited: boolean;
  purchasable: boolean; // Indicates if the ticket can be purchased
  type: string;
  available: number | null;
}

interface TicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  quantity: number;
  selectTicket: () => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  hasPassed: boolean;
  isSoldOut: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  isSelected,
  quantity,
  selectTicket,
  increaseQuantity,
  decreaseQuantity,
  hasPassed,
  isSoldOut,
}) => {
  const {
    name,
    price,
    perks = [],
    groupSize,
    purchaseLimit,
    available,
  } = ticket;

  const perkContainerClass = perks.length > 3 ? "scrollbar-hide" : "";

  return (
    <div
      onClick={() =>
        !hasPassed &&
        ticket?.purchasable &&
        !isSoldOut &&
        selectTicket()
      }
      className={`relative w-full bg-white rounded-xl p-4 flex flex-col gap-3 transition-all duration-300
        ${
          isSelected
            ? "shadow-lg border-primary border-2"
            : "border border-gray-200"
        }
        ${
           !ticket.purchasable || hasPassed || isSoldOut
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:shadow-md"
        }`}
    >
      {/* Top section: Info + Quantity Controls */}
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col w-full flex-1 min-w-0">
          <div className="flex items-center justify-between w-full gap-5">
            <h3
              className="text-base font-bold text-[#231F20] uppercase red-hat-display truncate"
              title={name}
            >
              {name}
            </h3>

            <div className="flex items-center h-full flex-shrink-0">
              {isSelected &&
                !isSoldOut &&
                ticket.purchasable &&
                ticket.type === "paid" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-2"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        decreaseQuantity();
                      }}
                      disabled={quantity <= 1}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-xl font-bold transition-colors duration-200 hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={purchaseLimit ? quantity >= purchaseLimit : false}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-xl font-bold transition-colors duration-200 hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </motion.div>
                )}

              {(isSoldOut) ? (
                <span className="text-red-500 font-bold text-sm">Sold Out</span>
              ) : (
                !ticket.purchasable && (
                  <span className="text-red-500 font-bold text-sm">
                    Not purchasable
                  </span>
                )
              )}
            </div>
          </div>

          <span className="text-sm font-semibold text-primary mt-1 red-hat-display">
            {ticket.type === "paid" ? `₦${Number(price).toLocaleString()}` : "FREE"}
          </span>

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 w-full">
            <span className="flex items-center gap-1">
              <FiUsers /> For {groupSize} {groupSize > 1 ? "People" : "Person"}
            </span>
            {ticket.type === "paid" && !!purchaseLimit && (
              <span className="flex items-center gap-1">
                <FiShoppingBag /> Max {purchaseLimit}
              </span>
            )}
            {available !== 0 && available != null && ticket.purchasable && !hasPassed && (
              <span className="flex items-center gap-1 ">
                <IoTicketSharp className="text-green-500" />
                {available} left
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Perks */}
      {perks.length > 0 && (
        <div className={`flex items-center gap-2 overflow-x-auto pt-2 -mb-1 ${perkContainerClass}`}>
          {perks.map((perk, index) => (
            <div
              key={index}
              className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              {perk}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketCard;
