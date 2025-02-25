import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/live',
      name: 'live',
      component: () => import('../views/LiveView.vue'),
    },
    {
      path: '/sample',
      name: 'sample',
      component: () => import('../views/SampleView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashbordView.vue'),
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/test.vue'),
    },
  ],
})

export default router
