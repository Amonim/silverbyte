export interface AdminUser {
  id: string | number;
  name: string;
  email: string;
  xp: number;
  level: number;
  role?: string;
  created_at?: string;
  ordersCount: number;
  is_blocked?: boolean;
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await fetch('http://localhost:5000/api/admin/users');
  if (!response.ok) {
    throw new Error('Failed to fetch admin users');
  }
  return response.json();
};

export const updateAdminUser = async (id: string | number, data: Partial<AdminUser>): Promise<AdminUser> => {
  const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user');
  }
  return response.json();
};

export const blockAdminUser = async (id: string | number): Promise<AdminUser> => {
  const response = await fetch(`http://localhost:5000/api/admin/users/${id}/block`, {
    method: 'PATCH'
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to toggle block status');
  }
  return response.json();
};

export const deleteAdminUser = async (id: string | number): Promise<void> => {
  const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete user');
  }
};
