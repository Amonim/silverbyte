export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  date: string;
}

export interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  cancelledOrders: number;
  deliveredOrders: number;
  deliveredRevenue: number;
  recentOrders: DashboardRecentOrder[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getDashboardData = async (): Promise<DashboardData> => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_URL}/admin/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
};
