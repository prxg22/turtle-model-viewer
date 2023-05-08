import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'lib/turtle-model-viewer.ts',
      name: 'turtle-model-viewer',
      // fileName: (format) => `turtle-model-viewer.${format}.js`,
      fileName: 'turtle-model-viewer',
    },
  },
})
