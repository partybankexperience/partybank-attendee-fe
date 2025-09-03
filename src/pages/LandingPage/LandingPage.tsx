import { motion } from "framer-motion";
import logo from "../../assets/images/logo.svg";
import footerLogo from "../../assets/images/landingpage/footerLogo.svg";
import floatingLogo from "../../assets/images/landingpage/floatingLogo.svg";
import pinkyvector from "../../assets/images/pinkyvector.svg";
import trad from "../../assets/images/landingpage/trad.png";
import event from "../../assets/images/landingpage/event.png";
import effect from "../../assets/images/landingpage/effect.png";
import spiral from "../../assets/images/landingpage/spiral.png";
import DefaultButton from "../../components/buttons/DefaultButton";
import { useNavigate } from "react-router";

const PartyBankLanding = () => {
  // Motion variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: { staggerChildren: 0.1 },
    },
  };

  // Shared button styles
  const btnMd = "!px-6 !py-3 !text-[15px] !font-semibold !rounded-lg";
  const btnLg = "!px-8 !py-4 !text-[16px] !font-semibold !rounded-lg";

  // Sample tiles (swap for real data anytime)
  const sampleTiles = [
    // { id: 1, title: "Afrobeats Night", imgUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
    // { id: 2, title: "Neon Rave", imgUrl: "https://images.unsplash.com/photo-1487412912498-0447578fcca8" },
    { id: 3, title: "Live Festival", imgUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3" },
    { id: 4, title: "Campus Bash", imgUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063" },
    { id: 5, title: "Friday Vibes", imgUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819" },
    { id: 6, title: "Late Night Jam", imgUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30" },
    { id: 7, title: "Beach Party", imgUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" },
    // { id: 8, title: "Summer Heat", imgUrl: "https://images.unsplash.com/photo-1514525253330-7a46d19cd819" },
  ];

  const navigate = useNavigate();

  return (
    <div className="bg-[#F8F9F9] overflow-x-hidden">
      {/* Header */}
      <header className="relative z-50 bg-white">
        <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={logo} alt="PartyBank" className="w-[3.938rem]" />
          </motion.div>

          {/* <motion.div
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Create Events</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">FAQs</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</a>
          </motion.div> */}

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DefaultButton
              onClick={() => window.open("https://preview.thepartybank.com", "_blank", "noopener,noreferrer")}
              className={btnMd}
            >
              Create Events
            </DefaultButton>
          </motion.div>
        </nav>
      </header>

      {/* HERO */}
      <div className="relative overflow-hidden">
        <section className="relative pt-16 pb-20 md:pb-28">
          {/* Decorations */}
          <img
            src={spiral}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute right-2 top-2 w-16 lg:w-40 opacity-40"
          />
          <img
            src={spiral}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -left-3 top-56 md:top-72 lg:top-52 w-16 lg:w-40 opacity-30 -scale-x-100 -rotate-12"
          />

          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 xl:px-12 relative">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.h1
                className="text-[1.75rem] sm:text-5xl lg:text-[3rem] font-semibold text-textBlack leading-tight mb-4"
                variants={fadeInUp}
              >
                Celebrations secured, <br /> Best <span className="text-primary">memories</span> deposited
              </motion.h1>

              <motion.p className="text-lg md:text-xl text-gray-600 mb-6" variants={fadeInUp}>
                Where every ticket holds a celebration.
              </motion.p>

              <DefaultButton onClick={() => navigate("/search")} className={btnLg}>
                Buy Tickets
              </DefaultButton>
            </motion.div>

            {/* Features Badge */}
            <motion.div
              className="hidden lg:block absolute top-24 right-6 xl:right-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="bg-white/95 backdrop-blur-sm text-textBlack rounded-2xl px-6 py-4 shadow-md border border-gray-100">
                <div className="mb-3 flex items-center gap-2">
                  <img src={pinkyvector} alt="" className="w-7" />
                  <span className="text-sm font-semibold">Simple pricing</span>
                </div>
                <p className="text-sm leading-5">5% + ₦100 for paid tickets.</p>
                <p className="text-sm leading-5">Free for free tickets.</p>
                <p className="text-sm leading-5">No hidden charges.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* IMAGE STRIP — short → tall → short → tall … */}
        <section className="relative mt-6">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 xl:px-12">
            <div className="relative overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <ul className="flex items-end gap-3 md:gap-4">
                {sampleTiles.map((t, i) => {
                  const isTall = i % 2 === 1; // alternate strictly
                  const heightCls = isTall ? "h-64 sm:h-72 lg:h-80" : "h-40 sm:h-48 lg:h-56";
                  return (
                    <li key={t.id} className="snap-start shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`relative ${heightCls} w-40 sm:w-48 lg:w-56 rounded-xl overflow-hidden border border-[#EAEAEA] bg-white`}
                        title={t.title}
                      >
                        <img
                          src={t.imgUrl}
                          alt={t.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-2 text-white text-xs sm:text-sm font-medium bg-gradient-to-t from-black/50 to-transparent">
                          {t.title}
                        </div>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
              <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent hidden sm:block" />
            </div>
          </div>
        </section>
      </div>

      {/* Statistics Section (equal-height, clean, captioned) */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 xl:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* LEFT COLUMN */}
            <motion.div
              className="flex flex-col h-full space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              {/* Top row: two cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <motion.div
                  className="bg-[#FFF2F4] rounded-[20px] p-6 h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-[40px] lg:text-[35px] font-bold text-primary">
                    1000+
                  </p>
                  <p className="text-[24px] lg:text-[16px] font-semibold text-textBlack">
                    Partybankers
                  </p>
                  <p className="text-[16px] font-medium text-[#A7A5A6] mt-6">
                    Experience seamless discovery of the best events to attend
                  </p>
                </motion.div>

                <motion.div
                  className="bg-[#FFF2F4] rounded-[20px] p-6 h-full flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                >
                  <img src={logo} alt="PartyBank" className="w-[6.938rem] lg:w-[5rem] mb-6" />
                  <DefaultButton className={btnMd}>
                    Explore Tickets
                  </DefaultButton>
                </motion.div>
              </div>

              {/* Memories */}
              <motion.div
                className="bg-[#FFF2F4] rounded-[20px] p-8 text-textBlack relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <img
                  src={spiral}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute right-2 bottom-2 rotate-[55deg] w-[4.938rem] lg:w-[7rem] opacity-80"
                />
                <div className="relative">
                  <p className="text-3xl lg:text-[35px] font-semibold mb-4 pt-2">
                    More than memories created
                  </p>
                  <p className="text-lg lg:text-[16px] opacity-90 text-[#A7A5A6]">
                    Stay in the loop with the hottest events happening daily on Partybank.
                    Don&apos;t miss the chance to discover unforgettable experiences and
                    exciting moments, wherever you are!
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN — matches LEFT height on lg+, with caption */}
            <motion.div
              className="h-full"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative h-full min-h-[22rem] lg:min-h-0 rounded-[20px] overflow-hidden">
                <div
                  className="absolute inset-0 bg-center bg-cover"
                  style={{ backgroundImage: `url(${trad})` }}
                  role="img"
                  aria-label="Party scene"
                />
                <div className="absolute inset-x-0 bottom-0 h-32 md:h-40 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                <p className="absolute left-5 bottom-5 md:left-6 md:bottom-6 text-white text-lg md:text-2xl font-semibold leading-snug drop-shadow-sm">
                  Bringing the fun to <br className="hidden sm:block" />
                  you anywhere you are.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Planning Dashboard Section */}
      <section className="py-16" aria-labelledby="event-dashboard-heading">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 xl:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2
              id="event-dashboard-heading"
              className="text-[28px] md:text-[36px] lg:text-[40px] font-semibold text-gray-900 mb-4"
            >
              Effortless <span className="text-primary">Event Planning</span> Dashboard
            </h2>
            <p className="text-base md:text-lg text-[#A7A5A6] mb-6 md:mb-8 max-w-3xl mx-auto">
              Easily manage and track your event from a single intuitive dashboard—plan and execute
              seamlessly in just a few steps.
            </p>
          </motion.div>

          <motion.div
            className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={event}
              alt="PartyBank Event Planning dashboard preview"
              className="w-full h-auto block"
              loading="lazy"
            />
          </motion.div>

          <motion.a
            href="https://example.com"
            className="inline-flex items-center justify-center mt-15 bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold
                       hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Create Event on PartyBank"
          >
            Create Event
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#080D18] text-white overflow-hidden">
        {/* Decorative effect (bottom-right) */}
        <img
          src={effect}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-0 bottom-0 w-[24rem] md:w-[30rem] opacity-30"
        />

        {/* Decorative floating logo (small screens) */}
        <img
          src={floatingLogo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute left-6 top-10 w-[18rem] md:w-[14rem] opacity-20 lg:hidden"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 lg:px-10 xl:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img src={footerLogo} alt="PartyBank" className="w-32 md:w-28 lg:w-28" />
            </motion.div>

            {/* Company */}
            <motion.nav
              aria-label="Company"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms and Conditions</a></li>
              </ul>
            </motion.nav>

            {/* Products */}
            <motion.nav
              aria-label="Products"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Create Event</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Attend Event</a></li>
              </ul>
            </motion.nav>

            {/* Support */}
            <motion.nav
              aria-label="Support"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Email Us</a></li>
              </ul>
            </motion.nav>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} PartyBank. All rights reserved.</p>
            <div className="hidden lg:flex items-center gap-3 opacity-70">
              <img src={floatingLogo} alt="" aria-hidden="true" className="w-24" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PartyBankLanding;
