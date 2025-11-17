'use client';

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import en from './locales/en.json';
import nl from './locales/nl.json';

const translations: Record<string, any> = { en, nl };

type Language = 'en' | 'nl';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || key;
  }, [language]);

  useEffect(() => {
    // You could add logic here to detect browser language or load from localStorage
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
