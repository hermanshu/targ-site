import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ListingsProvider } from './contexts/ListingsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import MainTabView from './components/MainTabView';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <FavoritesProvider>
          <ListingsProvider>
            <div className="App">
              <MainTabView />
            </div>
          </ListingsProvider>
        </FavoritesProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
