import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Listing } from '../types';
import { useAuth } from './AuthContext';
import { useListings } from './ListingsContext';

interface FavoritesContextType {
  favorites: Listing[];
  addToFavorites: (listing: Listing) => void;
  removeFromFavorites: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const { currentUser } = useAuth();
  const { incrementFavorites, decrementFavorites } = useListings();

  // Загружаем избранное из localStorage при инициализации
  useEffect(() => {
    if (currentUser) {
      const savedFavorites = localStorage.getItem(`favorites_${currentUser.id}`);
      if (savedFavorites) {
        try {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(parsedFavorites);
        } catch (error) {
          console.error('Ошибка при загрузке избранного:', error);
        }
      }
    } else {
      // Для неавторизованных пользователей очищаем избранное
      setFavorites([]);
    }
  }, [currentUser]);

  // Сохраняем избранное в localStorage при изменении
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);

  const addToFavorites = (listing: Listing) => {
    if (!currentUser) {
      return; // Не добавляем для неавторизованных пользователей
    }
    
    setFavorites(prev => {
      if (!prev.find(fav => fav.id === listing.id)) {
        // Увеличиваем счетчик избранного в объявлении
        incrementFavorites(listing.id);
        return [...prev, listing];
      }
      return prev;
    });
  };

  const removeFromFavorites = (listingId: string) => {
    setFavorites(prev => {
      const wasInFavorites = prev.some(fav => fav.id === listingId);
      if (wasInFavorites) {
        // Уменьшаем счетчик избранного в объявлении
        decrementFavorites(listingId);
      }
      return prev.filter(fav => fav.id !== listingId);
    });
  };

  const isFavorite = (listingId: string): boolean => {
    return favorites.some(fav => fav.id === listingId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}; 