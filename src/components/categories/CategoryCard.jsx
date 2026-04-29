import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={category.path}
      className="flex-shrink-0 w-44 sm:w-52 md:w-60 lg:w-64 bg-gradient-to-br rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-green-500/25 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden snap-start"
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-90`}
      />

      {/* Category Image */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center justify-center h-44 sm:h-52 md:h-60 text-center">
        <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {category.icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 z-10 drop-shadow-md">
          {category.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2 z-10">
          {category.description}
        </p>
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-700 shadow-sm z-10">
          {category.count} products
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <span className="text-white font-semibold text-sm z-20">
          Shop Now →
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
