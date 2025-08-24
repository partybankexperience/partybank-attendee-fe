import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.svg";
import footerLogo from "../../assets/images/landingpage/footerLogo.svg";
import floatingLogo from "../../assets/images/landingpage/floatingLogo.svg";
import pinkyvector from "../../assets/images/pinkyvector.svg";
import canvas from "../../assets/images/landingpage/canvas.png";
import playground from "../../assets/images/landingpage/playground.png";
import rekli from "../../assets/images/landingpage/rekli.png";
import snap from "../../assets/images/landingpage/snap.png";
import xtasy from "../../assets/images/landingpage/xtasy.png";
import trad from "../../assets/images/landingpage/trad.png";
import event from "../../assets/images/landingpage/event.png";
import effect from "../../assets/images/landingpage/effect.png";
import spiral from "../../assets/images/landingpage/spiral.png";

const PartyBankLanding = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    transition: { type: "spring", stiffness: 300 },
  };

  const data = [
    {
      id: 1,
      image: snap,
    },
    {
      id: 2,
      image: canvas,
    },
    {
      id: 3,
      image: xtasy,
    },
    {
      id: 1,
      image: playground,
    },
    {
      id: 1,
      image: rekli,
    },
  ];

  return (
    <div className="bg-[#F8F9F9]">
      {/* Header */}
      <header className="relative z-50 bg-white">
        <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <img src={logo} alt="" className="w-[3.938rem]" />
            </div>
          </motion.div>

          <motion.div
            className="hidden  items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Create Events
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              FAQs
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact Us
            </a>
          </motion.div>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button className="text-primary hover:text-red-600 font-medium transition-colors">
              Create Account
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
              Sign In
            </button>
          </motion.div>
        </nav>
      </header>

      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pb-24">
          <div className="absolute right-0 top-0">
            <img src={spiral} alt="" className="w-[4.938rem] lg:w-[10rem]" />
          </div>
          <div className="absolute left-[-1rem] top-[13rem] md:top-[19rem] lg:top-[13rem] scale-x-[-1] rotate-[-35deg]">
            <img src={spiral} alt="" className="w-[4.938rem] lg:w-[10rem]" />
          </div>
          <div className="max-w-7xl mx-auto relative">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.h1
                className="text-[1.5rem] sm:text-5xl lg:text-[3rem] font-semibold text-textBlack md:mb-4
               md:leading-12 leading-7 mb-4"
                variants={fadeInUp}
              >
                Celebrations secured, <br /> Best{" "}
                <span className="text-primary">memories</span> deposited
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 mb-4 md:mb-4"
                variants={fadeInUp}
              >
                Where every ticket holds a celebration.
              </motion.p>

              <motion.button
                className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold
               hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Buy Tickets
              </motion.button>
            </motion.div>

            {/* Features Badge */}
            <motion.div
              className="absolute top-[12rem] right-[5rem] hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div
                className="bg-white text-textBlack rounded-2xl px-7 py-4
            shadow-lg font-semibold"
              >
                <div className="mb-3">
                  <img
                    src={pinkyvector}
                    alt=""
                    className="w-[4.938rem] lg:w-[2rem]"
                  />
                </div>
                <p className="text-sm leading-5">5% + N100 for paid tickets.</p>
                <p className="text-sm leading-5">Free for free tickets.</p>
                <p className="text-sm leading-5">No hidden charges.</p>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Event Cards Section */}
        <section className="px-4 sm:px-6 lg:px-8 overflow-hidden lg:ml-[2rem] lg:mt-10 relative">
          <div className="max-w-7xl mx-auto ">
            <motion.div
              className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 items-end justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {data.map((data) => {
                const { id, image } = data;

                return (
                  <motion.div
                    key={id}
                    className=""
                    variants={scaleOnHover}
                    whileHover="whileHover"
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-[8rem] sm:w-[10rem] lg:w-[13rem]"
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </div>

      {/* Statistics Section */}
      <div className="lg:w-screen bg-white">
        <section
          className="bg-white flex justify-center items-center px-5 py-[3rem] 
            max-w-7xl mx-auto "
        >
          <div
            className="lg:flex max-w-7xl mx-auto lg:gap-[3rem] justify-center items-center
            lg:ml-[2.5rem] container bg-red relative"
          >
            {/* .................................................... */}
            <motion.div
              className=" rounded-3xl lg:w-[53.5%] relative "
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="lg:flex gap-5 w-full">
                {/* Party banker */}
                <motion.div
                  className="mb-6 bg-[#FFF2F4] py-4 px-8 rounded-[20px] lg:w-[50%]"
                  // variants={scaleOnHover}
                  // whileHover="whileHover"
                >
                  <p className="text-[40px] lg:text-[35px] font-bold text-primary mr-2 leading-14">
                    1000+
                  </p>
                  <p className="text-[24px] lg:text-[16px] font-semibold text-textBlack ">
                    Partybankers
                  </p>
                  <p className="text-[16px] lg:text-[16px] font-medium text-[#A7A5A6] mt-6">
                    Experience seamless discovery of the best events to attend
                  </p>
                </motion.div>
                {/* Explore Tickets */}
                <motion.div className="mb-6 bg-[#FFF2F4] py-4 px-8 rounded-[20px] lg:w-[50%]">
                  <div>
                    <img
                      src={logo}
                      alt=""
                      className="w-[6.938rem] lg:w-[5rem] lg:mt-3 mb-10"
                    />
                  </div>
                  <motion.button
                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Explore Tickets
                  </motion.button>
                </motion.div>
              </div>
              {/* Memories */}
              <motion.div
                className="bg-[#FFF2F4] rounded-3xl p-8 text-textBlack lg:w-full
                 flex justify-center items-center relative overflow-hidden"
                //   variants={scaleOnHover}
                //   whileHover="whileHover"
              >
                <div className="absolute right-0 bottom-0 rotate-[55deg]">
                  <img
                    src={spiral}
                    alt=""
                    className="w-[4.938rem] lg:w-[7rem]"
                  />
                </div>
                <div className="relative">
                  <p className="text-3xl lg:text-[35px] font-semibold mb-6 pt-4">
                    More than memories created
                  </p>
                  <p className="text-lg lg:text-[16px] opacity-90 mb-6 text-[#A7A5A6]">
                    Stay in the loop with the hottest events happening daily on
                    Partybank. Don't miss the chance to discover unforgettable
                    experiences and exciting moments, wherever you are!
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* .................................................... */}

            <motion.div
              className="relative lg:w-[50%] hidden lg:block lg:mr-[2rem] bg-green"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div
                className="lex items-center justify-center w-[8rem] sm:w-[10rem] lg:w-full 
                 rounded-[20px] bg-cover bg-center h-[12rem] sm:h-[16rem] md:h-[20rem] lg:h-[28rem]"
                style={{
                  backgroundImage: `url(${trad})`,

                }}
              >
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Event Planning Dashboard Section */}
      <section className="px-4 sm:px-6 lg:px-8  py-[3rem]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-4xl lg:text-[35px] font-semibold text-gray-900 mb-6">
              Effortless <span className="text-primary">Event Planning</span>{" "}
              Dashboard
            </h2>
            <p className="text-xl lg:text-[16px] text-[#A7A5A6] mb-3 max-w-3xl mx-auto">
              Easily manage and track your event from a single intuitive
              dashboard—plan and execute seamlessly in just a few steps.
            </p>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            className="relative bg-transparent rounded-2xl p-6 "
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="">
              <img src={event} alt="" className="w-full" />
            </div>
          </motion.div>

          <motion.button
            className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold
             hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Event
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-[#080D18] text-white px-4 sm:px-6 lg:px-8 py-16 relative 
      overflow-hidden"
      >
        {/* Effect */}
        <div
          className="mb-3 absolute right-0 bottom-0
          opacity-40    "
        >
          <img src={effect} alt="" className="w-[38rem] md:w-[30rem]" />
        </div>

        {/* Floating */}
        <div
          className="mb-3 absolute left-[3rem] md:left-[2rem] top-[10rem] md:top-[2rem]
         lg:hidden opacity-40"
        >
          <img src={floatingLogo} alt="" className="w-[38rem] md:w-[20rem]" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="md:flex md:gap-[5rem] lg:gap-8 justify-center">
            <div className=" md:flex lg:w-[55%] relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                <div className="mb-3">
                  <img
                    src={footerLogo}
                    alt=""
                    className="w-[8rem] sm:w-[10rem] lg:w-[7rem]"
                  />
                </div>
              </motion.div>

              {/* Floating Logo */}
              <div
                className="hidden lg:flex md:absolute md:top-[3rem] md:left-[5rem] lg:top-[3.8rem] 
              lg:left-[10rem] lg:w-[50vw] "
              >
                <div className="mb-3">
                  <img
                    src={floatingLogo}
                    alt=""
                    className="w-[8rem] sm:w-[10rem] lg:w-[17rem]"
                  />
                </div>
                <motion.div
                  className="mt-12 pt-8 text-center text-gray-400 hidden lg:block w-[20rem] relative top-[1.3rem]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 2.0 }}
                >
                  © 2025 PartyBank. All rights reserved.
                </motion.div>
              </div>
            </div>

            {/* Links */}
            <div className="md:flex gap-[3rem] lg:ml-[2rem] space-y-4 md:space-y-0 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.7 }}
              >
                <h3 className="font-semibold mb-4">Company</h3>
                <div className="space-y-2">
                  <div className="text-gray-400 hover:text-white cursor-pointer">
                    About Us
                  </div>
                  <div className="text-gray-400 hover:text-white cursor-pointer">
                    Privacy Policy
                  </div>
                  <div className="text-gray-400 hover:text-white cursor-pointer">
                    Terms and Conditions
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                <h3 className="font-semibold mb-4">Products</h3>
                <div className="space-y-2">
                  <div className="text-gray-400 hover:text-white cursor-pointer">
                    Create Event
                  </div>
                  <div className="text-gray-400 hover:text-white cursor-pointer">
                    Attend Event
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.9 }}
              >
                <h3 className="font-semibold mb-4">Support</h3>
                <div className="space-y-2">
                  <div className="text-gray-400 hover:text-white cursor-pointer">
                    Email Us
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.0 }}
          >
            © 2025 PartyBank. All rights reserved.
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default PartyBankLanding;
