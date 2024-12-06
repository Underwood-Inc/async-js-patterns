import { ref } from 'vue';

interface Favorite {
  path: string;
  title: string;
  description?: string;
  date?: string;
}

const favorites = ref<Favorite[]>([]);

export function useFavorites() {
  const toggleFavorite = (item: Favorite) => {
    const index = favorites.value.findIndex((f) => f.path === item.path);
    if (index === -1) {
      favorites.value.push(item);
    } else {
      favorites.value.splice(index, 1);
    }
    // Optionally persist to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
  };

  const isFavorited = (path: string) => {
    return favorites.value.some((f) => f.path === path);
  };

  // Load favorites from localStorage on init
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      favorites.value = JSON.parse(stored);
    }
  }

  return {
    favorites,
    toggleFavorite,
    isFavorited,
  };
}
