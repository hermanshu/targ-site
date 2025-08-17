import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../start-screen.css';

interface StartViewProps {
  onStart: () => void;
}

const StartView: React.FC<StartViewProps> = ({ onStart }) => {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [showLanguagePanel, setShowLanguagePanel] = useState(false);
  const [logoPhase, setLogoPhase] = useState<'largeCenter' | 'smallTop'>('largeCenter');

  useEffect(() => {
    // Анимация логотипа - начинаем раньше для более плавного перехода
    const timer1 = setTimeout(() => {
      setLogoPhase('smallTop');
    }, 800);

    // Показ панели языка - ждем завершения анимации логотипа
    const timer2 = setTimeout(() => {
      setShowLanguagePanel(true);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode as any);
    setShowLanguagePanel(false);
    setTimeout(() => {
      onStart();
    }, 600);
  };

  return (
    <div className="start-screen">
      {/* Логотип */}
      <div className="logo-container">
        <div className={`logo ${logoPhase === 'smallTop' ? 'small' : ''}`}>
          <img 
            src={`${process.env.PUBLIC_URL}/images/logo.png`} 
            alt="TARG Logo" 
          />
        </div>

      </div>

      {/* Панель выбора языка */}
      {showLanguagePanel && (
        <div className="language-panel">
          <div className="glass-panel">
            <h2 className="panel-title">
              Выберите язык
            </h2>
            <div className="language-buttons">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`language-button ${currentLanguage === language.code ? 'active' : ''}`}
                >
                  <span className="language-flag">{language.flag}</span>
                  <span className="language-name">{language.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartView; 