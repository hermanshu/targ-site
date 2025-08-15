import React, { useEffect } from 'react';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import '../auth-required-styles.css';

interface AuthRequiredViewProps {
  title: string;
  description: string;
}

const AuthRequiredView: React.FC<AuthRequiredViewProps> = ({ title, description }) => {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Блокируем прокрутку при открытии заглушки
    document.body.classList.add('auth-required-open');
    
    // Возвращаем прокрутку при закрытии компонента
    return () => {
      document.body.classList.remove('auth-required-open');
    };
  }, []);

  return (
    <div className="auth-required-container">
      <div className="auth-required-content">
        <div className="auth-required-icon">
          <LockClosedIcon className="lock-icon" />
        </div>
        
        <h1 className="auth-required-title">{title}</h1>
        <p className="auth-required-description">{description}</p>
        
        <div className="auth-required-actions">
          <Link to="/profile?mode=signin" className="auth-required-button primary">
            <UserIcon className="button-icon" />
            <span>{t('profile.signIn')}</span>
          </Link>
          
          <p className="auth-required-or">{t('common.or')}</p>
          
          <Link to="/profile?mode=signup" className="auth-required-button secondary">
            <span>{t('profile.signUp')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredView; 