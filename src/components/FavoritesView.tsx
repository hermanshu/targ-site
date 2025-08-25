import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTranslation } from '../hooks/useTranslation';
import DesktopListingsGrid from './DesktopListingsGrid';

import { Listing } from '../types';

interface FavoritesViewProps {
  onCardClick: (listing: Listing) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ onCardClick }) => {
  const { favorites, removeFromFavorites, isFavorite } = useFavorites();
  const { t } = useTranslation();

  const handleFavoriteToggle = (listing: Listing) => {
    // В избранном всегда удаляем объявление
    removeFromFavorites(listing.id);
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <div className="empty-icon">❤️</div>
        <h2 className="empty-title">{t('favorites.emptyTitle')}</h2>
        <p className="empty-description">
          {t('favorites.emptyDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      
      <div className="favorites-header">
        <div className="header-center">
          <h1 className="favorites-title">{t('favorites.title')}</h1>
          <span className="favorites-count">{favorites.length} {t('favorites.listingsCount')}</span>
          {favorites.length > 0 && (
            <div className="favorites-hint">
              Рекомендуем связаться с продавцом как можно скорее, пока объявление еще активно
            </div>
          )}
        </div>
      </div>
      
      <DesktopListingsGrid
        listings={favorites}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={isFavorite}
        onCardClick={onCardClick}
        hasMore={false}
        onLoadMore={() => {}}
        isLoading={false}
        hasFilters={false}
      />
    </div>
  );
};

export default FavoritesView; 