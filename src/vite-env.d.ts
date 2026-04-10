/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PERSONAL_CASE_API_BASE?: string;
  readonly VITE_SUPPORT_TELEGRAM_BOT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
