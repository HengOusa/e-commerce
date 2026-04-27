import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/home/HomePage";
import AboutPage from "./pages/about/AboutPage";
import ProductDetail from "./components/Prodcuts/ProductDetail";
import BuyOnePage from "./components/checkout/buy/BuyOnePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Product */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/buy/:id" element={<BuyOnePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
