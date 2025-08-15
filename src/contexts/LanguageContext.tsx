import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppLanguage, LanguageOption } from '../types';

interface LanguageContextType {
  currentLanguage: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>(() => {
    const savedLanguage = localStorage.getItem('appLanguage') as AppLanguage;
    return savedLanguage || 'RU';
  });

  const languages: LanguageOption[] = [
    { flag: "🇷🇸", name: "Српски", code: "SR" },
    { flag: "🇷🇺", name: "Русский", code: "RU" },
    { flag: "🇺🇸", name: "English", code: "EN" }
  ];

  const setLanguage = (language: AppLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('appLanguage', language);
  };

  const value = {
    currentLanguage,
    setLanguage,
    languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 