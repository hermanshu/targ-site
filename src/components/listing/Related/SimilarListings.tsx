import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

interface SimilarListingsProps {
  categoryId: string;
  listingId: string;
}

export const SimilarListings: React.FC<SimilarListingsProps> = React.memo(({
  categoryId, 
  listingId 
}) => {
  const { t } = useTranslation();

  return (
    <div className="similar-listings">
      <h3 className="similar-listings-title">
        {t('listingDetail.similarListings')}
      </h3>
      <div className="similar-listings-content">
        <p className="similar-listings-placeholder">
          {t('listingDetail.similarListingsPlaceholder')}
        </p>
        {/* TODO: Добавить компонент сетки похожих объявлений */}
      </div>
    </div>
  );
}); 