import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import '../auth-form-styles.css';
import '../auth-required-styles.css';

interface ProfileViewProps {
  onLogin?: (email: string, password: string) => void;
  onRegister?: (email: string, password: string, name: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onLogin, onRegister }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Читаем параметр mode из URL при загрузке компонента
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    
    if (mode === 'signup') {
      setIsLoginMode(false);
    } else if (mode === 'signin') {
      setIsLoginMode(true);
    }
  }, [location.search]);
  
  // Форма входа
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  
  // Форма регистрации
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerErrors, setRegisterErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
    terms?: string;
  }>({});
  
  // Состояния для чекбокса и модального окна
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Состояния для обработки ошибок и загрузки
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [showCodeInputModal, setShowCodeInputModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  
  // Используем контекст авторизации
  const { signIn, signUp, resendVerificationEmail, verifyEmailCode } = useAuth();

  // Функция для перевода ошибок аутентификации
  const translateAuthError = (errorMessage: string): string => {
    switch (errorMessage) {
      case 'INVALID_EMAIL_OR_PASSWORD':
        return t('profile.invalidEmailOrPassword');
      case 'EMAIL_NOT_FOUND':
        return t('profile.emailNotFound');
      case 'WRONG_PASSWORD':
        return t('profile.wrongPassword');
      case 'TOO_MANY_REQUESTS':
        return t('profile.tooManyRequests');
      case 'USER_DISABLED':
        return t('profile.userDisabled');
      case 'NETWORK_ERROR':
        return t('profile.networkError');
      case 'USER_ALREADY_EXISTS':
        return t('profile.userAlreadyExists');
      case 'INVALID_VERIFICATION_CODE':
        return t('profile.invalidVerificationCode');
      case 'NO_PENDING_VERIFICATION':
        return t('profile.noPendingVerification');
      default:
        return errorMessage;
    }
  };

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return t('profile.emailRequired');
    }
    
    // Проверяем наличие символа @
    if (!email.includes('@')) {
      return t('profile.emailMissingAt');
    }
    
    // Проверяем, что @ не в начале или конце
    if (email.startsWith('@') || email.endsWith('@')) {
      return t('profile.emailInvalidAt');
    }
    
    // Проверяем, что есть домен после @
    const parts = email.split('@');
    if (parts.length !== 2 || !parts[1].includes('.')) {
      return t('profile.emailInvalidDomain');
    }
    
    // Проверяем, что домен не пустой
    if (parts[1].length < 3) {
      return t('profile.emailInvalidDomain');
    }
    
    // Проверяем регулярным выражением
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t('profile.emailInvalid');
    }
    
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return t('profile.passwordMinLength');
    }
    if (!/[A-Z]/.test(password)) {
      return t('profile.passwordUppercase');
    }
    if (!/[0-9]/.test(password)) {
      return t('profile.passwordNumber');
    }
    return null;
  };

  const clearLoginErrors = () => {
    setLoginErrors({});
  };

  const clearRegisterErrors = () => {
    setRegisterErrors({});
  };

  const handleResendVerificationEmail = async () => {
    setIsResendingEmail(true);
    setCodeError(null);
    try {
      await resendVerificationEmail();
      alert(t('notifications.codeSent'));
    } catch (error: any) {
      setCodeError(translateAuthError(error.message));
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);
    
    if (!verificationCode.trim()) {
      setCodeError(t('profile.codeRequired'));
      return;
    }

    setIsLoading(true);
    try {
      await verifyEmailCode(verificationCode.trim());
      setShowCodeInputModal(false);
      setVerificationCode('');
      alert(t('notifications.emailVerified'));
    } catch (error: any) {
      setCodeError(translateAuthError(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearLoginErrors();
    setAuthError(null);
    
    const errors: { email?: string; password?: string } = {};
    
    // Валидация для входа
    if (!loginEmail.trim()) {
      errors.email = t('profile.emailRequired');
    } else {
      const emailError = validateEmail(loginEmail.trim());
      if (emailError) {
        errors.email = emailError;
      }
    }
    
    if (!loginPassword.trim()) {
      errors.password = t('profile.passwordRequired');
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await signIn(loginEmail.trim(), loginPassword);
      // Успешный вход - можно добавить редирект или уведомление
    } catch (error: any) {
      setAuthError(translateAuthError(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearRegisterErrors();
    setAuthError(null);
    
    const errors: { 
      name?: string; 
      email?: string; 
      password?: string; 
      confirmPassword?: string;
      terms?: string;
    } = {};
    
    // Валидация для регистрации
    if (!registerName.trim()) {
      errors.name = t('profile.nameRequired');
    } else if (registerName.trim().length < 2) {
      errors.name = t('profile.nameMinLength');
    }

    if (!registerEmail.trim()) {
      errors.email = t('profile.emailRequired');
    } else {
      const emailError = validateEmail(registerEmail.trim());
      if (emailError) {
        errors.email = emailError;
      }
    }

    if (!registerPassword) {
      errors.password = t('profile.passwordRequired');
    } else {
      const passwordError = validatePassword(registerPassword);
      if (passwordError) {
        errors.password = passwordError;
      }
    }

    if (registerPassword !== confirmPassword) {
      errors.confirmPassword = t('profile.passwordsDoNotMatch');
    }

    if (!agreeToTerms) {
      errors.terms = t('profile.termsRequired');
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await signUp(registerEmail.trim(), registerPassword, registerName.trim(), false);
      setShowEmailVerificationModal(true);
    } catch (error: any) {
      setAuthError(translateAuthError(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
    setAgreeToTerms(false);
    clearRegisterErrors();
  };

  const switchToRegister = () => {
    setIsLoginMode(false);
    setLoginEmail('');
    setLoginPassword('');
    clearLoginErrors();
  };

  return (
    <div className="auth-required-container">
      <div className="auth-required-content">
        <div className="auth-required-icon">
          <LockClosedIcon className="lock-icon" />
        </div>
        
        <h1 className="auth-required-title">
          {isLoginMode ? t('profile.signIn') : t('profile.signUp')}
        </h1>
        <p className="auth-required-description">
          {isLoginMode 
            ? t('profile.signInDescription')
            : t('profile.signUpDescription')
          }
        </p>

        <div className="auth-form-container">
          {isLoginMode ? (
            // Форма входа
            <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label className="form-label">{t('profile.email')}</label>
                <div className={`input-group ${loginErrors.email ? 'input-error' : ''}`}>
                  <EnvelopeIcon className={`input-icon ${loginErrors.email ? 'input-icon-error' : ''}`} />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginErrors.email) clearLoginErrors();
                    }}
                    placeholder={t('profile.enterEmail')}
                    className="form-input"
                    required
                  />
                </div>
                {loginErrors.email && (
                  <div className="error-message">{loginErrors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">{t('profile.password')}</label>
                <div className={`input-group ${loginErrors.password ? 'input-error' : ''}`}>
                  <LockClosedIcon className={`input-icon ${loginErrors.password ? 'input-icon-error' : ''}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginErrors.password) clearLoginErrors();
                    }}
                    placeholder={t('profile.enterPassword')}
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="password-icon" />
                    ) : (
                      <EyeIcon className="password-icon" />
                    )}
                  </button>
                </div>
                {loginErrors.password && (
                  <div className="error-message">{loginErrors.password}</div>
                )}
              </div>

              {authError && (
                <div className="auth-error-message">{authError}</div>
              )}
              
              <button type="submit" className="auth-button primary" disabled={isLoading}>
                <span>{isLoading ? t('profile.signingIn') : t('profile.signIn')}</span>
                {!isLoading && <ArrowRightIcon className="button-icon" />}
              </button>
            </form>
          ) : (
            // Форма регистрации
            <form onSubmit={handleRegisterSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label className="form-label">{t('profile.name')}</label>
                <div className={`input-group ${registerErrors.name ? 'input-error' : ''}`}>
                  <UserIcon className={`input-icon ${registerErrors.name ? 'input-icon-error' : ''}`} />
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => {
                      setRegisterName(e.target.value);
                      if (registerErrors.name) clearRegisterErrors();
                    }}
                    placeholder={t('profile.enterName')}
                    className="form-input"
                    required
                  />
                </div>
                {registerErrors.name && (
                  <div className="error-message">{registerErrors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">{t('profile.email')}</label>
                <div className={`input-group ${registerErrors.email ? 'input-error' : ''}`}>
                  <EnvelopeIcon className={`input-icon ${registerErrors.email ? 'input-icon-error' : ''}`} />
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => {
                      setRegisterEmail(e.target.value);
                      if (registerErrors.email) clearRegisterErrors();
                    }}
                    placeholder={t('profile.enterEmail')}
                    className="form-input"
                    required
                  />
                </div>
                {registerErrors.email && (
                  <div className="error-message">{registerErrors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">{t('profile.password')}</label>
                <div className={`input-group ${registerErrors.password ? 'input-error' : ''}`}>
                  <LockClosedIcon className={`input-icon ${registerErrors.password ? 'input-icon-error' : ''}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      if (registerErrors.password) clearRegisterErrors();
                    }}
                    placeholder={t('profile.createPassword')}
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="password-icon" />
                    ) : (
                      <EyeIcon className="password-icon" />
                    )}
                  </button>
                </div>
                {registerErrors.password && (
                  <div className="error-message">{registerErrors.password}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">{t('profile.confirmPassword')}</label>
                <div className={`input-group ${registerErrors.confirmPassword ? 'input-error' : ''}`}>
                  <LockClosedIcon className={`input-icon ${registerErrors.confirmPassword ? 'input-icon-error' : ''}`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (registerErrors.confirmPassword) clearRegisterErrors();
                    }}
                    placeholder={t('profile.repeatPassword')}
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="password-icon" />
                    ) : (
                      <EyeIcon className="password-icon" />
                    )}
                  </button>
                </div>
                {registerErrors.confirmPassword && (
                  <div className="error-message">{registerErrors.confirmPassword}</div>
                )}
              </div>

                             <div className="form-group">
                 <div className={`terms-checkbox-container ${registerErrors.terms ? 'input-error' : ''}`}>
                   <div className="terms-checkbox-label">
                     <span className="terms-text">
                       {t('profile.iAgreeWith')}{' '}
                       <button
                         type="button"
                         onClick={() => setShowTermsModal(true)}
                         className="terms-link"
                       >
                         {t('profile.termsAndConditions')}
                       </button>
                       {' '}{t('common.and')}{' '}
                       <button
                         type="button"
                         onClick={() => setShowTermsModal(true)}
                         className="terms-link"
                       >
                         {t('profile.privacyPolicy')}
                       </button>
                     </span>
                     <label className="apple-switch-label">
                       <div className="apple-switch">
                         <input
                           type="checkbox"
                           checked={agreeToTerms}
                           onChange={(e) => {
                             setAgreeToTerms(e.target.checked);
                             if (registerErrors.terms) clearRegisterErrors();
                           }}
                           className="apple-switch-input"
                           required
                         />
                         <div className="apple-switch-track">
                           <div className="apple-switch-thumb"></div>
                         </div>
                       </div>
                     </label>
                   </div>
                 </div>
                 {registerErrors.terms && (
                   <div className="error-message">{registerErrors.terms}</div>
                 )}
               </div>

              {authError && (
                <div className="auth-error-message">{authError}</div>
              )}
              
              <button type="submit" className="auth-button primary" disabled={isLoading}>
                <span>{isLoading ? t('profile.signingUp') : t('profile.signUp')}</span>
                {!isLoading && <ArrowRightIcon className="button-icon" />}
              </button>
            </form>
          )}
        </div>

                 <div className="auth-mode-toggle-container">
           <button
             type="button"
             onClick={isLoginMode ? switchToRegister : switchToLogin}
             className="auth-mode-toggle"
           >
             {isLoginMode 
               ? t('profile.noAccount') 
               : t('profile.haveAccount')
             }
           </button>
         </div>
      </div>

      {/* Модальные окна остаются без изменений */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t('profile.termsAndConditions')}</h2>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="modal-close"
              >
                <XMarkIcon className="modal-close-icon" />
              </button>
            </div>
            <div className="modal-body">
              <div className="terms-content">
                <h3>{t('profile.termsTitle')}</h3>
                <p>{t('profile.termsText')}</p>
                <h3>{t('profile.privacyTitle')}</h3>
                <p>{t('profile.privacyText')}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="auth-button"
              >
                {t('profile.understand')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения email */}
      {showEmailVerificationModal && (
        <div className="modal-overlay" onClick={() => setShowEmailVerificationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t('profile.emailVerificationTitle')}</h2>
              <button
                type="button"
                onClick={() => setShowEmailVerificationModal(false)}
                className="modal-close-button"
              >
                <XMarkIcon className="modal-close-icon" />
              </button>
            </div>
            <div className="modal-body">
              <div className="email-verification-content">
                <div className="verification-icon">
                  <EnvelopeIcon className="verification-icon-svg" />
                </div>
                <h3>{t('profile.checkEmail')}</h3>
                <p>
                  {t('profile.emailSentTo')} <strong>{registerEmail}</strong>
                </p>
                <p>{t('profile.emailVerificationSteps')}</p>
                <div className="verification-steps">
                  <div className="verification-step">
                    <span className="step-number">1</span>
                    <span>{t('profile.openEmail')}</span>
                  </div>
                  <div className="verification-step">
                    <span className="step-number">2</span>
                    <span>{t('profile.findEmail')}</span>
                  </div>
                  <div className="verification-step">
                    <span className="step-number">3</span>
                    <span>{t('profile.clickLink')}</span>
                  </div>
                </div>
                
                <div className="verification-actions">
                  <button
                    type="button"
                    onClick={handleResendVerificationEmail}
                    className="verification-action-button"
                    disabled={isResendingEmail}
                  >
                    {isResendingEmail ? t('profile.sending') : t('profile.resendEmail')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailVerificationModal(false);
                      setShowCodeInputModal(true);
                    }}
                    className="verification-action-button secondary"
                  >
                    {t('profile.enterCodeManually')}
                  </button>
                </div>
                
                {codeError && (
                  <div className="error-message">{codeError}</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setShowEmailVerificationModal(false)}
                className="modal-button"
              >
                {t('profile.understand')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно ввода кода подтверждения */}
      {showCodeInputModal && (
        <div className="modal-overlay" onClick={() => setShowCodeInputModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t('profile.codeInputTitle')}</h2>
              <button
                type="button"
                onClick={() => setShowCodeInputModal(false)}
                className="modal-close-button"
              >
                <XMarkIcon className="modal-close-icon" />
              </button>
            </div>
            <div className="modal-body">
              <div className="code-input-content">
                <div className="verification-icon">
                  <EnvelopeIcon className="verification-icon-svg" />
                </div>
                <h3>{t('profile.verificationCode')}</h3>
                <p>
                  {t('profile.emailSentTo')} <strong>{registerEmail}</strong>
                </p>
                
                <form onSubmit={handleCodeSubmit} className="code-input-form">
                  <div className="form-group">
                    <label className="form-label">{t('profile.verificationCode')}</label>
                    <div className={`input-group ${codeError ? 'input-error' : ''}`}>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value);
                          if (codeError) setCodeError(null);
                        }}
                        placeholder={t('profile.enterCodePlaceholder')}
                        className="form-input"
                        maxLength={6}
                        required
                      />
                    </div>
                    {codeError && (
                      <div className="error-message">{codeError}</div>
                    )}
                  </div>
                  
                  <div className="code-input-actions">
                    <button
                      type="submit"
                      className="auth-button primary"
                    >
                      {t('profile.confirm')}
                    </button>
                    <button
                      type="button"
                      onClick={handleResendVerificationEmail}
                      className="verification-action-button"
                      disabled={isResendingEmail}
                    >
                      {isResendingEmail ? t('profile.sending') : t('profile.resendCodeAgain')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setShowCodeInputModal(false)}
                className="modal-button"
              >
                {t('profile.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView; 