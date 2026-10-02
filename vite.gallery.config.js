import { defineConfig } from 'vite'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import preset from './tailwind-preset.js'

export default defineConfig({
  root: 'gallery',
  publicDir: 'public',
  esbuild: { jsx: 'automatic' },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          presets: [preset],
          content: {
            relative: true,
            files: ['./gallery/index.html', './gallery/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
          },
        }),
        autoprefixer(),
      ],
    },
  },
  build: {
    outDir: '../site-dist',
    emptyOutDir: true,
    sourcemap: true,
    manifest: true,
    // Keep small brand assets external: lossless optimization must not inflate eager JS.
    assetsInlineLimit: 0,
  },
})
