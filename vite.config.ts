import path from 'node:path'
import process from 'node:process'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
import Unocss from 'unocss/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, loadEnv } from 'vite'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = mode === 'development'

  return {
    base: env.VITE_BASE_URL || '/',

    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/styles/element/index.scss" as *;`,
          api: 'modern-compiler'
        }
      },
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      }
    },

    plugins: [
      Vue({
        reactivityTransform: true
      }),

      vueJsx(),

      VueRouter({
        extensions: ['.vue', '.md'],
        dts: 'src/typed-router.d.ts'
      }),

      Components({
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ElementPlusResolver({
            // 禁用按需样式导入，改用全局样式
            importStyle: false
          })
        ],
        dts: 'src/components.d.ts'
      }),

      Unocss(),

      // 开发环境禁用压缩和分析
      ...(isDev
        ? []
        : [
            viteCompression({
              algorithm: 'gzip',
              threshold: 10240,
              ext: '.gz',
              deleteOriginFile: false
            }),
            viteCompression({
              algorithm: 'brotliCompress',
              threshold: 10240,
              ext: '.br',
              deleteOriginFile: false
            }),
            visualizer({
              open: false,
              gzipSize: true,
              brotliSize: true,
              filename: 'dist/bundle-analysis.html'
            })
          ])
    ],

    ssr: {
      noExternal: ['element-plus']
    },

    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: mode !== 'production',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('element-plus')) {
                return 'vendor_elementplus'
              }
              if (id.includes('vue-router')) {
                return 'vendor_router'
              }
              if (id.includes('vue')) {
                return 'vendor_vue'
              }
              if (id.includes('lodash')) {
                return 'vendor_lodash'
              }
              return 'vendor'
            }
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]'
        }
      }
    },

    server: {
      port: 5173,
      // 关闭预构建依赖的浏览器重新加载
      watch: {
        usePolling: true,
        ignored: ['!**/node_modules/element-plus/**']
      },
      proxy: {
        '/api': {
          target: 'http://your-api-server.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },

    optimizeDeps: {
      // 强制预构建关键依赖
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        '@element-plus/icons-vue',
        '@vueuse/core'
      ],
      // 排除不需要预构建的依赖
      exclude: ['vue-demi'],
      // 禁用缓存失效
      holdUntilCrawlEnd: false
    }
  }
})
