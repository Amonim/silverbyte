import { useState, useEffect } from "react";
import { getUserOrders, getUserXP } from "../api/ordersApi";
import { getUserAchievements, unlockAchievement } from "../api/usersApi";
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
        const [apiOrders, backendXP, unlockedAchievements] = await Promise.all([
          getUserOrders(user.email),
          getUserXP(user.email),
          getUserAchievements(user.email)
        ]);
        
        setOrders(apiOrders);
        
        const newStats = calculateProfileStats(apiOrders, backendXP, true, unlockedAchievements);
        setStats(newStats);

        const newlyCompleted = newStats.achievements.filter(ach => ach.completed && !unlockedAchievements.includes(ach.id));
        if (newlyCompleted.length > 0) {
          const toUnlock = newlyCompleted.filter(ach => ach.id !== "purchases_passive");
          if (toUnlock.length > 0) {
            let unlockedAny = false;
            for (const ach of toUnlock) {
              const success = await unlockAchievement(user.email, ach.id, ach.reward);
              if (success) unlockedAny = true;
            }
            if (unlockedAny) {
              const [newOrders, newBackendXP, newUnlocked] = await Promise.all([
                getUserOrders(user.email),
                getUserXP(user.email),
                getUserAchievements(user.email)
              ]);
              setStats(calculateProfileStats(newOrders, newBackendXP, true, newUnlocked));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      }
    } else {
      setOrders([]);
      setStats(calculateProfileStats([], undefined, true, []));
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
