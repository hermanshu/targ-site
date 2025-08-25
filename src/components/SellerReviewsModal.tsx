import React from 'react';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Review, SellerRating } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface SellerReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  sellerRating: SellerRating;
  isCompany: boolean;
}

const SellerReviewsModal: React.FC<SellerReviewsModalProps> = ({
  isOpen,
  onClose,
  sellerName,
  sellerRating,
  isCompany
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="inline-block">
        {index < Math.floor(rating) ? (
          <StarIconSolid className="w-4 h-4 text-yellow-400" />
        ) : index < rating ? (
          <StarIconSolid className="w-4 h-4 text-yellow-400" />
        ) : (
          <StarIcon className="w-4 h-4 text-gray-300" />
        )}
      </span>
    ));
  };

  return (
    <div className="modal-overlay seller-reviews-modal-overlay" onClick={onClose}>
      <div className="modal-content seller-reviews-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h3 className="modal-title">Отзывы о продавце</h3>
            <div className="seller-info-summary">
              <span className="seller-name">{sellerName}</span>
              {isCompany && <span className="company-badge">Компания</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-button"
            aria-label="Закрыть"
          >
            <XMarkIcon className="close-icon" />
          </button>
        </div>

        {/* Общий рейтинг */}
        <div className="rating-summary">
          <div className="rating-main">
            <div className="rating-stars-large">
              {renderStars(sellerRating.averageRating)}
            </div>
            <div className="rating-details">
              <span className="rating-value">{sellerRating.averageRating}</span>
              <span className="rating-count">
                {sellerRating.totalReviews} {sellerRating.totalReviews === 1 ? 'отзыв' : 
                  sellerRating.totalReviews < 5 ? 'отзыва' : 'отзывов'}
              </span>
            </div>
          </div>
        </div>

        {/* Список отзывов */}
        <div className="reviews-list">
          {sellerRating.reviews.length > 0 ? (
            sellerRating.reviews.map((review: Review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <span className="reviewer-name">{review.reviewerName}</span>
                    {review.isVerified && (
                      <span className="verified-badge" title="Проверенный отзыв">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                {review.comment && (
                  <div className="review-comment">
                    {review.comment}
                  </div>
                )}
                
                <div className="review-date">
                  {formatDate(review.createdAt)}
                </div>
              </div>
            ))
          ) : (
            <div className="no-reviews">
              <div className="no-reviews-icon">📝</div>
              <p className="no-reviews-text">Пока нет отзывов</p>
              <p className="no-reviews-subtext">Будьте первым, кто оставит отзыв о {isCompany ? 'компании' : 'продавце'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerReviewsModal; 