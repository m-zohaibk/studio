'use client';

import React from 'react';
import { useLanguage } from './LanguageProvider';
import { Button } from '@/components/ui/button';
import UkFlag from './UkFlag';
import NlFlag from './NlFlag';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'nl' : 'en');
  };

  return (
    <Button onClick={toggleLanguage} variant="ghost" size="icon" aria-label="Switch language">
      {language === 'en' ? <UkFlag className="w-16 h-16" /> : <NlFlag className="w-16 h-16" />}
    </Button>
  );
};

export default LanguageSwitcher;
