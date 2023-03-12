import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'lib/index.ts',
      name: 'turtle-model-viewer',
      fileName: (format) => `turtle-model-viewer.${format}.js`,
    },
  },
})
