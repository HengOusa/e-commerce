import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown, Loader2, AlertCircle } from "lucide-react";
import ProductCard from "../Prodcuts/ProductCard";
import { allProducts } from "../../data/products";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="w-full h-52 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-2xl"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
        ))}
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

const ProductGrid = ({ products, className = "" }) => {
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setVisibleCount((prev) => prev + 12);
    setIsLoading(false);
  }, []);

  const visibleProducts = products.slice(0, visibleCount);

  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
        <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
          Try adjusting your filters or search terms to see more results.
        </p>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <ChevronDown className="w-5 h-5 rotate-180" />
          Browse All Products
        </button>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 ${className}`}
    >
      {visibleProducts.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 8}
          className="group/product hover:-translate-y-2 transition-all duration-300"
        />
      ))}

      {/* Skeletons if more to load */}
      {visibleCount < products.length &&
        Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}

      {/* Load More Button */}
      {visibleCount < products.length && (
        <div className="col-span-full flex justify-center pt-12">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="group flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading more...
              </>
            ) : (
              <>
                Load More Products
                <ChevronDown className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
