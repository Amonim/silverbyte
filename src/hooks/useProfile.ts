import { useState, useEffect } from "react";
import { getUserOrders, getUserXP } from "../api/ordersApi";
import { calculateProfileStats } from "../utils/profile";
import type { Order } from "../types/order";
import type { ProfileStats } from "../types/profile";
import useAuth from "./useAuth";

export default function useProfile() {
  const { user, authenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<ProfileStats | null>(null);

  const updateProfileData = async () => {
    if (authenticated && user?.email) {
      try {
        const [apiOrders, backendXP] = await Promise.all([
          getUserOrders(user.email),
          getUserXP(user.email)
        ]);
        setOrders(apiOrders);
        setStats(calculateProfileStats(apiOrders, backendXP));
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      }
    } else {
      setOrders([]);
      setStats(null);
    }
  };

  useEffect(() => {
    updateProfileData();

    window.addEventListener("orders-updated", updateProfileData);
    window.addEventListener("favorites-updated", updateProfileData);
    window.addEventListener("storage", updateProfileData);
    window.addEventListener("profile-updated", updateProfileData);

    return () => {
      window.removeEventListener("orders-updated", updateProfileData);
      window.removeEventListener("favorites-updated", updateProfileData);
      window.removeEventListener("storage", updateProfileData);
      window.removeEventListener("profile-updated", updateProfileData);
    };
  }, [authenticated, user]);

  return { orders, stats, refreshProfile: updateProfileData };
}
