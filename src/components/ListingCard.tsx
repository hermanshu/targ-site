import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  BuildingOfficeIcon, 
  TruckIcon, 
  DevicePhoneMobileIcon, 
  TrophyIcon, 
  BookOpenIcon, 
  Squares2X2Icon,
  ShoppingBagIcon,
  SparklesIcon,
  BriefcaseIcon,
  UserGroupIcon,
  HomeModernIcon,
  SwatchIcon,
  SunIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { Listing } from '../types';
import { useTranslation } from '../hooks/useTranslation';


interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle: (listing: Listing) => void;
  isFavorite: boolean;
  onCardClick: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onFavoriteToggle, 
  isFavorite, 
  onCardClick
}) => {
  const [animateHeart, setAnimateHeart] = useState(false);
  const { t } = useTranslation();

  // Отладочная информация
  React.useEffect(() => {
    console.log('ListingCard render:', {
      id: listing.id,
      title: listing.title,
      hasImages: !!listing.images,
      imagesCount: listing.images?.length || 0,
      imageName: listing.imageName,
      firstImageSrc: listing.images?.[0]?.src
    });
  }, [listing]);



  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimateHeart(true);
    onFavoriteToggle(listing);
    setTimeout(() => setAnimateHeart(false), 350);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'furniture': SwatchIcon,
      'services': WrenchScrewdriverIcon,
      'realEstate': BuildingOfficeIcon,
      'transport': TruckIcon,
      'electronics': DevicePhoneMobileIcon,
      'sport': TrophyIcon,
      'books': BookOpenIcon,
      'kids': AcademicCapIcon,
      'homeAndGarden': HomeIcon,
      'fashion': ShoppingBagIcon,
      'work': BriefcaseIcon,
      'plants': SunIcon,
      'hobby': SparklesIcon,
      'vacancies': UserGroupIcon,
      'resume': BriefcaseIcon,
      'rent': HomeModernIcon,
      'sale': BuildingOfficeIcon,
      'otherCategories': Squares2X2Icon
    };
    return icons[category] || Squares2X2Icon;
  };

  const CategoryIcon = getCategoryIcon(listing.category);

  return (
    <div 
      className="listing-card"
      onClick={() => onCardClick(listing)}
    >
      {/* Фото с бейджем категории */}
      <div className="listing-image-container">
        {listing.images && listing.images.length > 0 ? (
          <div className="listing-image">
            <img 
              src={listing.images[0].src} 
              alt={listing.images[0].alt || listing.title}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="listing-image-placeholder hidden">
              <div className="placeholder-icon">📷</div>
              <span>{t('common.noPhoto')}</span>
            </div>
          </div>
        ) : listing.imageName ? (
          <div className="listing-image">
            <img 
              src={`/images/${listing.imageName}.jpg`} 
              alt={listing.title}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="listing-image-placeholder hidden">
              <div className="placeholder-icon">📷</div>
              <span>{t('common.noPhoto')}</span>
            </div>
          </div>
        ) : (
          <div className="listing-image-placeholder">
            <div className="placeholder-icon">📷</div>
            <span>{t('common.noPhoto')}</span>
          </div>
        )}
        
        {/* Бейдж категории */}
        <div className="category-badge">
          <CategoryIcon className="category-icon-hero" />
        </div>

        {/* Индикатор количества изображений */}
        {listing.images && listing.images.length > 1 && (
          <div className="image-count-badge">
            <span className="image-count-text">{listing.images.length}</span>
          </div>
        )}

        {/* Кнопка избранного поверх изображения */}
        <button 
          className={`favorite-button ${isFavorite ? 'favorite-active' : ''}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <HeartIconSolid 
              className={`heart-icon ${animateHeart ? 'heart-animate' : ''}`}
            />
          ) : (
            <HeartIcon className="heart-icon" />
          )}
        </button>
      </div>

      {/* Плашка с ценой - теперь отдельно под изображением */}
      <div className="price-bar">
        <span className="price-text">
          {listing.price} {listing.currency}
          {(listing.category === 'work' || listing.category === 'vacancies' || listing.subcategory === 'vacancies' || listing.subcategory === 'rent') && ' / месяц'}
        </span>
      </div>

      {/* Текстовая часть */}
      <div className="listing-content">
        <div className="listing-header">
          <h3 className="listing-title">{listing.title}</h3>
        </div>
        
        <div className="listing-location">
          <span className="location-text">{listing.city}</span>
        </div>
        

      </div>
    </div>
  );
};

export default ListingCard; 