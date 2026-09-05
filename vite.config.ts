import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'icon-192x192.png', 'icon-512x512.png'],
      manifest: {
        name: 'Tools',
        short_name: 'Tools',
        description: 'Tools PWA 애플리케이션',
        theme_color: '#eef0f5',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // 기본 한도는 2 MiB인데 메인 번들이 그걸 넘으면 precache에서 조용히 빠진다.
        // 온라인에서는 멀쩡해 보이고 오프라인에서만 앱이 비는 형태로 드러나므로 위험하다.
        // 해피위크(/tool/happy-week)는 해외 로밍·산간에서 쓰는 오프라인 전제 도구라
        // 번들이 반드시 precache되어야 한다. 여유를 두고 5 MiB로 올린다.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // FCM 서비스워커는 런타임에 쿼리스트링을 붙여 별도 스코프로 직접 등록하므로 precache 대상에서 제외한다.
        globIgnores: ['**/node_modules/**/*', '**/firebase-messaging-sw.js'],
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: 'index.html',
        // `cgv-open.html`은 알림 클릭 착지 페이지라 SPA 셸로 대체되면 안 된다.
        navigateFallbackDenylist: [/^\/api/, /^\/cgv-open\.html/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
});
