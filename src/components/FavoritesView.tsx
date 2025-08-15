import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTranslation } from '../hooks/useTranslation';
import ListingCard from './ListingCard';
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
        <h1 className="favorites-title">{t('favorites.title')}</h1>
        <span className="favorites-count">{favorites.length} {t('favorites.listingsCount')}</span>
      </div>
      
      <div className="favorites-grid">
        {favorites.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onFavoriteToggle={handleFavoriteToggle}
            isFavorite={isFavorite(listing.id)}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesView; 