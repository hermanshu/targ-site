import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  BellIcon,
  EnvelopeIcon,
  ChartBarIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface NotificationSettings {
  newListings: boolean;
  platformNews: boolean;
  listingStats: boolean;
}

const NotificationsSettingsView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<NotificationSettings>({
    newListings: true,
    platformNews: true,
    listingStats: true
  });


  // Загружаем настройки из localStorage при инициализации
  useEffect(() => {
    const savedSettings = localStorage.getItem('targ-notification-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (e) {
        console.error('Ошибка при загрузке настроек уведомлений:', e);
      }
    }
  }, []);

  // Сохраняем настройки в localStorage
  const saveSettings = (newSettings: NotificationSettings) => {
    try {
      localStorage.setItem('targ-notification-settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (e) {
      console.error('Ошибка при сохранении настроек уведомлений:', e);
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    saveSettings(newSettings);
  };

  const handleBack = () => {
    navigate('/profile');
  };

  const notificationItems = [
    {
      key: 'newListings' as keyof NotificationSettings,
      icon: BellIcon,
      title: t('notifications.newListings'),
      description: t('notifications.newListingsDescription'),
      enabled: settings.newListings
    },
    {
      key: 'platformNews' as keyof NotificationSettings,
      icon: MegaphoneIcon,
      title: t('notifications.platformNews'),
      description: t('notifications.platformNewsDescription'),
      enabled: settings.platformNews
    },
    {
      key: 'listingStats' as keyof NotificationSettings,
      icon: ChartBarIcon,
      title: t('notifications.listingStats'),
      description: t('notifications.listingStatsDescription'),
      enabled: settings.listingStats
    }
  ];

  return (
    <div className="notifications-settings-container">
      {/* Заголовок */}
      <div className="notifications-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeftIcon className="back-icon" />
        </button>
        <h1 className="notifications-title">{t('notifications.settings')}</h1>
      </div>

      {/* Описание */}
      <div className="notifications-description">
        <EnvelopeIcon className="description-icon" />
        <p>{t('notifications.settingsDescription')}</p>
      </div>

      {/* Список настроек */}
      <div className="notifications-list">
        {notificationItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="notification-item">
              <div className="notification-item-content">
                <Icon className="notification-item-icon" />
                <div className="notification-item-text">
                  <h3 className="notification-item-title">{item.title}</h3>
                  <p className="notification-item-description">{item.description}</p>
                </div>
              </div>
              <label className="apple-switch-label">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => handleToggle(item.key)}
                  className="apple-switch-input"
                />
                <div className="apple-switch">
                  <div className="apple-switch-track">
                    <div className="apple-switch-thumb"></div>
                  </div>
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {/* Информация */}
      <div className="notifications-info">
        <p className="info-text">{t('notifications.settingsInfo')}</p>
      </div>
    </div>
  );
};

export default NotificationsSettingsView; 