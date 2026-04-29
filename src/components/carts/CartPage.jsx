import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  X,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getItemTotal,
  } = useCart();

  const [modalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleQtyChange = (item, delta) => {
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      openRemoveModal(item);
    } else {
      updateQuantity(item.id, newQty);
    }
  };

  const openRemoveModal = (item) => {
    setItemToRemove(item);
    setModalQty(item.qty || 1);
    setModalOpen(true);
  };

  const closeRemoveModal = () => {
    setModalOpen(false);
    setItemToRemove(null);
    setModalQty(1);
  };

  const handleUpdateQty = () => {
    const qty = parseInt(modalQty, 10);
    if (!isNaN(qty) && qty > 0 && itemToRemove && itemToRemove.id !== "all") {
      updateQuantity(itemToRemove.id, qty);
      closeRemoveModal();
    }
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      if (itemToRemove.id === "all") {
        clearCart();
      } else {
        removeFromCart(itemToRemove.id);
      }
    }
    closeRemoveModal();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven&apos;t added anything to your cart yet. Start
            shopping to discover amazing products!
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
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shopping Cart
            <span className="ml-3 text-base font-normal text-gray-500">
              ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
            </span>
          </h1>
          <button
            onClick={() => openRemoveModal({ id: "all", name: "all items" })}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const unitFinalPrice =
                item.unit_price * (1 - (item.discount_percent || 0) / 100);
              const originalPrice = item.unit_price;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6 transition hover:shadow-md"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-28 h-28 shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {item.shop}
                        </p>
                        <Link
                          to={`/product/${item.id}`}
                          className="font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.location}
                        </p>
                      </div>
                      <button
                        onClick={() => openRemoveModal(item)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 mr-1">Qty:</span>
                        <div className="flex items-center border border-gray-200 rounded-full">
                          <button
                            onClick={() => handleQtyChange(item, -1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition text-gray-600"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={item.qty}
                            onChange={(e) => {
                              const val = parseInt(
                                e.target.value.replace(/\D/g, ""),
                                10,
                              );
                              if (isNaN(val) || val <= 0) {
                                openRemoveModal(item);
                              } else {
                                updateQuantity(item.id, val);
                              }
                            }}
                            className="w-12 text-center text-sm font-semibold text-gray-900 bg-transparent border-none focus:outline-none"
                          />
                          <button
                            onClick={() => handleQtyChange(item, 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition text-gray-600"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ${getItemTotal(item).toFixed(2)}
                        </p>
                        {item.discount_percent > 0 && (
                          <div className="flex items-center gap-2 justify-end mt-0.5">
                            <span className="text-xs text-gray-400 line-through">
                              ${(originalPrice * item.qty).toFixed(2)}
                            </span>
                            <span className="text-xs text-green-600 font-medium">
                              -{item.discount_percent}%
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          ${unitFinalPrice.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors mt-4"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-medium text-gray-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                {/* Discount placeholder */}
                <div className="pt-3 border-t border-dashed border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
                    />
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-3.5 rounded-full font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Truck className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Secure checkout guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <RotateCcw className="w-4 h-4 text-green-500 shrink-0" />
                  <span>30-day hassle-free returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  ? "Remove All Items?"
                  : "Remove Item?"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {itemToRemove?.id === "all"
                  ? "Are you sure you want to remove all items from your cart? This action cannot be undone."
                  : `Are you sure you want to remove "${itemToRemove?.name}" from your cart?`}
              </p>

              {itemToRemove?.id !== "all" && (
                <div className="w-full mb-4">
                  <label className="block text-xs text-gray-500 mb-1 text-left">
                    Quantity
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={modalQty}
                    onChange={(e) =>
                      setModalQty(
                        parseInt(e.target.value.replace(/\D/g, ""), 10) || "",
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-400 text-center"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 w-full">
                {itemToRemove?.id !== "all" && (
                  <button
                    onClick={handleUpdateQty}
                    className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition"
                  >
                    Update Quantity
                  </button>
                )}
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
        </div>
      )}
    </div>
  );
};

export default CartPage;
