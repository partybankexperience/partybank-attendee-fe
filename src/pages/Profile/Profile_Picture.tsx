import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

const ProfilePicture: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face"
  );

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div className="flex justify-center mb-8">
      <div className="relative">
        <div
          className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Camera Button - Also triggers file input */}
        <motion.button
          type="button"
          onClick={handleImageClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
        >
          <Camera size={14} className="text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfilePicture;
