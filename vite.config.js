import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Assets relativos: funciona tanto en /repositorio/ como en un dominio propio.
  base: './',
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      // Punto de entrada sin lógica; la aplicación se verifica con mountApp.
      exclude: ['src/main.js'],
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 90 },
    },
  },
});
