import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'node',
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      'docs/.vitepress/theme/__tests__/**/*.{test,spec}.{js,ts}',
      'docs/.vitepress/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
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
