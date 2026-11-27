<template>
  <div class="app-shell" :class="{ 'screen-mode': isScreen }">
    <aside class="sidebar" v-if="!isScreen">
      <div class="brand">
        <span class="brand-mark">窑</span>
        <div>
          <div class="brand-title">水泥窑线预警平台</div>
          <div class="brand-sub">Cement Kiln Warning</div>
        </div>
      </div>
      <nav class="nav">
        <router-link to="/" class="nav-item" active-class="active">
          <span class="nav-dot"></span>工况总览
        </router-link>
        <router-link to="/screen" class="nav-item" active-class="active">
          <span class="nav-dot"></span>预警大屏
        </router-link>
        <router-link to="/detection" class="nav-item" active-class="active">
          <span class="nav-dot"></span>异常检测
        </router-link>
        <router-link to="/warnings" class="nav-item" active-class="active">
          <span class="nav-dot"></span>预警列表
        </router-link>
        <router-link to="/records" class="nav-item" active-class="active">
          <span class="nav-dot"></span>处置记录
        </router-link>
        <router-link to="/assistant" class="nav-item nav-ai" active-class="active">
          <span class="nav-dot"></span>智能助手
          <span class="nav-ai-tag">AI</span>
        </router-link>
      </nav>
      <div class="sidebar-foot">水泥窑线智能监控平台</div>
    </aside>
    <main class="main">
      <header class="topbar" v-if="!isScreen">
        <span class="topbar-title">{{ $route.meta.title || '工况总览' }}</span>
        <span class="topbar-tag"><span class="live-dot"></span>实时监测</span>
      </header>
      <section class="content" :class="{ 'content-screen': isScreen }">
        <router-view />
      </section>
    </main>
    <AiAssistant v-if="!isScreen && !isAiPage" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AiAssistant from './components/AiAssistant.vue'
const route = useRoute()
const isScreen = computed(() => route.path === '/screen')
const isAiPage = computed(() => route.path === '/assistant')
</script>

<style scoped>
.app-shell.screen-mode { min-height: 100vh; }
.content-screen { padding: 0 !important; }
</style>
