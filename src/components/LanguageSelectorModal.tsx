import React from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentLanguage, setLanguage, languages } = useLanguage();

  if (!isOpen) return null;

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode as any);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="language-selector-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="language-selector-modal-header">
          <div className="language-selector-modal-title-section">
            <div className="language-selector-modal-icon">🌐</div>
            <h2 className="language-selector-modal-title">Выберите язык</h2>
          </div>
          <button className="language-selector-modal-close" onClick={onClose}>
            <XMarkIcon className="close-icon" />
          </button>
        </div>

        <div className="language-selector-modal-body">
          <p className="language-selector-description">
            Выберите язык интерфейса. Изменения применятся немедленно.
          </p>
          
          <div className="language-options">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`language-option ${currentLanguage === language.code ? 'selected' : ''}`}
                onClick={() => handleLanguageSelect(language.code)}
              >
                <div className="language-option-content">
                  <div className="language-flag">{language.flag}</div>
                  <div className="language-info">
                    <div className="language-name">{language.name}</div>
                  </div>
                </div>
                {currentLanguage === language.code && (
                  <CheckIcon className="language-check-icon" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="language-selector-modal-footer">
          <button className="language-selector-modal-button secondary" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorModal; 