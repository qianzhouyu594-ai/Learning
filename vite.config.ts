import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  // 构建与运行时的性能优化（均为安全默认项）
  build: {
    // 关闭生产 sourcemap，可减少体积与暴露信息
    sourcemap: false,
    // CSS 拆分，避免一个超大 CSS 影响首屏
    cssCodeSplit: true,
    // 启用 modulepreload polyfill，提升现代浏览器并行加载度
    modulePreload: { polyfill: true },
    // 更激进但兼容的目标，帮助压缩器产出更小代码
    target: 'es2019',
    // 静态资源命名，利用长效缓存
    rollupOptions: {
      output: {
        // 手动拆分第三方依赖，提升缓存命中率（业务改动不影响 vendor）
        manualChunks: {
          vue: ['vue', 'pinia', 'vue-router'],
          utils: ['dayjs'], // 按需调整：在项目中常用的通用库
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // 小于该阈值的资源将被内联为 base64，可减少请求数（谨慎调大）
    assetsInlineLimit: 4096,
    // 使用 esbuild 作为压缩器，构建更快
    minify: 'esbuild',
  },
  // 依赖预构建：加速开发冷启动，也利于更稳定的拆包
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'dayjs'],
  },
  // 通过常量内联帮助消除死代码与关闭生产调试
  define: {
    __DEV__: false,
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false,
  },
  // 使用 esbuild 在生产构建时移除日志与 debugger，减小体积、减少解析开销
  esbuild: {
    drop: ['console', 'debugger'], // 同时移除 console.* 与 debugger
    pure: ['console.log'], // 进一步确保 log 被摇掉
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
