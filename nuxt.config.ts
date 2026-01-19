export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'aws-amplify',
    output: {
      dir: '.amplify-hosting', // output all server + public here
    },
  },
  app: {
    baseURL: '/'
  }
})
