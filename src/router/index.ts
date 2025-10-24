import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'naicha',
      component: () => import('../components/naicha.vue'),
    },
    {
      path: '/waimai',
      name: 'waimai',
      component: () => import('../components/waimai.vue'),
    },
  ],
})

export default router
