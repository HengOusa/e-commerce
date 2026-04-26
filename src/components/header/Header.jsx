import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faLocationDot,
  faCartArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import CategoryDropdown from "./CategoryDropdown";
import Badge from "./Badge";
/* 🔹 Reusable Nav Item */
const NavItem = ({ to, children }) => {
  const [open, setOpen] = useState(false);
  const options = [
    { value: "", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "home", label: "Home & Kitchen" },
  ];
  const [selected, setSelected] = useState(options["0"]);

  return (
    <li className="relative group text-gray-700 hover:text-gray-900 cursor-pointer">
      <Link to={to}>{children}</Link>

      {/* Animated underline */}
      <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-green-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
    </li>
  );
};

const Header = () => {
  return (
    <header>
      <div className="w-full bg-white shadow-sm border border-gray-300 hidden xl:block ">
        {/* 🔹 Top Bar */}
        <div className="border-b border-gray-300 flex items-center justify-between px-6 py-2">
          {/* LEFT MENU */}
          <ul className="flex items-center gap-4 text-sm">
            <NavItem to="/">About Us</NavItem>
            <span className="h-4 w-px bg-gray-300"></span>

            <NavItem to="/account">My Account</NavItem>
            <span className="h-4 w-px bg-gray-300"></span>

            <NavItem to="/wishlist">Wishlist</NavItem>
            <span className="h-4 w-px bg-gray-300"></span>

            <NavItem to="/orders">Order Tracking</NavItem>
          </ul>

          {/* CENTER TEXT */}
          <span className="text-gray-600 text-sm">
            Trendy 25 silver jewelry 25% off today!
          </span>

          {/* RIGHT MENU */}
          <ul className="flex items-center gap-4 text-sm">
            <li className="text-gray-700">
              Need Help?{" "}
              <span className="text-green-600 font-semibold">+1800 900</span>
            </li>

            <span className="h-4 w-px bg-gray-300"></span>

            <span className="h-4 w-px bg-gray-300"></span>
            {/* Language Selector */}
            <select className=" rounded-md text-sm focus:outline-none ring-none">
              <option value="en">English</option>
              <option value="es">Khmer</option>
            </select>
            <span className="h-4 w-px bg-gray-300"></span>
            <select className=" rounded-md text-sm focus:outline-none ring-none">
              <option className="bg-white hover:bg-gray-200" value="en">
                USD
              </option>
              <option className="bg-white hover:bg-gray-200" value="es">
                KHR
              </option>
            </select>
          </ul>
        </div>

        {/* 🔹 Bottom Header (logo / search / cart later) */}
        <div className="w-full h-20 bg-white flex items-center justify-between gap-10 px-10">
          <div className="flex items-center">
            <img src={logo} alt="My Logo" className="h-30" />
            <h3 className="text-3xl font-extrabold text-green-600">OuSa</h3>
          </div>
          <div className="flex items-center gap-4 border border-gray-300 rounded-md  h-12">
            <CategoryDropdown />
            <span className="h-4 w-px bg-gray-300"></span>
            <input
              type="text"
              placeholder="Search for products..."
              className="px-4 py-2 focus:outline-none rounded-l-md text-sm"
            />
            <button
              type="button"
              aria-label="Search"
              className="p-2 rounded-full "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 hover:text-green-500 transition cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-2 py-2 ">
            <FontAwesomeIcon icon={faLocationDot} className="text-gray-500" />
            <select
              name=""
              id="location"
              className=" rounded-md text-sm focus:outline-none ring-none"
            >
              <option value="">Select Location</option>
              <option value="us">United States</option>
              <option value="kh">Cambodia</option>
            </select>
          </div>
          <div className="flex justify-center items-center gap-5">
            <div className="flex items-end gap-1">
              <Badge icon={faHeart} count={5} />
              <span className="text-sm text-gray-700">Whislist</span>
            </div>
            <div className="flex items-end gap-1">
              <Badge icon={faHeart} count={5} />
              <span className="text-sm text-gray-700">Cart</span>
            </div>
            <div className="flex items-end gap-1">
              <Badge icon={faUser} />
              <span className="text-sm text-gray-700">Account</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
