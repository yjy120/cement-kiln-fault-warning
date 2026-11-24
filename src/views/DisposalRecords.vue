<template>
  <div class="page">
    <div class="demo-note">
      字段依据《可视化手册》5.1 第 7 步、5.4：确认人、处理状态、处理时间、处置记录 / 备注。
      本页仅做前端本地演示，未接入数据库；刷新页面后演示记录会恢复初始状态。
    </div>

    <div class="panels">
      <div class="panel">
        <div class="panel-title">处置记录</div>
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
        <div class="panel-title">处置登记（本地演示）</div>
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
const statusColor = { '待确认': '#BA7517', '已确认': '#378ADD', '处理中': '#D85A30', '已关闭': '#1D9E75' }
const statusStyle = (s) => {
  const c = statusColor[s] || '#888780'
  return { color: c, background: c + '1A', border: '1px solid ' + c + '55' }
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
.page { display:flex; flex-direction:column; gap:16px; }
.demo-note { background:#FFF7E6; border:1px solid #FFE7A8; color:#8A5A00; padding:10px 14px; border-radius:8px; font-size:12px; }
.panels { display:grid; grid-template-columns:3fr 2fr; gap:16px; }
.form { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.form label { display:flex; flex-direction:column; gap:6px; font-size:12px; color:#5F5E5A; }
.form label.full { grid-column:1 / -1; }
.input { width:100%; border:1px solid #E8ECEF; border-radius:6px; padding:8px 10px; font-size:13px; background:#fff; }
.textarea { resize:vertical; }
.actions { display:flex; gap:8px; margin-top:14px; }
.btn { border:1px solid #185FA5; color:#185FA5; background:#fff; border-radius:6px; padding:7px 14px; cursor:pointer; font-size:12px; }
.btn.primary { background:#185FA5; color:#fff; }
.hint { margin-top:12px; font-size:11px; color:#888780; }
@media (max-width:1100px){ .panels{grid-template-columns:1fr;} }
</style>
