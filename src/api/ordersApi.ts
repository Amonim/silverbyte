import type { Order } from "../types/order";

const API_BASE_URL = "http://localhost:5000/api";

export async function createOrder(order: Order) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getUserXP(email: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${email}`);
    if (!response.ok) throw new Error("Failed to fetch user XP");
    const data = await response.json();
    return data.xp || 0;
  } catch (error) {
    console.error("Error fetching user XP:", error);
    return 0;
  }
}

export async function getUserOrders(userEmail: string): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${userEmail}`);

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const rawOrders = await response.json();
    return rawOrders.map((order: any) => ({
      ...order,
      orderNumber: order.order_number || order.orderNumber,
      discountPercent: order.discount_percent || order.discountPercent,
      discountAmount: order.discount_amount || order.discountAmount,
      customerInfo: order.customer_info || order.customerInfo || {},
      paymentMethod: order.payment_method || order.paymentMethod,
      userPrefix: order.user_prefix || order.userPrefix,
      userEmail: order.user_email || order.userEmail,
      items: order.items || [],
    }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

export async function cancelOrder(orderId: string, userEmail: string): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail }),
    });

    if (!response.ok) {
      throw new Error("Failed to cancel order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error cancelling order:", error);
    return null;
  }
}