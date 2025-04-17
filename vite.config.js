import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // React JSX 변환을 위한 플러그인 추가
  plugins: [react()],

  // 개발 서버 설정
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
});
