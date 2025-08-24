import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

export const SafetyNote: React.FC = React.memo(() => {
  const { t } = useTranslation();

  return (
    <div className="safety-note">
      <div className="safety-note-icon">⚠️</div>
      <div className="safety-note-content">
        <h4 className="safety-note-title">{t('listingDetail.safetyTitle')}</h4>
        <p className="safety-note-text">
          {t('listingDetail.safetyText')}
        </p>
      </div>
    </div>
  );
}); 