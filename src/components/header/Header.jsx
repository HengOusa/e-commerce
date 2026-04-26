import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faLocationDot,
  faCartArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  Menu,
  X,
  Search,
  Phone,
  ChevronDown,
  Globe,
  DollarSign,
} from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import Badge from "./Badge";

/* 🔹 Reusable Nav Item */
const NavItem = ({ to, children }) => {
  return (
    <li className="relative group text-gray-700 hover:text-gray-900 cursor-pointer">
      <Link to={to}>{children}</Link>
      {/* Animated underline */}
      <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-green-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
    </li>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedCurrency, setSelectedCurrency] = useState("usd");

  const languages = [
    { value: "en", label: "English" },
    { value: "km", label: "Khmer" },
  ];

  const currencies = [
    { value: "usd", label: "USD", sub: "US Dollar" },
    { value: "khr", label: "KHR", sub: "Cambodian Riel" },
  ];

  // Handle scroll effect for sticky mobile header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const mobileNavLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About Us" },
    { to: "/account", label: "My Account" },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/orders", label: "Order Tracking" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="w-full sticky top-0 z-30">
      {/* ============================================
          MOBILE HEADER (< 768px)
          ============================================ */}
      <div className="md:hidden">
        {/* Sticky Mobile Top Bar - z-index: 50 */}
        <div
          className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
            scrolled || mobileMenuOpen ? "shadow-md" : ""
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3">
            {/* Hamburger Menu */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="My Logo" className="h-8 w-auto" />
              <h3 className="text-xl font-extrabold text-green-600">OuSa</h3>
            </Link>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>
              <Link
                to="/cart"
                className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <Badge icon={faCartArrowDown} count={3} />
              </Link>
            </div>
          </div>

          {/* Expandable Mobile Search */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              searchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg bg-gray-50 px-3 py-2">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  autoFocus={searchOpen}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for fixed header */}
        <div className="h-14"></div>

        {/* Mobile Menu Overlay & Drawer — with proper z-index stacking */}
        {/* Backdrop - z-index: 100 (below drawer) */}
        <div
          className={`fixed inset-0 z-[100] backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen
              ? "bg-black/50 opacity-100 pointer-events-auto"
              : "bg-black/50 opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Drawer - z-index: 101 (above backdrop) */}
        <div
          className={`fixed top-0 left-0 bottom-0 w-[280px] max-w-[80vw] bg-white z-[101] shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src={logo} alt="My Logo" className="h-8 w-auto" />
              <h3 className="text-xl font-extrabold text-green-600">OuSa</h3>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Mobile Search in Drawer */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg bg-gray-50 px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for products..."
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="py-2">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors border-b border-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Language & Currency */}
          <div className="p-4 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Preferences
            </h4>
            <div className="space-y-4">
              {/* Language */}
              <div className="relative">
                <button
                  onClick={() => {
                    setLangOpen(!langOpen);
                    setCurrencyOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-green-200 hover:shadow-sm transition-all group text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                      Language
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {languages.find((l) => l.value === selectedLang)?.label}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors ${
                      langOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {/* Language Options */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    langOpen ? "max-h-32 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mx-1 rounded-lg border border-gray-100 bg-gray-50/80 overflow-hidden">
                    {languages.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => {
                          setSelectedLang(lang.value);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          selectedLang === lang.value
                            ? "bg-green-50 text-green-700 font-semibold"
                            : "text-gray-700 hover:bg-white"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Currency */}
              <div className="relative">
                <button
                  onClick={() => {
                    setCurrencyOpen(!currencyOpen);
                    setLangOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-green-200 hover:shadow-sm transition-all group text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                      Currency
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {
                        currencies.find((c) => c.value === selectedCurrency)
                          ?.label
                      }
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors ${
                      currencyOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {/* Currency Options */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    currencyOpen
                      ? "max-h-32 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mx-1 rounded-lg border border-gray-100 bg-gray-50/80 overflow-hidden">
                    {currencies.map((curr) => (
                      <button
                        key={curr.value}
                        onClick={() => {
                          setSelectedCurrency(curr.value);
                          setCurrencyOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          selectedCurrency === curr.value
                            ? "bg-green-50 text-green-700 font-semibold"
                            : "text-gray-700 hover:bg-white"
                        }`}
                      >
                        <span className="font-medium">{curr.label}</span>
                        <span className="text-gray-400 ml-1">— {curr.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-green-600" />
              <span>
                Need Help?{" "}
                <span className="text-green-600 font-semibold">+1800 900</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          TABLET HEADER (768px - 1279px) - z-index: 20
          ============================================ */}
      <div className="hidden md:block xl:hidden relative z-20">
        {/* Tablet Top Bar — compact single row */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 lg:px-8 py-2">
            <span className="text-gray-600 text-sm truncate max-w-[40%]">
              Trendy 25 silver jewelry 25% off today!
            </span>
            <div className="flex items-center gap-3 text-sm">
              <select className="rounded-md text-sm focus:outline-none bg-transparent">
                <option value="en">English</option>
                <option value="km">Khmer</option>
              </select>
              <span className="h-4 w-px bg-gray-300"></span>
              <select className="rounded-md text-sm focus:outline-none bg-transparent">
                <option value="usd">USD</option>
                <option value="khr">KHR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tablet Main Header — single row layout */}
        <div className="bg-white shadow-sm">
          <div className="px-4 lg:px-8 py-3">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <img src={logo} alt="My Logo" className="h-9 w-auto" />
                <h3 className="text-xl font-extrabold text-green-600">OuSa</h3>
              </Link>

              {/* Search Bar — takes remaining space */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg h-11 flex-1 min-w-0">
                <div className="hidden md:block lg:hidden flex-shrink-0">
                  <CategoryDropdown />
                </div>
                <div className="hidden lg:block flex-shrink-0">
                  <CategoryDropdown />
                </div>
                <span className="h-6 w-px bg-gray-300 hidden md:block"></span>
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="flex-1 px-3 py-2 focus:outline-none text-sm min-w-0 bg-transparent"
                />
                <button
                  type="button"
                  aria-label="Search"
                  className="p-2.5 rounded-r-lg bg-green-50 hover:bg-green-100 transition-colors flex-shrink-0"
                >
                  <Search className="w-5 h-5 text-green-600" />
                </button>
              </div>

              {/* Location Selector — desktop-ish */}
              <div className="hidden lg:flex items-center gap-1.5 border border-gray-300 rounded-md px-2.5 py-2 flex-shrink-0">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-500 text-sm"
                />
                <select className="text-sm focus:outline-none bg-transparent">
                  <option value="">Location</option>
                  <option value="us">United States</option>
                  <option value="kh">Cambodia</option>
                </select>
              </div>

              {/* Icon Actions — horizontal */}
              <div className="flex items-center gap-4 lg:gap-5 flex-shrink-0">
                <Link
                  to="/wishlist"
                  className="flex flex-col items-center gap-0.5 hover:text-green-600 transition-colors group"
                >
                  <Badge icon={faHeart} count={5} />
                  <span className="text-[11px] text-gray-700 group-hover:text-green-600">
                    Wishlist
                  </span>
                </Link>
                <Link
                  to="/cart"
                  className="flex flex-col items-center gap-0.5 hover:text-green-600 transition-colors group"
                >
                  <Badge icon={faCartArrowDown} count={3} />
                  <span className="text-[11px] text-gray-700 group-hover:text-green-600">
                    Cart
                  </span>
                </Link>
                <Link
                  to="/account"
                  className="flex flex-col items-center gap-0.5 hover:text-green-600 transition-colors group"
                >
                  <Badge icon={faUser} />
                  <span className="text-[11px] text-gray-700 group-hover:text-green-600">
                    Account
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          DESKTOP HEADER (≥ 1280px) - z-index: 25
          ============================================ */}
      <div className="hidden xl:block w-full bg-white shadow-sm border border-gray-300 relative z-25">
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
            <select className="rounded-md text-sm focus:outline-none ring-none bg-transparent">
              <option value="en">English</option>
              <option value="es">Khmer</option>
            </select>
            <span className="h-4 w-px bg-gray-300"></span>
            <select className="rounded-md text-sm focus:outline-none ring-none bg-transparent">
              <option value="en">USD</option>
              <option value="es">KHR</option>
            </select>
          </ul>
        </div>

        {/* 🔹 Bottom Header (logo / search / cart) */}
        <div className="w-full h-20 bg-white flex items-center justify-between gap-10 px-10">
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logo} alt="My Logo" className="h-30" />
            <h3 className="text-3xl font-extrabold text-green-600">OuSa</h3>
          </Link>

          <div className="flex items-center gap-4 border border-gray-300 rounded-md h-12 flex-1 max-w-2xl">
            <CategoryDropdown />
            <span className="h-4 w-px bg-gray-300"></span>
            <input
              type="text"
              placeholder="Search for products..."
              className="px-4 py-2 focus:outline-none rounded-l-md text-sm flex-1"
            />
            <button
              type="button"
              aria-label="Search"
              className="p-2 rounded-full hover:bg-green-50 transition-colors"
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

          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-2 py-2 flex-shrink-0">
            <FontAwesomeIcon icon={faLocationDot} className="text-gray-500" />
            <select
              name=""
              id="location"
              className="rounded-md text-sm focus:outline-none ring-none bg-transparent"
            >
              <option value="">Select Location</option>
              <option value="us">United States</option>
              <option value="kh">Cambodia</option>
            </select>
          </div>

          <div className="flex justify-center items-center gap-5 flex-shrink-0">
            <Link
              to="/wishlist"
              className="flex items-end gap-1 hover:text-green-600 transition-colors"
            >
              <Badge icon={faHeart} count={5} />
              <span className="text-sm text-gray-700">Wishlist</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-end gap-1 hover:text-green-600 transition-colors"
            >
              <Badge icon={faCartArrowDown} count={3} />
              <span className="text-sm text-gray-700">Cart</span>
            </Link>
            <Link
              to="/account"
              className="flex items-end gap-1 hover:text-green-600 transition-colors"
            >
              <Badge icon={faUser} />
              <span className="text-sm text-gray-700">Account</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;