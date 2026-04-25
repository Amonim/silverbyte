import type { CurrentUser, User } from '../types/auth'

const USERS_KEY = 'sb_users'
const CURRENT_USER_KEY = 'sb_current_user'

const emitAuthUpdate = () => {
  window.dispatchEvent(new Event('auth-updated'))
}

export function getUsers(): User[] {
  const rawUsers = localStorage.getItem(USERS_KEY)

  if (!rawUsers) {
    return []
  }

  try {
    return JSON.parse(rawUsers) as User[]
  } catch {
    return []
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
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

const API_BASE_URL = 'http://localhost:5000/api'

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
      message: 'Ошибка соединения с сервером',
    }
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
      message: 'Ошибка соединения с сервером',
    }
  }
}

export function logoutUser(): void {
  clearCurrentUser()
}