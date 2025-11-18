'use client';

import React from 'react';
import { useLanguage } from './LanguageProvider';
import { Button } from '@/components/ui/button';
import ReactCountryFlag from 'react-country-flag';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'nl' : 'en');
  };

  return (
    <Button onClick={toggleLanguage} variant="ghost" size="icon" aria-label="Switch language">
      <ReactCountryFlag
        countryCode={language === 'en' ? 'GB' : 'NL'}
        svg
        style={{
          width: '2em',
          height: '2em',
        }}
        aria-label={language === 'en' ? 'United Kingdom Flag' : 'Netherlands Flag'}
      />
    </Button>
  );
};

export default LanguageSwitcher;
