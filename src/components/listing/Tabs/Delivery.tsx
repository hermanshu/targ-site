import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

interface DeliveryProps {
  listingId: string;
}

export const Delivery: React.FC<DeliveryProps> = ({ listingId }) => {
  const { t } = useTranslation();

  return (
    <div className="delivery-tab">
      <h3 className="delivery-title">{t('listingDetail.delivery')}</h3>
      <div className="delivery-content">
        <p className="delivery-placeholder">
          {t('listingDetail.deliveryPlaceholder')}
        </p>
        {/* TODO: Добавить компонент информации о доставке */}
      </div>
    </div>
  );
};

export default Delivery; 