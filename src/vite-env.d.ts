/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Firebase
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;

  // Security
  readonly VITE_ENABLE_MFA: string;
  readonly VITE_SESSION_TIMEOUT_MINUTES: string;
  readonly VITE_MAX_LOGIN_ATTEMPTS: string;
  readonly VITE_ALLOWED_IP_RANGES: string;

  // N8N Integration
  readonly VITE_N8N_WEBHOOK_URL: string;
  readonly VITE_N8N_API_KEY: string;

  // Alexa Smart Home
  readonly VITE_ALEXA_CLIENT_ID: string;
  readonly VITE_ALEXA_CLIENT_SECRET: string;
  readonly VITE_ALEXA_REDIRECT_URI: string;

  // App Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
