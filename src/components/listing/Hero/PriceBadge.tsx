import React from 'react';

interface PriceBadgeProps {
  price: number;
  currency: 'RSD' | 'EUR';
  category?: string;
  subcategory?: string;
}

export const PriceBadge: React.FC<PriceBadgeProps> = React.memo(({ 
  price, 
  currency, 
  category, 
  subcategory 
}) => {
  const isWorkOrVacancy = category === 'work' || 
                          category === 'vacancies' || 
                          subcategory === 'vacancies' || 
                          subcategory === 'rent';

  const formatPrice = (price: number, currency: 'RSD' | 'EUR') => {
    if (currency === 'RSD') {
      return new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    } else {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    }
  };

  return (
    <div className="detail-price">
      {formatPrice(price, currency)}
      {isWorkOrVacancy && ' / месяц'}
    </div>
  );
}); 