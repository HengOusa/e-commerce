import React, { useState, useReducer, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, Dress, Users, Heart, Zap } from "lucide-react";
import ProductGrid from "../../../components/shop/ProductGrid";
import FilterSidebar from "../../../components/shop/FilterSidebar";
import Breadcrumb from "../../../components/shop/Breadcrumb";
import TopBar from "../../../components/shop/TopBar";
import {
  allProducts,
  shopCategories,
  getShopCategory,
} from "../../../data/products";

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
      return initialFilters;
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.mode };
    default:
      return state;
  }
};

const initialFilters = {
  searchTerm: "",
  subcategories: [],
  sizes: [],
  colors: [],
  brands: [],
  priceRange: { min: 0, max: 250 },
  minRating: 0,
  sortBy: "rating",
  viewMode: "grid",
};

const WomenFashion = () => {
  const { category = "womens-fashion" } = useParams();
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  const categoryData = getShopCategory("womens-fashion");

  // Women's fashion keywords
  const womenKeywords = [
    "Women",
    "Dress",
    "Top",
    "Skirt",
    "Blouse",
    "Heels",
    "Sandals",
    "Jeans",
    "Jumpsuit",
    "Zara",
    "Mango",
    "Shein",
  ];

  const categoryProducts = useMemo(() => {
    return allProducts.filter((product) =>
      womenKeywords.some(
        (keyword) =>
          product.name.toLowerCase().includes(keyword.toLowerCase()) ||
          product.category === "womens-fashion",
      ),
    );
  }, []);

  const filteredProducts = useMemo(() => {
    let results = [...categoryProducts];

    // Similar filtering logic as above...
    if (filters.searchTerm) {
      results = results.filter((p) =>
        p.name.toLowerCase().includes(filters.searchTerm.toLowerCase()),
      );
    }

    if (filters.sizes.length > 0) {
      results = results.filter((p) => filters.sizes.includes(p.size));
    }

    if (filters.colors.length > 0) {
      results = results.filter((p) => filters.colors.includes(p.color));
    }

    if (filters.brands.length > 0) {
      results = results.filter((p) => filters.brands.includes(p.brand));
    }

    results = results.filter(
      (p) =>
        p.unit_price >= filters.priceRange.min &&
        p.unit_price <= filters.priceRange.max,
    );

    if (filters.minRating > 0) {
      results = results.filter(
        (p) => (p.rating?.point || 0) >= filters.minRating,
      );
    }

    const sortFns = {
      rating: (a, b) => (b.rating?.point || 0) - (a.rating?.point || 0),
      bestsellers: (a, b) => (b.sold || 0) - (a.sold || 0),
      newest: (a, b) => (b.id || 0) - (a.id || 0),
      "price-low": (a, b) => a.unit_price - b.unit_price,
    };

    results.sort(sortFns[filters.sortBy] || sortFns.rating);

    return results;
  }, [categoryProducts, filters]);

  useEffect(() => {
    document.title = "Women's Fashion - Elegant Collection | Ousa";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb categoryId="womens-fashion" />

        {/* Women's Fashion Hero */}
        <div className="text-center mb-20 bg-gradient-to-r from-pink-200 via-rose-200 to-red-200 p-20 rounded-3xl shadow-2xl">
          <div className="inline-block p-4 mb-8 bg-gradient-to-r from-pink-400 to-rose-500 rounded-3xl shadow-2xl">
            <Dress className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-pink-900 to-rose-900 bg-clip-text text-transparent mb-6">
            Women's Fashion
          </h1>
          <p className="text-xl lg:text-2xl text-slate-700 max-w-3xl mx-auto mb-12">
            Elegant dresses, chic tops and stunning accessories for every
            occasion.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl">
              <div className="text-3xl font-bold text-pink-600 mb-2">180+</div>
              <div className="text-sm text-slate-600">New Styles</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl">
              <Heart className="w-12 h-12 text-pink-500 mx-auto mb-3" />
              <div className="text-sm font-semibold text-slate-700">
                Customer Favorites
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl">
              <div className="text-3xl font-bold text-rose-600 mb-2">4.8</div>
              <div className="text-sm text-slate-600">Avg Rating</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl">
              <Zap className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <div className="text-sm font-semibold text-slate-700">
                Trend Alerts
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,350px)_1fr] xl:grid-cols-[minmax(0,400px)_1fr] gap-12">
          <div className="order-2 lg:order-1">
            <FilterSidebar
              categoryId="womens-fashion"
              products={categoryProducts}
              filters={filters}
              dispatch={dispatch}
            />
          </div>

          <div className="order-1 lg:order-2">
            <TopBar
              totalCount={filteredProducts.length}
              sortBy={filters.sortBy}
              onSortChange={(value) =>
                dispatch({ type: "SET_FILTER", key: "sortBy", value })
              }
              viewMode={filters.viewMode}
              onViewChange={(mode) => dispatch({ type: "SET_VIEW_MODE", mode })}
            />
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WomenFashion;
