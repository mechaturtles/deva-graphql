import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/deva-graphql/',
  root: 'docs',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: 'docs/index.html',
        graphiql: 'docs/graphiql.html',
        test: 'docs/test-musicbrainz.html'
      }
    }
  },
  server: {
    open: true
  }
}); 