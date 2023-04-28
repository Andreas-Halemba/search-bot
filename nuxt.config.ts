// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@formkit/nuxt'
    ],
    formkit: {
        defaultConfig: true,
        configFile: 'formkit.config.ts'
    },
    devtools: true
})
