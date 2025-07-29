import React, { useState } from 'react';


type TicketType = 'xtasyPass' | 'godMode' | 'xtasy';
type Tickets = Record<TicketType, number>;
interface  TicketCardType {
  ticketName: string;
  price: number;
  currency: '₦';
  calculateTotal: (tickets:Tickets, ticketPrices: Tickets ) => void
}

// TicketCard component to display a single ticket with quantity controls
const TicketCard = ({ ticketName, price, currency, calculateTotal }: TicketCardType) => {
 

  const [tickets, setTickets] = useState<Tickets>({
     xtasyPass: 1,
     godMode: 1,
     xtasy: 0
   });
  
     const ticketPrices: Tickets = {
    xtasyPass: 5000,
    godMode: 10000,
    xtasy: 15000
  };

   const updateTicketQuantity = (type: TicketType, change: number) => {
     setTickets(prev => ({
       ...prev,
       [type]: Math.max(0, prev[type] + change)
     }));
     calculateTotal(tickets, ticketPrices )
   };

  //    const calculateTotal = (): number => {
  //   return Object.entries(tickets).reduce((total, [type, quantity]) => {
  //     return total + (ticketPrices[type as TicketType] * quantity);
  //   }, 0);
  // };


  return (
    <div className="relative w-full max-w-sm bg-white rounded-xl shadow-md overflow-hidden border border-pink-200">
      {/* Ticket border with rounded corners and pink outline */}
      <div className="absolute inset-0 border-2 border-pink-400 rounded-xl pointer-events-none"></div>

      {/* Content wrapper with padding */}
      <div className="p-4 flex items-center justify-between">
        {/* Ticket details: name and price */}
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800 uppercase">
            {ticketName}
          </span>
          <span className="text-xl font-semibold text-pink-600 mt-1">
            {currency}{price.toLocaleString()}
          </span>
        </div>

        {/* Vertical dashed line separator */}
        <div className="absolute right-[100px] top-0 bottom-0 flex items-center justify-center">
          <div className="border-l-2 border-dashed border-pink-300 h-full my-2"></div>
        </div>

        {/* Ticket tear-off perforations */}
        <div className="absolute right-[98px] top-0 bottom-0 flex flex-col justify-between h-full">
          <div className="w-4 h-4 bg-gray-100 rounded-full -ml-2 -mt-2 border-2 border-pink-400"></div>
          <div className="w-4 h-4 bg-gray-100 rounded-full -ml-2 -mb-2 border-2 border-pink-400"></div>
        </div>

        {/* Quantity control */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Decrease button */}
          <button
            onClick={()=> updateTicketQuantity('xtasyPass', -1)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-xl font-bold transition-colors duration-200 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            aria-label="Decrease quantity"
          >
            −
          </button>
          {/* Quantity display */}
          <span className="text-lg font-semibold text-gray-800 w-6 text-center">
            {tickets.xtasyPass}
          </span>
          {/* Increase button */}
          <button
            onClick={()=> updateTicketQuantity('xtasyPass', 1)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 text-xl font-bold transition-colors duration-200 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
