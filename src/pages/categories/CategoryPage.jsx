import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/Prodcuts/ProductCard";
import { allProducts } from "../../data/products";
import { categories, shopCategories } from "../../data/products";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

const CategoryPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const categoryId = useParams().id;

  const category = categories.find((cat) => cat.id === categoryId);

  const categoryProducts = useMemo(() => {
    if (!categoryId) return [];

    // Filter products based on category keywords from ProductPage logic
    const catKeywords = {
      fruits: ["Banana", "Apple", "Orange", "Strawberry", "Grapes"],
      vegetables: ["Vegetables", "Tomato", "Potato", "Onion", "Carrot"],
      dairy: ["Milk", "Cheese", "Butter", "Yogurt", "Eggs"],
      "meat-fish": ["Meat", "Fish", "Chicken", "Beef", "Pork"],
      bakery: ["Bread", "Pastry", "Cake", "Cookie"],
      beverages: ["Juice", "Water", "Coffee", "Tea", "Soda"],
      grains: ["Rice", "Noodles", "Pasta", "Cereal"],
    };

    const keywords = catKeywords[categoryId] || [];
    return allProducts.filter((product) =>
      keywords.some((keyword) =>
        product.name.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );
  }, [categoryId]);

  const [scrollLeft, setScrollLeft] = useState(0);

  const scrollProducts = (direction) => {
    const container = document.querySelector(".category-products-scroll");
    if (!container) return;

    const scrollAmount = 320;
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === "next") {
      const newScroll = Math.min(currentScroll + scrollAmount, maxScroll);
      container.scrollTo({ left: newScroll, behavior: "smooth" });
    } else {
      const newScroll = Math.max(currentScroll - scrollAmount, 0);
      container.scrollTo({ left: newScroll, behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  if (!category || categoryProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center py-20">
          <ArrowLeft className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Category Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            No products available for this category or category doesn't exist.
          </p>
          <Link
            to="/products"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 mb-12 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
            {/* Category Icon & Image */}
            <div className="flex-shrink-0">
              <div className="text-6xl lg:text-8xl mb-4">{category.icon}</div>
              <img
                src={category.image}
                alt={category.name}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl shadow-xl object-cover"
              />
            </div>

            {/* Category Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent mb-4">
                {category.name}
              </h1>
              <p className="text-xl text-gray-600 mb-6 max-w-2xl leading-relaxed">
                {category.description} - Explore our freshest selection with{" "}
                {categoryProducts.length} premium products available.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 rounded-2xl border border-green-200 shadow-sm">
                  <span className="text-2xl font-bold text-green-700">
                    {categoryProducts.length}
                  </span>
                  <span className="text-sm text-green-600 font-medium ml-1">
                    Products
                  </span>
                </div>
                <Link
                  to="/products"
                  className="bg-white hover:bg-gray-50 text-green-700 px-6 py-3 rounded-2xl border-2 border-green-200 font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  All Categories
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
              Products in {category.name}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollProducts("prev")}
                className="w-12 h-12 bg-white border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scrollProducts("next")}
                className="w-12 h-12 bg-white border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="category-products-scroll hide-scrollbar flex gap-6 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {categoryProducts.map((product, index) => (
                <div key={product.id} className="snap-start flex-shrink-0">
                  <ProductCard product={product} priority={index < 4} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {categoryProducts.length}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Total Products
            </div>
          </div>
          <div className="text-center p-6 border-l border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.7</div>
            <div className="text-sm text-gray-600 font-medium">Avg Rating</div>
          </div>
          <div className="text-center p-6 border-l border-gray-200">
            <div className="text-3xl font-bold text-orange-600 mb-2">12k+</div>
            <div className="text-sm text-gray-600 font-medium">
              Sold This Month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
