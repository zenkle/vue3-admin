interface importMetaEnv {
  VITE_APP_TITLE: string
  VITE_APP_PORT: number
  VITE_APP_BASE_API: string
}

interface ImportMeta{
    readonly env: importMetaEnv
}