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

export async function getUserOrders(userEmail: string): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${userEmail}`);

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return []; // Return empty array as safe fallback
  }
}