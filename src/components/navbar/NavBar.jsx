import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronRight,
  Grid3X3,
  Home,
  ShoppingBag,
  Users,
  Newspaper,
  FileText,
  Phone,
} from "lucide-react";
import NavItem from "./NavItem";
import DropdownMenu from "./DropdownMenu";

const NavBar = () => {
  const [category, setCategory] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const categories = [
    { value: "", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "home", label: "Home & Kitchen" },
    { value: "books", label: "Books" },
    { value: "sports", label: "Sports" },
    { value: "beauty", label: "Beauty" },
  ];

  // Dropdown content for each nav item
  const homeDropdown = [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: "/dashboard" },
    { label: "New Arrivals", link: "/new-arrivals" },
    { label: "Trending", link: "/trending" },
    { label: "Help Center", link: "/help" },
  ];

  const shopDropdown = [
    { label: "Men's Fashion", link: "/shop/mens-fashion" },
    { label: "Women's Fashion", link: "/shop/womens-fashion" },
    { label: "Accessories", link: "/shop/accessories" },
    { label: "Footwear", link: "/shop/footwear" },
    { label: "Best Sellers", link: "/shop/best-sellers" },
    { label: "All Products", link: "/shop/all-products", isHighlight: true },
  ];

  const vendorsDropdown = [
    { label: "ElectroHub", link: "/vendors/electrohub", icon: "fa-store" },
    {
      label: "Fashion World",
      link: "/vendors/fashion-world",
      icon: "fa-tshirt",
    },
    { label: "HomeStyle", link: "/vendors/homestyle", icon: "fa-couch" },
    { label: "GadgetGuru", link: "/vendors/gadgetguru", icon: "fa-microchip" },
    { label: "Become a vendor", link: "/become-vendor", isSpecial: true },
  ];

  // Mega menu structure
  const megaMenuContent = {
    columns: [
      {
        title: "Electronics",
        items: [
          { label: "Smartphones", link: "/electronics/smartphones" },
          { label: "Laptops", link: "/electronics/laptops" },
          { label: "Headphones", link: "/electronics/headphones" },
          { label: "Smartwatches", link: "/electronics/smartwatches" },
        ],
      },
      {
        title: "Fashion",
        items: [
          { label: "Men's Clothing", link: "/fashion/men" },
          { label: "Women's Clothing", link: "/fashion/women" },
          { label: "Kids", link: "/fashion/kids" },
          { label: "Bags & Shoes", link: "/fashion/bags-shoes" },
        ],
      },
      {
        title: "Home & Living",
        items: [
          { label: "Furniture", link: "/home/furniture" },
          { label: "Decor", link: "/home/decor" },
          { label: "Kitchen", link: "/home/kitchen" },
          { label: "Lighting", link: "/home/lighting" },
        ],
      },
      {
        title: "Offers",
        items: [
          { label: "Flash Sale", link: "/sale/flash", isHot: true },
          { label: "Gift Cards", link: "/gift-cards" },
          { label: "Coupons", link: "/coupons" },
          { label: "Clearance", link: "/clearance" },
        ],
        special: "Up to 70% off",
      },
    ],
  };

  const blogDropdown = [
    {
      label: "Tech trends 2025",
      link: "/blog/tech-trends",
      description: "3 min read",
    },
    {
      label: "Style guide",
      link: "/blog/style-guide",
      description: "5 min read",
    },
    {
      label: "Home decor ideas",
      link: "/blog/home-decor",
      description: "4 min read",
    },
    { label: "View all articles", link: "/blog", isViewAll: true },
  ];

  const pageDropdown = [
    { label: "About Us", link: "/about" },
    { label: "FAQs", link: "/faqs" },
    { label: "Terms & Conditions", link: "/terms" },
    { label: "Privacy Policy", link: "/privacy" },
    { label: "Sitemap", link: "/sitemap" },
  ];

  const contactInfo = {
    email: "support@ousa.com",
    phone: "+1 (555) 123-4567",
    whatsapp: "+1 (555) 123-4567",
    social: [
      { icon: "fa-facebook", link: "https://facebook.com" },
      { icon: "fa-twitter", link: "https://twitter.com" },
      { icon: "fa-instagram", link: "https://instagram.com" },
    ],
  };

  // Mobile accordion sections
  const mobileSections = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      items: homeDropdown,
    },
    {
      id: "shop",
      label: "Shop",
      icon: ShoppingBag,
      items: shopDropdown,
    },
    {
      id: "vendors",
      label: "Vendors",
      icon: Users,
      items: vendorsDropdown,
    },
    {
      id: "mega",
      label: "Categories",
      icon: Grid3X3,
      isMega: true,
      columns: megaMenuContent.columns,
    },
    {
      id: "blog",
      label: "Blog",
      icon: Newspaper,
      items: blogDropdown,
    },
    {
      id: "page",
      label: "Pages",
      icon: FileText,
      items: pageDropdown,
    },
    {
      id: "contact",
      label: "Contact",
      icon: Phone,
      isContact: true,
      info: contactInfo,
    },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <>
      {/* ============================================
          MOBILE NAVBAR (< 768px)
          ============================================ */}
      <div className="md:hidden">
        {/* Mobile Category Bar - z-index: 45 (below mobile menu but above content) */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-29 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-2.5">
            {/* Browse Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>

            {/* Horizontal Scrollable Categories */}
            <div className="flex-1 overflow-x-auto hide-scrollbar">
              <div className="flex items-center gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.value}
                    to={cat.value ? `/category/${cat.value}` : "/shop"}
                    className="flex-shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Menu Overlay - Fixed z-index hierarchy */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop - z-index: 100 (below drawer) */}
            <div
              className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-up Panel - z-index: 101 (above backdrop) */}
            <div className="fixed inset-x-0 bottom-0 top-[20%] bg-white z-[101] rounded-t-2xl shadow-2xl overflow-hidden flex flex-col animate-navbar-slide">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-800">Browse</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Category Pills */}
                <div className="p-4 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.value}
                        to={cat.value ? `/category/${cat.value}` : "/shop"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-full text-sm font-medium transition-colors"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Accordion Sections */}
                <div className="py-2">
                  {mobileSections.map((section) => {
                    const Icon = section.icon;
                    const isExpanded = expandedSection === section.id;

                    return (
                      <div key={section.id} className="border-b border-gray-50">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-800">
                              {section.label}
                            </span>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {/* Expanded Content */}
                        <div
                          className={`overflow-hidden transition-all duration-200 ${
                            isExpanded
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          {section.isMega && section.columns ? (
                            <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                              {section.columns.map((col, idx) => (
                                <div
                                  key={idx}
                                  className="bg-gray-50 rounded-lg p-3"
                                >
                                  <h4 className="text-xs font-bold text-gray-700 mb-2">
                                    {col.title}
                                  </h4>
                                  <ul className="space-y-1.5">
                                    {col.items.map((item, i) => (
                                      <li key={i}>
                                        <Link
                                          to={item.link}
                                          onClick={() =>
                                            setMobileMenuOpen(false)
                                          }
                                          className={`text-xs ${
                                            item.isHot
                                              ? "text-red-500 font-medium"
                                              : "text-gray-600 hover:text-green-600"
                                          } transition-colors`}
                                        >
                                          {item.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : section.isContact && section.info ? (
                            <div className="px-4 pb-4 space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="fas fa-envelope text-green-500 w-5"></i>
                                <span>{section.info.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="fas fa-phone-alt text-green-500 w-5"></i>
                                <span>{section.info.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="fab fa-whatsapp text-green-600 w-5"></i>
                                <span>WhatsApp chat</span>
                              </div>
                              <div className="flex gap-3 pt-2">
                                {section.info.social.map((s, i) => (
                                  <a
                                    key={i}
                                    href={s.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-green-600 transition"
                                  >
                                    <i className={`fab ${s.icon} text-lg`}></i>
                                  </a>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="px-4 pb-2">
                              {section.items?.map((item, idx) => (
                                <Link
                                  key={idx}
                                  to={item.link}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`block py-2 text-sm transition-colors ${
                                    item.isHighlight ||
                                    item.isSpecial ||
                                    item.isViewAll
                                      ? "text-green-600 font-medium"
                                      : "text-gray-600 hover:text-green-600"
                                  }`}
                                >
                                  {item.description ? (
                                    <span>
                                      <span className="font-medium">
                                        {item.label}
                                      </span>
                                      <span className="block text-xs text-gray-400">
                                        {item.description}
                                      </span>
                                    </span>
                                  ) : (
                                    item.label
                                  )}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ============================================
          TABLET & DESKTOP NAVBAR (≥ 768px) - z-index: 35
          ============================================ */}
      <nav className="hidden md:block w-full bg-white shadow-sm border-b border-gray-200 z-35">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-3 lg:gap-5">
            {/* Browse Categories Button (Tablet/Desktop) */}
            <div className="flex-shrink-0 z-3">
              <DropdownMenu
                options={categories}
                value={category}
                onChange={(opt) => setCategory(opt.value)}
                placeholder="Browse Categories"
              />
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 hidden lg:block"></div>

            {/* Navigation Links */}
            <div className="flex items-center gap-4 lg:gap-6 z-3">
              <NavItem
                label="Home"
                dropdownItems={homeDropdown}
                type="default"
              />
              <NavItem
                label="Shop"
                dropdownItems={shopDropdown}
                type="default"
              />
              <div className="hidden lg:block">
                <NavItem
                  label="Vendors"
                  dropdownItems={vendorsDropdown}
                  type="vendors"
                />
              </div>
              <div className="hidden xl:block">
                <NavItem
                  label="Mega Menu"
                  megaMenu={megaMenuContent}
                  type="mega"
                />
              </div>
              <NavItem label="Blog" dropdownItems={blogDropdown} type="blog" />
              <div className="hidden lg:block">
                <NavItem
                  label="Pages"
                  dropdownItems={pageDropdown}
                  type="default"
                />
              </div>
              <NavItem
                label="Contact"
                contactInfo={contactInfo}
                type="contact"
                align="right"
              />
            </div>

            {/* Right Side Promo */}
            <div className="ml-auto hidden lg:flex items-center gap-3 flex-shrink-0">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Free Shipping over $50
              </span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
