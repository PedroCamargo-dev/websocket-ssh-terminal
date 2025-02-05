export {}

declare global {
  interface Window {
    _env_?: {
      VITE_URLSOCKET?: string
    }
  }
}
