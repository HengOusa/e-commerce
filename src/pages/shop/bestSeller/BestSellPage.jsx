import React, { useReducer, useMemo, useEffect } from "react";
import ProductGrid from "../../../components/shop/ProductGrid";
import Breadcrumb from "../../../components/shop/Breadcrumb";
import TopBar from "../../../components/shop/TopBar";
import { allProducts } from "../../../data/products";
import { ChevronDown, Star, TrendingUp, Fire, Crown } from "lucide-react";

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.key]: action.value };
    case "TOGGLE_MIN_RATING":
      return {
        ...state,
        minRating: state.minRating === action.rating ? 0 : action.rating,
      };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.mode };
    default:
      return state;
  }
};

const BestSellPage = () => {
  const [filters, dispatch] = useReducer(filterReducer, {
    sortBy: "bestsellers",
    minRating: 0,
    viewMode: "grid",
  });

  // Top best sellers (highest sold first)
  const bestSellers = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 48); // Top 48 best sellers
  }, []);

  const filteredProducts = useMemo(() => {
    let results = [...bestSellers];

    if (filters.minRating > 0) {
      results = results.filter(
        (p) => (p.rating?.point || 0) >= filters.minRating,
      );
    }

    const sortFns = {
      bestsellers: (a, b) => (b.sold || 0) - (a.sold || 0),
      rating: (a, b) => (b.rating?.point || 0) - (a.rating?.point || 0),
      newest: (a, b) => (b.id || 0) - (a.id || 0),
    };

    results.sort(sortFns[filters.sortBy]);

    return results;
  }, [bestSellers, filters]);

  useEffect(() => {
    document.title = "Best Sellers - Top Trending | Ousa";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb categoryId="best-sellers" />

        {/* Best Sellers Hero */}
        <div className="text-center mb-20 bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 p-20 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-10 right-10 opacity-20">
            <Fire className="w-32 h-32 text-red-400" />
          </div>
          <div className="inline-block p-6 mb-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl shadow-2xl">
            <Star className="w-24 h-24 text-white" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-orange-900 to-red-900 bg-clip-text text-transparent mb-6">
            Best Sellers
          </h1>
          <p className="text-xl lg:text-3xl text-slate-700 max-w-4xl mx-auto mb-16">
            🔥 Shop what everyone loves! Our top trending products bought by
            thousands.
          </p>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur p-8 rounded-3xl shadow-2xl border border-yellow-200">
              <TrendingUp className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <div className="text-4xl font-black text-slate-900 mb-2">
                #1 Trending
              </div>
              <div className="text-yellow-600 font-bold text-xl">Today</div>
            </div>
            <div className="bg-white/80 backdrop-blur p-8 rounded-3xl shadow-2xl border border-orange-200">
              <Crown className="w-20 h-20 text-orange-500 mx-auto mb-4" />
              <div className="text-4xl font-black text-slate-900 mb-2">
                12K+
              </div>
              <div className="text-orange-600 font-bold text-xl">
                Sold Weekly
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur p-8 rounded-3xl shadow-2xl border border-red-200">
              <Fire className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <div className="text-4xl font-black text-slate-900 mb-2">
                4.9⭐
              </div>
              <div className="text-red-600 font-bold text-xl">Avg Rating</div>
            </div>
            <div className="bg-white/80 backdrop-blur p-8 rounded-3xl shadow-2xl border border-amber-200">
              <Users className="w-20 h-20 text-amber-500 mx-auto mb-4" />
              <div className="text-4xl font-black bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent mb-2">
                Loved by
              </div>
              <div className="text-amber-600 font-bold text-xl">
                10K+ Shoppers
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            {/* Simple Best Seller filters */}
            <div className="bg-white/70 backdrop-blur p-8 rounded-3xl shadow-xl border border-yellow-100 sticky top-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Fire className="w-8 h-8 text-red-500" />
                Hot Filters
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() =>
                    dispatch({ type: "TOGGLE_MIN_RATING", rating: 4 })
                  }
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                    filters.minRating >= 4
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 shadow-md"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4⭐ & Above</span>
                </button>
                <button
                  onClick={() =>
                    dispatch({ type: "TOGGLE_MIN_RATING", rating: 5 })
                  }
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                    filters.minRating >= 5
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 shadow-md"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="flex gap-0.5">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                  </div>
                  <span className="font-semibold">Perfect 5⭐</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <TopBar
              totalCount={filteredProducts.length}
              sortBy={filters.sortBy}
              onSortChange={(value) =>
                dispatch({ type: "SET_FILTER", key: "sortBy", value })
              }
              viewMode={filters.viewMode}
              onViewChange={(mode) => dispatch({ type: "SET_VIEW_MODE", mode })}
            />
            <ProductGrid
              products={filteredProducts}
              className="lg:grid-cols-4 xl:grid-cols-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellPage;
