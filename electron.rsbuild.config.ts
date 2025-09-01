import { resolve } from 'node:path'
import { mainPlugin } from '@electron-rsbuild/plugin-main'
import { preloadPlugin } from '@electron-rsbuild/plugin-preload'

import { rendererPlugin } from '@electron-rsbuild/plugin-renderer'
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

import { tanstackRouter } from '@tanstack/router-plugin/rspack'
import { version } from './package.json' with { type: 'json' }

const APP_TITLE = 'template rs'

export default defineConfig({
  root: resolve(__dirname, '.'),
  environments: {
    main: {
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
          APP_VERSION: JSON.stringify(version),
        },
      },
      plugins: [pluginReact()],
      tools: {
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
