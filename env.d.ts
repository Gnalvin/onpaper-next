/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_OSS_PREVIEW_URL: string
  readonly VITE_OSS_ORIGINAL_URL: string
  readonly VITE_OSS_TEMP_URL: string
  readonly VITE_DEFAULT_AVATAR: string
  readonly VITE_OSS_PREVIEW_BUCKET: string
  readonly VITE_OSS_TEMP_BUCKET: string
  readonly VITE_OSS_REGION: string
  readonly VITE_MD5_SIGN: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
