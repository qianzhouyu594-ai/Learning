import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// 采集首屏 FP / FCP
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'first-paint') {
      console.log('[FP]', entry.startTime.toFixed(0), 'ms')
    }
    if (entry.name === 'first-contentful-paint') {
      console.log('[FCP]', entry.startTime.toFixed(0), 'ms')
      // 这里可以上报到你的后台
    }
  }
}).observe({ type: 'paint', buffered: true })

// 采集 LCP（更贴近用户感知的首屏可用）
new PerformanceObserver((list) => {
  const entries = list.getEntries()
  const last = entries[entries.length - 1]
  console.log('[LCP]', last.startTime.toFixed(0), 'ms')
  // 上报 last.startTime
}).observe({ type: 'largest-contentful-paint', buffered: true })

app.mount('#app')
