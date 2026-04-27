import React, { useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  ChevronLeft,
  Minus,
  Plus,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Building,
  Check,
  Package,
  Clock,
  AlertCircle,
} from "lucide-react";
import { getProductById } from "../../../data/products";

const BuyOnePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQty = parseInt(searchParams.get("qty")) || 1;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(initialQty);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Form states
  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Cambodia",
  });

  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Delivery options
  const deliveryOptions = [
    {
      id: "standard",
      label: "Standard Shipping",
      description: "3-5 business days",
      price: 0,
      icon: Truck,
    },
    {
      id: "express",
      label: "Express Delivery",
      description: "1-2 business days",
      price: 5.99,
      icon: Clock,
    },
    {
      id: "sameDay",
      label: "Same Day Delivery",
      description: "Within 4 hours (Phnom Penh only)",
      price: 9.99,
      icon: Package,
    },
  ];

  // Payment options
  const paymentOptions = [
    { id: "cod", label: "Cash on Delivery", icon: Banknote },
    { id: "card", label: "Credit / Debit Card", icon: CreditCard },
    { id: "wallet", label: "Mobile Wallet", icon: Smartphone },
  ];

  // Load product
  useEffect(() => {
    setLoading(true);
    const found = getProductById(id);
    setProduct(found || null);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Calculations
  const unitPrice = product?.unit_price || 0;
  const discountPercent = product?.discount_percent || 0;
  const finalUnitPrice = unitPrice * (1 - discountPercent / 100);
  const subtotal = finalUnitPrice * quantity;
  const shipping =
    deliveryOptions.find((d) => d.id === deliveryMethod)?.price || 0;
  const discountAmount = (unitPrice - finalUnitPrice) * quantity;
  const total = subtotal + shipping;

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email address";

    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.postalCode.trim())
      newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      setOrderSuccess(true);
    }, 2000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The product you are trying to buy does not exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Order success state
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Order Placed!
          </h2>
          <p className="text-gray-500 mb-2">
            Thank you, {form.firstName}. Your order has been received.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <p className="font-medium text-gray-900 text-sm line-clamp-1">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">Qty: {quantity}</p>
              </div>
              <span className="ml-auto font-semibold text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-full transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-29 md:z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to={`/product/${product.id}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">
              Back to Product
            </span>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Checkout
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT COLUMN — Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact Info */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.email ? "border-red-300" : "border-gray-200"
                      } focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition text-sm`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+855 12 345 678"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.phone ? "border-red-300" : "border-gray-200"
                      } focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition text-sm`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.firstName ? "border-red-300" : "border-gray-200"
                      } focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition text-sm`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.lastName ? "border-red-300" : "border-gray-200"
                      } focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition text-sm`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Street Address
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="123 Main Street, Apartment 4B"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.address ? "border-red-300" : "border-gray-200"
                      } focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition text-sm`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Phnom Penh"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.city ? "border-red-300" : "border-gray-200"
                      } focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition text-sm`}
                    />
                  </div>
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="12000"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.postalCode ? "border-red-300" : "border-gray-200"
                    } focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition text-sm`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition text-sm bg-white"
                  >
                    <option value="Cambodia">Cambodia</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Laos">Laos</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                Delivery Method
              </h2>
              <div className="space-y-3">
                {deliveryOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = deliveryMethod === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => setDeliveryMethod(option.id)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                          isSelected ? "border-green-500" : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {option.description}
                        </p>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        {option.price === 0
                          ? "Free"
                          : `$${option.price.toFixed(2)}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Payment Method
              </h2>
              <div className="space-y-3">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = paymentMethod === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => setPaymentMethod(option.id)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                          isSelected ? "border-green-500" : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Card details mock (only shown when card selected) */}
              {paymentMethod === "card" && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 outline-none text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN — Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                Order Summary
              </h2>

              {/* Product */}
              <div className="flex gap-4 mb-5 pb-5 border-b border-gray-100">
                <div className="relative shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-gray-100"
                  />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{product.shop}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-green-600 font-bold text-sm">
                      ${finalUnitPrice.toFixed(2)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-gray-400 text-xs line-through">
                        ${unitPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-200 rounded-full">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-medium text-sm text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-green-600">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-4 rounded-full transition flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure checkout powered by Ousa Pay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyOnePage;
