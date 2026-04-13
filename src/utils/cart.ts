import type { CartItem } from '../types/cart'
import type { Product } from '../data/product'

const CART_KEY = 'silverbyte_cart'

const emitCartUpdate = () => {
  window.dispatchEvent(new Event('cart-updated'))
}

export function getCart(): CartItem[] {
  const rawCart = localStorage.getItem(CART_KEY)

  if (!rawCart) {
    return []
  }

  try {
    return JSON.parse(rawCart) as CartItem[]
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  emitCartUpdate()
}

export function addToCart(product: Product): void {
  const cart = getCart()
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    })
  }

  saveCart(cart)
}

export function removeFromCart(productId: number): void {
  const cart = getCart().filter((item) => item.id !== productId)
  saveCart(cart)
}

export function increaseQuantity(productId: number): void {
  const cart = getCart().map((item) =>
    item.id === productId
      ? { ...item, quantity: item.quantity + 1 }
      : item
  )

  saveCart(cart)
}

export function decreaseQuantity(productId: number): void {
  const cart = getCart()
    .map((item) =>
      item.id === productId
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0)

  saveCart(cart)
}

export function updateQuantity(productId: number, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId)
    return
  }

  const cart = getCart().map((item) =>
    item.id === productId
      ? { ...item, quantity }
      : item
  )

  saveCart(cart)
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY)
  emitCartUpdate()
}

export function getCartCount(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0)
}

export function getCartTotal(): number {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
}