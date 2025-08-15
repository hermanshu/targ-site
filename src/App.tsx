import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ListingsProvider } from './contexts/ListingsContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import StartView from './components/StartView';
import MainTabView from './components/MainTabView';

function App() {
  const [showStart, setShowStart] = useState(true);

  const handleStart = () => {
    setShowStart(false);
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <FavoritesProvider>
          <ListingsProvider>
            <div className="App">
              {showStart ? (
                <StartView onStart={handleStart} />
              ) : (
                <MainTabView />
              )}
            </div>
          </ListingsProvider>
        </FavoritesProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
