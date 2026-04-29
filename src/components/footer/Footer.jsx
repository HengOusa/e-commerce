import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CreditCard,
  Truck,
  ShieldCheck,
  Headphones,
  ChevronRight,
  Smartphone,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const companyLinks = [
    { to: "/about", label: "About Us" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact Us" },
    { to: "/become-vendor", label: "Become a Vendor" },
  ];

  const customerLinks = [
    { to: "/account", label: "My Account" },
    { to: "/orders", label: "My Orders" },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/faqs", label: "FAQs" },
    { to: "/help", label: "Help Center" },
  ];

  const policyLinks = [
    { to: "/terms", label: "Terms & Conditions" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/return-policy", label: "Return Policy" },
    { to: "/shipping", label: "Shipping Info" },
    { to: "/sitemap", label: "Sitemap" },
  ];

  const categoryLinks = [
    { to: "/category/electronics", label: "Electronics" },
    { to: "/category/clothing", label: "Clothing" },
    { to: "/category/home", label: "Home & Kitchen" },
    { to: "/category/books", label: "Books" },
    { to: "/category/sports", label: "Sports" },
    { to: "/category/beauty", label: "Beauty" },
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      desc: "On orders over $50",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      desc: "100% protected checkout",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Dedicated support team",
    },
    {
      icon: CreditCard,
      title: "Money Back",
      desc: "30-day guarantee",
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      iconClass: "fab fa-facebook-f",
      url: "https://facebook.com/ousa",
      color: "#1877f2",
      followCount: "45.2K",
    },
    {
      name: "Instagram",
      iconClass: "fab fa-instagram",
      url: "https://instagram.com/ousa",
      color: "#e4405f",
      followCount: "32.8K",
    },
    {
      name: "Twitter",
      iconClass: "fab fa-twitter",
      url: "https://twitter.com/ousa",
      color: "#1da1f2",
      followCount: "28.4K",
    },
    {
      name: "YouTube",
      iconClass: "fab fa-youtube",
      url: "https://youtube.com/ousa",
      color: "#ff0000",
      followCount: "15.7K",
    },
    {
      name: "TikTok",
      iconClass: "fab fa-tiktok",
      url: "https://tiktok.com/@ousa",
      color: "#000000",
      followCount: "52.1K",
    },
    {
      name: "LinkedIn",
      iconClass: "fab fa-linkedin-in",
      url: "https://linkedin.com/company/ousa",
      color: "#0a66c2",
      followCount: "12.3K",
    },
    {
      name: "WhatsApp",
      iconClass: "fab fa-whatsapp",
      url: "https://wa.me/85512345678",
      color: "#25d366",
      followCount: "Chat Now",
    },
    {
      name: "Telegram",
      iconClass: "fab fa-telegram-plane",
      url: "https://t.me//Heng_OuSa",
      color: "#0088cc",
      followCount: "8.5K",
    },
    {
      name: "Pinterest",
      iconClass: "fab fa-pinterest-p",
      url: "https://pinterest.com/ousa",
      color: "#bd081c",
      followCount: "6.2K",
    },
    {
      name: "Snapchat",
      iconClass: "fab fa-snapchat-ghost",
      url: "https://snapchat.com/add/ousa",
      color: "#fffc00",
      followCount: "4.8K",
    },
  ];

  const paymentMethods = [
    { name: "VISA", icon: "💳" },
    { name: "MasterCard", icon: "💳" },
    { name: "PayPal", icon: "💰" },
    { name: "ABA Bank", icon: "🏦" },
    { name: "ACLEDA", icon: "🏦" },
    { name: "Wing", icon: "📱" },
    { name: "Pi Pay", icon: "📱" },
    { name: "TrueMoney", icon: "💸" },
  ];

  const getCurrentYear = () => new Date().getFullYear();

  return (
    <footer className="w-full bg-white">
      {/* Features Band */}
      <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 group-hover:bg-green-500 transition-colors duration-300 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Newsletter Band */}
      <div className="bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-green-100 text-base">
                Get special offers, free giveaways, and exclusive deals
                delivered to your inbox.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full lg:w-auto flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1 min-w-[280px]">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-300 bg-white text-gray-800"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {subscribed ? (
                  "Subscribed! 🎉"
                ) : (
                  <>
                    Subscribe
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <img src={logo} alt="OuSa Logo" className="h-12 w-auto" />
                <h3 className="text-2xl font-extrabold text-green-500">OuSa</h3>
              </Link>
              <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-md">
                Your one-stop destination for quality products at unbeatable
                prices. We bring you the best in electronics, fashion, home
                goods, and more with exceptional customer service.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-sm text-gray-400">
                  <MapPin className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>123 Commerce Street, Phnom Penh, Cambodia</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <span>+855 23 456 789</span>
                    <span className="mx-2">|</span>
                    <span>+855 12 345 678</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>support@ousa.com</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold text-base uppercase tracking-wider mb-5">
                Company
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 text-sm hover:text-green-500 transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 text-green-500" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service Links */}
            <div>
              <h4 className="text-white font-semibold text-base uppercase tracking-wider mb-5">
                Customer Service
              </h4>
              <ul className="space-y-3">
                {customerLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 text-sm hover:text-green-500 transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 text-green-500" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies & Categories */}
            <div>
              <h4 className="text-white font-semibold text-base uppercase tracking-wider mb-5">
                Information
              </h4>
              <ul className="space-y-3 mb-8">
                {policyLinks.slice(0, 3).map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 text-sm hover:text-green-500 transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 text-green-500" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <h4 className="text-white font-semibold text-base uppercase tracking-wider mb-5">
                Categories
              </h4>
              <ul className="space-y-3">
                {categoryLinks.slice(0, 4).map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 text-sm hover:text-green-500 transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 text-green-500" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Payment Band */}
      <div className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Social Media Section */}
            <div className="w-full lg:w-2/3">
              <div className="mb-4">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">
                  Connect With Us
                </h4>
                <p className="text-gray-500 text-xs">
                  Follow us on social media for exclusive deals and updates
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="relative group"
                    onMouseEnter={() => setHoveredSocial(idx)}
                    onMouseLeave={() => setHoveredSocial(null)}
                  >
                    <div
                      className="w-10 h-10 rounded-full bg-gray-800 hover:shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                      style={{
                        backgroundColor:
                          hoveredSocial === idx ? social.color : undefined,
                      }}
                    >
                      <i
                        className={`${social.iconClass} text-gray-400 group-hover:text-white transition-colors text-lg`}
                      ></i>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {social.name}
                      <span className="ml-1 text-green-400">
                        {typeof social.followCount === "string" &&
                        social.followCount.includes("K")
                          ? social.followCount
                          : social.followCount}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* App Download Section */}
            <div className="w-full lg:w-1/3">
              <div className="text-center lg:text-right">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
                  Download Our App
                </h4>
                <div className="flex gap-3 justify-center lg:justify-end">
                  <a
                    href="https://apps.apple.com/app/ousa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-green-600 rounded-lg transition-colors group"
                  >
                    <Smartphone className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    <div className="text-left">
                      <div className="text-gray-400 text-xs group-hover:text-white">
                        Download on
                      </div>
                      <div className="text-white text-sm font-semibold">
                        App Store
                      </div>
                    </div>
                  </a>
                  <a
                    href="https://play.google.com/store/apps/ousa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-green-600 rounded-lg transition-colors group"
                  >
                    <Smartphone className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    <div className="text-left">
                      <div className="text-gray-400 text-xs group-hover:text-white">
                        Get it on
                      </div>
                      <div className="text-white text-sm font-semibold">
                        Google Play
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-gray-500 text-sm">We accept:</span>
                <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                  {paymentMethods.map((method, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs text-gray-400 font-medium hover:bg-green-600 hover:text-white transition-colors cursor-default"
                    >
                      {method.icon} {method.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SSL Secure</span>
                </div>
                <div className="w-px h-4 bg-gray-700"></div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Headphones className="w-4 h-4" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs text-center sm:text-left">
              &copy; {getCurrentYear()} OuSa. All rights reserved. |
              <Link
                to="/privacy"
                className="hover:text-green-500 ml-1 transition-colors"
              >
                Privacy
              </Link>
              <span className="mx-1">•</span>
              <Link
                to="/terms"
                className="hover:text-green-500 transition-colors"
              >
                Terms
              </Link>
              <span className="mx-1">•</span>
              <Link
                to="/cookies"
                className="hover:text-green-500 transition-colors"
              >
                Cookies
              </Link>
            </p>
            <div className="flex items-center gap-3 text-xs">
              <select className="bg-gray-900 text-gray-400 rounded px-3 py-1.5 border border-gray-800 focus:outline-none focus:border-green-600 cursor-pointer hover:bg-gray-800 transition-colors">
                <option value="en">🌐 English</option>
                <option value="km">🇰🇭 Khmer</option>
                <option value="zh">🇨🇳 中文</option>
              </select>
              <select className="bg-gray-900 text-gray-400 rounded px-3 py-1.5 border border-gray-800 focus:outline-none focus:border-green-600 cursor-pointer hover:bg-gray-800 transition-colors">
                <option value="usd">💵 USD ($)</option>
                <option value="khr">🇰🇭 KHR (៛)</option>
                <option value="eur">💶 EUR (€)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
