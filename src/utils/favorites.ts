import { getCurrentUser } from './auth';

const getFavoritesKey = () => {
  const user = getCurrentUser();
  return user ? `sb_favorites_${user.id}` : 'sb_favorites_guest';
};

const emitFavoritesUpdate = () => {
  window.dispatchEvent(new Event('favorites-updated'));
};

export function getFavorites(): number[] {
  const key = getFavoritesKey();
  const raw = localStorage.getItem(key);
  
  if (!raw) return [];
  
  try {
    return JSON.parse(raw) as number[];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: number[]): void {
  const key = getFavoritesKey();
  localStorage.setItem(key, JSON.stringify(favorites));
  emitFavoritesUpdate();
}

export function toggleFavorite(productId: number): void {
  const favorites = getFavorites();
  const index = favorites.indexOf(productId);
  
  if (index === -1) {
    favorites.push(productId);
  } else {
    favorites.splice(index, 1);
  }
  
  saveFavorites(favorites);
}

export function isFavorite(productId: number): boolean {
  return getFavorites().includes(productId);
}
