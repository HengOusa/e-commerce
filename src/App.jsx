import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/home/HomePage";
import AboutPage from "./pages/about/AboutPage";
import ProductDetail from "./components/Prodcuts/ProductDetail";
import BuyOnePage from "./components/checkout/buy/BuyOnePage";
import CheckoutPage from "./components/checkout/CheckoutPage";
import CartPage from "./components/carts/CartPage";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { OrderProvider } from "./contexts/OrderContext";
import Wishlist from "./components/wishlist/Wishlist";
import OrderHistory from "./components/checkout/orders/OrderHistory";
import OrderTracking from "./components/checkout/orders/OrderTracking";
import ProductPage from "./pages/products/ProductPage";
import CategoryPage from "./pages/categories/CategoryPage";
import ShopCategoryPage from "./pages/shop/ShopCategoryPage";
import SecondaryLayout from "./layouts/SecondaryLayout";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <OrderProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                {/* Product */}
                <Route path="/products" element={<ProductPage />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/buy/:id" element={<BuyOnePage />} />
                {/* Cart */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                {/* Wishlist */}
                <Route path="/wishlist" element={<Wishlist />} />
                {/* Orders */}
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orders/:id" element={<OrderTracking />} />
              </Route>
              <Route element={<SecondaryLayout/>} >
                <Route path="/shop/:category" element={<ShopCategoryPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
