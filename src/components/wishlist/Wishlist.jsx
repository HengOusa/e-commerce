import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  X,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";
import { useWishlist } from "../../contexts/WishlistContext";
import { useCart } from "../../contexts/CartContext";
import { useEffect } from "react";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist, isInWishlist } =
    useWishlist();
  const { addToCart } = useCart();

  const [modalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const openRemoveModal = (item) => {
    setItemToRemove(item);
    setModalOpen(true);
  };

  const closeRemoveModal = () => {
    setModalOpen(false);
    setItemToRemove(null);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      if (itemToRemove.id === "all") {
        clearWishlist();
      } else {
        removeFromWishlist(itemToRemove.id);
      }
    }
    closeRemoveModal();
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart(item, 1);
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven&apos;t added anything to your wishlist yet.
            Browse our products and save your favorites!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">My Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Wishlist
            <span className="ml-3 text-base font-normal text-gray-500">
              ({wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"})
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddAllToCart}
              className="hidden sm:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            >
              <ShoppingCart className="w-4 h-4" />
              Add All to Cart
            </button>
            <button
              onClick={() => openRemoveModal({ id: "all", name: "all items" })}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors px-4 py-2.5 rounded-full hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const finalPrice = (
              product.unit_price *
              (1 - (product.discount_percent || 0) / 100)
            ).toFixed(2);
            const wasAdded = addedIds.has(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Image */}
                <div className="relative w-full h-52 overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  />

                  {/* Discount Badge */}
                  {(product.discount_percent || 0) > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                      -{product.discount_percent}%
                    </span>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => openRemoveModal(product)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center shadow-sm transition hover:scale-110"
                    aria-label="Remove from wishlist"
                  >
                    <X className="w-4 h-4 text-gray-500 hover:text-red-500 transition" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-gray-500 mb-1">{product.shop}</p>
                  <Link
                    to={`/product/${product.id}`}
                    className="font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2 mb-2"
                  >
                    {product.name}
                  </Link>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < product.rating.star
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 fill-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {product.rating.point}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-green-600 font-bold text-lg">
                      ${finalPrice}
                    </span>
                    {(product.discount_percent || 0) > 0 && (
                      <span className="text-gray-400 text-xs line-through">
                        ${product.unit_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                        wasAdded
                          ? "bg-green-500 text-white"
                          : "bg-black hover:bg-gray-800 text-white"
                      }`}
                    >
                      {wasAdded ? (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => navigate(`/buy/${product.id}`)}
                      className="px-4 py-2.5 border border-gray-300 hover:border-green-500 hover:text-green-600 rounded-full text-sm font-medium text-gray-700 transition"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Add All Button */}
        <div className="sm:hidden mt-6">
          <button
            onClick={handleAddAllToCart}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            Add All to Cart
          </button>
        </div>

        {/* Continue Shopping */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors mt-8"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Continue Shopping
        </Link>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeRemoveModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
            <button
              onClick={closeRemoveModal}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {itemToRemove?.id === "all"
                  ? "Clear Wishlist?"
                  : "Remove Item?"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {itemToRemove?.id === "all"
                  ? "Are you sure you want to remove all items from your wishlist? This action cannot be undone."
                  : `Are you sure you want to remove "${itemToRemove?.name}" from your wishlist?`}
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={closeRemoveModal}
                  className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
