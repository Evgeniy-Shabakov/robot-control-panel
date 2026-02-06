// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
   compatibilityDate: '2025-07-15',
   devtools: { enabled: false },
   ssr: false,
   app: {
      head: {
         title: 'Робот',
         link: [
            { rel: 'manifest', href: '/manifest.webmanifest' }
         ]
      }
   },
   css: ['./app/assets/css/main.css'],
   vite: {
      plugins: [
         tailwindcss(),
      ],
   },
})
