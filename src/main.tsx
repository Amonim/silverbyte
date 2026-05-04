import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", savedTheme);
} else {
  document.documentElement.setAttribute("data-theme", "dark");
}

import './styles/variables.css'
import './styles/reset.css'
import './styles/global.css'
import './styles/layout.css'
import './styles/home.css'
import './styles/catalog.css'
import './styles/product.css'
import './styles/cart.css'
import './styles/auth.css'
import './styles/checkout.css'
import './styles/profile.css'
import './styles/chatbot.css'
import './styles/theme.css'
import './styles/responsive.css'
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
