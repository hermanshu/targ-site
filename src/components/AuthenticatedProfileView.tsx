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
  PencilIcon
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

  const settingsMenuItems = [
    {
      icon: BellIcon,
      title: t('profile.notifications'),
      subtitle: t('profile.notificationsDescription'),
      action: () => navigate('/notifications-settings')
    },
    {
      icon: QuestionMarkCircleIcon,
      title: t('profile.helpAndSupport'),
      subtitle: t('profile.helpAndSupportDescription'),
      action: () => navigate('/help-support')
    },
    {
      icon: LanguageIcon,
      title: t('profile.languageChange'),
      subtitle: t('profile.languageChangeDescription'),
      action: () => alert(t('profile.goToLanguage'))
    }
  ];

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        alert(t('profile.fileTypeError'));
        return;
      }
      
      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('profile.fileSizeLimit'));
        return;
      }
      
      // Создаем URL для предварительного просмотра
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      
      // Здесь можно добавить логику загрузки файла на сервер
      console.log('Выбран файл:', file.name, 'Размер:', file.size, 'Тип:', file.type);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Валидация полей
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return t('profile.nameRequired');
        if (value.trim().length < 2) return t('profile.nameMinLength');
        return '';
      case 'email':
        if (!value.trim()) return t('profile.emailRequired');
        if (!value.includes('@')) return t('profile.emailMissingAt');
        if (value.split('@').length > 2) return t('profile.emailInvalidAt');
        if (!value.split('@')[1] || !value.split('@')[1].includes('.')) return t('profile.emailInvalidDomain');
        return '';
      case 'phone':
        if (!value.trim()) return t('profile.phoneRequired');
        // Простая валидация телефона (можно улучшить)
        const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/;
        if (!phoneRegex.test(value)) return t('profile.phoneInvalid');
        return '';
      default:
        return '';
    }
  };

  // Начало редактирования профиля
  const startEditing = () => {
    setIsEditing(true);
    setEditValues({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || ''
    });
    setErrors({});
  };

  // Отмена редактирования
  const cancelEditing = () => {
    setIsEditing(false);
    setErrors({});
  };

  // Сохранение изменений
  const saveChanges = async () => {
    // Валидируем все поля
    const nameError = validateField('name', editValues.name);
    const emailError = validateField('email', editValues.email);
    const phoneError = validateField('phone', editValues.phone);
    
    const newErrors: Record<string, string> = {};
    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (phoneError) newErrors.phone = phoneError;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile(editValues);
      setIsEditing(false);
      setErrors({});
      
      // Показываем уведомление об успехе
      alert('Профиль успешно обновлен');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка изменения значений в полях редактирования
  const handleEditValueChange = (field: string, value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Обработка нажатия Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveChanges();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="profile-container">
      {/* Заголовок профиля */}
      <div className="profile-header">
        <h1 className="profile-title">{t('profile.title')}</h1>
      </div>

      {/* Основная область профиля */}
      <div className="profile-main-section">
                {/* Аватар и основная информация */}
        <div className="profile-user-section">
          {/* Аватар */}
          <div className="profile-avatar-container">
            <div className="profile-avatar" onClick={handleAvatarClick}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={t('profile.avatar')} className="profile-avatar-image" />
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
          <div className="profile-info-section">
            {/* Кнопка редактирования */}
            {!isEditing && (
              <div className="profile-edit-header">
                <button 
                  className="profile-edit-button"
                  onClick={startEditing}
                  title={t('profile.editProfile')}
                >
                  <PencilIcon className="profile-edit-icon" />
                </button>
              </div>
            )}

            {/* Поля информации в три строки */}
            <div className="profile-info-fields">
              {/* Имя */}
              <div className="profile-info-row">
                <div className="profile-info-label">Имя:</div>
                <div className="profile-info-value">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editValues.name}
                      onChange={(e) => handleEditValueChange('name', e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="profile-edit-input"
                      placeholder={t('profile.enterName')}
                    />
                  ) : (
                    <span className="user-name">{currentUser?.name}</span>
                  )}
                </div>
                {errors.name && <div className="field-error">{errors.name}</div>}
              </div>

              {/* Email */}
              <div className="profile-info-row">
                <div className="profile-info-label">Email:</div>
                <div className="profile-info-value">
                  {isEditing ? (
                    <input
                      type="email"
                      value={editValues.email}
                      onChange={(e) => handleEditValueChange('email', e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="profile-edit-input"
                      placeholder={t('profile.enterEmail')}
                    />
                  ) : (
                    <span className="user-email">{currentUser?.email}</span>
                  )}
                </div>
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              {/* Телефон */}
              <div className="profile-info-row">
                <div className="profile-info-label">Телефон:</div>
                <div className="profile-info-value">
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editValues.phone}
                      onChange={(e) => handleEditValueChange('phone', e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="profile-edit-input"
                      placeholder={t('profile.enterPhone')}
                    />
                  ) : (
                    <span className="user-phone">
                      {currentUser?.phone || t('profile.phone')}
                    </span>
                  )}
                </div>
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>
            </div>

          </div>
        </div>

        {/* Кнопки сохранения/отмены при редактировании */}
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

        {/* Кнопки профиля */}
        <div className="profile-actions-section">
          <button 
            className="menu-item"
            onClick={() => navigate('/my-listings')}
          >
            <div className="menu-item-content">
              <PlusIcon className="menu-item-icon" />
              <div className="menu-item-text">
                <span className="menu-item-title">{t('profile.myListings')}</span>
                <span className="menu-item-subtitle">{t('profile.myListingsDescription')}</span>
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
                <span className="menu-item-title">{t('profile.reviews')}</span>
                <span className="menu-item-subtitle">{t('profile.reviewsDescription')}</span>
              </div>
            </div>
            <ArrowRightOnRectangleIcon className="menu-item-arrow" />
          </button>
        </div>
      </div>

      {/* Меню настроек */}
      <div className="settings-menu-section">
        <h2 className="section-title">Общие настройки</h2>
        <div className="settings-menu">
          {settingsMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="menu-item"
                onClick={item.action}
              >
                <div className="menu-item-content">
                  <Icon className="menu-item-icon" />
                  <div className="menu-item-text">
                    <span className="menu-item-title">{item.title}</span>
                    <span className="menu-item-subtitle">{item.subtitle}</span>
                  </div>
                </div>
                <ArrowRightOnRectangleIcon className="menu-item-arrow" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Кнопка выхода */}
      <div className="profile-actions">
        <button className="logout-button" onClick={onLogout}>
          <ArrowRightOnRectangleIcon className="logout-icon" />
          <span>{t('profile.logoutFromAccount')}</span>
        </button>
      </div>
    </div>
  );
};

export default AuthenticatedProfileView; 