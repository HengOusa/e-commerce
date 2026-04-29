import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Package,
  ChevronLeft,
  MapPin,
  Truck,
  CreditCard,
  Download,
  Eye,
  Printer,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Ban,
  ShoppingBag,
} from "lucide-react";
import {
  useOrder,
  canCancelOrder,
  cancellationReasons,
} from "../../../contexts/OrderContext";
import {
  generateInvoicePDF,
  viewInvoicePDF,
  printInvoicePDF,
} from "../../../utils/invoiceGenerator";
import DeliveryMap from "./DeliveryMap";

const statusConfig = {
  placed: {
    label: "Placed",
    color: "bg-gray-100 text-gray-700",
    icon: Package,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-700",
    icon: Truck,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-orange-100 text-orange-700",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: Ban,
  },
};

const formatDate = (iso) => {
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

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cancelOrder, getOrderById } = useOrder();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelCustomReason, setCancelCustomReason] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);

  const selectedOrder = id ? getOrderById(id) : null;

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

  // Order not found state
  if (!selectedOrder) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-500 mb-8">
            We couldn&apos;t find an order with ID <strong>{id}</strong>. It may
            have been removed or the ID is incorrect.
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[selectedOrder.status] || statusConfig.placed;
  const StatusIcon = status.icon;
  const isCancelled = selectedOrder.status === "cancelled";
  const canCancel = canCancelOrder(selectedOrder);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Orders</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order {selectedOrder.id}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {formatDate(selectedOrder.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}
              >
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </span>
              {canCancel && (
                <button
                  onClick={() => openCancelModal(selectedOrder)}
                  className="px-4 py-2 rounded-full text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {isCancelled && selectedOrder.cancellationReason && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700 text-sm">
                    Order Cancelled
                  </p>
                  <p className="text-sm text-red-600 mt-0.5">
                    Reason: {selectedOrder.cancellationReason}
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    Refund status: {selectedOrder.refundStatus || "processing"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Tracking Timeline
              </h2>
              <div className="space-y-0">
                {(selectedOrder.trackingSteps || []).map((step, index) => {
                  const isCompleted = step.completed;
                  const isCurrent =
                    isCompleted &&
                    !selectedOrder.trackingSteps[index + 1]?.completed;
                  const isLast =
                    index === (selectedOrder.trackingSteps || []).length - 1;

                  return (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${
                            isCompleted
                              ? isCancelled && step.status !== "placed"
                                ? "bg-red-100 border-red-300 text-red-600"
                                : "bg-green-100 border-green-500 text-green-600"
                              : "bg-gray-50 border-gray-200 text-gray-300"
                          }`}
                        >
                          {isCompleted ? (
                            isCancelled && step.status !== "placed" ? (
                              <Ban className="w-4 h-4" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5" />
                            )
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 min-h-[2rem] ${
                              isCompleted
                                ? isCancelled && step.status !== "placed"
                                  ? "bg-red-200"
                                  : "bg-green-300"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-6">
                        <p
                          className={`font-semibold text-sm ${
                            isCompleted
                              ? isCancelled && step.status !== "placed"
                                ? "text-red-700"
                                : "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                          {isCurrent && !isCancelled && (
                            <span className="ml-2 text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {step.description}
                        </p>
                        {step.timestamp && (
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(step.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                Order Items
              </h2>
              <div className="space-y-4">
                {(selectedOrder.items || []).map((item) => {
                  const unitFinal =
                    item.unit_price * (1 - (item.discount_percent || 0) / 100);
                  const itemTotal = unitFinal * item.qty;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.shop}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-green-600 font-bold text-sm">
                            ${unitFinal.toFixed(2)}
                          </span>
                          {item.discount_percent > 0 && (
                            <span className="text-gray-400 text-xs line-through">
                              ${item.unit_price.toFixed(2)}
                            </span>
                          )}
                          <span className="text-gray-400 text-xs">
                            × {item.qty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-gray-900 text-sm">
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">
                    ${(selectedOrder.subtotal || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900">
                    {selectedOrder.shipping === 0
                      ? "Free"
                      : `$${selectedOrder.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${(selectedOrder.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Delivery Map */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Delivery Map
              </h2>
              <DeliveryMap order={selectedOrder} />
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Shipping Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.customer?.firstName}{" "}
                      {selectedOrder.customer?.lastName}
                    </p>
                    <p className="text-gray-500">
                      {selectedOrder.customer?.address}
                    </p>
                    <p className="text-gray-500">
                      {selectedOrder.customer?.city},{" "}
                      {selectedOrder.customer?.postalCode}
                    </p>
                    <p className="text-gray-500">
                      {selectedOrder.customer?.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">
                    {selectedOrder.deliveryMethod?.label || "Standard Shipping"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">
                    {selectedOrder.paymentMethod?.label || "Cash on Delivery"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
              <button
                onClick={() => generateInvoicePDF(selectedOrder)}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-full transition"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
              <button
                onClick={() => viewInvoicePDF(selectedOrder)}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-full transition"
              >
                <Eye className="w-4 h-4" />
                View Invoice
              </button>
              <button
                onClick={() => printInvoicePDF(selectedOrder)}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-full transition"
              >
                <Printer className="w-4 h-4" />
                Print Invoice
              </button>
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 rounded-full transition"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
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
              <X className="w-5 h-5" />
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

export default OrderTracking;
