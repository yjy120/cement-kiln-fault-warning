<template>
  <div class="dashboard">
    <!-- 顶部指标卡 -->
    <div class="cards">
      <div class="card" v-for="m in metrics" :key="m.label">
        <div class="card-label">{{ m.label }}</div>
        <div class="card-value" :style="{ color: m.color }">{{ m.value }}<span class="card-unit">{{ m.unit }}</span></div>
        <div class="card-foot">{{ m.foot }}</div>
      </div>
    </div>

    <!-- 图表区：异常趋势 + 预警等级分布 -->
    <div class="panels">
      <div class="panel">
        <div class="panel-title">窑尾温度趋势（示例数据）</div>
        <div ref="trendChart" class="chart"></div>
      </div>
      <div class="panel">
        <div class="panel-title">预警等级分布（示例数据）</div>
        <div ref="levelChart" class="chart"></div>
      </div>
    </div>

    <!-- 预警列表 -->
    <div class="panel">
      <div class="panel-title">最新预警（示例数据）</div>
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
  { label: '当前工况', value: '正常', unit: '', color: '#1D9E75', foot: '综合评估结果' },
  { label: '活跃预警', value: '3', unit: '条', color: '#BA7517', foot: '待处理 2 条' },
  { label: '监测测点', value: '24', unit: '个', color: '#185FA5', foot: '在线 24 / 24' },
  { label: '数据更新', value: '10', unit: '秒前', color: '#5F5E5A', foot: '采集正常' }
]

const warnings = [
  { id: 1, time: '08:32:10', point: '窑尾温度', desc: '持续偏高，超出正常波动范围', level: '橙·严重', status: '待处理' },
  { id: 2, time: '08:15:46', point: '篦冷机压力', desc: '短时波动异常', level: '黄·一般', status: '已确认' },
  { id: 3, time: '07:58:23', point: '窑头负压', desc: '接近预警阈值', level: '蓝·提示', status: '已关闭' }
]

const levelColors = { '绿': '#1D9E75', '蓝': '#378ADD', '黄': '#BA7517', '橙': '#D85A30', '红': '#A32D2D' }
const badgeStyle = (level) => {
  const key = level.charAt(0)
  const c = levelColors[key] || '#888780'
  return { color: c, background: c + '1A', border: '1px solid ' + c + '55' }
}

const trendChart = ref(null)
const levelChart = ref(null)

onMounted(() => {
  const t = echarts.init(trendChart.value)
  t.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 45, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: ['08:00', '08:10', '08:20', '08:30', '08:40', '08:50', '09:00'] },
    yAxis: { type: 'value', name: '温度℃' },
    series: [{
      name: '窑尾温度', type: 'line', smooth: true,
      data: [1050, 1062, 1075, 1108, 1095, 1080, 1066],
      markLine: {
        silent: true,
        lineStyle: { color: '#D85A30', type: 'dashed' },
        data: [{ yAxis: 1100, name: '预警阈值' }]
      }
    }]
  })

  const l = echarts.init(levelChart.value)
  l.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['45%', '70%'],
      label: { formatter: '{b}: {c}' },
      data: [
        { value: 18, name: '绿·正常', itemStyle: { color: '#1D9E75' } },
        { value: 6, name: '蓝·提示', itemStyle: { color: '#378ADD' } },
        { value: 4, name: '黄·一般', itemStyle: { color: '#BA7517' } },
        { value: 2, name: '橙·严重', itemStyle: { color: '#D85A30' } },
        { value: 1, name: '红·紧急', itemStyle: { color: '#A32D2D' } }
      ]
    }]
  })

  window.addEventListener('resize', () => { t.resize(); l.resize() })
})
</script>
