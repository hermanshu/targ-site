import React, { useState, useRef } from 'react';
import { 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  PlusIcon,
  CameraIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  LanguageIcon,
  PencilIcon,
  WalletIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

interface AuthenticatedProfileViewProps {
  onLogout: () => void;
}

const AuthenticatedProfileView: React.FC<AuthenticatedProfileViewProps> = ({ 
  onLogout 
}) => {
  const { t } = useTranslation();
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUser?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Состояния для редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Моковые данные для демонстрации
  const userStats = {
    listings: 10,
    sales: 5,
    responseTime: '10 мин'
  };



  const analytics = {
    weeklyViews: 120,
    weeklyMessages: 8
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert(t('profile.fileTypeError'));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert(t('profile.fileSizeLimit'));
        return;
      }
      
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return t('profile.nameRequired');
        if (value.trim().length < 2) return t('profile.nameMinLength');
        return '';
      case 'email':
        if (!value.trim()) return t('profile.emailRequired');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return t('profile.emailInvalid');
        return '';
      case 'phone':
        if (value.trim() && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
          return t('profile.phoneInvalid');
        }
        return '';
      default:
        return '';
    }
  };

  const handleEditValueChange = (field: string, value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
    
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const startEditing = () => {
    setIsEditing(true);
    setErrors({});
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValues({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || ''
    });
    setErrors({});
  };

  const saveChanges = async () => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(editValues).forEach(field => {
      const error = validateField(field, editValues[field as keyof typeof editValues]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile(editValues);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveChanges();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="authenticated-profile-container">
      {/* Карточка профиля */}
      <div className="profile-card">
        <div className="profile-header">
          {/* Аватар */}
          <div className="profile-avatar-container">
            <div className="profile-avatar" onClick={handleAvatarClick}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="profile-avatar-image" />
              ) : (
                <UserIcon className="profile-avatar-icon" />
              )}
            </div>
            <div className="avatar-edit-overlay" onClick={handleAvatarClick}>
              <CameraIcon className="avatar-edit-icon" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Информация о пользователе */}
          <div className="profile-info">
            <div className="profile-name-section">
              {isEditing ? (
                <input
                  type="text"
                  value={editValues.name}
                  onChange={(e) => handleEditValueChange('name', e.target.value)}
                  className="profile-name-edit-input"
                  placeholder="Введите имя"
                />
              ) : (
                <h2 className="profile-name">{currentUser?.name}</h2>
              )}
              {!isEditing && (
                <button 
                  className="profile-edit-button"
                  onClick={startEditing}
                  title={t('profile.editProfile')}
                >
                  <PencilIcon className="profile-edit-icon" />
                </button>
              )}
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            {/* Контактная информация */}
            <div className="profile-contact-info">
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                {isEditing ? (
                  <input
                    type="email"
                    value={editValues.email}
                    onChange={(e) => handleEditValueChange('email', e.target.value)}
                    className="contact-edit-input"
                    placeholder="Введите email"
                  />
                ) : (
                  <span className="contact-value">{currentUser?.email}</span>
                )}
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>
              <div className="contact-item">
                <span className="contact-label">Телефон:</span>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editValues.phone}
                    onChange={(e) => handleEditValueChange('phone', e.target.value)}
                    className="contact-edit-input"
                    placeholder="Введите телефон"
                  />
                ) : (
                  <span className="contact-value">
                    {currentUser?.phone ? currentUser.phone : 'Подтвердить телефон'}
                  </span>
                )}
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>
            </div>

            {/* Мини-метрики */}
            <div className="profile-metrics">
              <span className="metric">
                {userStats.listings} объявлений
              </span>
              <span className="metric-separator">•</span>
              <span className="metric">
                {userStats.sales} продаж
              </span>
              <span className="metric-separator">•</span>
              <span className="metric">
                отвечает за {userStats.responseTime}
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки редактирования */}
        {isEditing && (
          <div className="profile-edit-actions">
            <button 
              onClick={saveChanges} 
              disabled={isLoading}
              className="profile-save-button"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button 
              onClick={cancelEditing}
              className="profile-cancel-button"
            >
              Отменить
            </button>
          </div>
        )}

        {/* Кнопка создания объявления */}
        <div className="create-listing-section">
          <button 
            className="create-listing-button"
            onClick={() => navigate('/add')}
          >
            <PlusIcon className="create-listing-icon" />
            Создать объявление
          </button>
        </div>
      </div>

      {/* Блоки управления и настроек */}
      <div className="profile-sections">
        {/* Управление (для продавца) */}
        <div className="profile-section">
          <h3 className="section-title">Управление объявлениями</h3>
          <div className="section-content">
            <button 
              className="menu-item"
              onClick={() => navigate('/my-listings')}
            >
              <div className="menu-item-content">
                <PlusIcon className="menu-item-icon" />
                <div className="menu-item-text">
                  <span className="menu-item-title">Мои объявления</span>
                  <span className="menu-item-subtitle">Управляй своими объявлениями</span>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="menu-item-arrow" />
            </button>

            <button 
              className="menu-item"
              onClick={() => setShowWalletModal(true)}
            >
              <div className="menu-item-content">
                <WalletIcon className="menu-item-icon" />
                <div className="menu-item-text">
                  <span className="menu-item-title">Кошелёк</span>
                  <span className="menu-item-subtitle">Баланс и пополнение</span>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="menu-item-arrow" />
            </button>

            <button 
              className="menu-item"
              onClick={() => navigate('/reviews')}
            >
              <div className="menu-item-content">
                <StarIcon className="menu-item-icon" />
                <div className="menu-item-text">
                  <span className="menu-item-title">Отзывы</span>
                  <span className="menu-item-subtitle">Просмотр и управление отзывами</span>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="menu-item-arrow" />
            </button>
          </div>
        </div>

        {/* Настройки */}
        <div className="profile-section">
          <h3 className="section-title">Настройки аккаунта</h3>
          <div className="section-content">
            <button 
              className="menu-item"
              onClick={() => navigate('/notifications-settings')}
            >
              <div className="menu-item-content">
                <BellIcon className="menu-item-icon" />
                <div className="menu-item-text">
                  <span className="menu-item-title">Уведомления</span>
                  <span className="menu-item-subtitle">Настройка уведомлений</span>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="menu-item-arrow" />
            </button>

            <button 
              className="menu-item"
              onClick={() => alert(t('profile.goToLanguage'))}
            >
              <div className="menu-item-content">
                <LanguageIcon className="menu-item-icon" />
                <div className="menu-item-text">
                  <span className="menu-item-title">Смена языка</span>
                  <span className="menu-item-subtitle">Выбери язык интерфейса</span>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="menu-item-arrow" />
            </button>

            <button 
              className="menu-item"
              onClick={() => navigate('/help-support')}
            >
              <div className="menu-item-content">
                <QuestionMarkCircleIcon className="menu-item-icon" />
                <div className="menu-item-text">
                  <span className="menu-item-title">Поддержка</span>
                  <span className="menu-item-subtitle">Помощь и поддержка</span>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="menu-item-arrow" />
            </button>
          </div>
        </div>

        {/* Аналитика */}
        <div className="profile-section full-width">
          <h3 className="section-title">Аналитика</h3>
          <div className="analytics-content">
            <div className="analytics-card">
              <ChartBarIcon className="analytics-icon" />
              <div className="analytics-text">
                <p className="analytics-title">За неделю твои объявления посмотрели {analytics.weeklyViews} раз</p>
                <p className="analytics-subtitle">Написали {analytics.weeklyMessages} человек</p>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Кнопка выхода внизу */}
      <div className="profile-footer">
        <button className="logout-link" onClick={onLogout}>
          Выйти из аккаунта
        </button>
      </div>

      {/* Модальное окно кошелька */}
      {showWalletModal && (
        <div className="modal-overlay wallet-modal-overlay" onClick={() => setShowWalletModal(false)}>
          <div className="modal-content wallet-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="wallet-modal-header">
              <h3 className="wallet-modal-title">
                <WalletIcon className="wallet-modal-icon" />
                {t('profile.wallet')}
              </h3>
              <button 
                className="modal-close-button"
                onClick={() => setShowWalletModal(false)}
              >
                <ArrowRightOnRectangleIcon className="modal-close-icon" />
              </button>
            </div>
            
            <div className="wallet-modal-body">
              <div className="wallet-feature">
                <div className="wallet-feature-icon">💳</div>
                <div className="wallet-feature-content">
                  <h4 className="wallet-feature-title">{t('profile.walletFeature1Title')}</h4>
                  <p className="wallet-feature-description">{t('profile.walletFeature1Description')}</p>
                </div>
              </div>
              
              <div className="wallet-feature">
                <div className="wallet-feature-icon">🚀</div>
                <div className="wallet-feature-content">
                  <h4 className="wallet-feature-title">{t('profile.walletFeature2Title')}</h4>
                  <p className="wallet-feature-description">{t('profile.walletFeature2Description')}</p>
                </div>
              </div>
              
              <div className="wallet-feature">
                <div className="wallet-feature-icon">⚡</div>
                <div className="wallet-feature-content">
                  <h4 className="wallet-feature-title">{t('profile.walletFeature3Title')}</h4>
                  <p className="wallet-feature-description">{t('profile.walletFeature3Description')}</p>
                </div>
              </div>
              
              <div className="wallet-coming-soon">
                <div className="coming-soon-icon">🔜</div>
                <h4 className="coming-soon-title">{t('profile.walletComingSoonTitle')}</h4>
                <p className="coming-soon-description">{t('profile.walletComingSoonDescription')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticatedProfileView; 