/// <reference types="vitest" />
/// <reference types="vite/client" />
// Takem from: https://github.com/vitest-dev/vitest/blob/main/examples/react-testing-lib/vite.config.ts
import react from '@vitejs/plugin-react'
import * as path from 'path'

import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      yjs: path.resolve('./node_modules/yjs/src/index.js'),
    },
  },
  test: {
    update: true,
    globals: true,
    environment: 'happy-dom',
    setupFiles: 'src/test/setup.ts',
  },
})
