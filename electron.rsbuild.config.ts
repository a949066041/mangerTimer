import { resolve } from 'node:path'

import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

// @ts-expect-error error
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
