import React, { useState, useReducer, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  X,
  ChevronDown,
  ShoppingBag,
  Star,
  Watch,
  Package,
  Crown,
  ArrowLeft,
  ArrowRight,
  Sparkles
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
      return {
        searchTerm: "",
        colors: [],
        brands: [],
        priceRange: { min: 0, max: 1000 },
        minRating: 0,
        sortBy: "bestsellers",
        viewMode: "grid",
      };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.mode };
    default:
      return state;
  }
};

const AccessoriesPage = () => {
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const { category = "accessories" } = useParams();
  const [filters, dispatch] = useReducer(filterReducer, {
    searchTerm: "",
    colors: [],
    brands: [],
    priceRange: { min: 0, max: 1000 },
    minRating: 0,
    sortBy: "bestsellers",
    viewMode: "grid",
  });

  const categoryData =
    getShopCategory("accessories") ||
    shopCategories.find((cat) => cat.id === "accessories");

  // Accessories-specific keywords from shop-categories.js
  const accessoriesKeywords = [
    "Watch",
    "Bag",
    "Wallet",
    "Belt",
    "Sunglasses",
    "Necklace",
    "Earrings",
    "Bracelet",
    "Jewelry",
    "Rolex",
    "Louis Vuitton",
  ];

  // Filter products for accessories
  const categoryProducts = useMemo(() => {
    return allProducts.filter((product) =>
      accessoriesKeywords.some(
        (keyword) =>
          product.name.toLowerCase().includes(keyword.toLowerCase()) ||
          product.category === "accessories",
      ),
    );
  }, []);

  // Apply filters (simplified for accessories - no sizes/subcategories)
  const filteredProducts = useMemo(() => {
    let results = [...categoryProducts];

    // Search
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.shop.toLowerCase().includes(term),
      );
    }

    // Colors
    if (filters.colors.length > 0) {
      results = results.filter((p) => filters.colors.includes(p.color));
    }

    // Brands
    if (filters.brands.length > 0) {
      results = results.filter((p) => filters.brands.includes(p.brand));
    }

    // Price range (extended for luxury accessories)
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

    // Sort (accessories-focused defaults)
    const sortFns = {
      bestsellers: (a, b) => (b.sold || 0) - (a.sold || 0),
      newest: (a, b) => (b.id || 0) - (a.id || 0),
      "price-low": (a, b) => a.unit_price - b.unit_price,
      "price-high": (a, b) => b.unit_price - a.unit_price,
      rating: (a, b) => (b.rating?.point || 0) - (a.rating?.point || 0),
    };

    results.sort(sortFns[filters.sortBy] || sortFns.bestsellers);

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

  // Auto carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatured((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextFeatured = () => setCurrentFeatured((prev) => (prev + 1) % 4);
  const prevFeatured = () => setCurrentFeatured((prev) => (prev - 1 + 4) % 4);

  // Page title
  useEffect(() => {
    document.title = `Accessories - Premium Collection | Ousa`;
  }, []);

  const featuredAccessories = filteredProducts.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-zinc-50/50 to-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb categoryId="accessories" />

        {/* Ultra Premium Hero - Rolex/Vuiton Inspired */}
        <section className="relative mb-24 overflow-hidden rounded-4xl bg-gradient-to-br from-zinc-900/10 via-slate-900/5 to-stone-900/10 p-24 shadow-2xl border border-zinc-200/20 backdrop-blur-xl">
          {/* Animated luxury particles */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,.3),rgba(255,119,198,.15)),radial-gradient(ellipse_80%_50%_at_10%_50%,rgba(120,119,198,.15),transparent),radial-gradient(ellipse_80%_50%_at_90%_30%,rgba(120,119,198,.2),transparent)] animate-pulse" />
          </div>

          {/* Premium Badge */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400/95 to-gold-500/95 px-12 py-6 rounded-3xl shadow-2xl border border-amber-300/50 backdrop-blur-xl font-black text-2xl text-slate-900 tracking-tight animate-glow">
              <Sparkles className="w-8 h-8 text-amber-600 animate-pulse" />
              CERTIFIED LUXURY COLLECTION
              <Sparkles className="w-8 h-8 text-amber-600 animate-pulse" />
            </div>
          </div>

          <div className="relative z-10">
            {/* Massive Icon */}
            <div className="flex justify-center mb-16">
              <div className="p-12 bg-gradient-to-br from-zinc-200/60 to-slate-200/60 backdrop-blur-xl rounded-[3rem] shadow-3xl border border-zinc-300/40 hover:scale-105 transition-all duration-700">
                <Watch className="w-32 h-32 text-zinc-800 drop-shadow-2xl" />
              </div>
            </div>

            {/* Hero Title */}
            <h1 className="text-center font-black text-[6rem] md:text-[8rem] lg:text-[10rem] leading-none mb-12 bg-gradient-to-r from-slate-900 via-zinc-900 to-stone-900 bg-clip-text text-transparent drop-shadow-3xl">
              ACCESSORIES
            </h1>

            {/* Subtitle */}
            <p className="text-center text-2xl md:text-3xl lg:text-4xl font-light text-zinc-700 max-w-5xl mx-auto mb-24 px-8 backdrop-blur-sm bg-white/70 rounded-3xl py-12 shadow-2xl border border-zinc-200/50">
              Timeless elegance meets modern luxury. Curated collection of exquisite watches, handcrafted leather goods, 
              and bespoke jewelry for the discerning collector.
            </p>

            {/* Interactive Featured Showcase */}
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-8 justify-center mb-12">
                <button
                  onClick={prevFeatured}
                  className="w-20 h-20 bg-white/90 hover:bg-white text-zinc-700 rounded-3xl shadow-2xl border border-zinc-200/50 p-5 hover:scale-110 hover:shadow-3xl transition-all duration-500 flex items-center justify-center backdrop-blur-xl"
                >
                  <ArrowLeft className="w-8 h-8" />
                </button>

                <div className="w-[500px] h-[600px] bg-gradient-to-br from-white/80 to-zinc-100/80 backdrop-blur-3xl rounded-[4rem] p-12 border border-zinc-200/40 shadow-3xl flex items-center justify-center relative group hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-1000 overflow-hidden">
                  {featuredAccessories[currentFeatured] && (
                    <>
                      <img 
                        src={featuredAccessories[currentFeatured].image} 
                        alt={featuredAccessories[currentFeatured].name}
                        className="w-96 h-96 object-contain rounded-3xl shadow-3xl mx-auto drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-3xl px-12 py-8 rounded-4xl shadow-3xl border border-zinc-200/50 w-[90%] text-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                        <h3 className="font-black text-3xl text-zinc-900 mb-4 drop-shadow-xl uppercase tracking-tight">
                          {featuredAccessories[currentFeatured].name}
                        </h3>
                        <div className="flex items-center justify-center gap-3 mb-8">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className="w-8 h-8 fill-amber-400 text-amber-400 drop-shadow-lg" />
                            ))}
                          </div>
                          <span className="text-2xl font-bold text-zinc-600 font-mono">
                            {featuredAccessories[currentFeatured].rating?.point?.toFixed(1) || '4.9'}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-6 justify-center">
                          <span className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent drop-shadow-2xl">
                            ${featuredAccessories[currentFeatured].unit_price?.toFixed(0)}
                          </span>
                          {featuredAccessories[currentFeatured].discount_percent > 0 && (
                            <span className="text-3xl text-zinc-500 line-through font-mono">
                              ${featuredAccessories[currentFeatured].unit_price?.toFixed(0)}
                            </span>
                          )}
                        </div>
                        <div className="mt-6 text-xs uppercase tracking-widest font-black text-zinc-500">
                          {featuredAccessories[currentFeatured].sold?.toLocaleString()} + SOLD
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={nextFeatured}
                  className="w-20 h-20 bg-white/90 hover:bg-white text-zinc-700 rounded-3xl shadow-2xl border border-zinc-200/50 p-5 hover:scale-110 hover:shadow-3xl transition-all duration-500 flex items-center justify-center backdrop-blur-xl"
                >
                  <ArrowRight className="w-8 h-8" />
                </button>
              </div>

              {/* Elegant Progress Dots */}
              <div className="flex gap-3 justify-center mb-12">
                {featuredAccessories.slice(0, 4).map((_, index) => (
                  <button
                    key={index}
                    className={`w-4 h-4 rounded-full shadow-lg transition-all duration-500 border-2 border-zinc-300 ${
                      currentFeatured === index 
                        ? 'w-12 bg-gradient-to-r from-zinc-900 to-slate-900 scale-125 shadow-zinc-900/50 border-zinc-900' 
                        : 'bg-zinc-200 hover:bg-zinc-300 hover:scale-110'
                    }`}
                    onClick={() => setCurrentFeatured(index)}
                  />
                ))}
              </div>

              {/* Live Counter */}
              <div className="text-center text-zinc-600 font-mono text-xl font-black tracking-wider uppercase">
                Featured Collection • {currentFeatured + 1} / {featuredAccessories.length}
              </div>
            </div>
          </div>
        </section>

        {/* Diamond Precision Stats */}
        <div className="grid md:grid-cols-3 gap-12 mb-32">
          <div className="group p-12 rounded-[3rem] bg-gradient-to-br from-zinc-50/90 via-slate-50/90 to-stone-50/90 backdrop-blur-xl shadow-3xl border border-zinc-200/30 hover:shadow-[0_50px_100px_rgba(0,0,0,0.15)] hover:-translate-y-4 transition-all duration-1000 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 -skew-x-3 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
            <ShoppingBag className="w-24 h-24 text-zinc-800 mx-auto mb-8 group-hover:text-emerald-600 group-hover:scale-110 transition-all duration-700 drop-shadow-2xl" />
            <div className="text-6xl font-black text-zinc-900 mb-6 group-hover:text-slate-950 drop-shadow-2xl">
              {filteredProducts.length}+
            </div>
            <div className="text-zinc-800 font-black text-2xl uppercase tracking-widest group-hover:text-zinc-950">
              Masterpieces
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] font-black text-emerald-600 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
              Curated Selection
            </div>
          </div>

          <div className="group p-12 rounded-[3rem] bg-gradient-to-br from-zinc-50/90 via-slate-50/90 to-stone-50/90 backdrop-blur-xl shadow-3xl border border-zinc-200/30 hover:shadow-[0_50px_100px_rgba(0,0,0,0.15)] hover:-translate-y-4 transition-all duration-1000 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-gold-400/20 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
            <Crown className="w-24 h-24 text-amber-600 mx-auto mb-8 group-hover:scale-110 group-hover:text-amber-700 transition-all duration-700 drop-shadow-2xl" />
            <div className="text-6xl font-black bg-gradient-to-r from-amber-600 to-gold-500 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
              4.9
            </div>
            <div className="flex items-center justify-center gap-2 mb-8">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className="w-10 h-10 fill-amber-400 text-amber-400 drop-shadow-xl" />
              ))}
            </div>
            <div className="text-zinc-800 font-black text-2xl uppercase tracking-widest group-hover:text-zinc-950">
              Heritage Rating
            </div>
          </div>

          <div className="group p-12 rounded-[3rem] bg-gradient-to-br from-zinc-50/90 via-slate-50/90 to-stone-50/90 backdrop-blur-xl shadow-3xl border border-zinc-200/30 hover:shadow-[0_50px_100px_rgba(0,0,0,0.15)] hover:-translate-y-4 transition-all duration-1000 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
            <Package className="w-24 h-24 text-emerald-600 mx-auto mb-8 group-hover:scale-110 group-hover:text-emerald-700 transition-all duration-700 drop-shadow-2xl" />
            <div className="text-6xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
              White Glove
            </div>
            <div className="text-zinc-800 font-black text-2xl uppercase tracking-widest group-hover:text-zinc-950">
              Delivery Service
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-4 rounded-3xl text-xl font-black tracking-wide opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-1000">
              24hr Dispatch
            </div>
          </div>
        </div>

        {/* Executive Layout */}
        <div className="grid lg:grid-cols-[420px_1fr] xl:grid-cols-[480px_1fr] 2xl:grid-cols-[520px_1fr] gap-16">
          {/* Executive Sidebar */}
          <div className="lg:sticky lg:top-32 self-start lg:h-[80vh] lg:overflow-y-auto">
            <div className="bg-white/85 backdrop-blur-3xl p-12 rounded-[4rem] shadow-3xl border border-zinc-200/40">
              <FilterSidebar
                categoryId="accessories"
                products={categoryProducts}
                filters={filters}
                dispatch={dispatch}
              />
            </div>
          </div>

          {/* Executive Product Gallery */}
          <div>
            <TopBar
              totalCount={filteredProducts.length}
              sortBy={filters.sortBy}
              onSortChange={handleSortChange}
              viewMode={filters.viewMode}
              onViewChange={handleViewChange}
            />

            {/* Diamond Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-10 pt-8">
              <ProductGrid 
                products={filteredProducts} 
                className="gap-10 [&>*]:hover:scale-[1.02] [&>*]:transition-all [&>*]:duration-500" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoriesPage;

