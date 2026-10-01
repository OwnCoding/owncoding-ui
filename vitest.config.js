import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  build: { assetsInlineLimit: 0 },
  test: {
    environment: 'node',
    include: ['test/**/*.test.{js,jsx}'],
  },
})
