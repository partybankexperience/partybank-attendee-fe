
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { FiUser } from "react-icons/fi";
import backgroundImage from "../../assets/images/backgroundImage.svg";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

import React from "react";

import DefaultButton from "../buttons/DefaultButton";
import { useAuthStore } from "../../stores/useAuthStore";
import { ToastContainer } from "react-toastify";
import { Storage } from "../../stores/InAppStorage";

const HomeLayout = ({ children }: React.PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const {setCheckoutStage} = useAuthStore();
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x)
    .map((segment) => capitalize(segment));
    const isEventDetailsPage = location.pathname.startsWith("/event-details/");
    const slug = isEventDetailsPage ? pathnames[pathnames.length - 1] : "";
    const formatSlug = (text: string) =>
        text.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <>
    <ToastContainer/>
      {/* Small sidebar */}
      <nav
        className="md:hidden bg-white py-[1rem] px-[1.2rem] flex gap-[1rem] items-center"
        aria-label="Mobile navigation"
      >
        <button
          onClick={() => navigate(-1)}
          className="text-black text-[1.2rem] flex items-center"
          aria-label="Go back to previous page"
        >
          <FaArrowLeft className="mr-[0.5rem]" />
          {isEventDetailsPage ? formatSlug(slug) : pathnames.join(" / ")}

        </button>
      </nav>

      {/* Large header nav */}
      <nav
        className="hidden md:flex px-[9rem] bg-white py-[0.9rem] items-center justify-between w-[100vw]"
        aria-label="Main site navigation"
      >
        <img src={logo} alt="PartyBank Attendee Logo" className="w-[4rem]" />

        <ul className="flex gap-[2.5rem] text-black text-[1rem] items-center">
          <li>
            <a href="/" aria-label="About PartyBank">About Us</a>
          </li>
          <li>
            <a href="/about" aria-label="Frequently Asked Questions">FAQs</a>
          </li>
          <li>
            <a href="/contact" aria-label="Contact PartyBank">Contact Us</a>
          </li>
        </ul>
        {user ? (
  <div className="flex gap-[1.5rem] items-center">
    {/* Profile icon link */}
    <a
      href="/profile"
      className="text-primary text-[1.4rem]"
      aria-label="Go to your profile"
    >
      <FiUser />
    </a>

    {/* Logout button */}
    <DefaultButton onClick={() => logout()} >
    Sign Out
    </DefaultButton>
  </div>
) : (
  <div className="flex gap-[1.5rem] items-center">
    {/* <a href="/signup" className="text-primary" aria-label="Create Account">
      Create Account
    </a> */}
    <button
      onClick={() => {
      // Storage.setItem("checkoutStage", null);
      setCheckoutStage('');
      navigate("/login");
      }}
      aria-label="Sign in to your account"
      className="font-bold rounded-[8px] text-[16px] w-fit cursor-pointer disabled:cursor-not-allowed disabled:border-mutedBlueGrey bg-primary text-white hover:bg-pink focus:border-darkRed py-[10px] px-[32px]"
    >
      Sign In
    </button>
    {/* <a
      href="/login"
      aria-label="Sign in to your account"
      className="font-bold rounded-[8px] text-[16px] w-fit cursor-pointer disabled:cursor-not-allowed disabled:border-mutedBlueGrey bg-primary text-white hover:bg-pink focus:border-darkRed py-[10px] px-[32px]"
    >
      Sign In
    </a> */}
  </div>
)}
      </nav>

      {/* Background banner */}
      <div className="relative w-[100vw] h-[11.8rem] px-[9rem] overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          role="img"
          aria-label="PartyBank background banner"
        />
        <div className="absolute inset-0 bg-[rgba(8,13,24,0.8)] z-10" />

        {/* Breadcrumbs */}
        <nav
          className="hidden relative z-20 mt-[3rem] md:flex gap-[6px] text-[.9rem] items-center text-white"
          aria-label="Breadcrumb"
        >
          <a href="/" className="text-grey400">Home</a>
          <IoIosArrowForward className="text-[1.1rem]" />
          {/* {pathnames.length > 0 && <IoIosArrowForward className="text-[1.1rem]" />}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return (
              <span key={name} className="flex items-center gap-[6px]">
                {isLast ? (
                  <span className="text-white" aria-current="page">{name}</span>
                ) : (
                  <>
                    <a href={routeTo} className="text-grey400">{name}</a>
                    <IoIosArrowForward className="text-[1.1rem]" />
                  </>
                )}
              </span>
            );
          })} */}
          {isEventDetailsPage && slug && (
    <>
      <span className="text-white" aria-current="page">{formatSlug(slug)}</span>
    </>
  )}
  {!isEventDetailsPage && pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
    const isLast = index === pathnames.length - 1;
    return (
      <span key={name} className="flex items-center gap-[6px]">
        {isLast ? (
          <span className="text-white" aria-current="page">{name}</span>
        ) : (
          <>
            <a href={routeTo} className="text-grey400">{name}</a>
            <IoIosArrowForward className="text-[1.1rem]" />
          </>
        )}
        
      </span>
    );
  })}
        </nav>
      </div>

      {children}
    </>
  );
};

export default HomeLayout;
