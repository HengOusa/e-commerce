import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

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
  // PRODUCTS DATA
  // =========================
  const products = [
    {
      id: 1,
      name: "Banana",
      image:
        "https://e7.pngegg.com/pngimages/595/523/png-clipart-six-ripe-banana-juice-banana-powder-flavor-fruit-yellow-bananas-natural-foods-food-thumbnail.png",
      qty: 10,
    },
    {
      id: 2,
      name: "Apple",
      image:
        "https://newindiansupermarket.com/cdn/shop/products/APPLE-RED.jpg?v=1739257722&width=1214",
      qty: 12,
    },
    {
      id: 3,
      name: "Orange",
      image:
        "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=300&h=300",
      qty: 8,
    },
    {
      id: 4,
      name: "Vegetables",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2JO52DNhosOU-MN9GQl_Ti1We4lPkUaUVCQ&s",
      qty: 20,
    },
    {
      id: 5,
      name: "Milk",
      image:
        "https://premierproduceone.com/media/catalog/product/cache/28bf51390c6a7eeeeb3ce2b166c68ce8/9/4/94568_whole_milk.jpeg.jpg",
      qty: 6,
    },
    {
      id: 6,
      name: "Bread",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&h=300",
      qty: 14,
    },
    {
      id: 7,
      name: "Meat",
      image:
        "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=300&h=300",
      qty: 9,
    },
    {
      id: 8,
      name: "Eggs",
      image:
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&h=300",
      qty: 30,
    },
    {
      id: 9,
      name: "Cheese",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuvp46y8Fcky7GVq9nVUTCi4kxOqlA7-R2wQ&s",
      qty: 5,
    },
    {
      id: 10,
      name: "Fish",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu35bXPse5ZXElK7hV9m4i0AsZ0o5TlxPVNw&s",
      qty: 11,
    },
    {
      id: 11,
      name: "Chicken",
      image:
        "https://static.vecteezy.com/system/resources/thumbnails/044/776/845/small/chicken-isolated-on-transparent-background-png.png",
      qty: 13,
    },
    {
      id: 12,
      name: "Rice",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&h=300",
      qty: 50,
    },
    {
      id: 13,
      name: "Noodles",
      image:
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=300&h=300",
      qty: 18,
    },
    {
      id: 14,
      name: "Coffee",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&h=300",
      qty: 7,
    },
    {
      id: 15,
      name: "Tea",
      image:
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=300&h=300",
      qty: 9,
    },
    {
      id: 16,
      name: "Juice",
      image:
        "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=300&h=300",
      qty: 16,
    },
    {
      id: 17,
      name: "Water",
      image:
        "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=300&h=300",
      qty: 40,
    },
    {
      id: 18,
      name: "Chocolate",
      image:
        "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=300&h=300",
      qty: 10,
    },
    {
      id: 19,
      name: "Ice Cream",
      image:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&h=300",
      qty: 6,
    },
    {
      id: 20,
      name: "Butter",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0fCLziY34uNDxaTGcLo3VEv3s8GoQo8tTWQ&s",
      qty: 8,
    },
  ];

  // =========================
  // POPULAR PRODUCTS DATA
  // =========================
  const popularProducts = [
    {
      id: 101,
      name: "Organic Fresh Bananas",
      shop: "FreshMart",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRloKeC5BYOK4EcN29XQy_0QgPAJh6GBqXHTw&s",
      rating: { star: 4, point: 4.5 },
      unit_price: 12.99,
      discount_percent: 15,
      sold: 2340,
      location: "Phnom Penh",
    },
    {
      id: 102,
      name: "Red Delicious Apples",
      shop: "FruitKing",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIRcW1Az7WGp3WEyEeV3vVEq2YflDFL5l-Dw&s",
      rating: { star: 5, point: 4.8 },
      unit_price: 8.49,
      discount_percent: 10,
      sold: 1890,
      location: "Siem Reap",
    },
    {
      id: 103,
      name: "Fresh Orange Juice Pack",
      shop: "JuicyBar",
      image:
        "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=400&h=400",
      rating: { star: 4, point: 4.2 },
      unit_price: 5.99,
      discount_percent: 20,
      sold: 3200,
      location: "Phnom Penh",
    },
    {
      id: 104,
      name: "Mixed Vegetables Box",
      shop: "VeggieLand",
      image:
        "https://5.imimg.com/data5/BG/IB/CI/SELLER-7051866/fresh-vegetables.jpg",
      rating: { star: 5, point: 4.9 },
      unit_price: 18.99,
      discount_percent: 25,
      sold: 1560,
      location: "Battambang",
    },
    {
      id: 105,
      name: "Whole Milk 1L Premium",
      shop: "DairyBest",
      image:
        "https://www.kibsons.com/_next/image?url=https%3A%2F%2Fcdn.kibsons.com%2Fproducts%2Fdetail%2FHPL_MILMIFRPM1LTS1_20240102085351.jpg&w=640&q=90",
      rating: { star: 4, point: 4.3 },
      unit_price: 3.49,
      discount_percent: 5,
      sold: 5600,
      location: "Phnom Penh",
    },
    {
      id: 106,
      name: "Artisan Sourdough Bread",
      shop: "BakeHouse",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&h=400",
      rating: { star: 5, point: 4.7 },
      unit_price: 6.99,
      discount_percent: 12,
      sold: 980,
      location: "Siem Reap",
    },
    {
      id: 107,
      name: "Premium Beef Steak",
      shop: "MeatMaster",
      image:
        "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&h=400",
      rating: { star: 4, point: 4.4 },
      unit_price: 24.99,
      discount_percent: 18,
      sold: 750,
      location: "Phnom Penh",
    },
    {
      id: 108,
      name: "Farm Fresh Eggs (12pcs)",
      shop: "EggCellent",
      image:
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&h=400",
      rating: { star: 5, point: 4.6 },
      unit_price: 4.29,
      discount_percent: 8,
      sold: 4200,
      location: "Battambang",
    },
  ];

  // =========================
  // REFS
  // =========================
  const popularProductsRef = useRef(null);
  // =========================
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // =========================
  // PRODUCT SCROLL FUNCTIONS
  // =========================
  const scrollProducts = useCallback((direction) => {
    if (!productsRef.current) return;

    const scrollAmount = 300; // Scroll by 300px
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

  const scrollToProduct = useCallback((index) => {
    if (!productsRef.current) return;

    const productWidth = 220; // Approximate width including gap
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

  return (
    <>
      {/* ================= CAROUSEL ================= */}
      <div
        className="relative overflow-hidden group"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          <div className="absolute z- w-full h-100% bg-black "></div>
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
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 flex flex-col justify-center items-center text-white p-4 text-center">
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
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 w-10 h-10 rounded-full text-white flex items-center justify-center transition backdrop-blur-sm"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 w-10 h-10 rounded-full text-white flex items-center justify-center transition backdrop-blur-sm"
        >
          ❯
        </button>
      </div>

      {/* ================= PRODUCT SECTION ================= */}
      <div className="py-3 px-6 w-full">
        <div className="flex items-center justify-between ">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-green-700">
            Featured Categories
          </h2>

          {/* Product Navigation Arrows */}
          <div className="flex gap-2 py-3">
            <button
              onClick={() => scrollProducts("prev")}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 text-sm sm:text-base md:text-lg bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
              aria-label="Scroll left"
            >
              ❮
            </button>
            <button
              onClick={() => scrollProducts("next")}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 text-sm sm:text-base md:text-lg bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
              aria-label="Scroll right"
            >
              ❯
            </button>
          </div>
        </div>

        {/* The Horizontal Scroll Container */}
        <div
          ref={productsRef}
          className="hide-scrollbar flex gap-3 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          onScroll={(e) => setProductScrollLeft(e.target.scrollLeft)}
        >
          {products.map((item) => (
            <Link
              to={`/product/${item.id}`}
              key={item.id}
              className="flex-shrink-0 w-35 md:w-40 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md snap-start transition-all duration-300 hover:-translate-y-1 cursor-pointer group/product"
            >
              <div className="w-full h-40 overflow-hidden rounded-t-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover/product:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-4 text-center">
                <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm text-green-600 font-medium mt-1">
                  {item.qty} items
                </p>
              </div>
            </Link>
          ))}
        </div>
        {/* ================= POPULAR PRODUCTS ================= */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-green-700">
              Popular Products
            </h2>
            <a
              href="/products"
              className="text-sm sm:text-base text-green-600 hover:text-green-800 font-medium transition"
            >
              View All →
            </a>
          </div>

          <div
            ref={popularProductsRef}
            className="hide-scrollbar flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-6 pt-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {popularProducts.map((product) => {
              const finalPrice = (
                product.unit_price *
                (1 - product.discount_percent / 100)
              ).toFixed(2);
              return (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="flex-shrink-0 w-44 sm:w-52 md:w-60 lg:w-64 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg snap-start transition-all duration-300 hover:-translate-y-1 group/product overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-44 sm:h-52 md:h-60 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-bottom group-hover/product:scale-110 transition-transform duration-500"
                    />

                    {/* Discount Badge */}
                    {product.discount_percent > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        -{product.discount_percent}%
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition hover:scale-110"
                      aria-label="Add to wishlist"
                      onClick={(e) => e.preventDefault()}
                    >
                      <svg
                        className="w-4 h-4 text-gray-400 hover:text-red-500 transition"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover/product:translate-y-0 transition-transform duration-300">
                      <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-lg shadow-lg transition"
                        onClick={(e) => e.preventDefault()}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 sm:p-4">
                    {/* Shop Name */}
                    <p className="text-xs text-gray-500 mb-1">{product.shop}</p>

                    {/* Product Name */}
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-2 mb-2 leading-tight">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < product.rating.star
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 fill-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {product.rating.point}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 font-bold text-base sm:text-lg">
                        ${finalPrice}
                      </span>
                      {product.discount_percent > 0 && (
                        <span className="text-gray-400 text-xs line-through">
                          ${product.unit_price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Sold & Location */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{product.sold.toLocaleString()} sold</span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {product.location}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
