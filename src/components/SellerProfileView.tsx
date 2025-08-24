import React, { useState } from 'react';
import { 
  ArrowLeftIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Listing } from '../types';

import { useTranslation } from '../hooks/useTranslation';
import { useListings } from '../contexts/ListingsContext';

interface SellerProfileViewProps {
  sellerId: string;
  sellerName: string;
  isCompany: boolean;
  onBack: () => void;
  onNavigateToMessages?: (listing: Listing) => void;
}

const SellerProfileView: React.FC<SellerProfileViewProps> = ({
  sellerId,
  sellerName,
  isCompany,
  onBack,
  onNavigateToMessages
}) => {


  const { t } = useTranslation();
  const { listings } = useListings();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Получаем все объявления продавца
  const sellerListings = listings.filter(listing => listing.userId === sellerId);

  // Статистика продавца
  const totalListings = sellerListings.length;
  const activeListings = sellerListings.filter(l => l.status === 'active').length;
  const totalViews = sellerListings.reduce((sum, listing) => sum + (listing.views || 0), 0);
  const totalFavorites = sellerListings.reduce((sum, listing) => sum + (listing.favorites || 0), 0);

  // Рейтинг продавца (заглушка для демонстрации)
  const sellerRating = 4.8;
  const totalReviews = 24;

  // Дата регистрации (заглушка)
  const registrationDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 год назад

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleBackToListings = () => {
    setSelectedListing(null);
  };



  // Если выбрано объявление, показываем его детали
  if (selectedListing) {
    return (
      <div className="seller-profile-container">
        <div className="seller-profile-header">
          <button onClick={handleBackToListings} className="back-button">
            <ArrowLeftIcon className="back-icon" />
            {t('common.back')}
          </button>
          <h1 className="seller-profile-title">{t('sellerProfile.listingDetails')}</h1>
        </div>
        
        <div className="listing-detail-card">
          <div className="listing-image-section">
            {selectedListing.images && selectedListing.images.length > 0 ? (
              <img 
                src={selectedListing.images[0]?.src || ''} 
                alt={selectedListing.images[0]?.alt || selectedListing.title}
                className="listing-detail-image"
              />
            ) : selectedListing.imageName ? (
              <img 
                src={`/images/${selectedListing.imageName}.jpg`} 
                alt={selectedListing.title}
                className="listing-detail-image"
              />
            ) : (
              <div className="listing-image-placeholder">
                <div className="placeholder-icon">📷</div>
                <span>{t('common.noPhoto')}</span>
              </div>
            )}
          </div>
          
          <div className="listing-detail-content">
            <h2 className="listing-detail-title">{selectedListing.title}</h2>
            <div className="listing-detail-price">
              {selectedListing.price} {selectedListing.currency}
            </div>
            <div className="listing-detail-location">
              <MapPinIcon className="location-icon" />
              {selectedListing.city}
            </div>
            <div className="listing-detail-stats">
              <div className="stat-item">
                <EyeIcon className="stat-icon" />
                <span>{formatViews(selectedListing.views || 0)}</span>
              </div>
              <div className="stat-item">
                <HeartIcon className="stat-icon" />
                <span>{selectedListing.favorites || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-profile-container">
      {/* Заголовок */}
      <div className="seller-profile-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeftIcon className="back-icon" />
          {t('common.back')}
        </button>
        <h1 className="seller-profile-title">{t('sellerProfile.title')}</h1>
      </div>

      {/* Информация о продавце */}
      <div className="seller-profile-info">
        <div className="seller-avatar-large">
          {isCompany ? (
            <BuildingOfficeIcon className="seller-icon-large" />
          ) : (
            <UserIcon className="seller-icon-large" />
          )}
        </div>
        
        <div className="seller-details-large">
          <h2 className="seller-name-large">{sellerName}</h2>
          <div className="seller-type-large">
            {isCompany ? t('listingDetail.company') : t('listingDetail.individual')}
          </div>
          
          {/* Рейтинг */}
          <div className="seller-rating">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <StarIconSolid 
                  key={star} 
                  className={`rating-star ${star <= Math.floor(sellerRating) ? 'filled' : ''}`}
                />
              ))}
            </div>
            <span className="rating-value">{sellerRating}</span>
            <span className="rating-count">({totalReviews} {t('sellerProfile.reviews')})</span>
          </div>
        </div>
      </div>

      {/* Статистика продавца */}
      <div className="seller-stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalListings}</div>
          <div className="stat-label">{t('sellerProfile.totalListings')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeListings}</div>
          <div className="stat-label">{t('sellerProfile.activeListings')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{formatViews(totalViews)}</div>
          <div className="stat-label">{t('sellerProfile.totalViews')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalFavorites}</div>
          <div className="stat-label">{t('sellerProfile.totalFavorites')}</div>
        </div>
      </div>

      {/* Информация о продавце */}
      <div className="seller-info-section">
        <h3 className="section-title">{t('sellerProfile.aboutSeller')}</h3>
        <div className="seller-info-grid">
          <div className="info-item">
            <MapPinIcon className="info-icon" />
            <span className="info-label">{t('sellerProfile.location')}:</span>
            <span className="info-value">{sellerListings[0]?.city || t('sellerProfile.notSpecified')}</span>
          </div>
          <div className="info-item">
            <CalendarIcon className="info-icon" />
            <span className="info-label">{t('sellerProfile.memberSince')}:</span>
            <span className="info-value">{formatDate(registrationDate)}</span>
          </div>
        </div>
      </div>

      {/* Объявления продавца */}
      <div className="seller-listings-section">
        <h3 className="section-title">
          {t('sellerProfile.sellerListings')} ({totalListings})
        </h3>
        
        {sellerListings.length === 0 ? (
          <div className="empty-listings">
            <div className="empty-icon">📦</div>
            <h4 className="empty-title">{t('sellerProfile.noListings')}</h4>
            <p className="empty-description">{t('sellerProfile.noListingsDescription')}</p>
          </div>
        ) : (
          <div className="seller-listings-grid">
            {sellerListings.map(listing => (
              <div 
                key={listing.id} 
                className="seller-listing-card"
                onClick={() => handleListingClick(listing)}
              >
                <div className="listing-image-container">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]?.src || ''} 
                      alt={listing.images[0]?.alt || listing.title}
                      className="listing-image"
                    />
                  ) : listing.imageName ? (
                    <img 
                      src={`/images/${listing.imageName}.jpg`} 
                      alt={listing.title}
                      className="listing-image"
                    />
                  ) : (
                    <div className="listing-image-placeholder">
                      <div className="placeholder-icon">📷</div>
                    </div>
                  )}
                </div>
                
                <div className="listing-content">
                  <h4 className="listing-title">{listing.title}</h4>
                  <div className="listing-price">
                    {listing.price} {listing.currency}
                  </div>
                  <div className="listing-stats">
                    <div className="stat-item">
                      <EyeIcon className="stat-icon" />
                      <span>{formatViews(listing.views || 0)}</span>
                    </div>
                    <div className="stat-item">
                      <HeartIcon className="stat-icon" />
                      <span>{listing.favorites || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfileView; 