import React, { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  UserIcon, 
  ChatBubbleLeftRightIcon, 
  StarIcon,
  PhoneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';
import { useDialogs } from '../../../contexts/DialogsContext';
import { useTranslation } from '../../../hooks/useTranslation';
import StarRating from '../../../components/StarRating';

interface Seller {
  id: string;
  name: string;
  isCompany: boolean;
  rating: number;
  deals: number;
  online?: boolean;
}

interface SellerCardProps {
  seller: Seller;
  contactMethod?: 'chat' | 'phone' | 'both';
  onContactClick: () => void;
  onNavigateToSellerProfile?: (sellerId: string, sellerName: string, isCompany: boolean) => void;
  canLeaveReview?: boolean;
  onReviewClick?: () => void;
}

export const SellerCard: React.FC<SellerCardProps> = React.memo(({ 
  seller, 
  contactMethod = 'both',
  onContactClick,
  onNavigateToSellerProfile,
  canLeaveReview = false,
  onReviewClick
}) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { hasDialogWithSeller } = useDialogs();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleContactClick = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (contactMethod === 'chat') {
      onContactClick();
    } else if (contactMethod === 'phone') {
      setShowContactModal(true);
    } else {
      setShowContactModal(true);
    }
  };

  const handlePhoneCall = () => {
    setShowContactModal(false);
    // TODO: Добавить логику для звонка
    window.alert(`${t('listingDetail.call')} ${seller.name}`);
  };

  const handleStartChat = () => {
    setShowContactModal(false);
    onContactClick();
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleAuthAction = (action: 'signin' | 'signup') => {
    setShowAuthModal(false);
    // TODO: Добавить навигацию к авторизации
    console.log('Navigate to auth:', action);
  };

  return (
    <>
      <div className="seller-info">
        <div className="seller-avatar">
          {seller.isCompany ? (
            <BuildingOfficeIcon className="seller-icon" />
          ) : (
            <UserIcon className="seller-icon" />
          )}
        </div>
        <div className="seller-details">
          <div 
            className="seller-name clickable"
            onClick={() => onNavigateToSellerProfile?.(seller.id, seller.name, seller.isCompany)}
            style={{ cursor: 'pointer' }}
          >
            {seller.name}
          </div>
          <div className="seller-type">
            {seller.isCompany ? t('listingDetail.company') : t('listingDetail.individual')}
          </div>
          
          {/* Рейтинг продавца */}
          {seller.rating > 0 && (
            <div className="seller-rating-info">
              <StarRating 
                rating={seller.rating} 
                readonly={true} 
                size="small"
              />
              <span className="rating-text">
                {seller.rating} ({seller.deals} сделок)
              </span>
            </div>
          )}
        </div>
        <div className="seller-actions">
          <button 
            className="contact-button"
            onClick={handleContactClick}
          >
            <ChatBubbleLeftRightIcon className="contact-icon" />
            <span className="contact-text">
              {contactMethod === 'chat' ? t('listingDetail.write') : t('listingDetail.contactSeller')}
            </span>
          </button>
          
          {/* Кнопка оставить отзыв */}
          {canLeaveReview && (
            <button 
              className="review-button"
              onClick={() => {
                if (!currentUser) {
                  setShowAuthModal(true);
                  return;
                }

                // Проверяем, есть ли диалог с продавцом
                if (!hasDialogWithSeller(currentUser.id, seller.id)) {
                  // Если диалога нет, показываем модальное окно ограничения
                  // Это будет обработано в родительском компоненте
                  onReviewClick?.();
                  return;
                }

                onReviewClick?.();
              }}
            >
              <StarIcon className="review-icon" />
              <span className="review-text">Отзыв</span>
            </button>
          )}
        </div>
      </div>

      {/* Модальное окно выбора способа связи */}
      {showContactModal && (
        <div className="contact-modal-overlay" onClick={handleCloseModal}>
          <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <h3 className="contact-modal-title">{t('listingDetail.contactSeller')}</h3>
              <button className="contact-modal-close" onClick={handleCloseModal}>
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="contact-modal-body">
              <p className="contact-modal-description">
                {t('listingDetail.chooseContactMethod')}
              </p>
              <div className="contact-modal-options">
                <button 
                  className="contact-option-button phone"
                  onClick={handlePhoneCall}
                >
                  <PhoneIcon className="contact-option-icon" />
                  <div className="contact-option-content">
                    <span className="contact-option-title">{t('listingDetail.call')}</span>
                    <span className="contact-option-description">{t('listingDetail.directCall')}</span>
                  </div>
                </button>
                <button 
                  className="contact-option-button chat"
                  onClick={handleStartChat}
                >
                  <ChatBubbleLeftRightIcon className="contact-option-icon" />
                  <div className="contact-option-content">
                    <span className="contact-option-title">{t('listingDetail.writeMessage')}</span>
                    <span className="contact-option-description">{t('listingDetail.openChat')}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно авторизации */}
      {showAuthModal && (
        <div className="contact-modal-overlay" onClick={handleCloseAuthModal}>
          <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <h3 className="contact-modal-title">{t('listingDetail.authRequired')}</h3>
              <button className="contact-modal-close" onClick={handleCloseAuthModal}>
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div className="contact-modal-body">
              <p className="contact-modal-description">
                {t('listingDetail.authRequiredDescription')}
              </p>
              <div className="contact-modal-options">
                <button 
                  className="contact-option-button signin"
                  onClick={() => handleAuthAction('signin')}
                >
                  <UserIcon className="contact-option-icon" />
                  <div className="contact-option-content">
                    <span className="contact-option-title">{t('listingDetail.signIn')}</span>
                    <span className="contact-option-description">{t('listingDetail.signInDescription')}</span>
                  </div>
                </button>
                <button 
                  className="contact-option-button signup"
                  onClick={() => handleAuthAction('signup')}
                >
                  <BuildingOfficeIcon className="contact-option-icon" />
                  <div className="contact-option-content">
                    <span className="contact-option-title">{t('listingDetail.signUp')}</span>
                    <span className="contact-option-description">{t('listingDetail.signUpDescription')}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}); 