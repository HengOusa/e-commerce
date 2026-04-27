import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  MapPin,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  Check,
  ShieldCheck,
  Award,
  Zap,
} from "lucide-react";
import { getProductById, allProducts } from "../../data/products";
import ProductCard from "./ProductCard";

// Accordion Item Component
const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-sm text-gray-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddedToBag, setIsAddedToBag] = useState(false);
  const relatedRef = useRef(null);
  const relatedIntervalRef = useRef(null);
  const [isRelatedAutoPlaying, setIsRelatedAutoPlaying] = useState(true);
  const [showRelatedArrows, setShowRelatedArrows] = useState(false);

  // Label colors (match ProductCard)
  const labelColors = {
    Sale: "bg-orange-500",
    "Best Sale": "bg-blue-600",
    "Hot Deal": "bg-red-600",
    Trending: "bg-purple-600",
    "Top Rated": "bg-yellow-500",
    "Save 15%": "bg-green-600",
    "Save 20%": "bg-green-600",
    New: "bg-teal-500",
    Limited: "bg-pink-600",
  };

  // Get product data
  useEffect(() => {
    setLoading(true);
    const foundProduct = getProductById(id);
    setProduct(foundProduct || null);
    setLoading(false);
    // Reset states when product changes
    setQuantity(1);
    setSelectedImage(0);
    setIsAddedToBag(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Generate gallery images (main image + 3 different related images)
  const galleryImages = product
    ? [
        product.image,
        `https://picsum.photos/seed/product${product.id}a/800/800`,
        `https://picsum.photos/seed/product${product.id}b/800/800`,
        `https://picsum.photos/seed/product${product.id}c/800/800`,
      ]
    : [];

  // Calculate final price
  const finalPrice = product?.unit_price
    ? (
        product.unit_price *
        (1 - (product.discount_percent || 0) / 100)
      ).toFixed(2)
    : "0.00";

  // Get related products (exclude current, take first 8)
  const relatedProducts = product
    ? allProducts.filter((p) => p.id !== product.id).slice(0, 8)
    : [];

  // Quantity handlers
  const decreaseQty = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increaseQty = () => setQuantity((prev) => prev + 1);

  // Image navigation handlers
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % galleryImages.length);
  };
  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  // Add to bag handler
  const handleAddToBag = () => {
    setIsAddedToBag(true);
    setTimeout(() => setIsAddedToBag(false), 2000);
  };

  // Scroll related products
  const scrollRelated = useCallback((direction) => {
    if (!relatedRef.current) return;
    const scrollAmount = 300;
    const currentScroll = relatedRef.current.scrollLeft;
    const maxScroll =
      relatedRef.current.scrollWidth - relatedRef.current.clientWidth;
    if (direction === "next") {
      const newScroll = Math.min(currentScroll + scrollAmount, maxScroll);
      relatedRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    } else {
      const newScroll = Math.max(currentScroll - scrollAmount, 0);
      relatedRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  }, []);

  // Auto scroll related products
  const autoScrollRelated = useCallback(() => {
    if (!relatedRef.current) return;
    const scrollAmount = 280;
    const currentScroll = relatedRef.current.scrollLeft;
    const maxScroll =
      relatedRef.current.scrollWidth - relatedRef.current.clientWidth;
    if (currentScroll >= maxScroll - 10) {
      relatedRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      relatedRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (isRelatedAutoPlaying) {
      relatedIntervalRef.current = setInterval(autoScrollRelated, 4000);
    }
    return () => clearInterval(relatedIntervalRef.current);
  }, [isRelatedAutoPlaying, autoScrollRelated]);

  // Stock status
  const getStockStatus = () => {
    if (!product) return null;
    if (product.qty > 20)
      return { text: "In Stock", color: "text-green-600", bg: "bg-green-50" };
    if (product.qty > 0)
      return {
        text: "Low Stock",
        color: "text-orange-600",
        bg: "bg-orange-50",
      };
    return { text: "Out of Stock", color: "text-red-600", bg: "bg-red-50" };
  };
  const stockStatus = getStockStatus();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // Product not found state
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="hover:text-green-600 transition-colors cursor-pointer">
              {product.shop || "Products"}
            </span>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails (Left on desktop, Bottom on mobile) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden pb-2 md:pb-0 md:w-20 shrink-0">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-green-400"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-fit-contain"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative aspect-square shadow bg-gray-50 rounded-2xl overflow-hidden group flex-1">
              <img
                src={galleryImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {/* Label Badge */}
              {product.label && (
                <span
                  className={`absolute top-4 left-1/2 -translate-x-1/2 ${
                    labelColors[product.label] || "bg-gray-700"
                  } text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md`}
                >
                  {product.label}
                </span>
              )}
              {/* Discount Badge */}
              {(product.discount_percent || 0) > 0 && (
                <span
                  className={`absolute ${
                    product.label ? "top-12" : "top-4"
                  } left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full`}
                >
                  -{product.discount_percent}%
                </span>
              )}
              {/* Share Button */}
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition hover:scale-110">
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition hover:scale-110 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:pointer-events-none lg:group-hover:pointer-events-auto"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition hover:scale-110 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:pointer-events-none lg:group-hover:pointer-events-auto"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col">
            {/* Shop Name */}
            <p className="text-sm text-gray-500 mb-1">
              {product.shop || "Ousa Store"}
            </p>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < product.rating.star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 fill-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating.point} ({product.sold?.toLocaleString() || 0}{" "}
                  sold)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${finalPrice}
              </span>
              {(product.discount_percent || 0) > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ${product.unit_price?.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Save $
                    {(product.unit_price - parseFloat(finalPrice)).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Experience premium quality with {product.name}. Sourced from the
              finest suppliers and delivered fresh to your doorstep. Perfect for
              daily use and guaranteed to exceed your expectations.
            </p>

            {/* Location */}
            {product.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <MapPin className="w-4 h-4" />
                <span>Ships from {product.location}</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">
                Quantity
              </span>
              <div className="flex items-center border border-gray-300 rounded-full">
                <button
                  onClick={decreaseQty}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={increaseQty}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {stockStatus && (
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stockStatus.bg} ${stockStatus.color}`}
                >
                  {stockStatus.text}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => navigate(`/buy/${product.id}?qty=${quantity}`)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-full font-semibold text-base transition-all duration-300 bg-black text-white hover:bg-gray-800`}
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToBag}
                className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isAddedToBag
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {isAddedToBag ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <ShoppingBag
                    className={`w-6 h-6 transition-colors ${
                      isAddedToBag ? "text-green-600" : "text-gray-600"
                    }`}
                  />
                )}
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isFavorite
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
                  }`}
                />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-green-600 mb-1.5" />
                <span className="text-xs font-medium text-gray-700">
                  Secure Payment
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                <Award className="w-6 h-6 text-green-600 mb-1.5" />
                <span className="text-xs font-medium text-gray-700">
                  Quality Guarantee
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                <Zap className="w-6 h-6 text-green-600 mb-1.5" />
                <span className="text-xs font-medium text-gray-700">
                  Fast Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Details */}
        <div className="border-t border-gray-200 mt-8">
          <AccordionItem title="Shipping & Delivery" defaultOpen={true}>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">
                    Free Standard Shipping
                  </p>
                  <p className="text-gray-500">Arrives in 3-5 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">
                    Express Delivery Available
                  </p>
                  <p className="text-gray-500">Get it tomorrow for $5.99</p>
                </div>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Returns & Exchanges">
            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-700">
                  30-Day Return Policy
                </p>
                <p className="text-gray-500">
                  Not satisfied? Return within 30 days for a full refund. Items
                  must be unused and in original packaging.
                </p>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Product Details">
            <div className="space-y-2">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Category</span>
                <span className="font-medium text-gray-700">
                  {product.shop || "General"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">SKU</span>
                <span className="font-medium text-gray-700">
                  OSA-{product.id.toString().padStart(4, "0")}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Stock</span>
                <span className="font-medium text-gray-700">
                  {product.qty || "In Stock"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Location</span>
                <span className="font-medium text-gray-700">
                  {product.location || "Phnom Penh"}
                </span>
              </div>
            </div>
          </AccordionItem>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="bg-gray-50 py-12 mt-8">
          <div className="max-w-7xl mx-auto px-2 sm:px-0 lg:px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-green-700">
                You Might Also Like
              </h2>
              <a
                href="/products"
                className="text-sm sm:text-base text-green-600 hover:text-green-800 font-medium transition"
              >
                View All →
              </a>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setShowRelatedArrows(true)}
              onMouseLeave={() => setShowRelatedArrows(false)}
            >
              {/* Left Scroll Button */}
              <button
                onClick={() => scrollRelated("prev")}
                className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 ${showRelatedArrows ? "opacity-100" : "opacity-0"}`}
                aria-label="Scroll left"
              >
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </button>

              {/* Right Scroll Button */}
              <button
                onClick={() => scrollRelated("next")}
                className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 ${showRelatedArrows ? "opacity-100" : "opacity-0"}`}
                aria-label="Scroll right"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>

              <div
                ref={relatedRef}
                className="hide-scrollbar flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-6 pt-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                onMouseEnter={() => setIsRelatedAutoPlaying(false)}
                onMouseLeave={() => setIsRelatedAutoPlaying(true)}
              >
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
