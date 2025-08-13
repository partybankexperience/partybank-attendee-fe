import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, ArrowLeft } from "lucide-react";
import ProfilePicture from "../Profile/Profile_Picture";

const ProfileComponent = () => {
  const [formData, setFormData] = useState({
    firstName: "Jane",
    lastName: "Cooper",
    email: "janecooper02@gmail.com",
    gender: "male",
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  interface FormData {
    label: string;
    name: string;
    type: string;
    value: string;
    placeholder: string;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const ProfileHeader = () => (
    <motion.header
      variants={itemVariants}
      className="flex items-center justify-between mb-8"
    >
      {isMobile && (
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors hidden"
        >
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
      >
        <Edit3 size={16} />
        <span className="font-medium">Edit</span>
      </motion.button>
    </motion.header>
  );

//   const ProfilePicture = () => (
//     <motion.div variants={itemVariants} className="flex justify-center mb-8">
//       <div className="relative">
//         <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
//           <img
//             src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face"
//             alt="Profile"
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <label htmlFor="profile_pics">
//         <input type="file" name="profile_pics" />
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
//         >
//           <Camera size={14} className="text-white" />
//         </motion.button>
//         </label>
//       </div>
//     </motion.div>
//   );

  const FormField = ({
    label,
    name,
    type = "text",
    value,
    placeholder,
  }: FormData) => (
    <motion.div variants={itemVariants} className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2
         focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50"
      />
    </motion.div>
  );

  const GenderSelection = () => (
    <motion.div variants={itemVariants} className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Gender
      </label>
      <div className="flex gap-6">
        {["male", "female"].map((gender) => (
          <label
            key={gender}
            className="flex items-center cursor-pointer group"
          >
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={formData.gender === gender}
              onChange={handleInputChange}
              className="sr-only"
              disabled
            />
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-all duration-200 ${
                formData.gender === gender
                  ? "border-red-500 bg-red-500"
                  : "border-gray-300 group-hover:border-red-300"
              }`}
            >
              {formData.gender === gender && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <span className="text-gray-700 capitalize font-medium group-hover:text-gray-900 transition-colors">
              {gender}
            </span>
          </label>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white w-[90vw] md:w-[50vw]">
      <div className="flex">
        {/* Main Content */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-6 md:p-8 lg:p-12 max-w-4xl mx-auto w-full"
        >
          <ProfileHeader />
          {/* <ProfilePicture /> */}
          <ProfilePicture/>

          <motion.form className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                placeholder="Enter first name"
                type="text"
              />
              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                placeholder="Enter last name"
                type="text"
              />
            </div>

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              placeholder="Enter email address"
            />

            <GenderSelection />
            {/* <RadioButton
              label="Gender"
              value="male"
              name="Ola"
              onChange={() => console.log("Hi")}
              extraText="Olami"
              disabled={true}
              checked={true}
            /> */}
          </motion.form>
        </motion.main>
      </div>
    </div>
  );
};

export default ProfileComponent;
