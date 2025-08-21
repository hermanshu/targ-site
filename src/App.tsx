import React, { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ListingsProvider } from './contexts/ListingsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import MainTabView from './components/MainTabView';
import ErrorBoundary from './components/ErrorBoundary';
import { useDeviceType } from './hooks/useDeviceType';

function App() {
  const { type } = useDeviceType();

  // TODO: Firebase - обработка email ссылок при загрузке приложения
  useEffect(() => {
    const handleEmailLink = async () => {
      // TODO: Firebase implementation
      // import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
      // const auth = getAuth();
      
      // if (isSignInWithEmailLink(auth, window.location.href)) {
      //   let email = window.localStorage.getItem('emailForSignIn');
      //   if (!email) {
      //     email = window.prompt('Пожалуйста, введите ваш email для подтверждения');
      //   }
      //   
      //   try {
      //     const result = await signInWithEmailLink(auth, email, window.location.href);
      //     window.localStorage.removeItem('emailForSignIn');
      //     
      //     // Пользователь автоматически войдет в систему
      //     console.log('Email link verification successful');
      //   } catch (error) {
      //     console.error('Email link verification failed:', error);
      //   }
      // }
      
      // Временная логика для демо
      console.log('App loaded, checking for email links...');
    };

    handleEmailLink();
  }, []);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <ListingsProvider>
            <FavoritesProvider>
              <ReviewsProvider>
                <div className={`App device-${type}`}>
                  <MainTabView />
                </div>
              </ReviewsProvider>
            </FavoritesProvider>
          </ListingsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
