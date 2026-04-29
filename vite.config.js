import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isVercel = process.env.VERCEL === '1'

  return {
    plugins: [
      react(),
      !isVercel && electron([
        {
          entry: 'electron/main.js',
          vite: {
            build: {
              rollupOptions: {
                external: ['better-sqlite3', 'electron'],
                output: {
                  format: 'cjs',
                  entryFileNames: '[name].js',
                  chunkFileNames: '[name].js',
                  assetFileNames: '[name].[ext]',
                },
              },
            },
          },
        },
        {
          entry: 'electron/preload.js',
          vite: {
            build: {
              rollupOptions: {
                output: {
                  format: 'cjs',
                  entryFileNames: '[name].js',
                },
              },
            },
          },
          onstart(options) {
            options.reload()
          },
        },
      ]),
      !isVercel && renderer(),
    ].filter(Boolean),
  }
})
