<template>
  <div class="page">
    <div class="demo-note">
      字段依据《可视化手册》5.1 第 7 步、5.4：确认人、处理状态、处理时间、处置记录 / 备注。
      本页仅做前端本地演示，未接入数据库；刷新页面后演示记录会恢复初始状态。
    </div>

    <div class="panels">
      <div class="panel">
        <div class="panel-title">处置记录<span class="sub">本地演示 · 未接入数据库</span></div>
        <table class="warn-table">
          <thead>
            <tr><th>预警编号</th><th>关联预警</th><th>确认人</th><th>处理状态</th><th>处理时间</th><th>处置备注</th></tr>
          </thead>
          <tbody>
            <tr v-for="r in records" :key="r.id">
              <td>{{ r.id }}</td>
              <td>{{ r.warning }}</td>
              <td>{{ r.operator }}</td>
              <td><span class="badge" :style="statusStyle(r.status)">{{ r.status }}</span></td>
              <td>{{ r.time }}</td>
              <td>{{ r.note || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="panel">
        <div class="panel-title">处置登记<span class="sub">本地演示</span></div>
        <div class="form">
          <label>预警编号
            <input v-model="form.id" class="input" placeholder="如 DEMO-W001" />
          </label>
          <label>关联预警
            <select v-model="form.warning" class="input">
              <option v-for="w in warnings" :key="w">{{ w }}</option>
            </select>
          </label>
          <label>确认人
            <input v-model="form.operator" class="input" placeholder="演示操作员" />
          </label>
          <label>处理状态
            <select v-model="form.status" class="input">
              <option v-for="s in statuses" :key="s">{{ s }}</option>
            </select>
          </label>
          <label>处理时间
            <input v-model="form.time" class="input" type="datetime-local" />
          </label>
          <label class="full">处置备注
            <textarea v-model="form.note" class="input textarea" rows="3" placeholder="填写处理过程与结果（演示）"></textarea>
          </label>
        </div>
        <div class="actions">
          <button class="btn primary" @click="save">保存演示记录</button>
          <button class="btn" @click="reset">重置</button>
        </div>
        <div class="hint">状态取值：待确认 → 已确认 → 处理中 → 已关闭（依据手册 5.4）。等级与处置建议须经老师及现场确认。</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const statuses = ['待确认', '已确认', '处理中', '已关闭']
const statusColor = { '待确认': '#ffc94d', '已确认': '#7fd4ff', '处理中': '#ff8a4d', '已关闭': '#43e0a0' }
const statusStyle = (s) => {
  const c = statusColor[s] || '#6B746C'
  return { color: c, background: c + '12' }
}
const warnings = ['DEMO-W001 · 窑尾烟室', 'DEMO-W002 · 篦冷机', 'DEMO-W003 · 分解炉', 'DEMO-W004 · 窑头']

const records = ref([
  { id: 'DEMO-W001', warning: 'DEMO-W001 · 窑尾烟室', operator: '演示操作员', status: '已确认', time: '2026-11-24 09:20（演示）', note: '已通知工艺人员关注（演示）' },
  { id: 'DEMO-W002', warning: 'DEMO-W002 · 篦冷机', operator: '演示操作员', status: '处理中', time: '2026-11-24 09:18（演示）', note: '检查篦下压力趋势（演示）' },
  { id: 'DEMO-W004', warning: 'DEMO-W004 · 窑头', operator: '演示操作员', status: '已关闭', time: '2026-11-24 09:02（演示）', note: '负压恢复，记录归档（演示）' }
])

const emptyForm = () => ({ id: '', warning: warnings[0], operator: '', status: '待确认', time: '', note: '' })
const form = reactive(emptyForm())
const save = () => {
  if (!form.id.trim()) { alert('请填写预警编号'); return }
  records.value.unshift({
    id: form.id.trim(), warning: form.warning, operator: form.operator || '演示操作员',
    status: form.status, time: form.time ? form.time.replace('T', ' ') + '（演示）' : '—（待接入）',
    note: form.note || '—'
  })
  Object.assign(form, emptyForm())
}
const reset = () => Object.assign(form, emptyForm())
</script>

<style scoped>
.sub { font-size: 11px; color: var(--muted); font-weight: 400; letter-spacing: 0; }
.form { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
.form label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #7fb3d8; }
.form label.full { grid-column: 1 / -1; }
.form .input { width: 100%; min-width: 0; }
.textarea { resize: vertical; font-family: inherit; }
.actions { display: flex; gap: 8px; margin-top: 16px; }
@media (max-width: 1200px) { .panels { grid-template-columns: 1fr; } }
@media (max-width: 520px) { .form { grid-template-columns: 1fr; } }
</style>
