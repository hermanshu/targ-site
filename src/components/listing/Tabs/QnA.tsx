import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

interface QnAProps {
  listingId: string;
}

export const QnA: React.FC<QnAProps> = ({ listingId }) => {
  const { t } = useTranslation();

  return (
    <div className="qna-tab">
      <h3 className="qna-title">{t('listingDetail.qna')}</h3>
      <div className="qna-content">
        <p className="qna-placeholder">
          {t('listingDetail.qnaPlaceholder')}
        </p>
        {/* TODO: Добавить компонент вопросов и ответов */}
      </div>
    </div>
  );
};

export default QnA; 