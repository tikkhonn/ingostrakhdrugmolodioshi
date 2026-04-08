/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY?: string;
  /** Устаревшее имя: если раньше клали сюда ключ Google — всё ещё подхватим. */
  readonly VITE_OPENROUTER_API_KEY?: string;
  readonly VITE_GEMINI_MODEL?: string;
  readonly VITE_SUPPORT_TELEGRAM_BOT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
