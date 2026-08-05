/// <reference types="vite/client" />

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'js-yaml';

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_ANALYTICS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

