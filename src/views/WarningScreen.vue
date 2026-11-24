<template>
  <div class="sc-screen">
    <header class="sc-head">
      <div class="sc-run">运行情况：<b>生产</b></div>
      <div class="head-title-wrap">
        <div class="sc-title">{{ current.title }}</div>
      </div>
      <div class="sc-time">{{ clock }}</div>
    </header>

    <router-link to="/" class="sc-back">‹ 返回总览</router-link>

    <div class="sc-body">
      <component :is="current.comp" :key="active" />
    </div>

    <nav class="sc-nav">
      <button
        v-for="(t, i) in tabs" :key="t.key" type="button"
        class="sc-tab" :class="{ on: active === i }"
        @click="selectTab(i)"
      ><span class="tab-no">0{{ i + 1 }}</span>{{ t.name }}</button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import '../assets/screen.css'
import HomeBoard from '../components/screens/HomeBoard.vue'
import StationaryBoard from '../components/screens/StationaryBoard.vue'
import TransitionBoard from '../components/screens/TransitionBoard.vue'
import EvaluateBoard from '../components/screens/EvaluateBoard.vue'
import DiagnosisBoard from '../components/screens/DiagnosisBoard.vue'
import WarningBoard from '../components/screens/WarningBoard.vue'

const tabs = [
  { key: 'home', name: '首页大屏', title: '水泥煅烧异常监测与诊断系统', comp: HomeBoard },
  { key: 'stationary', name: '非平稳异常监测', title: '非平稳过程异常监测大屏', comp: StationaryBoard },
  { key: 'transition', name: '过渡过程异常监测', title: '水泥煅烧过渡过程异常监测大屏', comp: TransitionBoard },
  { key: 'evaluate', name: '运行工况评估', title: '水泥煅烧运行工况评估大屏', comp: EvaluateBoard },
  { key: 'diagnosis', name: '非优根因诊断', title: '水泥煅烧异常因果与根因诊断系统', comp: DiagnosisBoard },
  { key: 'warning', name: '故障预警中心', title: '水泥窑线故障预警中心', comp: WarningBoard }
]
const active = ref(0)
const current = computed(() => tabs[active.value])
const selectTab = (i) => { active.value = i }

const clock = ref('')
let timer = null
const tick = () => {
  const d = new Date(), p = n => String(n).padStart(2, '0')
  clock.value = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}
onMounted(() => { tick(); timer = setInterval(tick, 1000) })
onUnmounted(() => clearInterval(timer))
</script>
