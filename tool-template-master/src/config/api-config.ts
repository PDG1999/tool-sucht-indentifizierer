// API Configuration

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'https://api.samebi.net',
  endpoints: {
    leads: '/leads',
    toolUsage: '/tool-usage',
    checkout: '/checkout/create-session',
    tools: '/tools',
  },
  timeout: 10000,
};

// PostgreSQL Connection (backend only)
export const DB_CONFIG = {
  host: 'nsgccoc4scg8g444c400c840', // Container name
  port: 5432,
  database: 'herramientas',
  schema: 'shared_core',
};

// Redis Connection
export const REDIS_CONFIG = {
  host: 'redis-shared',
  port: 6379,
};

// Environment-specific settings
export const ENV_CONFIG = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  language: (import.meta.env.VITE_LANGUAGE as 'de' | 'en' | 'es') || 'de',
  analyticsId: import.meta.env.VITE_GA_TRACKING_ID,
};


