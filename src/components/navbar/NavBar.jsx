import React, { useState } from "react";
import NavItem from "./NavItem";
import DropdownMenu from "./DropdownMenu";

const NavBar = () => {
  const [category, setCategory] = useState("");

  const categories = [
    { value: "", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "home", label: "Home & Kitchen" },
  ];

  // Dropdown content for each nav item
  const homeDropdown = [
    { label: "Dashboard", link: "/dashboard" },
    { label: "New Arrivals", link: "/new-arrivals" },
    { label: "Trending", link: "/trending" },
    { label: "Help Center", link: "/help" },
  ];

  const shopDropdown = [
    { label: "Men's Fashion", link: "/mens-fashion" },
    { label: "Women's Fashion", link: "/womens-fashion" },
    { label: "Accessories", link: "/accessories" },
    { label: "Footwear", link: "/footwear" },
    { label: "Best Sellers", link: "/best-sellers" },
    { label: "All Products", link: "/all-products", isHighlight: true },
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
    email: "support@shopzone.com",
    phone: "+1 (555) 123-4567",
    whatsapp: "+1 (555) 123-4567",
    social: [
      { icon: "fa-facebook", link: "https://facebook.com" },
      { icon: "fa-twitter", link: "https://twitter.com" },
      { icon: "fa-instagram", link: "https://instagram.com" },
    ],
  };

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 border-b border-gray-100 z-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start items-center h-16 gap-3">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <i className="fas fa-cubes text-blue-500 text-2xl mr-2"></i>
            <span className="font-bold text-xl text-gray-800 tracking-tight">
              Shop<span className="text-blue-500">Zone</span>
            </span>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Category Dropdown */}
            <DropdownMenu
              options={categories}
              value={category}
              onChange={(opt) => setCategory(opt.value)}
              placeholder="All Categories"
            />

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300"></div>

            {/* Nav Items with Dropdowns */}
            <div className="flex justify-between items-center gap-5">
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
              <NavItem
                label="Vendors"
                dropdownItems={vendorsDropdown}
                type="vendors"
              />
              <NavItem
                label="Mega Menu"
                megaMenu={megaMenuContent}
                type="mega"
              />
              <NavItem label="Blog" dropdownItems={blogDropdown} type="blog" />
              <NavItem
                label="Page"
                dropdownItems={pageDropdown}
                type="default"
              />
              <NavItem
                label="Contact"
                contactInfo={contactInfo}
                type="contact"
                align="right"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
