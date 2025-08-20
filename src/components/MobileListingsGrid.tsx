import React from 'react';
import { Listing } from '../types';
import ListingCard from './ListingCard';
import { useTranslation } from '../hooks/useTranslation';

interface MobileListingsGridProps {
  listings: Listing[];
  onFavoriteToggle: (listing: Listing) => void;
  isFavorite: (id: string) => boolean;
  onCardClick: (listing: Listing) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
  hasFilters?: boolean;
  pagination?: React.ReactNode;
}

const MobileListingsGrid: React.FC<MobileListingsGridProps> = ({
  listings,
  onFavoriteToggle,
  isFavorite,
  onCardClick,
  hasMore,
  onLoadMore,
  isLoading,
  hasFilters = false,
  pagination
}) => {
  const { t } = useTranslation();

  // Если нет объявлений, показываем соответствующее сообщение
  if (listings.length === 0 && !isLoading) {
    return (
      <div className="mobile-listings-container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          color: 'rgba(100, 116, 139, 0.7)',
          fontSize: '16px',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '8px' }}>
            {hasFilters ? t('home.noResultsFound') : t('home.emptyState')}
          </div>
          {hasFilters && (
            <div style={{
              fontSize: '14px',
              color: 'rgba(100, 116, 139, 0.5)',
              fontWeight: '400'
            }}>
              {t('home.noResultsDescription')}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-listings-container">
      <div className="mobile-listings-grid">
        {listings.map((listing) => (
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
      
      {/* Пагинация как элемент сетки */}
      {pagination && (
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          {pagination}
        </div>
      )}
    </div>
  );
};

export default MobileListingsGrid; 