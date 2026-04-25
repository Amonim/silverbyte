import type { Order } from "../types/order";

export function getOrders(_userId: string): Order[] {
  return [];
}

export function saveOrder(_order: Order, _userId: string): void {
  window.dispatchEvent(new Event("orders-updated"));
}

export function createOrderNumber(): string {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function cancelOrder(_orderId: string, _userId: string): void {
  window.dispatchEvent(new Event("orders-updated"));
}