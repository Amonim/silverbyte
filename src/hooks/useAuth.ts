import { useEffect, useState } from "react";
import type { CurrentUser } from "../types/auth";
import {
  getCurrentUser,
  isAuthenticated,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/authApi";

function useAuth() {
  const [user, setUser] = useState<CurrentUser | null>(getCurrentUser());
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const syncAuth = () => {
    setUser(getCurrentUser());
    setAuthenticated(isAuthenticated());
  };

  useEffect(() => {
    window.addEventListener("auth-updated", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth-updated", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  return {
    user,
    authenticated,
    registerUser,
    loginUser,
    logoutUser,
    syncAuth,
  };
}

export default useAuth;
