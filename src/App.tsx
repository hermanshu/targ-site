import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ListingsProvider } from './contexts/ListingsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import MainTabView from './components/MainTabView';
import ComingSoon from './components/ComingSoon';
import './coming-soon.css';

// Переключатель режима обслуживания
// Измените на false для включения основного сайта
const MAINTENANCE_MODE = false;

function App() {
  // Если включен режим обслуживания, показываем заглушку
  if (MAINTENANCE_MODE) {
    return <ComingSoon />;
  }

  // Иначе показываем основной сайт
  return (
    <LanguageProvider>
      <AuthProvider>
        <ListingsProvider>
          <FavoritesProvider>
            <div className="App">
              <MainTabView />
            </div>
          </FavoritesProvider>
        </ListingsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
