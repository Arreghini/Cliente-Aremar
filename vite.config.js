/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_TEST': JSON.stringify(true), // <-- agregado
  },
  test: {
    globals: true,        // ✅ describe, it, expect, vi disponibles
    environment: 'jsdom', // ✅ simula navegador
    setupFiles: './src/setupTests.js',
  },
});
