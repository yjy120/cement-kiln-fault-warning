<template>
  <div class="dashboard">
    <div class="board-head">
      <div class="board-id">
        <span class="board-kicker">窑线 01 · 中控工况</span>
        <h1 class="board-title">生产工况总览</h1>
      </div>
      <div class="board-stamp">
        <span class="stamp-dot"></span>
        <span>演示数据 · 非真实采集</span>
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
  { id: 1, time: '08:32:10（演示）', point: '窑尾温度', desc: '持续偏高，超出正常波动范围', level: '严重预警', status: '待确认' },
  { id: 2, time: '08:15:46（演示）', point: '篦冷机压力', desc: '短时波动异常', level: '一般预警', status: '已确认' },
  { id: 3, time: '07:58:23（演示）', point: '窑头负压', desc: '接近预警阈值', level: '提示', status: '已关闭' }
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
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(7,26,46,.92)', borderColor: '#2a6f9e', textStyle: { color: '#cfe6ff' } },
    grid: { left: 48, right: 22, top: 18, bottom: 32 },
    xAxis: {
      type: 'category', boundaryGap: false,
      data: ['08:00', '08:10', '08:20', '08:30', '08:40', '08:50', '09:00'],
      axisLine: { lineStyle: { color: '#2a6f9e' } }, axisTick: { show: false },
      axisLabel: { color: '#8fb8d9' }
    },
    yAxis: {
      type: 'value', name: '温度 ℃', splitLine: { lineStyle: { color: 'rgba(58,208,255,.12)' } },
      nameTextStyle: { color: '#8fb8d9', fontSize: 11 },
      axisLabel: { color: '#8fb8d9' }
    },
    series: [{
      name: '窑尾温度', type: 'line', smooth: false, symbol: 'circle', symbolSize: 5,
      lineStyle: { color: '#3ad0ff', width: 2 }, itemStyle: { color: '#3ad0ff' },
      areaStyle: { color: 'rgba(58,208,255,0.10)' },
      data: [1050, 1062, 1075, 1108, 1095, 1080, 1066],
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: '#ff5c5c', type: 'dashed', width: 1 },
        label: { formatter: '阈值 1100', color: '#ff5c5c', fontSize: 11 },
        data: [{ yAxis: 1100 }]
      }
    }]
  })

  const l = echarts.init(levelChart.value)
  l.setOption({
    tooltip: { trigger: 'item', backgroundColor: 'rgba(7,26,46,.92)', borderColor: '#2a6f9e', textStyle: { color: '#cfe6ff' } },
    series: [{
      type: 'pie', radius: ['52%', '74%'], center: ['50%', '52%'],
      label: { formatter: '{b} {c}', color: '#8fb8d9', fontSize: 11 },
      labelLine: { lineStyle: { color: '#2a6f9e' } },
      itemStyle: { borderColor: 'rgba(7,26,46,.9)', borderWidth: 2 },
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
.board-kicker { font-size: 11px; letter-spacing: 2px; color: #6aa8d6; }
.board-title { font-size: 22px; font-weight: 600; margin-top: 3px; letter-spacing: 3px; color: var(--title); text-shadow: 0 0 14px rgba(58, 208, 255, .45); }
.board-stamp { display: flex; align-items: center; gap: 7px; font-size: 11px; color: #8fd0ff; border: 1px solid rgba(58, 208, 255, .4); padding: 4px 10px; background: rgba(14, 52, 84, .55); }
.stamp-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--warn); box-shadow: 0 0 6px rgba(255, 201, 77, .7); }

.gauge-bar {
  display: grid; grid-template-columns: repeat(4, 1fr);
  background: linear-gradient(160deg, var(--panel-a), var(--panel-b));
  border: 1px solid var(--line); border-top: 2px solid var(--accent);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  box-shadow: inset 0 0 24px rgba(20, 80, 130, .25);
}
.gauge { padding: 16px 20px 15px; border-right: 1px solid var(--line-soft); }
.gauge:last-child { border-right: none; }
.gauge-label { font-size: 12px; color: #7fb3d8; letter-spacing: 1px; }
.gauge-value { font-family: var(--num); font-size: 34px; line-height: 1.2; margin: 5px 0 3px; letter-spacing: 1px; text-shadow: 0 0 12px rgba(58, 208, 255, .35); }
.gauge-unit { font-size: 14px; margin-left: 5px; color: #7fb3d8; font-family: inherit; }
.gauge-foot { font-size: 11px; color: #557a99; }

@media (max-width: 900px) {
  .gauge-bar { grid-template-columns: repeat(2, 1fr); }
  .gauge:nth-child(2) { border-right: none; }
  .gauge:nth-child(-n+2) { border-bottom: 1px solid var(--line-soft); }
}
@media (max-width: 520px) {
  .gauge-bar { grid-template-columns: 1fr; }
  .gauge { border-right: none; border-bottom: 1px solid var(--line-soft); }
}
</style>
