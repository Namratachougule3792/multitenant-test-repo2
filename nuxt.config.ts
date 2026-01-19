// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    baseURL: '/',
  },
  nitro: {
    output: {
      publicDir: '.output/public'
    }
  }
})
