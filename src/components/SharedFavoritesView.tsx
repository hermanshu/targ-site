import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import DesktopListingsGrid from './DesktopListingsGrid';
import { Listing } from '../types';

interface SharedFavoritesViewProps {
  userId: string;
  onCardClick: (listing: Listing) => void;
}

const SharedFavoritesView: React.FC<SharedFavoritesViewProps> = ({ 
  userId, 
  onCardClick 
}) => {
  const { t } = useTranslation();
  const [sharedFavorites, setSharedFavorites] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // В реальном приложении здесь был бы API запрос
    // Пока используем моковые данные
    const loadSharedFavorites = async () => {
      try {
        setIsLoading(true);
        // Имитируем загрузку
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Моковые данные - в реальном приложении это был бы API запрос
        const mockFavorites: Listing[] = [
          {
            id: 'shared-1',
            title: 'Квартира в центре',
            price: '150000',
            currency: 'EUR',
            city: 'Белград',
            category: 'Недвижимость',
            sellerName: 'Алексей',
            isCompany: false,
            createdAt: '2024-01-15T10:00:00Z',
            userId: userId,
            images: [{ id: '1', src: '/images/apartment-2room.jpg' }]
          },
          {
            id: 'shared-2',
            title: 'BMW X5 2019',
            price: '45000',
            currency: 'EUR',
            city: 'Нови Сад',
            category: 'Авто',
            sellerName: 'Михаил',
            isCompany: false,
            createdAt: '2024-01-14T15:30:00Z',
            userId: userId,
            images: [{ id: '2', src: '/images/bmw-1.jpg' }]
          }
        ];
        
        setSharedFavorites(mockFavorites);
      } catch (err) {
        setError('Ошибка при загрузке избранного');
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedFavorites();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="shared-favorites-loading">
        <div className="loading-spinner"></div>
        <p>Загружаем избранное...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-favorites-error">
        <div className="error-icon">⚠️</div>
        <h3>Ошибка загрузки</h3>
        <p>{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (sharedFavorites.length === 0) {
    return (
      <div className="shared-favorites-empty">
        <div className="empty-icon">🔒</div>
        <h2>Избранное недоступно</h2>
        <p>Это избранное либо не существует, либо недоступно для просмотра.</p>
      </div>
    );
  }

  return (
    <div className="shared-favorites-container">
      <div className="shared-favorites-header">
        <div className="header-center">
          <h1 className="shared-favorites-title">Избранное пользователя</h1>
          <span className="shared-favorites-count">
            {sharedFavorites.length} {t('favorites.listingsCount')}
          </span>
          <div className="shared-favorites-note">
            Это избранное было поделилось с тобой. Ты можешь просматривать объявления, но не можешь их изменять.
          </div>
        </div>
      </div>
      
      <DesktopListingsGrid
        listings={sharedFavorites}
        onFavoriteToggle={() => {}} // Отключаем функциональность избранного для шаринга
        isFavorite={() => false} // Всегда false для шаринга
        onCardClick={onCardClick}
        hasMore={false}
        onLoadMore={() => {}}
        isLoading={false}
        hasFilters={false}
      />
    </div>
  );
};

export default SharedFavoritesView; 