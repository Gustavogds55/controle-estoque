// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3001
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000/api'
    }
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss']
})
