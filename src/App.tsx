import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/HomePage";
import Catalog from "./components/pages/CatalogPage";
import Product from "./components/pages/ProductPage";
import CartPage from "./components/pages/CartPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import FavoritesPage from "./components/pages/FavoritesPage";
import ScrollToTop from "./components/ScrollToTop";
import CheckoutPage from "./components/pages/CheckoutPage";
import ProfilePage from "./components/pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
