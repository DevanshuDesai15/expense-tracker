/**
 * Centralized Environment Configuration
 * All environment variables should be accessed through this file
 */

interface EnvConfig {
  // Firebase
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };

  // Security
  security: {
    enableMFA: boolean;
    sessionTimeoutMinutes: number;
    maxLoginAttempts: number;
    allowedIpRanges: string[];
  };

  // Integrations
  integrations: {
    n8n: {
      webhookUrl: string;
      apiKey: string;
    };
    alexa: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
    };
  };

  // App
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'staging';
    apiBaseUrl: string;
  };
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue;
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

const getNumberEnvVar = (key: string, defaultValue: number = 0): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const getArrayEnvVar = (key: string, defaultValue: string[] = []): string[] => {
  const value = import.meta.env[key];
  if (!value) return defaultValue;
  return value.split(',').map((v: string) => v.trim()).filter(Boolean);
};

export const env: EnvConfig = {
  firebase: {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('VITE_FIREBASE_APP_ID'),
    measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
  },

  security: {
    enableMFA: getBooleanEnvVar('VITE_ENABLE_MFA', false),
    sessionTimeoutMinutes: getNumberEnvVar('VITE_SESSION_TIMEOUT_MINUTES', 30),
    maxLoginAttempts: getNumberEnvVar('VITE_MAX_LOGIN_ATTEMPTS', 5),
    allowedIpRanges: getArrayEnvVar('VITE_ALLOWED_IP_RANGES'),
  },

  integrations: {
    n8n: {
      webhookUrl: getEnvVar('VITE_N8N_WEBHOOK_URL'),
      apiKey: getEnvVar('VITE_N8N_API_KEY'),
    },
    alexa: {
      clientId: getEnvVar('VITE_ALEXA_CLIENT_ID'),
      clientSecret: getEnvVar('VITE_ALEXA_CLIENT_SECRET'),
      redirectUri: getEnvVar('VITE_ALEXA_REDIRECT_URI'),
    },
  },

  app: {
    name: getEnvVar('VITE_APP_NAME', 'ATLAS'),
    version: getEnvVar('VITE_APP_VERSION', '2.0.0'),
    environment: getEnvVar('VITE_ENVIRONMENT', 'development') as EnvConfig['app']['environment'],
    apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000'),
  },
};

// Validation: Ensure critical env vars are set
const validateEnv = () => {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Run validation on module load
if (env.app.environment !== 'development') {
  validateEnv();
}

export default env;
