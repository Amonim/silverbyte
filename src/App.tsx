import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { markDailyVisit } from "./utils/profile";
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
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./components/pages/admin/AdminLoginPage";
import AdminDashboardPage from "./components/pages/admin/AdminDashboardPage";
import AdminProductsPage from "./components/pages/admin/AdminProductsPage";
import AdminOrdersPage from "./components/pages/admin/AdminOrdersPage";
import AdminUsersPage from "./components/pages/admin/AdminUsersPage";
function App() {
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    markDailyVisit();
    const handleAuth = () => markDailyVisit();
    const handleAuthError = (e: Event) => {
      const customEvent = e as CustomEvent;
      setAuthError(customEvent.detail.message);

      setTimeout(() => {
        window.location.href = "/login";
        setAuthError(null);
      }, 3000);
    };

    window.addEventListener("auth-updated", handleAuth);
    window.addEventListener("auth-error", handleAuthError);
    return () => {
      window.removeEventListener("auth-updated", handleAuth);
      window.removeEventListener("auth-error", handleAuthError);
    };
  }, []);

  return (
    <BrowserRouter>
      {authError && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, background: "#ef4444", color: "white",
          padding: "1rem", textAlign: "center", zIndex: 9999, fontWeight: "bold"
        }}>
          {authError}
        </div>
      )}
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


        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
