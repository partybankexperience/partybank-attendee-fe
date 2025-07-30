import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { Variants } from 'framer-motion';

type TicketCategory = 'upcoming' | 'past';

const TicketManagement = () => {
  const [activeTab, setActiveTab] = useState<TicketCategory>('upcoming');

  // Sample ticket data
  const tickets: Record<TicketCategory, {
    id: number;
    title: string;
    subtitle: string;
    date: string;
    time: string;
    location: string;
    price: string;
    image: string;
    bgPattern: string;
  }[]> = {
    upcoming: [
      {
        id: 1,
        title: 'Canvas and Beats',
        subtitle: 'Paint • Vibe • Connect',
        date: '12 Apr 2025',
        time: '08:15 AM - 08:30 PM',
        location: 'Victoria Island, Lagos',
        price: '₦10,000',
        image: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
        bgPattern: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)'
      },
      {
        id: 2,
        title: 'Chill With Dummy: The Classroom',
        subtitle: 'Comedy Show',
        date: '12 Apr 2025',
        time: '08:15 AM - 08:30 PM',
        location: 'Victoria Island, Lagos',
        price: '₦100,000',
        image: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)',
        bgPattern: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
      },
      {
        id: 3,
        title: 'Temple of Erosassroom',
        subtitle: 'The forbidden desire',
        date: '12 Apr 2025',
        time: '08:15 AM - 08:30 PM',
        location: 'Victoria Island, Lagos',
        price: '₦50,000',
        image: 'linear-gradient(135deg, #1f2937 0%, #ef4444 100%)',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)'
      }
    ],
    past: [
      {
        id: 4,
        title: 'Jazz Night Experience',
        subtitle: 'Smooth Jazz & Wine',
        date: '15 Mar 2025',
        time: '07:00 PM - 11:00 PM',
        location: 'Ikoyi, Lagos',
        price: '₦25,000',
        image: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',
        bgPattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)'
      },
      {
        id: 5,
        title: 'Tech Conference 2025',
        subtitle: 'Innovation & Future',
        date: '28 Feb 2025',
        time: '09:00 AM - 06:00 PM',
        location: 'Victoria Island, Lagos',
        price: '₦75,000',
        image: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        bgPattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)'
      }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: ["easeOut"]
      }
    }
  };

  const tabVariants: Variants = {
    inactive: { 
      color: '#9ca3af',
      borderBottomColor: 'transparent'
    },
    active: { 
      color: '#ef4444',
      borderBottomColor: '#ef4444',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            My Tickets ({tickets.upcoming.length + tickets.past.length})
          </h1>
          
          {/* Tab Navigation */}
          <nav className="flex space-x-8 border-b border-gray-200" role="tablist">
            {([
              { key: 'upcoming', label: 'Upcoming Events' },
              { key: 'past', label: 'Past Events' }
            ] as { key: TicketCategory; label: string }[]).map(({ key, label }) => (
              <motion.button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-4 font-medium text-lg relative focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  activeTab === key ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
                }`}
                variants={tabVariants}
                animate={activeTab === key ? 'active' : 'inactive'}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                role="tab"
                aria-selected={activeTab === key}
                aria-controls={`${key}-panel`}
              >
                {label}
                {activeTab === key && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                    layoutId="activeTab"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Ticket Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6"
            role="tabpanel"
            id={`${activeTab}-panel`}
            aria-labelledby={`${activeTab}-tab`}
          >
            {tickets[activeTab].map((ticket) => (
              <motion.article
                key={ticket.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2"
                tabIndex={0}
                role="button"
                aria-label={`${ticket.title} event ticket`}
              >
                {/* Event Image/Header */}
                <div 
                  className="h-48 relative overflow-hidden"
                  style={{ 
                    background: ticket.image,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div 
                    className="absolute inset-0"
                    style={{ background: ticket.bgPattern }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20" />
                  <div className="relative p-6 h-full flex flex-col justify-end">
                    <motion.h2 
                      className="text-white text-xl md:text-2xl font-bold mb-2 drop-shadow-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {ticket.title}
                    </motion.h2>
                    <motion.p 
                      className="text-white text-sm opacity-90 drop-shadow"
                      initial={{ opacity: 0, x: -20 }}  
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {ticket.subtitle}
                    </motion.p>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-red-500" aria-hidden="true" />
                    <time dateTime={ticket.date}>{ticket.date}</time>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-2 text-red-500" aria-hidden="true" />
                    <span>{ticket.time}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" aria-hidden="true" />
                    <address className="not-italic">{ticket.location}</address>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Price</span>
                      <motion.span 
                        className="text-2xl font-bold text-gray-900"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {ticket.price}
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {tickets[activeTab].length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No {activeTab} events
            </h3>
            <p className="text-gray-500">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming events." 
                : "You haven't attended any events yet."
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TicketManagement;