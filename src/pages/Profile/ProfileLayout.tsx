import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Ticket, Settings, LogOut, X } from "lucide-react";

import HomeLayout from "../../components/layouts/HomeLayout";
import ProfileComponent from "./ProfilePageComponent";
import TicketManagement from "./Ticket";
import Profile_Settings from "./Settings";


interface sideItemsType {
  icon: React.ElementType;
  label: "My Profile" | "My Tickets" | "Settings" | "Log Out";
}
const Profile: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeButton, setActiveButton] = useState<
    "My Profile" | "My Tickets" | "Settings" | "Log Out"
  >("My Profile");

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeComponent = () => {
    switch (activeButton) {
      case "My Profile":
        return <ProfileComponent />;
        break;
      case "My Tickets":
        return <TicketManagement />;
        break;
      case "Settings":
        return <Profile_Settings />;
        break;
      default:
        break;
    }
  };

  const sidebarItems: sideItemsType[] = [
    { icon: User, label: "My Profile" },
    { icon: Ticket, label: "My Tickets" },
    { icon: Settings, label: "Settings" },
    { icon: LogOut, label: "Log Out" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const sidebarVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  const Sidebar = ({ className = "" }) => (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className={`bg-[#FFF2F4] h-screen w-72 flex flex-col md:m-[2rem] 
        rounded-[12px] ${className}`}
    >
      <nav className="flex-1 pt-8 px-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              variants={itemVariants}
              className={`w-full flex items-center gap-3 px-4 py-4 mb-2 rounded-lg 
                text-left transition-all duration-200 hover:scale-[1.5rem] hover:shadow-sm ${
                  item.label === activeButton
                    ? "bg-red-500 text-white "
                    : "bg-white text-gray-700 hover:text-gray-900"
                }`}
              onClick={() => {
                setActiveButton(item.label);
                setIsMobileSidebarOpen(false);
              }}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );

  return (
    <HomeLayout>
      <div className="flex justify-center items-center relative top-[-5rem] z-50">
        <div className="min-h-screen bg-white lg:w-[90vw] rounded-3xl shadow-lg">
          {/* Mobile Sidebar Overlay */}
          {isMobile && isMobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          <div className="flex">
            {/* Desktop Sidebar */}
            {!isMobile && <Sidebar />}

            {/* Mobile Sidebar */}
            {isMobile && isMobileSidebarOpen && (
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed right-[2rem] top-[5rem] z-50 w-[100vw] bg-red"
              >
                <Sidebar />
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900"
                >
                  <X size={20} />
                </button>
              </motion.div>
            )}

            {isMobile && (
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            )}
            {/* Main Content */}
            <motion.main
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 p-6 md:p-8 lg:p-12 max-w-4xl mx-auto w-full"
            >
              {activeComponent()}
              {/* <ProfileComponent /> */}
            </motion.main>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Profile;
