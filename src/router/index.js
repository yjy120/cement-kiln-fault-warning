import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import WarningScreen from '../views/WarningScreen.vue'
import AnomalyDetection from '../views/AnomalyDetection.vue'
import WarningList from '../views/WarningList.vue'
import DisposalRecords from '../views/DisposalRecords.vue'
import AiAssistantPage from '../views/AiAssistantPage.vue'

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
  },
  {
    path: '/detection',
    name: 'AnomalyDetection',
    component: AnomalyDetection,
    meta: { title: '异常检测' }
  },
  {
    path: '/warnings',
    name: 'WarningList',
    component: WarningList,
    meta: { title: '预警列表' }
  },
  {
    path: '/records',
    name: 'DisposalRecords',
    component: DisposalRecords,
    meta: { title: '处置记录' }
  },
  {
    path: '/assistant',
    name: 'AiAssistantPage',
    component: AiAssistantPage,
    meta: { title: '智能助手' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
