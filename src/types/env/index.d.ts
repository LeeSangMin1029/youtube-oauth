interface ImportMetaEnv {
  readonly HTTP_PORT: string;
  readonly HTTPS_PORT: string;
  readonly TOKEN_SECERT_KEY: string;
  readonly CLIENT_ID: string;
  readonly CLIENT_SECRET: string;
  readonly REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
