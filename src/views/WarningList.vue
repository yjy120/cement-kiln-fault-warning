<template>
  <div class="page">
    <div class="demo-note">
      字段依据《可视化手册》5.3、5.4：预警编号、设备/工艺段、等级、触发时间、状态。
      下列为演示样例，非真实预警事件；等级名称与颜色为设计草案，需老师与现场确认。
    </div>

    <div class="cards">
      <div class="card"><div class="card-label">演示预警条目</div><div class="card-value" style="color:#185FA5">{{ rows.length }}</div><div class="card-foot">本页本地列表</div></div>
      <div class="card"><div class="card-label">待确认</div><div class="card-value" style="color:#BA7517">{{ countBy('待确认') }}</div><div class="card-foot">手册状态：待确认</div></div>
      <div class="card"><div class="card-label">处理中</div><div class="card-value" style="color:#378ADD">{{ countBy('处理中') }}</div><div class="card-foot">手册状态：处理中</div></div>
      <div class="card"><div class="card-label">已关闭</div><div class="card-value" style="color:#1D9E75">{{ countBy('已关闭') }}</div><div class="card-foot">手册状态：已关闭</div></div>
    </div>

    <div class="panel">
      <div class="toolbar">
        <div class="panel-title" style="margin:0">预警列表</div>
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
      <div class="empty" v-if="!filtered.length">没有符合条件的演示记录。</div>
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
const levelColor = { '正常': '#1D9E75', '提示': '#378ADD', '一般预警': '#BA7517', '严重预警': '#D85A30', '紧急报警': '#A32D2D' }
const badgeStyle = (level) => {
  const c = levelColor[level] || '#888780'
  return { color: c, background: c + '1A', border: '1px solid ' + c + '55' }
}

const rows = ref([
  { id: 'DEMO-W001', target: '窑尾烟室', level: '一般预警', time: '09:16:27（演示）', basis: '温度持续偏高（演示）', status: '待确认', vars: '窑尾烟室温度、负压、O₂', duration: '—（待接入）', diagnosis: '—（待接入）' },
  { id: 'DEMO-W002', target: '篦冷机', level: '提示', time: '09:14:46（演示）', basis: '篦下压力短时波动（演示）', status: '已确认', vars: '篦下压力、压损', duration: '—（待接入）', diagnosis: '—（待接入）' },
  { id: 'DEMO-W003', target: '分解炉', level: '严重预警', time: '09:08:02（演示）', basis: '喂煤量偏离（演示）', status: '处理中', vars: '分解炉喂煤量、出口温度', duration: '—（待接入）', diagnosis: '—（待接入）' },
  { id: 'DEMO-W004', target: '窑头', level: '正常', time: '08:55:10（演示）', basis: '负压恢复（演示）', status: '已关闭', vars: '窑头负压、二次风温', duration: '—（待接入）', diagnosis: '—（待接入）' }
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
.page { display: flex; flex-direction: column; gap: 16px; }
.demo-note { background:#FFF7E6; border:1px solid #FFE7A8; color:#8A5A00; padding:10px 14px; border-radius:8px; font-size:12px; }
.toolbar { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:12px; }
.filters { display:flex; gap:8px; flex-wrap:wrap; }
.input { border:1px solid #E8ECEF; border-radius:6px; padding:7px 10px; font-size:13px; background:#fff; min-width:140px; }
.btn { border:1px solid #185FA5; color:#185FA5; background:#fff; border-radius:6px; padding:5px 12px; cursor:pointer; font-size:12px; }
.btn.primary { background:#185FA5; color:#fff; }
.empty { text-align:center; color:#888780; padding:18px; font-size:13px; }
.detail-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.detail-grid > div { background:#FAFBFC; border-radius:6px; padding:10px 12px; }
.k { display:block; font-size:12px; color:#5F5E5A; margin-bottom:4px; }
.v { font-size:13px; color:#2C2C2A; }
.detail-foot { margin-top:10px; font-size:11px; color:#888780; }
.modal-mask { position:fixed; inset:0; background:rgba(0,0,0,.35); display:flex; align-items:center; justify-content:center; z-index:99; }
.modal { width:min(640px,92vw); background:#fff; border-radius:12px; padding:20px; box-shadow:0 12px 40px rgba(0,0,0,.2); }
.modal-head { font-size:16px; font-weight:500; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; }
.close { cursor:pointer; font-size:22px; color:#888780; line-height:1; }
.modal-foot { margin-top:16px; text-align:right; }
</style>
