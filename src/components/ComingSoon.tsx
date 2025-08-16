import React from 'react';
import { SparklesIcon, ClockIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const ComingSoon: React.FC = () => {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        {/* Анимированный фон */}
        <div className="coming-soon-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="coming-soon-main">
          {/* Логотип */}
          <div className="coming-soon-logo">
            <SparklesIcon className="logo-icon" />
            <h1 className="logo-text">Targ</h1>
          </div>

          {/* Заголовок */}
          <div className="coming-soon-header">
            <h2 className="coming-soon-title">
              Скоро запускаемся!
            </h2>
            <p className="coming-soon-subtitle">
              Мы работаем над созданием лучшей платформы для покупок и продаж в Сербии
            </p>
          </div>

          {/* Прогресс */}
          <div className="coming-soon-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <p className="progress-text">Подготовка к запуску: 85%</p>
          </div>

          {/* Функции */}
          <div className="coming-soon-features">
            <div className="feature">
              <div className="feature-icon">
                <SparklesIcon />
              </div>
              <div className="feature-text">
                <h3>Умные фильтры</h3>
                <p>Быстрый поиск по категориям и параметрам</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <ClockIcon />
              </div>
              <div className="feature-text">
                <h3>Мгновенные уведомления</h3>
                <p>Получайте уведомления о новых объявлениях</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <EnvelopeIcon />
              </div>
              <div className="feature-text">
                <h3>Безопасные сделки</h3>
                <p>Встроенная система сообщений и сделок</p>
              </div>
            </div>
          </div>

          {/* Подписка на уведомления */}
          <div className="coming-soon-notify">
            <h3>Узнайте о запуске первым!</h3>
            <div className="notify-form">
              <input 
                type="email" 
                placeholder="Ваш email" 
                className="notify-input"
              />
              <button className="notify-button">
                Подписаться
              </button>
            </div>
          </div>

          {/* Социальные сети */}
          <div className="coming-soon-social">
            <p>Следите за нами:</p>
            <div className="social-links">
              <button className="social-link">Instagram</button>
              <button className="social-link">Facebook</button>
              <button className="social-link">Telegram</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon; 