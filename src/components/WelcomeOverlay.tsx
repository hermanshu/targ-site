import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

interface WelcomeOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ isVisible, onClose }) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        <button className="welcome-close-button" onClick={onClose}>
          ✕
        </button>
        
        <div className="welcome-content">
          <div className="welcome-logo">
            <img 
              src="/images/logo.png" 
              alt="Targ Logo" 
              className="welcome-logo-image"
            />
          </div>
          
          <h1 className="welcome-title">{t('welcome.title')}</h1>
          
          <p className="welcome-description">
            {t('welcome.description')}
          </p>
          
          <div className="welcome-features">
            <div className="welcome-feature">
              <span className="welcome-feature-icon">📱</span>
              <span>{t('welcome.feature1')}</span>
            </div>
            <div className="welcome-feature">
              <span className="welcome-feature-icon">🌍</span>
              <span>{t('welcome.feature2')}</span>
            </div>
            <div className="welcome-feature">
              <span className="welcome-feature-icon">🔍</span>
              <span>{t('welcome.feature3')}</span>
            </div>
          </div>
          
          <div className="welcome-language-section">
            <h3 className="welcome-language-title">{t('welcome.selectLanguage')}</h3>
            <div className="welcome-language-options">
              <button
                className={`welcome-language-option ${currentLanguage === 'SR' ? 'active' : ''}`}
                onClick={() => setLanguage('SR')}
              >
                <span className="welcome-flag">🇷🇸</span>
                <span>Српски</span>
              </button>
              <button
                className={`welcome-language-option ${currentLanguage === 'RU' ? 'active' : ''}`}
                onClick={() => setLanguage('RU')}
              >
                <span className="welcome-flag">🇷🇺</span>
                <span>Русский</span>
              </button>
              <button
                className={`welcome-language-option ${currentLanguage === 'EN' ? 'active' : ''}`}
                onClick={() => setLanguage('EN')}
              >
                <span className="welcome-flag">🇺🇸</span>
                <span>English</span>
              </button>
            </div>
          </div>
          
          <button className="welcome-start-button" onClick={onClose}>
            {t('welcome.startExploring')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay; 