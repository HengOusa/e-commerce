import React, { createContext, useContext, useReducer, useEffect } from "react";

const WishlistContext = createContext();

const initialState = {
  items: [],
};

const loadWishlistFromStorage = () => {
  try {
    const stored = localStorage.getItem("ousa_wishlist");
    if (stored) {
      return { items: JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Failed to load wishlist from localStorage", e);
  }
  return initialState;
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_WISHLIST": {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (exists) return state;
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_FROM_WISHLIST": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }
    case "TOGGLE_WISHLIST": {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "CLEAR_WISHLIST": {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    wishlistReducer,
    initialState,
    loadWishlistFromStorage,
  );

  useEffect(() => {
    localStorage.setItem("ousa_wishlist", JSON.stringify(state.items));
  }, [state.items]);

  const addToWishlist = (product) => {
    dispatch({ type: "ADD_TO_WISHLIST", payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: productId });
  };

  const toggleWishlist = (product) => {
    dispatch({ type: "TOGGLE_WISHLIST", payload: product });
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  const isInWishlist = (productId) => {
    return state.items.some((item) => item.id === productId);
  };

  const getWishlistCount = () => {
    return state.items.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: state.items,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
