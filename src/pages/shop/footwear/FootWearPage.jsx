import React, { useState, useReducer, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronDown,
  ShoePrintsIcon as ShoePrints,
  Speedometer2,
  Users,
} from "lucide-react";
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
  sizes: [],
  colors: [],
  brands: [],
  priceRange: { min: 0, max: 400 },
  minRating: 0,
  sortBy: "bestsellers",
  viewMode: "grid",
};

const FootWearPage = () => {
  const { category = "footwear" } = useParams();
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  const categoryData = getShopCategory("footwear");

  // Footwear keywords
  const footwearKeywords = [
    "Sneakers",
    "Boots",
    "Sandals",
    "Shoes",
    "Loafers",
    "Heels",
    "Trainers",
    "Nike",
    "Adidas",
    "Puma",
  ];

  const categoryProducts = useMemo(() => {
    return allProducts.filter((product) =>
      footwearKeywords.some(
        (keyword) =>
          product.name.toLowerCase().includes(keyword.toLowerCase()) ||
          product.category === "footwear",
      ),
    );
  }, []);

  const filteredProducts = useMemo(() => {
    let results = [...categoryProducts];

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
      bestsellers: (a, b) => (b.sold || 0) - (a.sold || 0),
      newest: (a, b) => (b.id || 0) - (a.id || 0),
      "price-low": (a, b) => a.unit_price - b.unit_price,
      rating: (a, b) => (b.rating?.point || 0) - (a.rating?.point || 0),
    };

    results.sort(sortFns[filters.sortBy] || sortFns.bestsellers);

    return results;
  }, [categoryProducts, filters]);

  useEffect(() => {
    document.title = "Footwear - Step Out in Style | Ousa";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb categoryId="footwear" />

        {/* Footwear Hero */}
        <div className="text-center mb-20 bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 p-20 rounded-3xl shadow-2xl">
          <div className="inline-block p-4 mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl shadow-2xl">
            <ShoePrints className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent mb-6">
            Footwear
          </h1>
          <p className="text-xl lg:text-2xl text-slate-700 max-w-3xl mx-auto mb-12">
            Premium sneakers, boots and sandals. Walk with confidence and style.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                450+
              </div>
              <div className="text-sm text-slate-600">Styles Available</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl">
              <Speedometer2 className="w-12 h-12 text-teal-500 mx-auto mb-3" />
              <div className="text-sm font-semibold text-slate-700">
                Best Performance
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl">
              <div className="text-3xl font-bold text-cyan-600 mb-2">4.9</div>
              <div className="text-sm text-slate-600">Avg Rating</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,350px)_1fr] xl:grid-cols-[minmax(0,400px)_1fr] gap-12">
          <div className="order-2 lg:order-1">
            <FilterSidebar
              categoryId="footwear"
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

export default FootWearPage;
