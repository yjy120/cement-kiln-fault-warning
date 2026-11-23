<template>
  <div class="app-shell">
    <aside class="sidebar">
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
        <div class="nav-item disabled"><span class="nav-dot"></span>异常检测</div>
        <div class="nav-item disabled"><span class="nav-dot"></span>预警列表</div>
        <div class="nav-item disabled"><span class="nav-dot"></span>处置记录</div>
      </nav>
      <div class="sidebar-foot">本科毕业设计 · 原型演示</div>
    </aside>
    <main class="main">
      <header class="topbar">
        <span class="topbar-title">{{ $route.meta.title || '工况总览' }}</span>
        <span class="topbar-tag"><span class="live-dot"></span>演示数据</span>
      </header>
      <section class="content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
</script>
