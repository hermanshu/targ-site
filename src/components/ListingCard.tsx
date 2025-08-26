import React, { useState, useEffect, useRef } from 'react';
import { HeartIcon, FolderIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
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
import { useListingImages } from '../hooks/useListingImages';


interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle: (listing: Listing) => void;
  isFavorite: boolean;
  onCardClick: (listing: Listing) => void;
  onMoveToFolder?: (listing: Listing, folderId?: string) => void;
  // Новые пропсы для работы с папками
  folders?: Array<{ id: string; name: string; color: string }>;
  currentFolderId?: string;
  showFolderSelector?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onFavoriteToggle, 
  isFavorite, 
  onCardClick,
  onMoveToFolder,
  folders = [],
  currentFolderId,
  showFolderSelector = false
}) => {
  const [animateHeart, setAnimateHeart] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const folderSelectorRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Используем хук для правильной сборки изображений
  const { images } = useListingImages({ 
    images: listing.images, 
    imageName: listing.imageName 
  });

  // Обработка кликов вне выпадающего списка и прокрутки
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (folderSelectorRef.current && !folderSelectorRef.current.contains(event.target as Node)) {
        setShowFolderDropdown(false);
      }
    };

    const handleScroll = () => {
      setShowFolderDropdown(false);
    };

    if (showFolderDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [showFolderDropdown]);





  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimateHeart(true);
    onFavoriteToggle(listing);
    setTimeout(() => setAnimateHeart(false), 350);
  };



  const handleFolderSelect = (folderId: string) => {
    if (onMoveToFolder) {
      onMoveToFolder(listing, folderId);
    }
    setShowFolderDropdown(false);
  };

  // Обновляем отображение текущей папки при изменении currentFolderId
  useEffect(() => {
    // Принудительно обновляем компонент при изменении currentFolderId
  }, [currentFolderId]);

  const getCurrentFolderName = () => {
    if (!currentFolderId || currentFolderId === '') return t('favorites.allFavorites');
    const folder = folders.find(f => f.id === currentFolderId);
    return folder?.name || t('favorites.allFavorites');
  };

  const getCurrentFolderColor = () => {
    if (!currentFolderId || currentFolderId === '') return '#6b7280';
    const folder = folders.find(f => f.id === currentFolderId);
    return folder?.color || '#6b7280';
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
      className={`listing-card ${showFolderDropdown ? 'has-open-dropdown' : ''}`}
      onClick={() => onCardClick(listing)}
    >
      {/* Фото с бейджем категории */}
      <div className="listing-image-container">
        {images && images.length > 0 ? (
          <div className="listing-image">
            <img 
              src={images[0].src} 
              alt={images[0].alt || listing.title}
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



        {/* Кнопки действий поверх изображения */}
        <div className="action-buttons">
          {/* Кнопка избранного */}
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
        
        {/* Выпадающий список папок */}
        {showFolderSelector && folders.length > 0 && (
          <div 
            ref={folderSelectorRef}
            className="folder-selector-bottom"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button 
              className={`folder-selector-button-bottom ${currentFolderId && currentFolderId !== '' ? 'has-active-folder' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowFolderDropdown(!showFolderDropdown);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title={t('favorites.moveToFolder')}
            >
              <div 
                className="folder-color-indicator"
                style={{ backgroundColor: getCurrentFolderColor() }}
              />
              <span className="folder-selector-text">{getCurrentFolderName()}</span>
              <ChevronDownIcon className="folder-chevron-icon" />
            </button>
            
            {showFolderDropdown && (
              <div 
                className="folder-dropdown-bottom"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="folder-dropdown-list">
                  <button
                    className="folder-dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFolderSelect('');
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <span className="folder-dropdown-text">{t('favorites.allFavorites')}</span>
                  </button>
                  
                                      {folders.map(folder => (
                      <button
                        key={folder.id}
                        className="folder-dropdown-item"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFolderSelect(folder.id);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                      <div 
                        className="folder-dropdown-color"
                        style={{ backgroundColor: folder.color }}
                      />
                      <span className="folder-dropdown-text">{folder.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard; 