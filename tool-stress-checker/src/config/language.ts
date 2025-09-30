export type Language = 'de' | 'en' | 'es';

export interface LanguageConfig {
  language: Language;
  apiUrl: string;
  gaTrackingId: string;
  currency: string;
  timezone: string;
  dateFormat: string;
}

export const getLanguageConfig = (): LanguageConfig => {
  const lang = (import.meta.env.VITE_LANGUAGE || 'es') as Language;
  
  const configs: Record<Language, LanguageConfig> = {
    de: {
      language: 'de',
      apiUrl: import.meta.env.VITE_API_URL || 'https://api.samebi.net',
      gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID || 'G-DE-XXXXXXXXX',
      currency: 'EUR',
      timezone: 'Europe/Berlin',
      dateFormat: 'DD.MM.YYYY'
    },
    en: {
      language: 'en',
      apiUrl: import.meta.env.VITE_API_URL || 'https://en-api.samebi.net',
      gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID || 'G-EN-XXXXXXXXX',
      currency: 'EUR',
      timezone: 'Europe/London',
      dateFormat: 'MM/DD/YYYY'
    },
    es: {
      language: 'es',
      apiUrl: import.meta.env.VITE_API_URL || 'https://es-api.samebi.net',
      gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID || 'G-ES-XXXXXXXXX',
      currency: 'EUR',
      timezone: 'Europe/Madrid',
      dateFormat: 'DD/MM/YYYY'
    }
  };

  return configs[lang];
};

export const currentLanguage = getLanguageConfig().language;
export const currentConfig = getLanguageConfig();
