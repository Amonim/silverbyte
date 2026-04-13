import type { Order } from "../types/order";

export function getOrders(userId: string): Order[] {
  const rawOrders = localStorage.getItem(`orders_${userId}`);

  if (!rawOrders) {
    return [];
  }

  try {
    return JSON.parse(rawOrders) as Order[];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order, userId: string): void {
  const orders = getOrders(userId);
  orders.push(order);
  localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));
  window.dispatchEvent(new Event("orders-updated"));
}

export function createOrderNumber(): string {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
}