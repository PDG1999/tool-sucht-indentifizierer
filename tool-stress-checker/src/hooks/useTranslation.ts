import { useMemo } from 'react';
import { currentLanguage } from '@/config/language';
import { getTranslations, Translations } from '@/translations';

export const useTranslation = () => {
  const translations = useMemo(() => {
    return getTranslations(currentLanguage);
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const formatMessage = (key: string, params: Record<string, string | number> = {}): string => {
    let message = t(key);
    
    Object.entries(params).forEach(([param, value]) => {
      message = message.replace(new RegExp(`{${param}}`, 'g'), String(value));
    });
    
    return message;
  };

  return {
    t,
    formatMessage,
    translations,
    language: currentLanguage
  };
};

export default useTranslation;
