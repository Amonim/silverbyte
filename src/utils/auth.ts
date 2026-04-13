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

export function registerUser(
  name: string,
  email: string,
  password: string
): { success: boolean; message: string } {
  const users = getUsers()

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  )

  if (existingUser) {
    return {
      success: false,
      message: 'Пользователь с таким email уже существует',
    }
  }

  const newUser: User = {
    id: Date.now(),
    name,
    email,
    password,
  }

  users.push(newUser)
  saveUsers(users)

  saveCurrentUser({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  })

  return {
    success: true,
    message: 'Регистрация прошла успешно',
  }
}

export function loginUser(
  email: string,
  password: string
): { success: boolean; message: string } {
  const users = getUsers()

  const foundUser = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
  )

  if (!foundUser) {
    return {
      success: false,
      message: 'Неверный email или пароль',
    }
  }

  saveCurrentUser({
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
  })

  return {
    success: true,
    message: 'Вход выполнен успешно',
  }
}

export function logoutUser(): void {
  clearCurrentUser()
}