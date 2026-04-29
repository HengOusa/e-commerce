import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Check,
  TrendingUp,
  ArrowUpDown,
  Star,
  Filter,
} from "lucide-react";

const sortOptions = [
  { value: "newest", label: "Newest First", icon: TrendingUp },
  { value: "price-low", label: "Price: Low to High", icon: ArrowUpDown },
  { value: "price-high", label: "Price: High to Low", icon: ArrowUpDown },
  { value: "bestsellers", label: "Best Sellers", icon: TrendingUp },
  { value: "rating", label: "Highest Rated", icon: Star },
  { value: "name", label: "Name A-Z", icon: ArrowUpDown },
];

const TopBar = ({
  totalCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewChange,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedSort = sortOptions.find((opt) => opt.value === sortBy);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Results Count */}
        <div className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-700 bg-clip-text text-transparent">
          <span>{totalCount}</span>
          <span className="text-lg text-gray-600 font-normal">
            products found
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* View Toggle */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl">
            <button
              onClick={() => onViewChange("grid")}
              className={`p-2.5 rounded-lg transition-all flex items-center gap-1 text-sm font-medium ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-green-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" ry="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" ry="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" ry="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" ry="1" />
              </svg>
              Grid
            </button>
            <button
              onClick={() => onViewChange("list")}
              className={`p-2.5 rounded-lg transition-all flex items-center gap-1 text-sm font-medium ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-green-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h7"
                />
              </svg>
              List
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 shadow-sm hover:shadow-md transition-all font-medium text-gray-700 group"
            >
              {selectedSort?.icon && (
                <selectedSort.icon className="w-4 h-4 text-green-600" />
              )}
              <span>{selectedSort?.label || "Sort By"}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all first:rounded-t-2xl last:rounded-b-2xl ${
                        sortBy === option.value
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-r-4 border-green-500 text-green-800 font-semibold"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0 opacity-70" />
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                      {sortBy === option.value && (
                        <Check className="ml-auto w-5 h-5 text-green-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
