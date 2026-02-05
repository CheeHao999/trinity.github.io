/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";


// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/trinity.github.io/' : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/shared/test/setup.ts',
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),

    tsconfigPaths()
  ],
}))
