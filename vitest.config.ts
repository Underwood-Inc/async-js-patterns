import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      'docs/.vitepress/theme/__tests__/**/*.{test,spec}.{js,ts}',
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'docs/.vitepress/cache/',
        'docs/.vitepress/dist/',
      ],
    },
    setupFiles: ['docs/.vitepress/theme/__tests__/setup.ts'],
  },
});
