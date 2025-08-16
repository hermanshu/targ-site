import React, { useState } from 'react';
import { Listing } from '../types';
import ListingCard from './ListingCard';

interface MobileListingsGridProps {
  listings: Listing[];
  onFavoriteToggle: (listing: Listing) => void;
  isFavorite: (id: string) => boolean;
  onCardClick: (listing: Listing) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
}

const MobileListingsGrid: React.FC<MobileListingsGridProps> = ({
  listings,
  onFavoriteToggle,
  isFavorite,
  onCardClick,
  hasMore,
  onLoadMore,
  isLoading
}) => {
  const [showAll, setShowAll] = useState(false);
  
  // Количество объявлений для показа изначально
  const INITIAL_COUNT = 10;
  
  // Определяем, какие объявления показывать
  const displayedListings = showAll ? listings : listings.slice(0, INITIAL_COUNT);
  
  // Проверяем, есть ли скрытые объявления
  const hasHidden = listings.length > INITIAL_COUNT;

  // Обработчик прокрутки для загрузки новых данных
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (hasMore && !isLoading && scrollTop + clientHeight >= scrollHeight - 200) {
      onLoadMore();
    }
  };

  return (
    <div className="mobile-listings-container" onScroll={handleScroll}>
      <div className="mobile-listings-grid">
        {displayedListings.map((listing) => (
          <div key={listing.id} className="mobile-listing-item">
            <ListingCard
              listing={listing}
              onFavoriteToggle={onFavoriteToggle}
              isFavorite={isFavorite(listing.id)}
              onCardClick={onCardClick}
            />
          </div>
        ))}
      </div>
      
      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="mobile-loading-indicator">
          Загрузка...
        </div>
      )}
      
      {/* Кнопка показать/скрыть остальные */}
      {hasHidden && (
        <div className="mobile-show-more-container">
          <button
            onClick={() => setShowAll(!showAll)}
            className="show-more-button"
          >
            {showAll ? 'Скрыть остальные' : `Показать остальные (${listings.length - INITIAL_COUNT})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileListingsGrid; 