import { resolve } from 'node:path'
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

import { tanstackRouter } from '@tanstack/router-plugin/rspack'

const APP_TITLE = 'template rs'

export default defineConfig({
  root: resolve(__dirname, '.'),

  environments: {
    main: {
      output: {
        externals: {
          knex: 'commonjs knex',
        },
      },
      source: {
        decorators: {
          version: 'legacy',
        },
      },
    },
    preload: {
    },
    renderer: {
      performance: {
        buildCache: process.env.NODE_ENV === 'development',
      },
      resolve: {
        alias: {
          APP_TITLE: JSON.stringify(APP_TITLE),
        },
      },
      plugins: [
        pluginReact(),
      ],
      tools: {
        swc: {
          jsc: {
            parser: {
              syntax: 'typescript', // 支持 TS/JSX
              tsx: true, // 如果使用 TSX
              decorators: true, // 启用装饰器解析（默认 false）
            },
            transform: {
              decoratorMetadata: true, // 启用元数据支持（用于 reflect-metadata 等库）
              decoratorVersion: '2022-03', // 转换时指定版本，与解析一致
            },
          },
        },
        rspack: {
          plugins: [
            tanstackRouter({
              routesDirectory: './src/renderer/src/routes',
              generatedRouteTree: './src/renderer/src/routeTree.gen.ts',
              target: 'react',
              autoCodeSplitting: true,
            }),
          ],
        },
      },
    },
  },
})
