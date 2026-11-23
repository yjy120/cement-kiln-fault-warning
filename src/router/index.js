import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import WarningScreen from '../views/WarningScreen.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: '工况总览' }
  },
  {
    path: '/screen',
    name: 'WarningScreen',
    component: WarningScreen,
    meta: { title: '预警大屏' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
