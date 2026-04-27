import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ProductCard = ({ product, className = "" }) => {
  const navigate = useNavigate();
  const finalPrice = (
    product.unit_price *
    (1 - product.discount_percent / 100)
  ).toFixed(2);

  const labelColors = {
    Sale: "bg-orange-500",
    "Best Sale": "bg-blue-600",
    "Hot Deal": "bg-red-600",
    Trending: "bg-purple-600",
    "Top Rated": "bg-yellow-500",
    "Save 15%": "bg-green-600",
    "Save 20%": "bg-green-600",
    New: "bg-teal-500",
    Limited: "bg-pink-600",
  };

  return (
    <Link
      to={`/product/${product.id}`}
      key={product.id}
      className={`flex-shrink-0 w-44 sm:w-52 md:w-60 lg:w-64 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg snap-start transition-all duration-300 hover:-translate-y-1 group/product overflow-hidden ${className}`}
    >
      {/* Image Container */}
      <div className="relative w-full h-44 sm:h-52 md:h-60 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-bottom  transition-transform duration-500"
        />

        {/* Label Badge */}
        {product.label && (
          <span
            className={`absolute top-2 left-1/2 -translate-x-1/2 ${
              labelColors[product.label] || "bg-gray-700"
            } text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md`}
          >
            {product.label}
          </span>
        )}

        {/* Discount Badge */}
        {product.discount_percent > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{product.discount_percent}%
          </span>
        )}

        {/* Action Buttons - Wishlist & Cart */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition hover:scale-110"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <svg
              className="w-4 h-4 text-gray-400 hover:text-red-500 transition cursor-pointer"
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
          <button
            className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition hover:scale-110"
            aria-label="Add to cart"
            onClick={(e) => e.preventDefault()}
          >
            <svg
              className="w-4 h-4 text-gray-400 hover:text-green-600 transition cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
        </div>

        {/* Buy Now Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover/product:translate-y-0 transition-transform duration-300">
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-lg shadow-lg transition cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/buy/${product.id}`);
            }}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4">
        {/* Shop Name */}
        <p className="text-xs text-gray-500 mb-1">{product.shop}</p>

        {/* Product Name */}
        <h3 className="font-bold text-gray-800 text-sm sm:text-base  mb-2 leading-tight line-clamp-1">
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
          <span className="text-xs text-gray-500">{product.rating.point}</span>
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
              className="w-3 h-3 flex-shrink-0"
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
            <span className="line-clamp-1">{product.location}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
