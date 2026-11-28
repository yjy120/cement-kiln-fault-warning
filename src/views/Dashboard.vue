<template>
  <div class="dashboard">
    <div class="board-head">
      <div class="board-id">
        <span class="board-kicker">窑线 01 · 中控工况</span>
        <h1 class="board-title">生产工况总览</h1>
      </div>
      <div class="board-stamp">
        <span class="stamp-dot"></span>
        <span>工况实时监视</span>
      </div>
    </div>

    <!-- 工况读数仪表带 -->
    <div class="gauge-bar">
      <div class="gauge" v-for="m in metrics" :key="m.label">
        <div class="gauge-label">{{ m.label }}</div>
        <div class="gauge-value" :style="{ color: m.color }">{{ m.value }}<span class="gauge-unit">{{ m.unit }}</span></div>
        <div class="gauge-foot">{{ m.foot }}</div>
      </div>
    </div>

    <!-- 图表区 -->
    <div class="panels">
      <div class="panel">
        <div class="panel-title">窑尾温度趋势<span class="sub">示例数据</span></div>
        <div ref="trendChart" class="chart"></div>
      </div>
      <div class="panel">
        <div class="panel-title">预警等级分布<span class="sub">示例数据</span></div>
        <div ref="levelChart" class="chart"></div>
      </div>
    </div>

    <!-- 平台能力：数据底座 / 设备健康 / 能耗双碳 -->
    <div class="cap-grid">
      <div class="cap-card">
        <div class="cap-head">
          <span class="cap-icon">▦</span>
          <div>
            <div class="cap-name">统一数据底座</div>
            <div class="cap-en">DATA FOUNDATION</div>
          </div>
          <span class="cap-flag">示例数据</span>
        </div>
        <div class="cap-desc">多源异构数据统一汇聚，为预警与分析提供同源数据支撑</div>
        <div class="cap-stats">
          <div class="cap-stat"><b>24</b><span>接入测点</span></div>
          <div class="cap-stat"><b>3</b><span>数据源类型</span></div>
          <div class="cap-stat"><b>1s</b><span>采集周期</span></div>
        </div>
        <div class="cap-src">数据源：DCS 实时 / 质量化验 / 生产报表</div>
      </div>

      <div class="cap-card">
        <div class="cap-head">
          <span class="cap-icon">◎</span>
          <div>
            <div class="cap-name">设备健康状态</div>
            <div class="cap-en">EQUIPMENT HEALTH</div>
          </div>
          <span class="cap-flag">示例数据</span>
        </div>
        <div class="cap-desc">关键设备健康度跟踪，辅助运维排查与预防性维护</div>
        <div class="health-list">
          <div class="health-row" v-for="h in health" :key="h.name">
            <span class="health-name">{{ h.name }}</span>
            <span class="health-track"><i :style="{ width: h.value + '%', background: h.color }"></i></span>
            <span class="health-val" :style="{ color: h.color }">{{ h.value }}%</span>
          </div>
        </div>
      </div>

      <div class="cap-card">
        <div class="cap-head">
          <span class="cap-icon">◈</span>
          <div>
            <div class="cap-name">能耗与双碳指标</div>
            <div class="cap-en">ENERGY &amp; CARBON</div>
          </div>
          <span class="cap-flag">示例数据</span>
        </div>
        <div class="cap-desc">吨熟料能耗跟踪，对照工艺参考值辅助节能降耗</div>
        <div class="energy-list">
          <div class="energy-row" v-for="e in energy" :key="e.name">
            <div class="energy-info"><span class="energy-name">{{ e.name }}</span><span class="energy-ref">参考 {{ e.ref }}</span></div>
            <div class="energy-num">{{ e.value }}<span>{{ e.unit }}</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新预警 -->
    <div class="panel">
      <div class="panel-title">最新预警<span class="sub">示例数据</span></div>
      <table class="warn-table">
        <thead>
          <tr><th>时间</th><th>测点</th><th>描述</th><th>等级</th><th>状态</th></tr>
        </thead>
        <tbody>
          <tr v-for="w in warnings" :key="w.id">
            <td>{{ w.time }}</td>
            <td>{{ w.point }}</td>
            <td>{{ w.desc }}</td>
            <td><span class="badge" :style="badgeStyle(w.level)">{{ w.level }}</span></td>
            <td>{{ w.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const metrics = [
  { label: '当前工况', value: '正常', unit: '', color: '#43e0a0', foot: '综合评估结果' },
  { label: '活跃预警', value: '3', unit: '条', color: '#ffc94d', foot: '待确认 2 条' },
  { label: '监测测点', value: '24', unit: '个', color: '#7ce4ff', foot: '在线 24 / 24' },
  { label: '数据更新', value: '10', unit: '秒前', color: '#7ce4ff', foot: '采集正常' }
]

const warnings = [
  { id: 1, time: '08:32:10', point: '窑尾温度', desc: '持续偏高，超出正常波动范围', level: '严重预警', status: '待确认' },
  { id: 2, time: '08:15:46', point: '篦冷机压力', desc: '短时波动异常', level: '一般预警', status: '已确认' },
  { id: 3, time: '07:58:23', point: '窑头负压', desc: '接近预警阈值', level: '提示', status: '已关闭' }
]

// 平台能力看板数据（示例值；能耗参考值取自系统已固化的工艺参考区间）
const health = [
  { name: '预热器 C1-C5', value: 92, color: '#43e0a0' },
  { name: '分解炉', value: 88, color: '#43e0a0' },
  { name: '回转窑', value: 76, color: '#ffc94d' },
  { name: '篦冷机', value: 95, color: '#43e0a0' }
]
const energy = [
  { name: '吨熟料煤耗', value: '98.6', unit: 'kgce/t', ref: '≤100 kgce/t' },
  { name: '吨熟料电耗', value: '25.4', unit: 'kWh/t', ref: '≤26 kWh/t' }
]

const levelColors = { '正常': '#43e0a0', '提示': '#7fd4ff', '一般预警': '#ffc94d', '严重预警': '#ff8a4d', '紧急报警': '#ff5c5c' }
const badgeStyle = (level) => {
  const c = levelColors[level] || '#6B746C'
  return { color: c, background: c + '12' }
}

const trendChart = ref(null)
const levelChart = ref(null)

onMounted(() => {
  const t = echarts.init(trendChart.value)
  t.setOption({
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(7,26,46,.94)', borderColor: '#2a6f9e', textStyle: { color: '#cfe6ff', fontSize: 17 }, padding: [10, 14] },
    grid: { left: 68, right: 58, top: 30, bottom: 48 },
    xAxis: {
      type: 'category', boundaryGap: false,
      data: ['08:00', '08:10', '08:20', '08:30', '08:40', '08:50', '09:00'],
      axisLine: { lineStyle: { color: '#2a6f9e' } }, axisTick: { show: false },
      axisLabel: { color: '#a8cbe6', fontSize: 16 }
    },
    yAxis: {
      type: 'value', name: '温度 ℃', splitLine: { lineStyle: { color: 'rgba(58,208,255,.14)' } },
      nameTextStyle: { color: '#a8cbe6', fontSize: 16 },
      axisLabel: { color: '#a8cbe6', fontSize: 16 }
    },
    series: [{
      name: '窑尾温度', type: 'line', smooth: false, symbol: 'circle', symbolSize: 7,
      lineStyle: { color: '#3ad0ff', width: 3, shadowColor: 'rgba(58,208,255,.5)', shadowBlur: 8 }, itemStyle: { color: '#7ce4ff' },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(58,208,255,0.32)' }, { offset: 1, color: 'rgba(58,208,255,0.02)' }
      ]) },
      data: [1050, 1062, 1075, 1108, 1095, 1080, 1066],
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: '#ff5c5c', type: 'dashed', width: 2 },
        label: { formatter: '阈值 1100', color: '#ff8a8a', fontSize: 16, position: 'insideStartTop' },
        data: [{ yAxis: 1100 }]
      }
    }]
  })

  const l = echarts.init(levelChart.value)
  l.setOption({
    tooltip: { trigger: 'item', backgroundColor: 'rgba(7,26,46,.94)', borderColor: '#2a6f9e', textStyle: { color: '#cfe6ff', fontSize: 17 }, padding: [10, 14] },
    series: [{
      type: 'pie', radius: ['48%', '68%'], center: ['50%', '52%'], minAngle: 16,
      labelLayout: { hideOverlap: true },
      label: { formatter: '{b} {c}', color: '#a8cbe6', fontSize: 15, fontWeight: 500 },
      labelLine: { lineStyle: { color: '#2a6f9e' }, length: 10, length2: 6 },
      itemStyle: { borderColor: 'rgba(7,26,46,.9)', borderWidth: 3 },
      data: [
        { value: 18, name: '正常', itemStyle: { color: '#43e0a0' } },
        { value: 6, name: '提示', itemStyle: { color: '#7fd4ff' } },
        { value: 4, name: '一般预警', itemStyle: { color: '#ffc94d' } },
        { value: 2, name: '严重预警', itemStyle: { color: '#ff8a4d' } },
        { value: 1, name: '紧急报警', itemStyle: { color: '#ff5c5c' } }
      ]
    }]
  })

  window.addEventListener('resize', () => { t.resize(); l.resize() })
})
</script>

<style scoped>
.board-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
.board-kicker { font-size: 16px; letter-spacing: 2px; color: #7fb3d8; }
.board-title { font-size: 33px; font-weight: 600; margin-top: 4px; letter-spacing: 3px; color: var(--title); text-shadow: 0 0 14px rgba(58, 208, 255, .45); }
.board-stamp { display: flex; align-items: center; gap: 10px; font-size: 16px; color: #8fd0ff; border: 1px solid rgba(58, 208, 255, .4); padding: 8px 16px; background: rgba(14, 52, 84, .55); }
.stamp-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--warn); box-shadow: 0 0 6px rgba(255, 201, 77, .7); }

.gauge-bar {
  display: grid; grid-template-columns: repeat(4, 1fr);
  background: linear-gradient(160deg, var(--panel-a), var(--panel-b));
  border: 1px solid var(--line); border-top: 2px solid var(--accent);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  box-shadow: inset 0 0 24px rgba(20, 80, 130, .25);
}
.gauge { padding: 28px 32px 26px; border-right: 1px solid var(--line-soft); }
.gauge:last-child { border-right: none; }
.gauge-label { font-size: 17px; color: #7fb3d8; letter-spacing: 1.5px; }
.gauge-value { font-family: var(--num); font-size: 60px; font-weight: 600; line-height: 1.15; margin: 7px 0 4px; letter-spacing: 1px; text-shadow: 0 0 18px currentColor; }
.gauge-unit { font-size: 20px; margin-left: 7px; color: #9fc3e0; font-family: inherit; font-weight: 400; }
.gauge-foot { font-size: 16px; color: #7fa3c2; letter-spacing: .5px; }

/* 平台能力看板 */
.cap-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.cap-card {
  background: linear-gradient(160deg, var(--panel-a), var(--panel-b));
  border: 1px solid var(--line);
  border-top: 2px solid var(--accent);
  padding: 22px 24px 20px;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  box-shadow: inset 0 0 24px rgba(20, 80, 130, .25);
}
.cap-head { display: flex; align-items: center; gap: 11px; }
.cap-icon {
  width: 38px; height: 38px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: var(--accent);
  border: 1px solid rgba(58, 208, 255, .4); background: rgba(58, 208, 255, .08);
}
.cap-name { font-size: 18px; color: var(--title); font-weight: 600; }
.cap-en { font-size: 12px; color: #5f93bc; letter-spacing: 1.5px; margin-top: 1px; }
.cap-flag { margin-left: auto; font-size: 12px; color: #7fa3c2; border: 1px solid var(--line-soft); padding: 2px 8px; white-space: nowrap; }
.cap-desc { font-size: 14px; color: #8fb8d9; margin: 14px 0 16px; line-height: 1.6; }
.cap-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.cap-stat { text-align: center; padding: 8px 4px; background: rgba(58, 208, 255, .05); border: 1px solid var(--line-soft); }
.cap-stat b { display: block; font-family: var(--num); font-size: 26px; color: var(--accent-bright); line-height: 1.2; }
.cap-stat span { font-size: 13px; color: #7fa3c2; }
.cap-src { font-size: 12.5px; color: #5f93bc; margin-top: 14px; border-top: 1px solid var(--line-soft); padding-top: 10px; }
.health-list, .energy-list { display: flex; flex-direction: column; gap: 11px; }
.health-row { display: flex; align-items: center; gap: 10px; }
.health-name { width: 104px; flex-shrink: 0; font-size: 14px; color: #b4d4ec; }
.health-track { flex: 1; height: 8px; background: rgba(58, 208, 255, .1); overflow: hidden; }
.health-track i { display: block; height: 100%; box-shadow: 0 0 8px currentColor; }
.health-val { width: 44px; text-align: right; font-family: var(--num); font-size: 15px; }
.energy-row { padding: 9px 12px; background: rgba(58, 208, 255, .05); border: 1px solid var(--line-soft); }
.energy-info { display: flex; justify-content: space-between; align-items: baseline; }
.energy-name { font-size: 14px; color: #b4d4ec; }
.energy-ref { font-size: 12.5px; color: #7fa3c2; }
.energy-num { font-family: var(--num); font-size: 26px; color: var(--accent-bright); line-height: 1.3; }
.energy-num span { font-family: inherit; font-size: 13px; color: #7fa3c2; margin-left: 5px; }

@media (max-width: 900px) {
  .cap-grid { grid-template-columns: 1fr; }
  .gauge-bar { grid-template-columns: repeat(2, 1fr); }
  .gauge:nth-child(2) { border-right: none; }
  .gauge:nth-child(-n+2) { border-bottom: 1px solid var(--line-soft); }
}
@media (max-width: 520px) {
  .gauge-bar { grid-template-columns: 1fr; }
  .gauge { border-right: none; border-bottom: 1px solid var(--line-soft); }
}
</style>
