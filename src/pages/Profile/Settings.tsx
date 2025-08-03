import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Eye, EyeOff, Check, X, CreditCard } from 'lucide-react';

const Profile_Settings = () => {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('mypassword123');
  const [tempPassword, setTempPassword] = useState('');
const passwordInputRef = useRef<HTMLInputElement>(null);;

  // Sample payment methods data
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      lastFour: '8112',
      fullNumber: 'xxxx xxxx xxxx 8112'
    }
  ]);

  const handleChangePasswordClick = () => {
    setIsEditingPassword(true);
    setTempPassword(password);
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 100);
  };

  const handleSavePassword = () => {
    setPassword(tempPassword);
    setIsEditingPassword(false);
    setShowPassword(false);
  };

  const handleCancelPassword = () => {
    setTempPassword(password);
    setIsEditingPassword(false);
    setShowPassword(false);
  };

  const handleDeletePaymentMethod = (id:number) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const getCardIcon = (type:string) => {
    switch (type.toLowerCase()) {
      case 'visa':
        return (
          <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
            VISA
          </div>
        );
      case 'mastercard':
        return (
          <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            MC
          </div>
        );
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-white w-full p-4 md:p-6 lg:p-8">
      <motion.div 
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
          variants={itemVariants}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Settings
          </h1>
          
          <motion.button
            onClick={handleChangePasswordClick}
            disabled={isEditingPassword}
            className={`inline-flex items-center px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              isEditingPassword
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-red-500 text-red-500 hover:bg-red-50 active:bg-red-100'
            }`}
            variants={buttonVariants}
            initial="idle"
            whileHover={!isEditingPassword ? "hover" : "idle"}
            whileTap={!isEditingPassword ? "tap" : "idle"}
            aria-label="Change password"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Change Password
          </motion.button>
        </motion.div>

        {/* Password Section */}
        <motion.section 
          className="mb-8"
          variants={itemVariants}
          aria-labelledby="password-heading"
        >
          <h2 id="password-heading" className="text-lg font-semibold text-gray-900 mb-4">
            Password
          </h2>
          
          <div className="relative">
            <motion.div
              className="relative"
              layout
              transition={{ duration: 0.3 }}
            >
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                value={isEditingPassword ? tempPassword : '••••••••'}
                onChange={(e) => setTempPassword(e.target.value)}
                readOnly={!isEditingPassword}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                  isEditingPassword
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 bg-white'
                    : 'border-gray-200 bg-gray-50 cursor-default'
                }`}
                placeholder="Enter your password"
                aria-label="Password input"
                aria-describedby={isEditingPassword ? "password-help" : undefined}
              />
              
              <AnimatePresence>
                {isEditingPassword && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {isEditingPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 mt-3"
                >
                  <motion.button
                    onClick={handleSavePassword}
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="Save password"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </motion.button>
                  
                  <motion.button
                    onClick={handleCancelPassword}
                    className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="Cancel password change"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {isEditingPassword && (
              <p id="password-help" className="text-sm text-gray-500 mt-2">
                Enter your new password and click Save to update it.
              </p>
            )}
          </div>
        </motion.section>

        {/* Payment Methods Section */}
        <motion.section 
          variants={itemVariants}
          aria-labelledby="payment-methods-heading"
        >
          <h2 id="payment-methods-heading" className="text-lg font-semibold text-gray-900 mb-4">
            Payment Methods
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.95,
                    x: -100,
                    transition: { duration: 0.3 }
                  }}
                  className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200 bg-white"
                  role="listitem"
                  aria-label={`${method.type} card ending in ${method.lastFour}`}
                >
                  <div className="flex items-center space-x-3">
                    {getCardIcon(method.type)}
                    <span className="text-gray-700 font-medium">
                      {method.fullNumber}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                      aria-label={`Edit ${method.type} card ending in ${method.lastFour}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                      aria-label={`Delete ${method.type} card ending in ${method.lastFour}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {paymentMethods.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 text-gray-500"
              >
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No payment methods added yet.</p>
              </motion.div>
            )}
          </div>
          
          <motion.button
            className="mt-4 w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            aria-label="Add new payment method"
          >
            <motion.div
              className="w-5 h-5 mr-2"
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              +
            </motion.div>
            Add Payment Method
          </motion.button>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Profile_Settings;