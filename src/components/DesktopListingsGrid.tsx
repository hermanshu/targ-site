import React, { useState, useMemo, useEffect } from 'react';
import { Listing } from '../types';
import ListingCard from './ListingCard';
import { useTranslation } from '../hooks/useTranslation';

interface DesktopListingsGridProps {
  listings: Listing[];
  onFavoriteToggle: (listing: Listing) => void;
  isFavorite: (id: string) => boolean;
  onCardClick: (listing: Listing) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
  hasFilters?: boolean;
  pagination?: React.ReactNode;
  onMoveToFolder?: (listing: Listing, folderId?: string) => void;
  // Новые пропсы для работы с папками
  folders?: Array<{ id: string; name: string; color: string }>;
  currentFolderId?: string;
  showFolderSelector?: boolean;
  getCurrentFolderId?: (listing: Listing) => string | undefined;
}

const DesktopListingsGrid: React.FC<DesktopListingsGridProps> = ({
  listings,
  onFavoriteToggle,
  isFavorite,
  onCardClick,
  hasMore,
  onLoadMore,
  isLoading,
  hasFilters = false,
  pagination,
  onMoveToFolder,
  folders = [],
  currentFolderId,
  showFolderSelector = false,
  getCurrentFolderId
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const { t } = useTranslation();

  // Десктопные размеры карточки
  const CARD_WIDTH = 240; // Оптимизировано для 4+ столбцов
  const GRID_GAP = 20; // Отступ между карточками (уменьшен еще больше)

  // Фиксированное количество колонок для десктопной версии
  const columnCount = useMemo(() => {
    if (containerWidth === 0) return 4; // По умолчанию 4 столбца
    
    // Для всех десктопных экранов (768px и больше) - фиксированное количество колонок
    if (containerWidth >= 768) {
      // Вычисляем оптимальное количество колонок на основе ширины экрана
      const availableWidth = containerWidth - 32; // Учитываем padding контейнера
      const optimalColumns = Math.floor(availableWidth / (CARD_WIDTH + GRID_GAP));
      
      // Ограничиваем от 3 до 7 колонок
      let columns = Math.min(7, Math.max(3, optimalColumns));
      
      // На больших экранах убираем один столбец для создания отступа
      if (containerWidth >= 1400) {
        columns = Math.max(3, columns - 1);
      }
      
      return columns;
    }
    
    // Для мобильных устройств возвращаем 0 - будет использоваться мобильная версия
    return 0;
  }, [containerWidth]);



  // Получаем ширину окна напрямую
  useEffect(() => {
    const updateWidth = () => {
      setContainerWidth(window.innerWidth);
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Если это мобильный экран, не рендерим ничего
  if (columnCount === 0) {
    return null;
  }

  // Если нет объявлений, показываем соответствующее сообщение
  if (listings.length === 0 && !isLoading) {
    return (
      <div style={{ 
        height: '100%', 
        width: '100%',
        maxWidth: '1800px',
        margin: '0 auto',
        padding: window.innerWidth >= 1800 ? '0 60px' : 
                 window.innerWidth >= 1400 ? '0 40px' : 
                 '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'rgba(100, 116, 139, 0.7)',
          fontSize: '18px',
          fontWeight: '500'
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
    <div style={{ 
      height: '100%', 
      width: '100%',
      maxWidth: '1800px',
      margin: '0 auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, ${CARD_WIDTH}px)`,
        gap: `${GRID_GAP}px`,
        alignItems: 'start',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        {listings.map((listing, index) => (
          <div key={listing.id}>
            <ListingCard
              listing={listing}
              onFavoriteToggle={onFavoriteToggle}
              isFavorite={isFavorite(listing.id)}
              onCardClick={onCardClick}
              onMoveToFolder={onMoveToFolder}
              folders={folders}
              currentFolderId={getCurrentFolderId ? getCurrentFolderId(listing) : undefined}
              showFolderSelector={showFolderSelector}
              key={`${listing.id}-${getCurrentFolderId ? getCurrentFolderId(listing) : 'no-folder'}`}
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

export default DesktopListingsGrid; 