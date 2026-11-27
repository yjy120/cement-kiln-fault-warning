<template>
  <div class="page">
    <div class="demo-note">
      字段依据《可视化手册》5.3、5.4：预警编号、设备/工艺段、等级、触发时间、状态。
      支持按编号、工艺段、等级与状态检索预警事件，点击可查看详情。
    </div>

    <div class="stat-line">
      <div class="stat"><span class="stat-label">预警条目</span><span class="stat-num">{{ rows.length }}</span></div>
      <div class="stat"><span class="stat-label">待确认</span><span class="stat-num warn">{{ countBy('待确认') }}</span></div>
      <div class="stat"><span class="stat-label">处理中</span><span class="stat-num info">{{ countBy('处理中') }}</span></div>
      <div class="stat"><span class="stat-label">已关闭</span><span class="stat-num ok">{{ countBy('已关闭') }}</span></div>
    </div>

    <div class="panel">
      <div class="toolbar">
        <div class="panel-title">预警列表</div>
        <div class="filters">
          <input v-model="keyword" class="input" placeholder="搜索编号 / 工艺段" />
          <select v-model="levelFilter" class="input"><option value="">全部等级</option><option v-for="l in levels" :key="l">{{ l }}</option></select>
          <select v-model="statusFilter" class="input"><option value="">全部状态</option><option v-for="s in statuses" :key="s">{{ s }}</option></select>
        </div>
      </div>
      <table class="warn-table">
        <thead>
          <tr><th>预警编号</th><th>设备 / 工艺段</th><th>等级</th><th>触发时间</th><th>触发条件 / 依据</th><th>状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="r in filtered" :key="r.id">
            <td>{{ r.id }}</td>
            <td>{{ r.target }}</td>
            <td><span class="badge" :style="badgeStyle(r.level)">{{ r.level }}</span></td>
            <td>{{ r.time }}</td>
            <td>{{ r.basis }}</td>
            <td>{{ r.status }}</td>
            <td><button class="btn" @click="openDetail(r)">详情</button></td>
          </tr>
        </tbody>
      </table>
      <div class="empty" v-if="!filtered.length">没有符合条件的记录。</div>
    </div>

    <div class="modal-mask" v-if="detail" @click.self="detail = null">
      <div class="modal">
        <div class="modal-head">预警详情 · {{ detail.id }} <span class="close" @click="detail=null">×</span></div>
        <div class="detail-grid">
          <div><span class="k">设备 / 工艺段</span><span class="v">{{ detail.target }}</span></div>
          <div><span class="k">等级</span><span class="v">{{ detail.level }}</span></div>
          <div><span class="k">触发时间</span><span class="v">{{ detail.time }}</span></div>
          <div><span class="k">状态</span><span class="v">{{ detail.status }}</span></div>
          <div><span class="k">关联变量</span><span class="v">{{ detail.vars }}</span></div>
          <div><span class="k">异常持续时间</span><span class="v">{{ detail.duration }}</span></div>
          <div><span class="k">触发规则 / 模型依据</span><span class="v">{{ detail.basis }}</span></div>
          <div><span class="k">诊断结果</span><span class="v">{{ detail.diagnosis }}</span></div>
        </div>
        <div class="modal-foot"><button class="btn primary" @click="detail=null">关闭</button></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const levels = ['正常', '提示', '一般预警', '严重预警', '紧急报警']
const statuses = ['待确认', '已确认', '处理中', '已关闭']
const levelColor = { '正常': '#43e0a0', '提示': '#7fd4ff', '一般预警': '#ffc94d', '严重预警': '#ff8a4d', '紧急报警': '#ff5c5c' }
const badgeStyle = (level) => {
  const c = levelColor[level] || '#6B746C'
  return { color: c, background: c + '12' }
}

const rows = ref([
  { id: 'W001', target: '窑尾烟室', level: '一般预警', time: '09:16:27', basis: '温度持续偏高', status: '待确认', vars: '窑尾烟室温度、负压、O₂', duration: '—', diagnosis: '—' },
  { id: 'W002', target: '篦冷机', level: '提示', time: '09:14:46', basis: '篦下压力短时波动', status: '已确认', vars: '篦下压力、压损', duration: '—', diagnosis: '—' },
  { id: 'W003', target: '分解炉', level: '严重预警', time: '09:08:02', basis: '喂煤量偏离', status: '处理中', vars: '分解炉喂煤量、出口温度', duration: '—', diagnosis: '—' },
  { id: 'W004', target: '窑头', level: '正常', time: '08:55:10', basis: '负压恢复', status: '已关闭', vars: '窑头负压、二次风温', duration: '—', diagnosis: '—' }
])

const keyword = ref('')
const levelFilter = ref('')
const statusFilter = ref('')
const filtered = computed(() => rows.value.filter(r => {
  const hit = !keyword.value || (r.id + r.target).toLowerCase().includes(keyword.value.toLowerCase())
  return hit && (!levelFilter.value || r.level === levelFilter.value) && (!statusFilter.value || r.status === statusFilter.value)
}))
const countBy = (s) => rows.value.filter(r => r.status === s).length

const detail = ref(null)
const openDetail = (r) => { detail.value = { ...r } }
</script>

<style scoped>
.stat-line {
  display: flex; gap: 0;
  background: linear-gradient(160deg, var(--panel-a), var(--panel-b));
  border: 1px solid var(--line); border-left: 3px solid var(--accent);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  box-shadow: inset 0 0 24px rgba(20, 80, 130, .25);
}
.stat { flex: 1; display: flex; align-items: baseline; gap: 12px; padding: 11px 18px; border-right: 1px solid var(--line-soft); }
.stat:last-child { border-right: none; }
.stat-label { font-size: 17px; color: #7fb3d8; letter-spacing: 1px; }
.stat-num { font-family: var(--num); font-size: 28px; letter-spacing: 1px; }
.stat-num.warn { color: var(--warn); }
.stat-num.info { color: var(--info); }
.stat-num.ok { color: var(--ok); }
.detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.detail-grid > div { background: rgba(58, 208, 255, .05); border: 1px solid var(--line-soft); padding: 9px 12px; }
.k { display: block; font-size: 16px; color: #7fb3d8; margin-bottom: 3px; }
.v { font-size: 19px; color: var(--text); }
.modal-mask { position: fixed; inset: 0; background: rgba(3, 12, 22, .65); display: flex; align-items: center; justify-content: center; z-index: 99; }
.modal { width: min(640px, 92vw); background: linear-gradient(160deg, #0e3252, #081e36); border: 1px solid var(--line); padding: 22px; clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px); box-shadow: 0 0 40px rgba(58, 208, 255, .2); }
.modal-head { font-size: 20px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; color: var(--title); letter-spacing: 1px; }
.close { cursor: pointer; font-size: 24px; color: #557a99; line-height: 1; }
.close:hover { color: #fff; }
.modal-foot { margin-top: 18px; text-align: right; }
@media (max-width: 760px) {
  .stat-line { flex-wrap: wrap; }
  .stat { min-width: 50%; }
}
</style>
