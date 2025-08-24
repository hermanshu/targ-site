import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

interface ReviewsProps {
  listingId: string;
}

export const Reviews: React.FC<ReviewsProps> = ({ listingId }) => {
  const { t } = useTranslation();

  return (
    <div className="reviews-tab">
      <h3 className="reviews-title">{t('listingDetail.reviews')}</h3>
      <div className="reviews-content">
        <p className="reviews-placeholder">
          {t('listingDetail.reviewsPlaceholder')}
        </p>
        {/* TODO: Добавить компонент списка отзывов */}
      </div>
    </div>
  );
};

export default Reviews; 