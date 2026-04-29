import React, { useState, useReducer, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  allProducts,
  shopCategories,
  getShopCategory,
} from "../../data/products";
import { X } from "lucide-react";
import FilterSidebar from "../../components/shop/FilterSidebar";
import ProductGrid from "../../components/shop/ProductGrid";
import Breadcrumb from "../../components/shop/Breadcrumb";
import TopBar from "../../components/shop/TopBar";
import { Home, ShoppingBag, Star } from "lucide-react";

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.key]: action.value };
    case "TOGGLE_FILTER":
      const current = state[action.key] || [];
      const isSelected = current.includes(action.value);
      const newValue = isSelected
        ? current.filter((v) => v !== action.value)
        : [...current, action.value];
      return { ...state, [action.key]: newValue };
    case "CLEAR_ALL":
      return {
        searchTerm: "",
        subcategories: [],
        sizes: [],
        colors: [],
        brands: [],
        priceRange: { min: 0, max: 300 },
        minRating: 0,
        sortBy: "relevance",
        viewMode: "grid",
      };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.mode };
    default:
      return state;
  }
};

const ShopCategoryPage = () => {
  const { category } = useParams();
  const [filters, dispatch] = useReducer(filterReducer, {
    searchTerm: "",
    subcategories: [],
    sizes: [],
    colors: [],
    brands: [],
    priceRange: { min: 0, max: 300 },
    minRating: 0,
    sortBy: "relevance",
    viewMode: "grid",
  });

  const categoryData =
    getShopCategory(category) ||
    shopCategories.find((cat) => cat.id === "all-products");

  // Filter products by category keywords
  const categoryProducts = useMemo(() => {
    if (!categoryData?.keywords) return allProducts;

    const keywords = categoryData.keywords;
    return allProducts.filter((product) =>
      keywords.some(
        (keyword) =>
          product.name.toLowerCase().includes(keyword.toLowerCase()) ||
          product.category === category,
      ),
    );
  }, [category, categoryData]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let results = [...categoryProducts];

    // Search
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.shop.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term),
      );
    }

    // Subcategories
    if (filters.subcategories.length > 0) {
      results = results.filter((p) =>
        filters.subcategories.some((subcat) =>
          p.name.toLowerCase().includes(subcat.toLowerCase()),
        ),
      );
    }

    // Sizes
    if (filters.sizes.length > 0) {
      results = results.filter((p) => filters.sizes.includes(p.size));
    }

    // Colors
    if (filters.colors.length > 0) {
      results = results.filter((p) => filters.colors.includes(p.color));
    }

    // Brands
    if (filters.brands.length > 0) {
      results = results.filter((p) => filters.brands.includes(p.brand));
    }

    // Price range
    results = results.filter(
      (p) =>
        p.unit_price >= filters.priceRange.min &&
        p.unit_price <= filters.priceRange.max,
    );

    // Rating
    if (filters.minRating > 0) {
      results = results.filter(
        (p) => (p.rating?.point || 0) >= filters.minRating,
      );
    }

    // Sort
    const sortFns = {
      relevance: () => 0,
      newest: (a, b) => (b.id || 0) - (a.id || 0),
      "price-low": (a, b) => a.unit_price - b.unit_price,
      "price-high": (a, b) => b.unit_price - a.unit_price,
      bestsellers: (a, b) => (b.sold || 0) - (a.sold || 0),
      rating: (a, b) => (b.rating?.point || 0) - (a.rating?.point || 0),
      name: (a, b) => a.name.localeCompare(b.name),
    };

    results.sort(sortFns[filters.sortBy] || sortFns.relevance);

    return results;
  }, [categoryProducts, filters]);

  const handleSortChange = (value) => {
    dispatch({ type: "SET_FILTER", key: "sortBy", value });
  };

  const handleViewChange = (mode) => {
    dispatch({ type: "SET_VIEW_MODE", mode });
  };

  const handleToggleFilter = (key, value) => {
    dispatch({ type: "TOGGLE_FILTER", key, value });
  };

  const hasActiveFilters = Object.values(filters).some((val) =>
    Array.isArray(val)
      ? val.length > 0
      : typeof val === "object"
        ? val.min > 0 || val.max < 300
        : val !== "",
  );

  // Page title
  useEffect(() => {
    document.title = `${categoryData?.name || "Shop"} - Ousa`;
  }, [categoryData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb categoryId={category} />

        {/* Category Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-2 mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl shadow-2xl">
            <span className="text-5xl">{categoryData?.icon || "🛍️"}</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-green-900 to-emerald-800 bg-clip-text text-transparent mb-6 leading-tight">
            {categoryData?.name || "All Products"}
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {categoryData?.description ||
              "Browse our complete collection of premium products across all categories."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-12 text-center">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50 min-w-[200px]">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {filteredProducts.length}
              </div>
              <div className="text-lg font-semibold text-gray-700">
                Products
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50 min-w-[200px]">
              <ShoppingBag className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <div className="text-lg font-semibold text-gray-700">
                Free Shipping
              </div>
              <div className="text-sm text-gray-500">Over $50</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/50 min-w-[200px]">
              <div className="flex gap-1 mx-auto mb-3">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      className="w-6 h-6 text-yellow-400 fill-yellow-400"
                      key={i}
                    />
                  ))}
              </div>
              <div className="text-lg font-semibold text-gray-700">
                4.8 Rating
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[minmax(0,350px)_1fr] xl:grid-cols-[minmax(0,400px)_1fr] gap-8 lg:gap-12">
          {/* Filters */}
          <div className="order-2 lg:order-1">
            <FilterSidebar
              categoryId={category}
              products={categoryProducts}
              filters={filters}
              dispatch={dispatch}
            />
          </div>

          {/* Products */}
          <div className="order-1 lg:order-2">
            {/* Top Bar */}
            <TopBar
              totalCount={filteredProducts.length}
              sortBy={filters.sortBy}
              onSortChange={handleSortChange}
              viewMode={filters.viewMode}
              onViewChange={handleViewChange}
            />

            {/* Active Filters Row (mobile) */}
            {hasActiveFilters && (
              <div className="lg:hidden mb-8 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-2 -mb-2">
                  {/* Simplified active filters for mobile */}
                  <button className="bg-gradient-to-r from-red-100 to-rose-100 text-red-700 px-4 py-2 rounded-xl text-sm font-medium hover:from-red-200 hover:to-rose-200 transition flex items-center gap-1">
                    Filters Applied <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div
              className={`${filters.viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
            >
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCategoryPage;
