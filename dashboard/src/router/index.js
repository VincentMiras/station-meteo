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
      path: '/liveview',
      name: 'live',
      component: () => import('../views/LiveView.vue'),
    },
    {
      path: '/sampleview',
      name: 'sample',
      component: () => import('../views/SampleView.vue'),
    },
    {
      path: '/dashboardlive',
      name: 'dashboardlive',
      component: () => import('../views/DashbordLiveView.vue'),
    },
    {
      path: '/dashboardsample',
      name: 'dashboardsample',
      component: () => import('../views/DashbordSampleView.vue'),
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/test.vue'),
    },
  ],
})

export default router
