import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { FiUser } from "react-icons/fi";

import logo from "../../assets/images/logo.svg";
import backgroundImage from "../../assets/images/backgroundImage.svg";

import DefaultButton from "../buttons/DefaultButton";
import { useAuthStore } from "../../stores/useAuthStore";
import { ToastContainer } from "react-toastify";

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const titleizeSlug = (text: string) =>
  text.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const HomeLayout = ({ children }: React.PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, setCheckoutStage } = useAuthStore();

  const pathname = location.pathname;
  const segments = pathname.split("/").filter(Boolean);

  const isEventDetailsPage = pathname.startsWith("/event-details/");
  const slug = isEventDetailsPage ? segments[1] || "" : "";

  // Build canonical breadcrumbs:
  // - "/"                      => [Home]
  // - "/search"                => [Home, Search]
  // - "/event-details/:slug"   => [Home, Search, <Slug Titleized>]
  // - generic fallback         => [Home, ...segments]
  const crumbs: Array<{ label: string; to?: string; current?: boolean }> = [];

  // Always start with Home
  crumbs.push({ label: "Home", to: "/" });

  if (pathname === "/") {
    crumbs[0].current = true;
  } else if (pathname === "/search") {
    crumbs.push({ label: "Search", current: true });
  } else if (isEventDetailsPage && slug) {
    crumbs.push({ label: "Search", to: "/search" });
    crumbs.push({ label: titleizeSlug(slug), current: true });
  } else {
    // Fallback: build from segments, title-cased
    let accPath = "";
    segments.forEach((seg, i) => {
      accPath += `/${seg}`;
      const isLast = i === segments.length - 1;
      crumbs.push({
        label: capitalize(seg),
        to: isLast ? undefined : accPath,
        current: isLast,
      });
    });
  }

  // Mobile top bar label = last crumb label (current page)
  const mobileLabel = crumbs[crumbs.length - 1]?.label || "Home";

  return (
    <>
      <ToastContainer />

      {/* Mobile top bar (Back + current page label) */}
      <nav
        className="md:hidden bg-white py-4 px-5 flex gap-4 items-center sticky top-0 z-50 border-b border-gray-100"
        aria-label="Mobile navigation"
      >
        <button
          onClick={() => navigate(-1)}
          className="text-black text-[1.1rem] flex items-center"
          aria-label="Go back to previous page"
        >
          <FaArrowLeft className="mr-2" />
          <span className="truncate max-w-[70vw]">{mobileLabel}</span>
        </button>
      </nav>

      {/* Desktop header */}
      <header className="hidden md:block bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 xl:px-12 py-3 md:py-4 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" aria-label="PartyBank home">
            <img src={logo} alt="PartyBank" className="w-16 md:w-16" />
          </Link>

          {/* Primary nav (add items when needed) */}
          {/* <ul className="hidden lg:flex items-center gap-8 text-[15px]">
            <li><Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</Link></li>
            <li><Link to="/create" className="text-gray-600 hover:text-gray-900 transition-colors">Create Events</Link></li>
            <li><Link to="/faqs" className="text-gray-600 hover:text-gray-900 transition-colors">FAQs</Link></li>
            <li><Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</Link></li>
          </ul> */}

          {/* Right actions */}
          {user ? (
            <div className="flex items-center gap-5">
              <Link
                to="/profile"
                className="text-primary text-[1.35rem] hover:opacity-90 transition-opacity"
                aria-label="Go to your profile"
                title="Profile"
              >
                <FiUser />
              </Link>
              <DefaultButton onClick={logout} className="!px-5 !py-2.5 !text-[15px] !font-semibold !rounded-lg">
                Sign Out
              </DefaultButton>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <DefaultButton
                onClick={() => {
                  setCheckoutStage("");
                  navigate("/login");
                }}
                className="!px-5 !py-2.5 !text-[15px] !font-semibold !rounded-lg"
              >
                Sign In
              </DefaultButton>
            </div>
          )}
        </div>
      </header>

      {/* Banner / Breadcrumb area */}
      <div className="relative w-full h-[11.8rem]">
        {/* Background */}
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
        {/* Overlay */}
        <div className="absolute inset-0 bg-[rgba(8,13,24,0.8)] z-10" />

        {/* Breadcrumbs (desktop) — moved UP with items-start + pt-6 */}
        <nav className="hidden md:flex relative z-20 h-full items-start" aria-label="Breadcrumb">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 xl:px-12 w-full pt-6">
            <ol className="flex flex-wrap items-center gap-2 text-white/90 text-[0.95rem]">
              {crumbs.map((c, i) => {
                const isLast = i === crumbs.length - 1;
                return (
                  <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                    {c.to && !isLast ? (
                      <Link to={c.to} className="text-gray-300 hover:text-white transition-colors">
                        {c.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-white" : "text-gray-300"} aria-current={isLast ? "page" : undefined}>
                        {c.label}
                      </span>
                    )}
                    {!isLast && <IoIosArrowForward className="text-[1.1rem] text-gray-400" />}
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>
      </div>

      {/* Page content */}
      <main className="min-h-[40vh]">{children}</main>
    </>
  );
};

export default HomeLayout;
