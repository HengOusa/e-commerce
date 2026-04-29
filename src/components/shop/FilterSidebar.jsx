import React from "react";
import { useReducer, useMemo } from "react";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Check,
  Star as StarIcon,
  Search,
} from "lucide-react";
import { shopCategories } from "../../data/products";

const filterReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_ITEM":
      const current = state[action.filter];
      const isSelected = current.includes(action.value);
      const newSelected = isSelected
        ? current.filter((item) => item !== action.value)
        : [...current, action.value];
      return { ...state, [action.filter]: newSelected };
    case "SET_PRICE_RANGE":
      return { ...state, priceRange: action.range };
    case "SET_RATING":
      return { ...state, minRating: action.rating };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.term };
    case "CLEAR_FILTER":
      return action.filter === "ALL"
        ? initialFilters
        : { ...state, [action.filter]: initialFilters[action.filter] };
    default:
      return state;
  }
};

const initialFilters = {
  subcategories: [],
  sizes: [],
  colors: [],
  brands: [],
  priceRange: { min: 0, max: 300 },
  minRating: 0,
  searchTerm: "",
  sortBy: "relevance",
};

const FilterSidebar = ({ categoryId, products, filters, dispatch }) => {
  const category = shopCategories.find((cat) => cat.id === categoryId);
  const {
    subcategories = [],
    sizes = [],
    colors = [],
    brands = [],
  } = category || {};

  // Category-specific filter options
  const sizeOptions = useMemo(
    () => (sizes.length > 0 ? sizes : ["XS", "S", "M", "L", "XL", "XXL"]),
    [sizes],
  );
  const colorOptions = useMemo(
    () =>
      colors.length > 0
        ? colors
        : ["#000000", "#8B4513", "#FF69B4", "#4682B4", "#FFD700"],
    [colors],
  );
  const brandOptions = useMemo(
    () =>
      brands.length > 0
        ? brands
        : ["Nike", "Adidas", "Zara", "Gucci", "Levi's"],
    [brands],
  );

  const hasActiveFilters = Object.values(filters).some((value) =>
    Array.isArray(value)
      ? value.length > 0
      : value !==
        initialFilters[Object.keys(filters).find((k) => filters[k] === value)],
  );

  const toggleFilter = (filterType, value) => {
    dispatch({ type: "TOGGLE_ITEM", filter: filterType, value });
  };

  const clearFilter = (filterType) => {
    dispatch({ type: "CLEAR_FILTER", filter: filterType });
  };

  const ActiveFilterBadge = ({ label, type, onRemove }) => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm rounded-full font-medium shadow-sm">
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-green-200 rounded-full p-0.5 -m-0.5 transition"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );

  const ColorSwatch = ({ color, selected, onClick }) => (
    <div
      className={`w-6 h-6 rounded-full shadow-md border-2 cursor-pointer transition-all hover:scale-110 hover:shadow-lg ${
        selected
          ? "border-green-500 shadow-green-200 ring-2 ring-green-200"
          : "border-gray-200 hover:border-gray-400"
      }`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      title={color}
    />
  );

  return (
    <div className="lg:w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:sticky lg:top-8 h-fit max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
            Filters
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => dispatch({ type: "CLEAR_FILTER", filter: "ALL" })}
            className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          Search Products
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white shadow-sm"
            placeholder="e.g. cotton shirt, nike sneakers..."
            value={filters.searchTerm}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", term: e.target.value })
            }
          />
          {filters.searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition"
              onClick={() => dispatch({ type: "SET_SEARCH", term: "" })}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Categories
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {subcategories.map((subcat) => {
              const isSelected = filters.subcategories.includes(subcat);
              return (
                <label
                  key={subcat}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition-all group hover:bg-gray-50 ${
                    isSelected
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 shadow-md"
                      : "border border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFilter("subcategories", subcat)}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
                  />
                  <span
                    className={`font-medium transition ${isSelected ? "text-green-700" : "text-gray-700 group-hover:text-gray-900"}`}
                  >
                    {subcat}
                  </span>
                  {isSelected && (
                    <Check className="ml-auto w-5 h-5 text-green-600" />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Price Range
        </h3>
        <div className="space-y-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                Min Price
              </label>
              <input
                type="range"
                min="0"
                max="300"
                value={filters.priceRange.min}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PRICE_RANGE",
                    range: {
                      ...filters.priceRange,
                      min: Number(e.target.value),
                    },
                  })
                }
                className="w-full h-2 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg cursor-pointer"
              />
              <span className="text-sm font-semibold text-green-600">
                ${filters.priceRange.min}
              </span>
            </div>
            <span className="self-center text-gray-400 font-semibold text-lg">
              —
            </span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                Max Price
              </label>
              <input
                type="range"
                min="0"
                max="300"
                value={filters.priceRange.max}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PRICE_RANGE",
                    range: {
                      ...filters.priceRange,
                      max: Number(e.target.value),
                    },
                  })
                }
                className="w-full h-2 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg cursor-pointer"
              />
              <span className="text-sm font-semibold text-green-600">
                ${filters.priceRange.max}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Size</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {sizeOptions.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <label
                key={size}
                className={`flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all border group hover:bg-gray-50 ${
                  isSelected
                    ? "bg-green-500 text-white border-green-500 shadow-md"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleFilter("sizes", size)}
                  className="sr-only"
                />
                <span
                  className={`font-semibold uppercase tracking-wide text-sm ${isSelected ? "text-white drop-shadow-sm" : "text-gray-700"}`}
                >
                  {size}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Color</h3>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((color) => {
            const isSelected = filters.colors.includes(color);
            return (
              <ColorSwatch
                key={color}
                color={color}
                selected={isSelected}
                onClick={() => toggleFilter("colors", color)}
              />
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Brand</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {brandOptions.map((brand) => {
            const isSelected = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-all group hover:bg-gray-50 ${
                  isSelected
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400"
                    : "border border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleFilter("brands", brand)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
                />
                <span
                  className={`font-medium ${isSelected ? "text-green-700" : "text-gray-700 group-hover:text-gray-900"}`}
                >
                  {brand}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Customer Rating
        </h3>
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const isSelected = filters.minRating >= rating;
            return (
              <button
                key={rating}
                onClick={() => dispatch({ type: "SET_RATING", rating })}
                className={`flex items-center w-full p-3 rounded-xl hover:bg-gray-50 transition-all text-left group ${
                  isSelected
                    ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 shadow-sm"
                    : "hover:border-gray-300 border border-gray-200"
                }`}
              >
                <div className="flex mr-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 flex-shrink-0 ${
                        i < rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`font-medium text-sm ${isSelected ? "text-yellow-800" : "text-gray-700"}`}
                >
                  {rating} Stars & Up
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-6 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Active Filters
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.subcategories.map((cat) => (
              <ActiveFilterBadge
                key={cat}
                label={cat}
                type="subcategories"
                onRemove={() => clearFilter("subcategories")}
              />
            ))}
            {filters.sizes.map((size) => (
              <ActiveFilterBadge
                key={size}
                label={`Size ${size}`}
                type="sizes"
                onRemove={() => clearFilter("sizes")}
              />
            ))}
            {filters.colors.map((color) => (
              <ActiveFilterBadge
                key={color}
                label="Color"
                type="colors"
                onRemove={() => clearFilter("colors")}
              />
            ))}
            {filters.brands.map((brand) => (
              <ActiveFilterBadge
                key={brand}
                label={brand}
                type="brands"
                onRemove={() => clearFilter("brands")}
              />
            ))}
            {filters.minRating > 0 && (
              <ActiveFilterBadge
                label={`${filters.minRating}+ Stars`}
                type="rating"
                onRemove={() => clearFilter("minRating")}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
