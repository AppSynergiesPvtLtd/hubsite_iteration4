"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import {
  MdDashboard,
  MdArrowBack,
  MdAdd,
  MdRefresh,
} from "react-icons/md";
import {
  FaUsers,
  FaPoll,
  FaTasks,
  FaClipboardList,
  FaRegClock,
  FaUserPlus,
  FaListAlt,
  FaBolt,
} from "react-icons/fa";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import {
  ContactRound,
  MessageSquareQuote,
  NewspaperIcon,
  LogOut,
} from "lucide-react";
import { triggerExcel } from "@/store/adminbtnSlice";
import { signOut } from "next-auth/react";

const Layout = ({ children, isLoading = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  // State for showing logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Logout handler: clear storages and call NextAuth's signOut
  const handleLogout = async () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    await signOut({ callbackUrl: "/admin/auth/login" });
  };

  // Pre-initialize openSubmenu from sessionStorage (if available)
  const [openSubmenu, setOpenSubmenu] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("openSubmenu") || null;
    }
    return null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Retrieve header configuration from Redux.
  const adminBtn = useSelector((state) => state.adminbtn);

  // Toggle sidebar open/closed.
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleSubmenuToggle = (menuName) => {
    setOpenSubmenu((prev) => {
      const newValue = prev === menuName ? null : menuName;
      sessionStorage.setItem("openSubmenu", newValue || "");
      return newValue;
    });
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Additional dropdown logic if needed.
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Main icon mapping for top-level sidebar items.
  const iconMapping = {
    Dashboard: <MdDashboard size={20} className="mr-2" />,
    "User Management": <FaUsers size={20} className="mr-2" />,
    "Survey Taken": <FaPoll size={20} className="mr-2" />,
    "Manage Surveys": <FaTasks size={20} className="mr-2" />,
    "Contact Us": <ContactRound size={20} className="mr-2" />,
    Newsletter: <NewspaperIcon size={20} className="mr-2" />,
    Testimonials: <MessageSquareQuote size={20} className="mr-2" />,
    Logout: <LogOut size={20} className="mr-2" />,
  };

  // Icon mapping for nested submenu items.
  const subIconMapping = {
    // For Survey Taken nested options.
    Profile: <FaListAlt size={16} className="mr-2" />,
    Live: <FaBolt size={16} className="mr-2" />,
    // For Manage Surveys nested options.
    Profiling: <FaClipboardList size={16} className="mr-2" />,
    LiveSurvey: <FaRegClock size={16} className="mr-2" />,
    Onboarding: <FaUserPlus size={16} className="mr-2" />,
  };

  // Define your sidebar items.
  const sidebarItems = [
    {
      name: "dashboard",
      label: "Dashboard",
      path: "/admin",
      icon: "Dashboard",
    },
    {
      name: "User Management",
      label: "User Management",
      path: "/admin/usermanagement",
      icon: "User Management",
    },
    {
      name: "Survey Taken",
      label: "Survey Taken",
      icon: "Survey Taken",
      subItems: [
        {
          name: "Profile Survey Completions",
          label: "Profile-Survey-Completions",
          path: "/admin/survey-taken",
          icon: "Profile",
        },
        {
          name: "Live-Survey-Completions",
          label: "Live-Survey-Completions",
          path: "/admin/survey-taken-live-survey",
          icon: "Live",
        },
      ],
    },
    {
      name: "Manage Surveys",
      label: "Manage Surveys",
      icon: "Manage Surveys",
      subItems: [
        {
          name: "Profiling Surveys",
          label: "Profiling Survey",
          path: "/admin/manage-surveys/profiling-survey",
          icon: "Profiling",
        },
        {
          name: "Live Survey",
          label: "Live Survey",
          path: "/admin/manage-surveys/live-survey",
          icon: "LiveSurvey",
        },
        {
          name: "Onboarding Survey",
          label: "OnBoarding Survey",
          path: "/admin/manage-surveys/onboarding-survey",
          icon: "Onboarding",
        },
      ],
    },
    {
      name: "Contact-us",
      label: "Contact-us",
      path: "/admin/contact-us",
      icon: "Contact Us",
    },
    {
      name: "Newsletter",
      label: "NewsLetter",
      path: "/admin/newsletter",
      icon: "Newsletter",
    },
    {
      name: "Testimonials",
      label: "Testimonials",
      path: "/admin/testimonials",
      icon: "Testimonials",
    },
    {
      name: "Logout",
      label: "Logout",
      path: "", // No path since this is an action
      icon: "Logout",
    },
  ];

  return (
    <div className="poppins flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-[250px] min-h-screen md:relative `}
      >
        <div className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <Image
                  src="/navbar_logo.png"
                  alt="Logo"
                  width={120}
                  height={24}
                />
              </div>
              <button
                onClick={toggleSidebar}
                className="text-2xl md:hidden focus:outline-none"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-4 ">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  {/* Items without subItems */}
                  {!item.subItems ? (
                    item.label === "Logout" ? (
                      <div
                        className="flex rounded-lg p-2 items-center cursor-pointer text-gray-700 hover:text-[#0057A1]"
                        onClick={() => setShowLogoutModal(true)}
                      >
                        {iconMapping[item.icon] || null}
                        {item.label}
                      </div>
                    ) : (
                      <Link href={item.path} legacyBehavior>
                        <a
                          className={`flex rounded-lg  p-2 items-center cursor-pointer ${
                            router.pathname === item.path
                              ? "text-white bg-[#0057A1]"
                              : "text-gray-700 hover:text-[#0057A1]"
                          }`}
                        >
                          {iconMapping[item.icon] || null}
                          {item.label}
                        </a>
                      </Link>
                    )
                  ) : (
                    <>
                      <div
                        className={`flex justify-between items-center rounded-lg p-2 cursor-pointer ${
                          openSubmenu === item.name
                            ? "bg-gray-200"
                            : "hover:bg-gray-100"
                        } text-gray-700`}
                        onClick={() => handleSubmenuToggle(item.name)}
                      >
                        <div className="flex items-center">
                          {iconMapping[item.icon] || null}
                          {item.label}
                        </div>
                        <span>{openSubmenu === item.name ? "−" : "+"}</span>
                      </div>
                      {/* Smooth transition for nested submenu */}
                      <ul
                        className={`ml-3 space-y-2 overflow-hidden transition-all duration-300 ${
                          openSubmenu === item.name
                            ? "max-h-96 mt-2"
                            : "max-h-0 mt-0"
                        }`}
                      >
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link href={subItem.path} legacyBehavior>
                              <a
                                className={`flex rounded-lg p-2 items-center cursor-pointer ${
                                  router.pathname === subItem.path
                                    ? "text-white bg-[#0057A1]"
                                    : "text-gray-700 hover:text-[#0057A1]"
                                }`}
                              >
                                {/* Show nested icon if provided */}
                                {subItem.icon &&
                                  subIconMapping[subItem.icon] !== undefined &&
                                  subIconMapping[subItem.icon]}
                                {subItem.label}
                              </a>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-[#0057A1] text-white p-3 flex justify-between items-center">
          <div className="flex items-center">
            {/* Hamburger for mobile */}
            <button
              onClick={toggleSidebar}
              className="text-2xl md:hidden focus:outline-none"
            >
              ☰
            </button>
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="ml-2 hidden sm:block text-2xl focus:outline-none"
              title="Go Back"
            >
              <MdArrowBack size={24} />
            </button>
            {/* Header Title */}
            <h1 className="ml-2 text-[18px] md:text-[24px] font-semibold capitalize">
              {adminBtn.title || router.pathname.split("/").pop()}
            </h1>
          </div>
          <div className="flex gap-2 md:gap-4">
            {adminBtn.add && (
              <button
                className="flex items-center px-2 md:px-4 py-2 bg-white text-[#0057A1] rounded-md font-semibold hover:bg-gray-200 text-sm md:text-base"
                onClick={() => {
                  if (adminBtn.add.redirectTo) {
                    router.push(adminBtn.add.redirectTo);
                  }
                }}
              >
                <MdAdd size={20} />
                <span className="hidden md:inline ml-1">
                  {adminBtn.add.label || "Add"}
                </span>
              </button>
            )}
            {adminBtn.refresh && (
              <button
                className="flex items-center px-2 md:px-4 py-2 bg-white text-[#0057A1] rounded-md font-semibold hover:bg-gray-200 text-sm md:text-base"
                onClick={() => {
                  if (adminBtn.refresh.redirectTo) {
                    router.push(adminBtn.refresh.redirectTo);
                  }
                }}
              >
                <MdRefresh size={20} className="mr-1" />
                <span className="hidden md:inline">
                  {adminBtn.refresh.label || "Refresh"}
                </span>
              </button>
            )}
            {adminBtn.excel && (
              <button
                className="flex items-center px-2 md:px-4 py-2 bg-white text-[#0057A1] rounded-md font-semibold hover:bg-gray-200 text-sm md:text-base"
                onClick={() => {
                  if (adminBtn.excel.actionType === "GENERATE_EXCEL") {
                    dispatch(triggerExcel());
                  } else if (adminBtn.excel.redirectTo) {
                    router.push(adminBtn.excel.redirectTo);
                  }
                }}
              >
                <PiMicrosoftExcelLogo size={20} />
                <span className="hidden md:inline ml-1">
                  {adminBtn.excel.label || "Generate Excel"}
                </span>
              </button>
            )}
          </div>
        </div>
        <div className={`relative mt-6 h-full ${isLoading ? "opacity-50" : ""}`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="loader"></div>
            </div>
          )}
          {children}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          {/* Modal content */}
          <div className="relative bg-white p-6 rounded-md shadow-md z-10 w-80">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Layout);
