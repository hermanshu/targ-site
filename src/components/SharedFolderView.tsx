import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import DesktopListingsGrid from './DesktopListingsGrid';
import { Listing, FavoriteFolder } from '../types';
import { FolderIcon } from '@heroicons/react/24/outline';

interface SharedFolderViewProps {
  shareId: string;
  onCardClick: (listing: Listing) => void;
}

const SharedFolderView: React.FC<SharedFolderViewProps> = ({ 
  shareId, 
  onCardClick 
}) => {
  const { t } = useTranslation();
  const [sharedFolder, setSharedFolder] = useState<FavoriteFolder | null>(null);
  const [sharedListings, setSharedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // В реальном приложении здесь был бы API запрос
    // Пока используем моковые данные
    const loadSharedFolder = async () => {
      try {
        setIsLoading(true);
        // Имитируем загрузку
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Моковые данные - в реальном приложении это был бы API запрос
        const mockFolder: FavoriteFolder = {
          id: 'shared-folder-1',
          name: 'Квартиры для покупки',
          description: 'Подборка квартир, которые мы рассматриваем для покупки',
          color: '#3b82f6',
          isPublic: true,
          shareId: shareId,
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-15T15:30:00Z',
          userId: 'user-123',
          listingIds: ['shared-1', 'shared-2', 'shared-3']
        };
        
        const mockListings: Listing[] = [
          {
            id: 'shared-1',
            title: 'Квартира в центре Белграда',
            price: '150000',
            currency: 'EUR',
            city: 'Белград',
            category: 'Недвижимость',
            sellerName: 'Алексей',
            isCompany: false,
            createdAt: '2024-01-15T10:00:00Z',
            userId: 'user-123',
            images: [{ id: '1', src: '/images/apartment-2room.jpg' }]
          },
          {
            id: 'shared-2',
            title: 'Квартира в Нови Саде',
            price: '120000',
            currency: 'EUR',
            city: 'Нови Сад',
            category: 'Недвижимость',
            sellerName: 'Михаил',
            isCompany: false,
            createdAt: '2024-01-14T15:30:00Z',
            userId: 'user-123',
            images: [{ id: '2', src: '/images/apartment-2room-2.jpg' }]
          },
          {
            id: 'shared-3',
            title: 'Студия в центре',
            price: '80000',
            currency: 'EUR',
            city: 'Белград',
            category: 'Недвижимость',
            sellerName: 'Елена',
            isCompany: false,
            createdAt: '2024-01-13T12:00:00Z',
            userId: 'user-123',
            images: [{ id: '3', src: '/images/studio-1.jpg' }]
          }
        ];
        
        setSharedFolder(mockFolder);
        setSharedListings(mockListings);
      } catch (err) {
        setError('Ошибка при загрузке папки');
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedFolder();
  }, [shareId]);

  if (isLoading) {
    return (
      <div className="shared-folder-loading">
        <div className="loading-spinner"></div>
        <p>Загружаем папку...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-folder-error">
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

  if (!sharedFolder) {
    return (
      <div className="shared-folder-empty">
        <div className="empty-icon">🔒</div>
        <h2>Папка недоступна</h2>
        <p>Эта папка либо не существует, либо недоступна для просмотра.</p>
      </div>
    );
  }

  return (
    <div className="shared-folder-container">
      <div className="shared-folder-header">
        <div className="header-center">
          <div className="folder-info-header">
            <div 
              className="folder-icon-large"
              style={{ backgroundColor: sharedFolder.color }}
            >
              <FolderIcon className="folder-icon-svg-large" />
            </div>
            <div className="folder-details-header">
              <h1 className="shared-folder-title">{sharedFolder.name}</h1>
              {sharedFolder.description && (
                <p className="shared-folder-description">{sharedFolder.description}</p>
              )}
              <span className="shared-folder-count">
                {sharedListings.length} {t('favorites.listingsCount')}
              </span>
            </div>
          </div>
          
          <div className="shared-folder-note">
            Это папка была поделилась с тобой. Ты можешь просматривать объявления, но не можешь их изменять.
          </div>
        </div>
      </div>
      
      <DesktopListingsGrid
        listings={sharedListings}
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

export default SharedFolderView; 