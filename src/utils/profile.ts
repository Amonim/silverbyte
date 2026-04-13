import type { Order } from "../types/order";
import type { ProfileStats, Achievement } from "../types/profile";
import { getFavorites } from "./favorites";

const LEVELS = [0, 300, 700, 1500];

export function calculateProfileStats(orders: Order[]): ProfileStats {
  let points = 100; // Registration bonus

  if (orders.length > 0) {
    points += 200; // First order bonus
  }

  // Add 100 points per every other order to make "Active user" achievable
  points += Math.max(0, orders.length - 1) * 100;

  // Level calculation
  let level = 1;
  let nextLevelPoints = LEVELS[1];
  
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i]) {
      level = i + 1;
      nextLevelPoints = LEVELS[i + 1] || LEVELS[LEVELS.length - 1]; // Cap at max level
    }
  }

  // Progress to next level percentage
  let progressToNext = 100;
  if (level < LEVELS.length) {
    const currentLevelPoints = LEVELS[level - 1];
    progressToNext = Math.min(
      100,
      Math.max(0, ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100)
    );
  }

  // Achievements
  const favoritesCount = getFavorites().length;

  const achievements: Achievement[] = [
    {
      id: "first_order",
      title: "Первый заказ",
      description: "Оформите свой первый заказ",
      completed: orders.length >= 1,
      progress: Math.min(orders.length, 1),
      total: 1
    },
    {
      id: "buyer",
      title: "Покупатель",
      description: "Совершите 3 заказа",
      completed: orders.length >= 3,
      progress: Math.min(orders.length, 3),
      total: 3
    },
    {
      id: "collector",
      title: "Коллекционер",
      description: "Добавьте 5 товаров в избранное",
      completed: favoritesCount >= 5,
      progress: Math.min(favoritesCount, 5),
      total: 5
    },
    {
      id: "active_user",
      title: "Активный пользователь",
      description: "Накопите 1000 баллов",
      completed: points >= 1000,
      progress: Math.min(points, 1000),
      total: 1000
    }
  ];

  return {
    points,
    level,
    progressToNext,
    nextLevelPoints,
    achievements
  };
}
