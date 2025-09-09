import { QueryClientProvider } from '@tanstack/react-query'
import { unstableSetRender } from 'antd'
import { StrictMode } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import { scan } from 'react-scan'
import App from './App'
import { queryClient } from './store'
import '@ant-design/v5-patch-for-react-19'

import './setup'
import './style/index.css'

if (typeof window !== 'undefined') {
  scan({
    enabled: import.meta.env.DEV,
    log: false, // logs render info to console (default: false)
  })
}

unstableSetRender((node, container) => {
  // @ts-expect-error error
  container._reactRoot ||= createRoot(container)
  // @ts-expect-error error
  const root = container._reactRoot
  root.render(node)
  return async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    root.unmount()
  }
})

function bootstrap() {
  const rootEl = document.getElementById('root')
  if (rootEl) {
    const root = ReactDOM.createRoot(rootEl)
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>,
    )
  }
}

bootstrap()
