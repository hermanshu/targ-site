import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  interlocutorLanguage: string;
  currentLanguage: string;
}

const LanguageInfoModal: React.FC<LanguageInfoModalProps> = ({
  isOpen,
  onClose,
  interlocutorLanguage,
  currentLanguage
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const languageNames = {
    'RU': 'русском',
    'EN': 'английском', 
    'SR': 'сербском'
  };

  const currentLanguageNames = {
    'RU': 'русский',
    'EN': 'английский',
    'SR': 'сербский'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="language-info-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="language-info-modal-header">
          <div className="language-info-modal-title-section">
            <div className="language-info-modal-icon">🌐</div>
            <h2 className="language-info-modal-title">Язык общения</h2>
          </div>
          <button className="language-info-modal-close" onClick={onClose}>
            <XMarkIcon className="close-icon" />
          </button>
        </div>

        <div className="language-info-modal-body">
          <div className="language-info-section">
            <h3 className="language-info-subtitle">Почему важно общаться на одном языке?</h3>
            
            <div className="language-info-benefits">
              <div className="language-info-benefit">
                <div className="benefit-icon">💬</div>
                <div className="benefit-content">
                  <h4>Лучшее понимание</h4>
                  <p>Общение на родном языке собеседника помогает избежать недопонимания и двусмысленностей</p>
                </div>
              </div>

              <div className="language-info-benefit">
                <div className="benefit-icon">🤝</div>
                <div className="benefit-content">
                  <h4>Уважение и доверие</h4>
                  <p>Попытка говорить на языке собеседника показывает уважение к его культуре и создает доверие</p>
                </div>
              </div>

              <div className="language-info-benefit">
                <div className="benefit-icon">⚡</div>
                <div className="benefit-content">
                  <h4>Быстрое решение вопросов</h4>
                  <p>Четкое понимание друг друга ускоряет процесс обсуждения и принятия решений</p>
                </div>
              </div>

              <div className="language-info-benefit">
                <div className="benefit-icon">🎯</div>
                <div className="benefit-content">
                  <h4>Успешные сделки</h4>
                  <p>Комфортное общение повышает вероятность успешного завершения сделки</p>
                </div>
              </div>
            </div>

            <div className="language-info-current">
              <p className="language-info-text">
                <strong>Ваш собеседник говорит на {languageNames[interlocutorLanguage as keyof typeof languageNames]}.</strong>
                {currentLanguage !== interlocutorLanguage && (
                  <span> Рекомендуем переключиться на {currentLanguageNames[interlocutorLanguage as keyof typeof currentLanguageNames]} для более комфортного общения.</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="language-info-modal-footer">
          <button className="language-info-modal-button primary" onClick={onClose}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageInfoModal; 