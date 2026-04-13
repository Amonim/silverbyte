import type { Order } from "../types/order";

const ORDERS_KEY = "silverbyte_orders";

export function getOrders(): Order[] {
  const rawOrders = localStorage.getItem(ORDERS_KEY);

  if (!rawOrders) {
    return [];
  }

  try {
    return JSON.parse(rawOrders) as Order[];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("orders-updated"));
}

export function createOrderNumber(): string {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
}