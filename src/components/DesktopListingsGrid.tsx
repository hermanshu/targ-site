import React, { useState, useCallback, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Listing } from '../types';
import ListingCard from './ListingCard';

interface DesktopListingsGridProps {
  listings: Listing[];
  onFavoriteToggle: (listing: Listing) => void;
  isFavorite: (id: string) => boolean;
  onCardClick: (listing: Listing) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
}

const DesktopListingsGrid: React.FC<DesktopListingsGridProps> = ({
  listings,
  onFavoriteToggle,
  isFavorite,
  onCardClick,
  hasMore,
  onLoadMore,
  isLoading
}) => {
  const [containerWidth, setContainerWidth] = useState(0);

  // Десктопные размеры карточки
  const CARD_WIDTH = 240; // Оптимизировано для 4+ столбцов
  const CARD_HEIGHT = 320;
  const CARD_MARGIN = 16;

  // Вычисляем количество колонок с оптимизацией для больших экранов
  const columnCount = useMemo(() => {
    if (containerWidth === 0) return 4; // По умолчанию 4 столбца
    
    // Для очень больших экранов (больше 1400px) - автоматически вычисляем оптимальное количество
    if (containerWidth >= 1400) {
      const optimalColumns = Math.floor((containerWidth + CARD_MARGIN) / (CARD_WIDTH + CARD_MARGIN));
      return Math.max(4, optimalColumns); // Минимум 4, максимум - сколько поместится
    }
    
    // Для больших экранов (больше 1200px) - минимум 3 столбца
    if (containerWidth >= 1200) {
      const optimalColumns = Math.floor((containerWidth + CARD_MARGIN) / (CARD_WIDTH + CARD_MARGIN));
      return Math.max(3, optimalColumns);
    }
    
    // Для средних экранов (768px - 1199px) - минимум 2 столбца
    if (containerWidth >= 768) {
      const optimalColumns = Math.floor((containerWidth + CARD_MARGIN) / (CARD_WIDTH + CARD_MARGIN));
      return Math.max(2, optimalColumns);
    }
    
    // Для мобильных устройств возвращаем 0 - будет использоваться мобильная версия
    return 0;
  }, [containerWidth]);

  // Вычисляем количество строк
  const rowCount = useMemo(() => {
    if (columnCount === 0) return 0;
    return Math.ceil(listings.length / columnCount);
  }, [listings.length, columnCount]);

  // Обработчик прокрутки для загрузки новых данных
  const handleScroll = useCallback(({ scrollTop, scrollHeight, clientHeight }: any) => {
    if (hasMore && !isLoading && scrollTop + clientHeight >= scrollHeight - 200) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  // Рендер ячейки
  const Cell = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex;
    const listing = listings[index];

    if (!listing) {
      return <div style={style} />;
    }

    return (
      <div style={style}>
        <div style={{ padding: CARD_MARGIN / 2 }}>
          <ListingCard
            listing={listing}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={isFavorite(listing.id)}
            onCardClick={onCardClick}
          />
        </div>
      </div>
    );
  }, [listings, columnCount, onFavoriteToggle, isFavorite, onCardClick]);

  // Обработчик изменения размера контейнера
  const handleResize = useCallback(({ width }: { width: number; height: number }) => {
    setContainerWidth(width);
  }, []);

  // Если это мобильный экран, не рендерим ничего
  if (columnCount === 0) {
    return null;
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AutoSizer onResize={handleResize}>
        {({ width, height }: { width: number; height: number }) => (
          <Grid
            columnCount={columnCount}
            columnWidth={CARD_WIDTH + CARD_MARGIN}
            height={height}
            rowCount={rowCount}
            rowHeight={CARD_HEIGHT + CARD_MARGIN}
            width={width}
            onScroll={handleScroll}
          >
            {Cell}
          </Grid>
        )}
      </AutoSizer>
      
      {/* Индикатор загрузки */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          Загрузка...
        </div>
      )}
    </div>
  );
};

export default DesktopListingsGrid; 