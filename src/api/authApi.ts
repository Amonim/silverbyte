import type { CurrentUser } from '../types/auth'
import { apiFetch } from './apiClient'

const CURRENT_USER_KEY = 'sb_current_user'

const emitAuthUpdate = () => {
  window.dispatchEvent(new Event('auth-updated'))
}

export function getCurrentUser(): CurrentUser | null {
  const rawCurrentUser = localStorage.getItem(CURRENT_USER_KEY)

  if (!rawCurrentUser) {
    return null
  }

  try {
    return JSON.parse(rawCurrentUser) as CurrentUser
  } catch {
    return null
  }
}

export function saveCurrentUser(user: CurrentUser): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  emitAuthUpdate()
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
  emitAuthUpdate()
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Ошибка регистрации',
      }
    }

    saveCurrentUser({
      id: data.id,
      name: data.name,
      email: data.email,
    })

    return {
      success: true,
      message: 'Регистрация прошла успешно',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Ошибка соединения с сервером. Пожалуйста, убедитесь, что backend запущен.',
    }
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Неверный email или пароль',
      }
    }

    saveCurrentUser({
      id: data.id,
      name: data.name,
      email: data.email,
    })

    return {
      success: true,
      message: 'Вход выполнен успешно',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Ошибка соединения с сервером. Пожалуйста, убедитесь, что backend запущен.',
    }
  }
}

export function logoutUser(): void {
  clearCurrentUser()
}