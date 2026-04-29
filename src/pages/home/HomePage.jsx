import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import CategoryCard from "../../components/categories/CategoryCard";
import ProductCard from "../../components/Prodcuts/ProductCard";
import {
  categories,
  popularProducts,
  dailyBestSellers,
} from "../../data/products";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);
  const productsRef = useRef(null);
  const [productScrollLeft, setProductScrollLeft] = useState(0);

  // =========================
  // SLIDES DATA
  // =========================
  const slides = [
    {
      id: 1,
      title: "Premium Quality Products",
      description: "Discover our exclusive collection",
      shop: "StartKist",
      rating: { star: 4, point: 2.3 },
      unit_price: 100,
      discount_percent: 10,
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&h=700",
      cta: "Shop Now",
      link: "/shop",
    },
    {
      id: 2,
      title: "Summer Sale",
      description: "Up to 50% off",
      shop: "SummerMart",
      rating: { star: 5, point: 4.8 },
      unit_price: 80,
      discount_percent: 50,
      image:
        "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?auto=format&fit=crop&w=1600&h=700",
      cta: "View Offers",
      link: "/offers",
    },
    {
      id: 3,
      title: "Free Shipping",
      description: "Orders over $100",
      shop: "ShipEasy",
      rating: { star: 4, point: 3.9 },
      unit_price: 120,
      discount_percent: 5,
      image:
        "https://www.barkershoes.com/cdn/shop/files/ss26_mirfield_jpg_1800x1200_crop_center.jpg?v=1773399642",
      cta: "Learn More",
      link: "/shipping",
    },
    {
      id: 4,
      title: "New Arrivals",
      description: "Check out the latest trends",
      shop: "TrendyStore",
      rating: { star: 5, point: 4.6 },
      unit_price: 150,
      discount_percent: 15,
      image:
        "https://www.datocms-assets.com/88007/1686803946-canberra_airport_293.jpg?crop=focalpoint&fit=crop&fm=jpg&fp-x=0.53&fp-y=0.56&h=320&w=902",
      cta: "Explore",
      link: "/new",
    },
    {
      id: 5,
      title: "Best Sellers",
      description: "Most popular products this week",
      shop: "TopMarket",
      rating: { star: 5, point: 4.9 },
      unit_price: 200,
      discount_percent: 20,
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&h=700",
      cta: "Shop Best Sellers",
      link: "/best-sellers",
    },
    {
      id: 6,
      title: "Flash Deals",
      description: "Limited time offers you can't miss",
      shop: "FlashZone",
      rating: { star: 4, point: 4.2 },
      unit_price: 90,
      discount_percent: 35,
      image:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1600&h=700",
      cta: "Grab Now",
      link: "/flash-deals",
    },
    {
      id: 7,
      title: "Electronics Sale",
      description: "Upgrade your gadgets today",
      shop: "TechWorld",
      rating: { star: 4, point: 4.4 },
      unit_price: 300,
      discount_percent: 25,
      image:
        "https://www.newelectronics.co.uk/media/ckafyfjt/adobestock_930152700.jpg?width=1002&height=564&v=1db3a9e52e03230",
      cta: "Shop Electronics",
      link: "/electronics",
    },
    {
      id: 8,
      title: "Fashion Collection",
      description: "Style that defines you",
      shop: "FashionHub",
      rating: { star: 5, point: 4.7 },
      unit_price: 130,
      discount_percent: 18,
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&h=700",
      cta: "Discover Fashion",
      link: "/fashion",
    },
    {
      id: 9,
      title: "Home Essentials",
      description: "Everything you need for your home",
      shop: "HomePlus",
      rating: { star: 4, point: 4.1 },
      unit_price: 110,
      discount_percent: 12,
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&h=700",
      cta: "Shop Home",
      link: "/home",
    },
    {
      id: 10,
      title: "Exclusive Deals",
      description: "Special discounts just for you",
      shop: "DealZone",
      rating: { star: 5, point: 4.9 },
      unit_price: 250,
      discount_percent: 40,
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&h=700",
      cta: "Get Deals",
      link: "/deals",
    },
  ];

  // =========================
  // REFS
  // =========================
  const popularProductsRef = useRef(null);
  const dailyBestSellersRef = useRef(null);
  const popularIntervalRef = useRef(null);
  const dailyIntervalRef = useRef(null);

  // =========================
  // AUTO SCROLL STATES
  // =========================
  const [isPopularAutoPlaying, setIsPopularAutoPlaying] = useState(true);
  const [isDailyAutoPlaying, setIsDailyAutoPlaying] = useState(true);

  // =========================
  // ARROW VISIBILITY STATES
  // =========================
  const [showFeaturedArrows, setShowFeaturedArrows] = useState(false);
  const [showPopularArrows, setShowPopularArrows] = useState(false);
  const [showDailyArrows, setShowDailyArrows] = useState(false);

  // =========================
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // =========================
  // AUTO SCROLL FUNCTIONS
  // =========================
  const autoScroll = useCallback((ref) => {
    if (!ref.current) return;

    const scrollAmount = 280;
    const currentScroll = ref.current.scrollLeft;
    const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;

    if (currentScroll >= maxScroll - 10) {
      ref.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      ref.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  // =========================
  // PRODUCT SCROLL FUNCTIONS
  // =========================
  const scrollProducts = useCallback((direction) => {
    if (!productsRef.current) return;

    const scrollAmount = 300;
    const currentScroll = productsRef.current.scrollLeft;
    const maxScroll =
      productsRef.current.scrollWidth - productsRef.current.clientWidth;

    if (direction === "next") {
      const newScroll = Math.min(currentScroll + scrollAmount, maxScroll);
      productsRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
      setProductScrollLeft(newScroll);
    } else {
      const newScroll = Math.max(currentScroll - scrollAmount, 0);
      productsRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
      setProductScrollLeft(newScroll);
    }
  }, []);

  const scrollPopular = useCallback((direction) => {
    if (!popularProductsRef.current) return;

    const scrollAmount = 300;
    const currentScroll = popularProductsRef.current.scrollLeft;
    const maxScroll =
      popularProductsRef.current.scrollWidth -
      popularProductsRef.current.clientWidth;

    if (direction === "next") {
      const newScroll = Math.min(currentScroll + scrollAmount, maxScroll);
      popularProductsRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    } else {
      const newScroll = Math.max(currentScroll - scrollAmount, 0);
      popularProductsRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollDaily = useCallback((direction) => {
    if (!dailyBestSellersRef.current) return;

    const scrollAmount = 300;
    const currentScroll = dailyBestSellersRef.current.scrollLeft;
    const maxScroll =
      dailyBestSellersRef.current.scrollWidth -
      dailyBestSellersRef.current.clientWidth;

    if (direction === "next") {
      const newScroll = Math.min(currentScroll + scrollAmount, maxScroll);
      dailyBestSellersRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    } else {
      const newScroll = Math.max(currentScroll - scrollAmount, 0);
      dailyBestSellersRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollToProduct = useCallback((index) => {
    if (!productsRef.current) return;

    const productWidth = 220;
    const scrollPosition = index * productWidth;
    productsRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
    setProductScrollLeft(scrollPosition);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, nextSlide]);

  useEffect(() => {
    if (isPopularAutoPlaying) {
      popularIntervalRef.current = setInterval(
        () => autoScroll(popularProductsRef),
        4000,
      );
    }
    return () => clearInterval(popularIntervalRef.current);
  }, [isPopularAutoPlaying, autoScroll]);

  useEffect(() => {
    if (isDailyAutoPlaying) {
      dailyIntervalRef.current = setInterval(
        () => autoScroll(dailyBestSellersRef),
        4000,
      );
    }
    return () => clearInterval(dailyIntervalRef.current);
  }, [isDailyAutoPlaying, autoScroll]);

  return (
    <>
      {/* ================= CAROUSEL ================= */}
      <div className="relative overflow-hidden group" style={{ zIndex: 1 }}>
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="min-w-full h-[400px] md:h-[600px] relative"
            >
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover"
              />
              {/* Content overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 flex flex-col justify-center items-center text-white p-4 text-center z-5">
                <h1 className="text-3xl md:text-5xl font-bold tracking-wide">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl py-3 tracking-wide">
                  {slide.description}
                </p>
                <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-full transition font-semibold">
                  {slide.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 w-10 h-10 rounded-full text-white flex items-center justify-center transition backdrop-blur-sm z-10"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 w-10 h-10 rounded-full text-white flex items-center justify-center transition backdrop-blur-sm z-10"
        >
          ❯
        </button>
      </div>

      {/* ================= PRODUCT SECTION ================= */}
      <div className="py-3 px-0 lg:px-10 md:px-5 w-full">
        <div className="flex items-center justify-between ">
          <h2 className="text-base px-3 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-green-700">
            Featured Categories
          </h2>
          <a
            href="/products"
            className="text-sm px-3 sm:text-base text-green-600 hover:text-green-800 font-medium transition"
          >
            View All →
          </a>
        </div>

        {/* The Horizontal Scroll Container */}
        <div
          className="relative"
          onMouseEnter={() => setShowFeaturedArrows(true)}
          onMouseLeave={() => setShowFeaturedArrows(false)}
        >
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollProducts("prev")}
            className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 ${showFeaturedArrows ? "opacity-100" : "opacity-0"}`}
            aria-label="Scroll left"
          >
            <ChevronDown className="w-5 h-5 -rotate-90" />
          </button>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollProducts("next")}
            className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 ${showFeaturedArrows ? "opacity-100" : "opacity-0"}`}
            aria-label="Scroll right"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
          </button>

          <div
            ref={productsRef}
            className="hide-scrollbar flex gap-3 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            onScroll={(e) => setProductScrollLeft(e.target.scrollLeft)}
          >
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* ================= POPULAR PRODUCTS ================= */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base px-3 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-green-700">
              Popular Products
            </h2>
            <Link
              to="/products"
              className="text-sm px-3 sm:text-base text-green-600 hover:text-green-800 font-medium transition"
            >
              View All →
            </Link>
          </div>

          <div
            className="relative"
            onMouseEnter={() => {
              setIsPopularAutoPlaying(false);
              setShowPopularArrows(true);
            }}
            onMouseLeave={() => {
              setIsPopularAutoPlaying(true);
              setShowPopularArrows(false);
            }}
          >
            {/* Left Scroll Button */}
            <button
              onClick={() => scrollPopular("prev")}
              className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 ${showPopularArrows ? "opacity-100" : "opacity-0"}`}
              aria-label="Scroll left"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>

            {/* Right Scroll Button */}
            <button
              onClick={() => scrollPopular("next")}
              className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 ${showPopularArrows ? "opacity-100" : "opacity-0"}`}
              aria-label="Scroll right"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>

            <div
              ref={popularProductsRef}
              className="hide-scrollbar flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-6 pt-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* ================= DAILY BEST SELLING PRODUCTS ================= */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base px-3 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-green-700">
              Daily Best Selling Products
            </h2>
            <Link
              to="/products"
              className="text-sm px-3 sm:text-base text-green-600 hover:text-green-800 font-medium transition"
            >
              View All →
            </Link>
          </div>

          <div
            className="relative"
            onMouseEnter={() => {
              setIsDailyAutoPlaying(false);
              setShowDailyArrows(true);
            }}
            onMouseLeave={() => {
              setIsDailyAutoPlaying(true);
              setShowDailyArrows(false);
            }}
          >
            {/* Left Scroll Button */}
            <button
              onClick={() => scrollDaily("prev")}
              className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 ${showDailyArrows ? "opacity-100" : "opacity-0"}`}
              aria-label="Scroll left"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>

            {/* Right Scroll Button */}
            <button
              onClick={() => scrollDaily("next")}
              className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 ${showDailyArrows ? "opacity-100" : "opacity-0"}`}
              aria-label="Scroll right"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>

            <div
              ref={dailyBestSellersRef}
              className="hide-scrollbar flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-6 pt-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {dailyBestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
