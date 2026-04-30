import React, { createContext, useState, useContext } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const translations = lang === 'en' ? en : hi;

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

  return (
    <LanguageContext.Provider value={{ lang, translations, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);