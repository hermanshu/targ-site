import React, { useState, useRef } from 'react';
import { 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  PlusIcon,
  CameraIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  LanguageIcon
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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUser?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuItems = [
    {
      icon: PlusIcon,
      title: t('profile.myListings'),
      subtitle: t('profile.myListingsDescription'),
      action: () => navigate('/my-listings')
    },
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
      icon: StarIcon,
      title: t('profile.reviews'),
      subtitle: t('profile.reviewsDescription'),
      action: () => navigate('/reviews')
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

  return (
    <div className="profile-container">
      <div className="profile-header">
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
        <h1 className="profile-title">{t('profile.title')}</h1>
        <div className="user-info">
          <p className="user-name">{currentUser?.name}</p>
          <p className="user-email">{currentUser?.email}</p>
        </div>
      </div>

      <div className="profile-menu">
        {menuItems.map((item, index) => {
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