import { useState, useEffect } from "react";
import { getOrders } from "../utils/orders";
import { calculateProfileStats } from "../utils/profile";
import type { Order } from "../types/order";
import type { ProfileStats } from "../types/profile";
import useAuth from "./useAuth";

export default function useProfile() {
  const { user, authenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<ProfileStats | null>(null);

  useEffect(() => {
    const updateProfileData = () => {
      if (authenticated && user) {
        const userOrders = getOrders(user.email);
        setOrders(userOrders);
        setStats(calculateProfileStats(userOrders));
      } else {
        setOrders([]);
        setStats(null);
      }
    };

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

  return { orders, stats };
}
