import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/deva-graphql/', // This matches mechaturtles.com/deva-graphql
  build: {
    outDir: 'docs', // Output to docs directory for GitHub Pages
    emptyOutDir: true, // Clear the docs directory before building
  },
  server: {
    open: true, // Automatically open browser
  }
}); 