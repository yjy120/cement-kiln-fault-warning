import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: '工况总览' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
