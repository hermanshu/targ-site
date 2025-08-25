import React from 'react';
import { XMarkIcon, ChatBubbleLeftRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../hooks/useTranslation';

interface ReviewRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactSeller: () => void;
  sellerName: string;
}

const ReviewRestrictionModal: React.FC<ReviewRestrictionModalProps> = ({
  isOpen,
  onClose,
  onContactSeller,
  sellerName
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay review-restriction-modal-overlay" onClick={onClose}>
      <div className="modal-content review-restriction-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="warning-icon-container">
              <ExclamationTriangleIcon className="warning-icon" />
            </div>
            <h3 className="modal-title">Отзыв можно оставить только после общения</h3>
          </div>
          <button
            onClick={onClose}
            className="modal-close-button"
            aria-label="Закрыть"
          >
            <XMarkIcon className="close-icon" />
          </button>
        </div>

        {/* Содержимое */}
        <div className="modal-body">
          <div className="restriction-message">
            <p className="main-message">
              Чтобы оставить отзыв о <strong>{sellerName}</strong>, необходимо дождаться ответа от продавца.
            </p>
            
            <div className="reasons-list">
              <div className="reason-item">
                <div className="reason-icon">💬</div>
                               <div className="reason-text">
                 <strong>Реальность отзывов</strong><br />
                 Отзывы должны быть основаны на реальном взаимодействии
               </div>
              </div>
              
              <div className="reason-item">
                <div className="reason-icon">🤝</div>
                               <div className="reason-text">
                 <strong>Качество взаимодействия</strong><br />
                 Оценить можно только после ответа продавца
               </div>
              </div>
              
              <div className="reason-item">
                <div className="reason-icon">✅</div>
                               <div className="reason-text">
                 <strong>Достоверность</strong><br />
                 Ответ продавца подтверждает реальность взаимодействия
               </div>
              </div>
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="modal-actions">
          <button
            onClick={onClose}
            className="modal-button secondary"
          >
            Понятно
          </button>
          <button
            onClick={() => {
              onContactSeller();
              onClose();
            }}
            className="modal-button primary"
          >
            <ChatBubbleLeftRightIcon className="action-icon" />
            Связаться с продавцом
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewRestrictionModal; 