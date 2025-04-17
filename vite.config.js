import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  return {
    base: isProduction ? '/front_5th_chapter2-1/' : '/',
    plugins: [react()],

    server: {
      open: '/', // 서버 시작시 기본 페이지
    },

    // 빌드 설정 (멀티 페이지)
    build: {
      rollupOptions: {
        input: {
          main: './index.html',
          basic: './index.basic.html',
          advanced: './index.advanced.html',
        },
      },
    },

    // Vitest 테스트 설정
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: 'src/setupTests.js',
    },
  };
});
