import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  ChevronRight,
  Package,
  CheckCircle2,
  Truck,
  Ban,
  Clock,
  ArrowUpDown,
  Download,
  RotateCcw,
  Eye,
  XCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingUp,
  Inbox,
} from "lucide-react";
import {
  useOrder,
  canCancelOrder,
  cancellationReasons,
} from "../../../contexts/OrderContext";
import { useCart } from "../../../contexts/CartContext";
import { generateInvoicePDF } from "../../../utils/invoiceGenerator";

const statusConfig = {
  placed: {
    label: "Placed",
    color: "bg-gray-100 text-gray-700",
    barColor: "bg-gray-300",
    icon: Package,
    step: 1,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    barColor: "bg-blue-400",
    icon: CheckCircle2,
    step: 2,
  },
  shipped: {
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-700",
    barColor: "bg-indigo-400",
    icon: Truck,
    step: 3,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-orange-100 text-orange-700",
    barColor: "bg-orange-400",
    icon: Truck,
    step: 4,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    barColor: "bg-green-500",
    icon: CheckCircle2,
    step: 5,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    barColor: "bg-red-400",
    icon: Ban,
    step: 0,
  },
};

const filterTabs = [
  { id: "all", label: "All Orders" },
  { id: "active", label: "Active" },
  { id: "placed", label: "Placed" },
  { id: "confirmed", label: "Confirmed" },
  { id: "shipped", label: "Shipped" },
  { id: "out_for_delivery", label: "Out for Delivery" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const sortOptions = [
  { id: "recent", label: "Most Recent" },
  { id: "oldest", label: "Oldest First" },
  { id: "highest", label: "Highest Total" },
  { id: "lowest", label: "Lowest Total" },
];

const formatDate = (iso) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (iso) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDateGroup = (iso) => {
  if (!iso) return "Earlier";
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays <= 7) return "This Week";
  if (diffDays <= 30) return "This Month";
  return "Earlier";
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const { orders, cancelOrder, getOrderById } = useOrder();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(5);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelCustomReason, setCancelCustomReason] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [reorderToast, setReorderToast] = useState(null);

  // Stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce(
      (sum, o) => sum + (o.status !== "cancelled" ? o.total || 0 : 0),
      0,
    );
    const activeOrders = orders.filter(
      (o) => !["delivered", "cancelled"].includes(o.status),
    ).length;
    const deliveredCount = orders.filter(
      (o) => o.status === "delivered",
    ).length;
    return { totalOrders, totalSpent, activeOrders, deliveredCount };
  }, [orders]);

  // Filter & Sort
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items?.some((item) => item.name?.toLowerCase().includes(q)),
      );
    }

    // Status filter
    if (activeFilter === "active") {
      result = result.filter(
        (o) => !["delivered", "cancelled"].includes(o.status),
      );
    } else if (activeFilter !== "all") {
      result = result.filter((o) => o.status === activeFilter);
    }

    // Sort
    switch (sortBy) {
      case "recent":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "highest":
        result.sort((a, b) => (b.total || 0) - (a.total || 0));
        break;
      case "lowest":
        result.sort((a, b) => (a.total || 0) - (b.total || 0));
        break;
      default:
        break;
    }

    return result;
  }, [orders, searchQuery, activeFilter, sortBy]);

  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOrders.length;

  const loadMore = () => setVisibleCount((c) => c + 5);

  const handleReorder = useCallback(
    (order) => {
      order.items?.forEach((item) => {
        addToCart(item, item.qty);
      });
      setReorderToast(`Added ${order.items?.length || 0} item(s) to cart`);
      setTimeout(() => setReorderToast(null), 3000);
    },
    [addToCart],
  );

  const openCancelModal = (order) => {
    setOrderToCancel(order);
    setCancelReason("");
    setCancelCustomReason("");
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setOrderToCancel(null);
    setCancelReason("");
    setCancelCustomReason("");
  };

  const confirmCancel = () => {
    if (!orderToCancel) return;
    const reason =
      cancelReason === "other"
        ? cancelCustomReason.trim()
        : cancellationReasons.find((r) => r.id === cancelReason)?.label;
    if (!reason) return;
    cancelOrder(orderToCancel.id, reason);
    closeCancelModal();
  };

  // Group orders by date
  const groupedOrders = useMemo(() => {
    const groups = {};
    visibleOrders.forEach((order) => {
      const group = getDateGroup(order.createdAt);
      if (!groups[group]) groups[group] = [];
      groups[group].push(order);
    });
    const groupOrder = ["Today", "This Week", "This Month", "Earlier"];
    return groupOrder
      .filter((g) => groups[g])
      .map((g) => ({ label: g, orders: groups[g] }));
  }, [visibleOrders]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  // Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Inbox className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-500 mb-8">
            You haven&apos;t placed any orders yet. Start shopping to see your
            orders here!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Reorder Toast */}
      {reorderToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{reorderToast}</span>
          <Link
            to="/cart"
            className="ml-2 text-xs underline hover:text-green-100"
          >
            View Cart
          </Link>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Orders
            </h1>
            <p className="text-gray-500 mt-1">
              Track, manage, and reorder your purchases
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-medium transition text-sm self-start"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop More
          </Link>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.totalOrders}
              </span>
            </div>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                ${stats.totalSpent.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-500">Total Spent</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.activeOrders}
              </span>
            </div>
            <p className="text-sm text-gray-500">Active Orders</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.deliveredCount}
              </span>
            </div>
            <p className="text-sm text-gray-500">Delivered</p>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(5);
              }}
              placeholder="Search by order ID or product name..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition text-sm bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setVisibleCount(5);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
              >
                <XCircle className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-10 pr-8 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition text-sm bg-white cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {filterTabs.map((tab) => {
            const count =
              tab.id === "all"
                ? orders.length
                : tab.id === "active"
                  ? orders.filter(
                      (o) => !["delivered", "cancelled"].includes(o.status),
                    ).length
                  : orders.filter((o) => o.status === tab.id).length;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id);
                  setVisibleCount(5);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {visibleOrders.length} of {filteredOrders.length} order
          {filteredOrders.length !== 1 ? "s" : ""}
          {searchQuery && ` for "${searchQuery}"`}
        </p>

        {/* Order Groups */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No orders found
            </h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedOrders.map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {group.label}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="space-y-4">
                  {group.orders.map((order) => {
                    const status =
                      statusConfig[order.status] || statusConfig.placed;
                    const StatusIcon = status.icon;
                    const firstItem = order.items?.[0];
                    const itemCount = order.items?.length || 0;
                    const totalQty =
                      order.items?.reduce((sum, i) => sum + i.qty, 0) || 0;
                    const canCancel = canCancelOrder(order);
                    const progressPercent =
                      order.status === "cancelled"
                        ? 0
                        : (status.step / 5) * 100;

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
                      >
                        {/* Order Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900">
                              {order.id}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDateTime(order.createdAt)}
                          </div>
                        </div>

                        {/* Progress Bar (non-cancelled) */}
                        {order.status !== "cancelled" && (
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                              <span>Progress</span>
                              <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${status.barColor}`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <div className="flex justify-between mt-1.5">
                              {[
                                "Placed",
                                "Confirmed",
                                "Shipped",
                                "Out",
                                "Delivered",
                              ].map((label, idx) => (
                                <span
                                  key={label}
                                  className={`text-[10px] ${
                                    idx < status.step
                                      ? "text-gray-700 font-medium"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Items Preview */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex -space-x-3">
                            {order.items?.slice(0, 4).map((item, idx) => (
                              <img
                                key={item.id}
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                                style={{ zIndex: 4 - idx }}
                              />
                            ))}
                            {itemCount > 4 && (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                                +{itemCount - 4}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {firstItem?.name}
                              {itemCount > 1 &&
                                ` and ${itemCount - 1} other item${itemCount > 2 ? "s" : ""}`}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {totalQty} item{totalQty !== 1 ? "s" : ""} total
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-gray-900 text-lg">
                              ${(order.total || 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {order.paymentMethod?.label || "Cash on Delivery"}
                            </p>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleReorder(order)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reorder
                          </button>
                          <button
                            onClick={() => generateInvoicePDF(order)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Invoice
                          </button>
                          {canCancel && (
                            <button
                              onClick={() => openCancelModal(order)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition ml-auto"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          )}
                          {order.status === "cancelled" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium bg-red-50 text-red-600 ml-auto">
                              <XCircle className="w-3.5 h-3.5" />
                              Refund: {order.refundStatus || "processing"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-green-500 text-gray-700 hover:text-green-700 font-medium rounded-full transition shadow-sm"
            >
              Load More Orders
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeCancelModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <button
              onClick={closeCancelModal}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Cancel Order?</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to cancel order{" "}
                <span className="font-medium">{orderToCancel?.id}</span>?
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium text-gray-700 text-left">
                Reason for cancellation
              </label>
              <div className="space-y-2">
                {cancellationReasons.map((reason) => (
                  <label
                    key={reason.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                      cancelReason === reason.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason.id}
                      checked={cancelReason === reason.id}
                      onChange={() => setCancelReason(reason.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                        cancelReason === reason.id
                          ? "border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {cancelReason === reason.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {reason.label}
                    </span>
                  </label>
                ))}
              </div>
              {cancelReason === "other" && (
                <textarea
                  value={cancelCustomReason}
                  onChange={(e) => setCancelCustomReason(e.target.value)}
                  placeholder="Please specify your reason..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition text-sm resize-none"
                  rows={3}
                />
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeCancelModal}
                className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition"
              >
                Keep Order
              </button>
              <button
                onClick={confirmCancel}
                disabled={
                  !cancelReason ||
                  (cancelReason === "other" && !cancelCustomReason.trim())
                }
                className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium rounded-full transition"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
