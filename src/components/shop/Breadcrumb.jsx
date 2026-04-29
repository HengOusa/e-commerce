import React from "react";
import { Link, useParams } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { shopCategories } from "../../data/products";

const Breadcrumb = ({ categoryId }) => {
  const category = shopCategories.find((cat) => cat.id === categoryId);
  const categoryName = category ? category.name : "Category";

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 max-w-2xl">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-green-600 transition-colors font-medium"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
      <Link
        to="/shop"
        className="hover:text-green-600 transition-colors font-medium"
      >
        Shop
      </Link>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
      <span className="font-semibold text-gray-900 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
        {categoryName}
      </span>
    </nav>
  );
};

export default Breadcrumb;
