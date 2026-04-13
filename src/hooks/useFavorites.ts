import { useEffect, useState } from "react";
import { getFavorites, toggleFavorite, isFavorite } from "../utils/favorites";

function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(getFavorites());

  const syncFavorites = () => {
    setFavorites(getFavorites());
  };

  useEffect(() => {
    window.addEventListener("favorites-updated", syncFavorites);
    window.addEventListener("storage", syncFavorites);

    // Also listen to auth-updated to sync favorites when user logs in/out
    window.addEventListener("auth-updated", syncFavorites);

    return () => {
      window.removeEventListener("favorites-updated", syncFavorites);
      window.removeEventListener("storage", syncFavorites);
      window.removeEventListener("auth-updated", syncFavorites);
    };
  }, []);

  return {
    favorites,
    favoritesCount: favorites.length,
    toggleFavorite,
    isFavorite,
  };
}

export default useFavorites;
