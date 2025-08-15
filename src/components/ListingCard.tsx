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
  HeartIcon as HeartIconCategory,
  Squares2X2Icon,
  ShoppingBagIcon,
  SparklesIcon,
  BriefcaseIcon,
  UserGroupIcon,
  HomeModernIcon
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



  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimateHeart(true);
    onFavoriteToggle(listing);
    setTimeout(() => setAnimateHeart(false), 350);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'furniture': HomeIcon,
      'services': WrenchScrewdriverIcon,
      'realEstate': BuildingOfficeIcon,
      'transport': TruckIcon,
      'electronics': DevicePhoneMobileIcon,
      'sport': TrophyIcon,
      'books': BookOpenIcon,
      'kids': HeartIconCategory,
      'homeAndGarden': HomeIcon,
      'fashion': ShoppingBagIcon,
      'work': BriefcaseIcon,
      'plants': SparklesIcon,
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
        {listing.imageName ? (
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

      {/* Плашка с ценой */}
      <div className="price-bar">
        <span className="price-text">{listing.price} {listing.currency}</span>
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