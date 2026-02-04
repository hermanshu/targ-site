import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import '../auth-form-styles.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompany, setIsCompany] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setLoginEmail('');
      setLoginPassword('');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      setIsLoginMode(true);
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signIn(loginEmail, loginPassword);
      onClose();
    } catch (err: any) {
      setError(t('profile.invalidEmailOrPassword'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (registerPassword !== confirmPassword) {
      setError(t('profile.passwordsDoNotMatch'));
      setIsLoading(false);
      return;
    }
    try {
      await signUp(registerEmail, registerPassword, registerName, isCompany);
      onClose();
    } catch (err: any) {
      setError(t('profile.userAlreadyExists'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal-content auth-form-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <UserIcon className="modal-title-icon" />
            <h2 className="modal-title">{isLoginMode ? t('profile.signIn') : t('profile.signUp')}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <XMarkIcon className="close-icon" />
          </button>
        </div>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          {isLoginMode ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>{t('profile.email')}</label>
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className="form-input" autoFocus />
              </div>
              <div className="form-group">
                <label>{t('profile.password')}</label>
                <div className="password-input-wrapper">
                  <input type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="form-input" />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                    {showPassword ? <EyeSlashIcon className="eye-icon" /> : <EyeIcon className="eye-icon" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-button primary" disabled={isLoading}>
                {t('profile.signIn')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label>{t('profile.name')}</label>
                <input type="text" value={registerName} onChange={e => setRegisterName(e.target.value)} required className="form-input" />
              </div>
              <div className="form-group">
                <label>{t('profile.email')}</label>
                <input type="email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required className="form-input" />
              </div>
              <div className="form-group">
                <label>{t('profile.password')}</label>
                <input type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required className="form-input" />
              </div>
              <div className="form-group">
                <label>{t('profile.confirmPassword')}</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="form-input" />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="isCompany" checked={isCompany} onChange={e => setIsCompany(e.target.checked)} />
                <label htmlFor="isCompany" style={{ margin: 0 }}>{t('profile.iAmCompany') || 'Я — компания'}</label>
              </div>
              <button type="submit" className="auth-button primary" disabled={isLoading}>
                {t('profile.signUp')}
              </button>
            </form>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-button secondary" onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? t('profile.signUp') : t('profile.signIn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
