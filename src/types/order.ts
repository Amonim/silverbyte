import type { CartItem } from "./cart";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  comment?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  total: number;
  customerInfo: OrderCustomerInfo;
  paymentMethod: string;
  status: OrderStatus;
  userEmail?: string;
}