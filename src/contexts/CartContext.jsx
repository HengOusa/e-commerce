import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = {
  items: [],
};

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem("ousa_cart");
    if (stored) {
      return { items: JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Failed to load cart from localStorage", e);
  }
  return initialState;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      let newItems;
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, qty: item.qty + action.payload.qty }
            : item,
        );
      } else {
        newItems = [
          ...state.items,
          { ...action.payload.product, qty: action.payload.qty },
        ];
      }
      return { ...state, items: newItems };
    }
    case "REMOVE_FROM_CART": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }
    case "UPDATE_QTY": {
      if (action.payload.qty <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, qty: action.payload.qty }
            : item,
        ),
      };
    }
    case "CLEAR_CART": {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    loadCartFromStorage,
  );

  useEffect(() => {
    localStorage.setItem("ousa_cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, qty = 1) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { product, qty, id: product.id },
    });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateQuantity = (productId, qty) => {
    dispatch({ type: "UPDATE_QTY", payload: { id: productId, qty } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getCartCount = () => {
    return state.items.reduce((total, item) => total + item.qty, 0);
  };

  const getUniqueCartCount = () => {
    return state.items.length;
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const finalPrice =
        item.unit_price * (1 - (item.discount_percent || 0) / 100);
      return total + finalPrice * item.qty;
    }, 0);
  };

  const getSubtotal = () => getCartTotal();

  const getItemTotal = (item) => {
    const finalPrice =
      item.unit_price * (1 - (item.discount_percent || 0) / 100);
    return finalPrice * item.qty;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getUniqueCartCount,
        getCartTotal,
        getSubtotal,
        getItemTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
