import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, LanguageOption, SUPPORTED_LANGUAGES } from './types';
import { TRANSLATIONS, Translations } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('freshsaver_language');
      if (saved && ['en', 'es', 'pt', 'zh', 'gl'].includes(saved)) {
        return saved as SupportedLanguage;
      }
      // Auto-detect browser language
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('es')) return 'es';
      if (navLang.startsWith('pt')) return 'pt';
      if (navLang.startsWith('zh')) return 'zh';
      if (navLang.startsWith('gl')) return 'gl';
    } catch {}
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('freshsaver_language', lang);
    } catch {}
  };

  const t = (key: keyof Translations, params?: Record<string, string | number>): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = langDict[key] || TRANSLATIONS.en[key] || String(key);

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return text;
  };

  const currentLanguageOption = 
    SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES, currentLanguageOption }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
