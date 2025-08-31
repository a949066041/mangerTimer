import { defineConfig } from '@rsbuild/core'

import { pluginReact } from '@rsbuild/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/rspack'
import { version } from './package.json' with { type: 'json' }

const APP_TITLE = 'template rs'

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    define: {
      APP_TITLE: JSON.stringify(APP_TITLE),
      APP_VERSION: JSON.stringify(version),
    },
  },
  html: {
    favicon: './src/assets/icon/app-icon.png',
    title: APP_TITLE,
  },
  performance: {
    buildCache: process.env.NODE_ENV === 'development',
  },
  tools: {
    rspack: {
      plugins: [
        tanstackRouter({
          target: 'react',
          autoCodeSplitting: true,
        }),
      ],
    },
  },
})
