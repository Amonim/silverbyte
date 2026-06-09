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

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await fetch('http://localhost:5000/api/admin/dashboard');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
};
