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

import { apiFetch } from './apiClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const token = localStorage.getItem('adminToken');
  const response = await apiFetch(`${API_URL}/admin/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch admin users');
  }
  return response.json();
};

export const updateAdminUser = async (id: string | number, data: Partial<AdminUser>): Promise<AdminUser> => {
  const token = localStorage.getItem('adminToken');
  const response = await apiFetch(`${API_URL}/admin/users/${id}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user');
  }
  return response.json();
};

export const blockAdminUser = async (id: string | number): Promise<AdminUser> => {
  const token = localStorage.getItem('adminToken');
  const response = await apiFetch(`${API_URL}/admin/users/${id}/block`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to toggle block status');
  }
  return response.json();
};

export const deleteAdminUser = async (id: string | number): Promise<void> => {
  const token = localStorage.getItem('adminToken');
  const response = await apiFetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete user');
  }
};

export const getUserAchievements = async (email: string): Promise<string[]> => {
  const response = await apiFetch(`${API_URL}/users/${email}/achievements`);
  if (!response.ok) {
    console.error('Failed to fetch achievements');
    return [];
  }
  return response.json();
};

export const unlockAchievement = async (email: string, achievementKey: string, reward: number): Promise<boolean> => {
  const response = await apiFetch(`${API_URL}/users/${email}/achievements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ achievement_key: achievementKey, reward })
  });
  if (!response.ok) {
    return false;
  }
  const data = await response.json();
  return data.success;
};
