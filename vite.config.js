import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        nested: resolve(import.meta.dirname, 'cfncs/index.html'),
        links: resolve(import.meta.dirname, 'links/index.html'),
      },
    },
  },
})