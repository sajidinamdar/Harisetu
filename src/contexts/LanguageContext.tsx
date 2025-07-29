import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, createTranslator } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: string, key: string) => string;
}

const defaultLanguage: Language = 'en';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: () => '',
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get language from localStorage or default to English
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return (savedLanguage === 'en' || savedLanguage === 'mr') ? savedLanguage : defaultLanguage;
  });

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Translation function that combines section and key
  const t = (section: string, key: string): string => {
    const translator = createTranslator(language, section as any);
    return translator(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;