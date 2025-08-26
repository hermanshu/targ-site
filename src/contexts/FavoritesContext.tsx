import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Listing, FavoriteFolder, FavoriteItem } from '../types';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  // Основные функции избранного
  favorites: Listing[];
  favoriteItems: FavoriteItem[];
  addToFavorites: (listing: Listing, folderId?: string) => void;
  removeFromFavorites: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  clearFavorites: () => void;
  
  // Функции для папок
  folders: FavoriteFolder[];
  createFolder: (name: string, description?: string, color?: string) => string;
  updateFolder: (folderId: string, updates: Partial<FavoriteFolder>) => void;
  deleteFolder: (folderId: string) => void;
  getFolderById: (folderId: string) => FavoriteFolder | undefined;
  getListingsInFolder: (folderId: string) => Listing[];
  moveToListingToFolder: (listingId: string, folderId?: string) => void;
  
  // Функции для шаринга папок
  generateShareLink: (folderId: string) => string;
  toggleFolderPublic: (folderId: string) => void;
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
  const [folders, setFolders] = useState<FavoriteFolder[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const { currentUser } = useAuth();

  // Загружаем избранное из localStorage при инициализации
  useEffect(() => {
    if (currentUser) {
      const savedFavorites = localStorage.getItem(`favorites_${currentUser.id}`);
      const savedFolders = localStorage.getItem(`folders_${currentUser.id}`);
      const savedFavoriteItems = localStorage.getItem(`favoriteItems_${currentUser.id}`);
      
      if (savedFavorites) {
        try {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(parsedFavorites);
        } catch (error) {
          console.error('Ошибка при загрузке избранного:', error);
        }
      }
      
      if (savedFolders) {
        try {
          const parsedFolders = JSON.parse(savedFolders);
          setFolders(parsedFolders);
        } catch (error) {
          console.error('Ошибка при загрузке папок:', error);
        }
      }
      
      if (savedFavoriteItems) {
        try {
          const parsedFavoriteItems = JSON.parse(savedFavoriteItems);
          setFavoriteItems(parsedFavoriteItems);
        } catch (error) {
          console.error('Ошибка при загрузке элементов избранного:', error);
        }
      }
    } else {
      // Для неавторизованных пользователей очищаем избранное
      setFavorites([]);
      setFolders([]);
      setFavoriteItems([]);
    }
  }, [currentUser]);

  // Синхронизация favoriteItems с favorites
  useEffect(() => {
    if (currentUser && favorites.length > 0) {
      setFavoriteItems(prev => {
        const currentFavoriteIds = new Set(favorites.map(f => f.id));
        const currentItemIds = new Set(prev.map(item => item.listingId));
        
        // Добавляем недостающие элементы
        const missingItems = favorites
          .filter(favorite => !currentItemIds.has(favorite.id))
          .map(favorite => ({
            listingId: favorite.id,
            folderId: undefined,
            addedAt: new Date().toISOString()
          }));
        
        // Удаляем элементы, которых нет в favorites
        const filteredItems = prev.filter(item => currentFavoriteIds.has(item.listingId));
        
        return [...filteredItems, ...missingItems];
      });
    }
  }, [favorites, currentUser]);

  // Сохраняем избранное в localStorage при изменении
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);

  // Сохраняем папки в localStorage при изменении
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`folders_${currentUser.id}`, JSON.stringify(folders));
    }
  }, [folders, currentUser]);

  // Сохраняем элементы избранного в localStorage при изменении
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`favoriteItems_${currentUser.id}`, JSON.stringify(favoriteItems));
    }
  }, [favoriteItems, currentUser]);

  const addToFavorites = (listing: Listing, folderId?: string) => {
    if (!currentUser) {
      return;
    }
    
    setFavorites(prev => {
      if (!prev.find(fav => fav.id === listing.id)) {
        return [...prev, listing];
      }
      return prev;
    });

    setFavoriteItems(prev => {
      const existingItem = prev.find(item => item.listingId === listing.id);
      if (existingItem) {
        // Обновляем существующий элемент
        return prev.map(item => 
          item.listingId === listing.id 
            ? { ...item, folderId, addedAt: new Date().toISOString() }
            : item
        );
      } else {
        // Добавляем новый элемент
        return [...prev, {
          listingId: listing.id,
          folderId,
          addedAt: new Date().toISOString()
        }];
      }
    });

    // Если указана папка, добавляем ID объявления в папку
    if (folderId) {
      setFolders(prev => 
        prev.map(folder => 
          folder.id === folderId 
            ? { ...folder, listingIds: [...folder.listingIds, listing.id] }
            : folder
        )
      );
    }
  };

  const removeFromFavorites = (listingId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== listingId));
    
    setFavoriteItems(prev => prev.filter(item => item.listingId !== listingId));
    
    // Удаляем из всех папок
    setFolders(prev => 
      prev.map(folder => ({
        ...folder,
        listingIds: folder.listingIds.filter(id => id !== listingId)
      }))
    );
  };

  const isFavorite = (listingId: string): boolean => {
    return favorites.some(fav => fav.id === listingId);
  };

  const clearFavorites = () => {
    setFavorites([]);
    setFavoriteItems([]);
    setFolders([]);
  };

  // Функции для папок
  const createFolder = (name: string, description?: string, color?: string): string => {
    if (!currentUser) return '';
    
    const folderId = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newFolder: FavoriteFolder = {
      id: folderId,
      name,
      description,
      color: color || '#3b82f6',
      isPublic: false,
      shareId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: currentUser.id,
      listingIds: []
    };
    
    setFolders(prev => [...prev, newFolder]);
    return folderId;
  };

  const updateFolder = (folderId: string, updates: Partial<FavoriteFolder>) => {
    setFolders(prev => 
      prev.map(folder => 
        folder.id === folderId 
          ? { ...folder, ...updates, updatedAt: new Date().toISOString() }
          : folder
      )
    );
  };

  const deleteFolder = (folderId: string) => {
    // Перемещаем все объявления из папки в общее избранное
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setFavoriteItems(prev => 
        prev.map(item => 
          item.folderId === folderId 
            ? { ...item, folderId: undefined }
            : item
        )
      );
    }
    
    setFolders(prev => prev.filter(folder => folder.id !== folderId));
  };

  const getFolderById = (folderId: string): FavoriteFolder | undefined => {
    return folders.find(folder => folder.id === folderId);
  };

  const getListingsInFolder = (folderId: string): Listing[] => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return [];
    
    return favorites.filter(listing => folder.listingIds.includes(listing.id));
  };

  const moveToListingToFolder = (listingId: string, folderId?: string) => {
    // Обновляем favoriteItems
    setFavoriteItems(prev => {
      const updated = prev.map(item => 
        item.listingId === listingId 
          ? { ...item, folderId: folderId || undefined, addedAt: new Date().toISOString() }
          : item
      );
      return updated;
    });

    // Удаляем listingId из всех папок
    setFolders(prev => 
      prev.map(folder => ({
        ...folder,
        listingIds: folder.listingIds.filter(id => id !== listingId)
      }))
    );

    // Добавляем listingId в целевую папку (если folderId не пустой)
    if (folderId && folderId !== '') {
      setFolders(prev => 
        prev.map(folder => 
          folder.id === folderId 
            ? { ...folder, listingIds: [...folder.listingIds, listingId] }
            : folder
        )
      );
    }
  };

  // Функции для шаринга папок
  const generateShareLink = (folderId: string): string => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return '';
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/favorites/folder/${folder.shareId}`;
  };

  const toggleFolderPublic = (folderId: string) => {
    setFolders(prev => 
      prev.map(folder => 
        folder.id === folderId 
          ? { ...folder, isPublic: !folder.isPublic }
          : folder
      )
    );
  };

  const value = {
    favorites,
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    folders,
    createFolder,
    updateFolder,
    deleteFolder,
    getFolderById,
    getListingsInFolder,
    moveToListingToFolder,
    generateShareLink,
    toggleFolderPublic,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}; 