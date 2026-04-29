import React, {
  useState,
  useMemo,
  useCallback,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/Prodcuts/ProductCard";
import { allProducts } from "../../data/products";
import { categories } from "../../data/products";

// ============== REDUCER FOR BETTER STATE MANAGEMENT ==============
const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.key]: action.value };
    case "TOGGLE_CATEGORY":
      return {
        ...state,
        selectedCategories: state.selectedCategories.includes(action.catId)
          ? state.selectedCategories.filter((id) => id !== action.catId)
          : [...state.selectedCategories, action.catId],
      };
    case "SET_PRICE_RANGE":
      return { ...state, priceRange: action.range };
    case "CLEAR_ALL":
      return {
        searchTerm: "",
        selectedCategories: [],
        priceRange: { min: 0, max: 50 },
        sortBy: "relevance",
        viewMode: "grid",
      };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.mode };
    default:
      return state;
  }
};

// ============== CUSTOM HOOKS ==============
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    [key],
  );

  return [storedValue, setValue];
};

// ============== OPTIMIZED COMPONENTS ==============
const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const [localMin, setLocalMin] = useState(value.min);
  const [localMax, setLocalMax] = useState(value.max);

  useEffect(() => {
    setLocalMin(value.min);
    setLocalMax(value.max);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), localMax - 1);
    setLocalMin(newMin);
    onChange({ min: newMin, max: localMax });
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), localMin + 1);
    setLocalMax(newMax);
    onChange({ min: localMin, max: newMax });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-xs text-gray-600 block mb-1">Min ($)</label>
          <input
            type="range"
            min={min}
            max={max}
            value={localMin}
            onChange={handleMinChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Minimum price"
          />
          <div className="mt-1 text-sm font-medium text-gray-700">
            ${localMin}
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-600 block mb-1">Max ($)</label>
          <input
            type="range"
            min={min}
            max={max}
            value={localMax}
            onChange={handleMaxChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Maximum price"
          />
          <div className="mt-1 text-sm font-medium text-gray-700">
            ${localMax}
          </div>
        </div>
      </div>
      <div className="relative pt-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>${min}</span>
          <span>${max}</span>
        </div>
      </div>
    </div>
  );
};

const CategoryItem = ({ category, count, isSelected, onToggle }) => {
  return (
    <label
      className={`group flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-sm"
          : "hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="w-4 h-4 text-green-600 rounded-md focus:ring-green-500 focus:ring-offset-0 mr-3"
      />
      <div className="flex-1">
        <div
          className={`font-medium ${isSelected ? "text-green-700" : "text-gray-700"}`}
        >
          {category.label}
        </div>
        <div className="text-xs text-gray-500">{count} products</div>
      </div>
      {isSelected && <Check className="w-4 h-4 text-green-600" />}
    </label>
  );
};

const ActiveFilterBadge = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs rounded-full font-medium">
    {label}
    <button
      onClick={onRemove}
      className="hover:bg-green-200 rounded-full p-0.5 transition"
    >
      <X className="w-3 h-3" />
    </button>
  </span>
);

const SortDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: "relevance", label: "Relevance", icon: TrendingUp },
    { value: "price-low", label: "Price: Low to High", icon: ArrowUpDown },
    { value: "price-high", label: "Price: High to Low", icon: ArrowUpDown },
    { value: "best-selling", label: "Best Selling", icon: TrendingUp },
    { value: "rating", label: "Highest Rated", icon: Star },
  ];

  const selectedOption = sortOptions.find((opt) => opt.value === value);
  const Icon = selectedOption?.icon;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
      >
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <span className="text-sm font-medium text-gray-700">
          {selectedOption?.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
          {sortOptions.map((option) => {
            const OptionIcon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-50 transition ${
                  value === option.value
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700"
                }`}
              >
                <OptionIcon className="w-4 h-4" />
                <span className="text-sm">{option.label}</span>
                {value === option.value && (
                  <Check className="w-4 h-4 ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ViewToggle = ({ viewMode, onChange }) => (
  <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
    <button
      onClick={() => onChange("grid")}
      className={`p-2 rounded-lg transition-all duration-200 ${
        viewMode === "grid"
          ? "bg-white shadow-sm text-green-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
      aria-label="Grid view"
    >
      <Grid3x3 className="w-4 h-4" />
    </button>
    <button
      onClick={() => onChange("list")}
      className={`p-2 rounded-lg transition-all duration-200 ${
        viewMode === "list"
          ? "bg-white shadow-sm text-green-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
      aria-label="List view"
    >
      <LayoutList className="w-4 h-4" />
    </button>
  </div>
);

// ============== MAIN COMPONENT ==============
const ProductPage = () => {
  const [filters, dispatch] = useReducer(filterReducer, {
    searchTerm: "",
    selectedCategories: [],
    priceRange: { min: 0, max: 50 },
    sortBy: "relevance",
    viewMode: "grid",
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [savedFilters, setSavedFilters] = useLocalStorage(
    "product-filters",
    null,
  );
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);
  const mainContentRef = useRef(null);
  const productsRef = useRef(null);
  const [showProductsArrows, setShowProductsArrows] = useState(false);

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
    } else {
      const newScroll = Math.max(currentScroll - scrollAmount, 0);
      productsRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  }, []);

  // Categories data with better organization
  const categories = useMemo(
    () => [
      {
        id: "fruits",
        label: "Fruits",
        icon: "🍎",
        keywords: ["Banana", "Apple", "Orange", "Strawberry", "Grapes"],
      },
      {
        id: "vegetables",
        label: "Vegetables",
        icon: "🥬",
        keywords: ["Vegetables", "Tomato", "Potato", "Onion", "Carrot"],
      },
      {
        id: "dairy",
        label: "Dairy",
        icon: "🥛",
        keywords: ["Milk", "Cheese", "Butter", "Yogurt", "Eggs"],
      },
      {
        id: "meat-fish",
        label: "Meat & Fish",
        icon: "🥩",
        keywords: ["Meat", "Fish", "Chicken", "Beef", "Pork"],
      },
      {
        id: "bakery",
        label: "Bakery",
        icon: "🍞",
        keywords: ["Bread", "Pastry", "Cake", "Cookie"],
      },
      {
        id: "beverages",
        label: "Beverages",
        icon: "🥤",
        keywords: ["Juice", "Water", "Coffee", "Tea", "Soda"],
      },
      {
        id: "grains",
        label: "Grains",
        icon: "🌾",
        keywords: ["Rice", "Noodles", "Pasta", "Cereal"],
      },
    ],
    [],
  );

  // Product counts per category
  const categoryCounts = useMemo(() => {
    const counts = new Map();
    categories.forEach((cat) => {
      const count = allProducts.filter((p) =>
        cat.keywords.some((keyword) =>
          p.name.toLowerCase().includes(keyword.toLowerCase()),
        ),
      ).length;
      counts.set(cat.id, count);
    });
    return counts;
  }, [categories]);

  // Filtered products with memoization
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Apply search filter with debounced value
    if (debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.shop.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term)),
      );
    }

    // Apply category filter
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.selectedCategories.some((catId) => {
          const cat = categories.find((c) => c.id === catId);
          return cat?.keywords.some((keyword) =>
            product.name.toLowerCase().includes(keyword.toLowerCase()),
          );
        }),
      );
    }

    // Apply price filter
    filtered = filtered.filter(
      (p) =>
        p.unit_price >= filters.priceRange.min &&
        p.unit_price <= filters.priceRange.max,
    );

    // Apply sorting with stable sort
    const sortFunctions = {
      "price-low": (a, b) => a.unit_price - b.unit_price,
      "price-high": (a, b) => b.unit_price - a.unit_price,
      "best-selling": (a, b) => (b.sold || 0) - (a.sold || 0),
      rating: (a, b) => (b.rating?.point || 0) - (a.rating?.point || 0),
      relevance: () => 0,
    };

    const sortFn = sortFunctions[filters.sortBy];
    if (sortFn && filters.sortBy !== "relevance") {
      filtered.sort(sortFn);
    }

    return filtered;
  }, [
    debouncedSearchTerm,
    filters.selectedCategories,
    filters.priceRange,
    filters.sortBy,
    categories,
  ]);

  // Load saved filters on mount
  useEffect(() => {
    if (savedFilters) {
      Object.entries(savedFilters).forEach(([key, value]) => {
        if (key !== "viewMode") {
          dispatch({ type: "SET_FILTER", key, value });
        } else {
          dispatch({ type: "SET_VIEW_MODE", mode: value });
        }
      });
    }
  }, [savedFilters]);

  // Save filters when changed
  useEffect(() => {
    const filtersToSave = {
      selectedCategories: filters.selectedCategories,
      priceRange: filters.priceRange,
      sortBy: filters.sortBy,
      viewMode: filters.viewMode,
    };
    setSavedFilters(filtersToSave);
  }, [
    filters.selectedCategories,
    filters.priceRange,
    filters.sortBy,
    filters.viewMode,
  ]);

  // Scroll to top when filters change
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [filteredProducts.length]);

  const hasActiveFilters =
    filters.searchTerm ||
    filters.selectedCategories.length > 0 ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 50 ||
    filters.sortBy !== "relevance";

  const clearAllFilters = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
    setIsMobileFiltersOpen(false);
  }, []);

  // Filter Sidebar Component
  const FilterSidebar = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Search products
        </label>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          <input
            type="text"
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
            placeholder="Search by name, shop, or description..."
            value={filters.searchTerm}
            onChange={(e) =>
              dispatch({
                type: "SET_FILTER",
                key: "searchTerm",
                value: e.target.value,
              })
            }
            aria-label="Search products"
          />
          {filters.searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition"
              onClick={() =>
                dispatch({ type: "SET_FILTER", key: "searchTerm", value: "" })
              }
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">
            Categories
          </label>
          {filters.selectedCategories.length > 0 && (
            <button
              onClick={() =>
                dispatch({
                  type: "SET_FILTER",
                  key: "selectedCategories",
                  value: [],
                })
              }
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear ({filters.selectedCategories.length})
            </button>
          )}
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const count = categoryCounts.get(cat.id) || 0;
            const isSelected = filters.selectedCategories.includes(cat.id);

            return (
              <CategoryItem
                key={cat.id}
                category={cat}
                count={count}
                isSelected={isSelected}
                onToggle={() =>
                  dispatch({ type: "TOGGLE_CATEGORY", catId: cat.id })
                }
              />
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Price Range
        </label>
        <PriceRangeSlider
          min={0}
          max={50}
          value={filters.priceRange}
          onChange={(range) => dispatch({ type: "SET_PRICE_RANGE", range })}
        />
      </div>
    </div>
  );

  // No Results Component
  const NoResults = () => (
    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
        <AlertCircle className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        No products found
      </h3>
      <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
        We couldn't find any products matching your criteria. Try adjusting your
        filters or search terms.
      </p>
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
          >
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filters & Sort
            </span>
            {hasActiveFilters && (
              <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full">
                Active
              </span>
            )}
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Mobile Sidebar */}
          {isMobileFiltersOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              <div
                className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto animate-in slide-in-from-right duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Filters
                  </h3>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar />
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="space-y-6" ref={mainContentRef}>
            {/* Header with Controls */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                    All Products
                  </h1>
                  <p className="text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-green-600">
                      {filteredProducts.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">{allProducts.length}</span>{" "}
                    products
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ViewToggle
                    viewMode={filters.viewMode}
                    onChange={(mode) =>
                      dispatch({ type: "SET_VIEW_MODE", mode })
                    }
                  />
                  <SortDropdown
                    value={filters.sortBy}
                    onChange={(value) =>
                      dispatch({ type: "SET_FILTER", key: "sortBy", value })
                    }
                  />
                </div>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {filters.searchTerm && (
                      <ActiveFilterBadge
                        label={`Search: ${filters.searchTerm}`}
                        onRemove={() =>
                          dispatch({
                            type: "SET_FILTER",
                            key: "searchTerm",
                            value: "",
                          })
                        }
                      />
                    )}
                    {filters.selectedCategories.map((catId) => {
                      const cat = categories.find((c) => c.id === catId);
                      return (
                        cat && (
                          <ActiveFilterBadge
                            key={catId}
                            label={`${cat.icon} ${cat.label}`}
                            onRemove={() =>
                              dispatch({ type: "TOGGLE_CATEGORY", catId })
                            }
                          />
                        )
                      );
                    })}
                    {(filters.priceRange.min > 0 ||
                      filters.priceRange.max < 50) && (
                      <ActiveFilterBadge
                        label={`$${filters.priceRange.min} - $${filters.priceRange.max}`}
                        onRemove={() =>
                          dispatch({
                            type: "SET_PRICE_RANGE",
                            range: { min: 0, max: 50 },
                          })
                        }
                      />
                    )}
                    {filters.sortBy !== "relevance" && (
                      <ActiveFilterBadge
                        label={`Sort: ${filters.sortBy.replace("-", " ")}`}
                        onRemove={() =>
                          dispatch({
                            type: "SET_FILTER",
                            key: "sortBy",
                            value: "relevance",
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <NoResults />
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setShowProductsArrows(true)}
                onMouseLeave={() => setShowProductsArrows(false)}
              >
                <button
                  onClick={() => scrollProducts("prev")}
                  className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 ${
                    showProductsArrows ? "opacity-100" : "opacity-0"
                  }`}
                  aria-label="Scroll left"
                >
                  <ChevronDown className="w-5 h-5 -rotate-90" />
                </button>
                <button
                  onClick={() => scrollProducts("next")}
                  className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 ${
                    showProductsArrows ? "opacity-100" : "opacity-0"
                  }`}
                  aria-label="Scroll right"
                >
                  <ChevronDown className="w-5 h-5 rotate-90" />
                </button>
                <div
                  ref={productsRef}
                  className="hide-scrollbar flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-6 pt-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={index < 6} // Priority loading for first 6 products
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
