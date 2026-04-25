import type { Order } from "../types/order";
import type { ProfileStats, Achievement } from "../types/profile";
import { getFavorites } from "./favorites";
import { getCartCount } from "./cart";

const LEVELS = [0, 300, 700, 1500, 3000];

export const LEVEL_INFO: Record<number, { prefix: string, discount: number }> = {
  1: { prefix: "Новичок", discount: 0 },
  2: { prefix: "Покупатель", discount: 2 },
  3: { prefix: "Активный", discount: 3 },
  4: { prefix: "Коллекционер", discount: 5 },
  5: { prefix: "VIP", discount: 7 }
};

export function calculateProfileStats(orders: Order[]): ProfileStats {
  const favoritesCount = getFavorites().length;
  const cartCount = getCartCount();
  const catalogOpened = localStorage.getItem('catalogOpened') === 'true';
  const dailyVisit = localStorage.getItem('dailyVisit') !== null;
  const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '[]').length;

  const orderPoints = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + Math.floor(order.total / 1000), 0);

  const achievements: Achievement[] = [
    {
      id: "purchases_passive",
      title: "Покупки",
      description: "Получайте +1 XP за каждые 1000 ₸",
      completed: false,
      progress: orderPoints,
      total: 0,
      reward: 0
    },
    {
      id: "first_order",
      title: "Первый заказ",
      description: "Оформите свой первый заказ",
      completed: orders.length >= 1,
      progress: Math.min(orders.length, 1),
      total: 1,
      reward: 200
    },
    {
      id: "buyer",
      title: "Покупатель",
      description: "Совершите 3 заказа",
      completed: orders.length >= 3,
      progress: Math.min(orders.length, 3),
      total: 3,
      reward: 300
    },
    {
      id: "collector",
      title: "Коллекционер",
      description: "Добавьте 5 товаров в избранное",
      completed: favoritesCount >= 5,
      progress: Math.min(favoritesCount, 5),
      total: 5,
      reward: 100
    },
    {
      id: "add_to_fav",
      title: "Добавить в избранное",
      description: "Добавьте первый товар в избранное",
      completed: favoritesCount >= 1,
      progress: Math.min(favoritesCount, 1),
      total: 1,
      reward: 20
    },
    {
      id: "view_products",
      title: "Изучение",
      description: "Посмотрите 3 товара",
      completed: viewedProducts >= 3,
      progress: Math.min(viewedProducts, 3),
      total: 3,
      reward: 15
    },
    {
      id: "open_catalog",
      title: "Исследователь",
      description: "Откройте каталог",
      completed: catalogOpened,
      progress: catalogOpened ? 1 : 0,
      total: 1,
      reward: 10
    },
    {
      id: "daily_visit",
      title: "Ежедневный визит",
      description: "Зайдите на сайт",
      completed: dailyVisit,
      progress: dailyVisit ? 1 : 0,
      total: 1,
      reward: 25
    },
    {
      id: "add_to_cart",
      title: "Шопинг",
      description: "Добавьте 3 товара в корзину",
      completed: cartCount >= 3,
      progress: Math.min(cartCount, 3),
      total: 3,
      reward: 40
    },
    {
      id: "complete_order",
      title: "Завершение",
      description: "Оформите заказ",
      completed: orders.length >= 1,
      progress: Math.min(orders.length, 1),
      total: 1,
      reward: 100
    }
  ];

  let points = 100 + orderPoints;
  achievements.forEach(ach => {
    if (ach.completed) points += ach.reward;
  });

  let level = 1;
  let nextLevelPoints = LEVELS[1];

  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i]) {
      level = i + 1;
      nextLevelPoints = LEVELS[i + 1] || LEVELS[LEVELS.length - 1];
    }
  }
  
  if (level > 5) level = 5;

  let progressToNext = 100;
  if (level < LEVELS.length) {
    const currentLevelPoints = LEVELS[level - 1];
    progressToNext = Math.min(
      100,
      Math.max(0, ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100)
    );
  }

  const prefix = LEVEL_INFO[level]?.prefix || "Новичок";
  const discount = LEVEL_INFO[level]?.discount || 0;

  return {
    points,
    level,
    progressToNext,
    nextLevelPoints,
    achievements,
    prefix,
    discount
  };
}
