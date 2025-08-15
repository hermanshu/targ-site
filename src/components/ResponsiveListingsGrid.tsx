import React, { useState, useEffect } from 'react';
import { Listing } from '../types';
import DesktopListingsGrid from './DesktopListingsGrid';
import MobileListingsGrid from './MobileListingsGrid';
import '../mobile-styles.css';
import '../desktop-styles.css';

interface ResponsiveListingsGridProps {
  listings: Listing[];
  onFavoriteToggle: (listing: Listing) => void;
  isFavorite: (id: string) => boolean;
  onCardClick: (listing: Listing) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
}

const ResponsiveListingsGrid: React.FC<ResponsiveListingsGridProps> = (props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Мобильные устройства: меньше 768px
      setIsMobile(window.innerWidth < 768);
    };

    // Проверяем при загрузке
    checkScreenSize();

    // Добавляем слушатель изменения размера окна
    window.addEventListener('resize', checkScreenSize);

    // Очистка при размонтировании
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Рендерим соответствующую версию
  if (isMobile) {
    return <MobileListingsGrid {...props} />;
  }

  return <DesktopListingsGrid {...props} />;
};

export default ResponsiveListingsGrid; 