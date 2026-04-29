import React, { createContext, useContext, useReducer, useEffect } from "react";

const OrderContext = createContext();

const initialState = {
  orders: [],
};

const loadOrdersFromStorage = () => {
  try {
    const stored = localStorage.getItem("ousa_orders");
    if (stored) {
      return { orders: JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Failed to load orders from localStorage", e);
  }
  return initialState;
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ORDER": {
      const newOrders = [action.payload, ...state.orders];
      return { ...state, orders: newOrders };
    }
    case "SET_ORDERS": {
      return { ...state, orders: action.payload };
    }
    case "CANCEL_ORDER": {
      const updatedOrders = state.orders.map((o) =>
        o.id === action.payload.orderId
          ? {
              ...o,
              status: "cancelled",
              cancelledAt: new Date().toISOString(),
              cancellationReason: action.payload.reason,
              refundStatus: "processing",
              trackingSteps: o.trackingSteps?.map((step) =>
                step.status !== "placed"
                  ? { ...step, completed: false, timestamp: null }
                  : step,
              ),
            }
          : o,
      );
      return { ...state, orders: updatedOrders };
    }
    default:
      return state;
  }
};

const generateOrderId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "OUS-";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export const canCancelOrder = (order) => {
  if (!order) return false;
  if (order.status === "cancelled") return false;
  if (!["placed", "confirmed"].includes(order.status)) return false;

  // Must be within 24 hours of order creation
  const created = new Date(order.createdAt);
  const now = new Date();
  const hoursDiff = (now - created) / (1000 * 60 * 60);
  return hoursDiff <= 24;
};

export const cancellationReasons = [
  { id: "changed_mind", label: "Changed my mind" },
  { id: "cheaper_elsewhere", label: "Found cheaper elsewhere" },
  { id: "ordered_by_mistake", label: "Ordered by mistake" },
  { id: "shipping_too_slow", label: "Shipping too slow" },
  { id: "other", label: "Other" },
];

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    orderReducer,
    initialState,
    loadOrdersFromStorage,
  );

  useEffect(() => {
    localStorage.setItem("ousa_orders", JSON.stringify(state.orders));
  }, [state.orders]);

  const addOrder = (orderData) => {
    const order = {
      id: generateOrderId(),
      ...orderData,
      createdAt: new Date().toISOString(),
      status: "placed",
      // Mock coordinates for Phnom Penh area
      originCoordinates: [11.5564, 104.9282],
      deliveryCoordinates: [
        11.5449 + (Math.random() - 0.5) * 0.05,
        104.8922 + (Math.random() - 0.5) * 0.05,
      ],
      trackingSteps: [
        {
          status: "placed",
          label: "Order Placed",
          description: "Your order has been received and is being processed.",
          timestamp: new Date().toISOString(),
          completed: true,
        },
        {
          status: "confirmed",
          label: "Order Confirmed",
          description:
            "Your order has been confirmed and prepared for shipping.",
          timestamp: null,
          completed: false,
        },
        {
          status: "shipped",
          label: "Shipped",
          description: "Your order has been shipped and is on the way.",
          timestamp: null,
          completed: false,
        },
        {
          status: "out_for_delivery",
          label: "Out for Delivery",
          description: "Your order is out for delivery with our courier.",
          timestamp: null,
          completed: false,
        },
        {
          status: "delivered",
          label: "Delivered",
          description: "Your order has been delivered. Enjoy!",
          timestamp: null,
          completed: false,
        },
      ],
    };
    dispatch({ type: "ADD_ORDER", payload: order });
    return order.id;
  };

  const setOrders = (orders) => {
    dispatch({ type: "SET_ORDERS", payload: orders });
  };

  const cancelOrder = (orderId, reason) => {
    dispatch({ type: "CANCEL_ORDER", payload: { orderId, reason } });
  };

  const getOrderById = (orderId) => {
    return state.orders.find((o) => o.id === orderId) || null;
  };

  const getAllOrders = () => state.orders;

  const getLatestOrder = () => {
    return state.orders.length > 0 ? state.orders[0] : null;
  };

  return (
    <OrderContext.Provider
      value={{
        orders: state.orders,
        addOrder,
        setOrders,
        cancelOrder,
        getOrderById,
        getAllOrders,
        getLatestOrder,
        canCancelOrder,
        cancellationReasons,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
