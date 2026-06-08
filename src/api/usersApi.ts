export interface AdminUser {
  id: string | number;
  name: string;
  email: string;
  xp: number;
  level: number;
  role?: string;
  created_at?: string;
  ordersCount: number;
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await fetch('http://localhost:5000/api/admin/users');
  if (!response.ok) {
    throw new Error('Failed to fetch admin users');
  }
  return response.json();
};
