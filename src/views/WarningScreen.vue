<template>
  <div class="screen">
    <div class="screen-head">
      <div class="head-side"></div>
      <div class="head-center">水泥窑线工况异常检测与故障预警中心</div>
      <div class="head-side head-time">{{ clock }}</div>
    </div>

    <div class="screen-body">
      <!-- 左列 -->
      <div class="col">
        <div class="box">
          <div class="box-title">预警等级实时统计</div>
          <div ref="gaugeChart" class="chart-sm"></div>
        </div>
        <div class="box">
          <div class="box-title">近 7 日预警趋势</div>
          <div ref="barChart" class="chart-sm"></div>
        </div>
        <div class="box">
          <div class="box-title">测点异常率 TOP5</div>
          <div ref="barHChart" class="chart-sm"></div>
        </div>
      </div>

      <!-- 中列 -->
      <div class="col col-mid">
        <div class="box box-kpi">
          <div class="kpi-grid">
            <div class="kpi" v-for="k in kpis" :key="k.label">
              <div class="kpi-value" :style="{ color: k.color }">{{ k.value }}</div>
              <div class="kpi-label">{{ k.label }}</div>
            </div>
          </div>
        </div>
        <div class="box box-trend">
          <div class="box-title">窑尾温度实时监测（示例数据）</div>
          <div ref="lineChart" class="chart-lg"></div>
        </div>
        <div class="box">
          <div class="box-title">最新预警事件</div>
          <div class="event-list">
            <div class="event" v-for="w in events" :key="w.id">
              <span class="event-dot" :style="{ background: w.color }"></span>
              <span class="event-time">{{ w.time }}</span>
              <span class="event-text">{{ w.text }}</span>
              <span class="event-level" :style="{ color: w.color }">{{ w.level }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右列 -->
      <div class="col">
        <div class="box">
          <div class="box-title">预警类型分布</div>
          <div ref="pieChart" class="chart-sm"></div>
        </div>
        <div class="box">
          <div class="box-title">设备健康度</div>
          <div ref="radarChart" class="chart-sm"></div>
        </div>
        <div class="box">
          <div class="box-title">处置状态</div>
          <div ref="funnelChart" class="chart-sm"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const clock = ref('')
let timer = null
const updateClock = () => {
  clock.value = new Date().toLocaleString('zh-CN', { hour12: false })
}

const kpis = [
  { label: '在线测点', value: '24', color: '#5DCAA5' },
  { label: '活跃预警', value: '3', color: '#EF9F27' },
  { label: '严重及以上', value: '1', color: '#F09595' },
  { label: '今日已处置', value: '12', color: '#85B7EB' }
]
const events = [
  { id: 1, time: '08:32:10', text: '窑尾温度持续偏高', level: '严重', color: '#F09595' },
  { id: 2, time: '08:15:46', text: '篦冷机压力短时波动', level: '一般', color: '#EF9F27' },
  { id: 3, time: '07:58:23', text: '窑头负压接近阈值', level: '提示', color: '#85B7EB' },
  { id: 4, time: '07:40:02', text: '喂料量异常波动', level: '一般', color: '#EF9F27' },
  { id: 5, time: '07:22:31', text: '系统运行正常', level: '正常', color: '#5DCAA5' }
]

const gaugeChart = ref(null), barChart = ref(null), barHChart = ref(null)
const lineChart = ref(null), pieChart = ref(null), radarChart = ref(null), funnelChart = ref(null)
const charts = []

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)

  const mk = (el) => { const c = echarts.init(el); charts.push(c); return c }
  const darkText = '#C8D6E5'

  mk(gaugeChart.value).setOption({
    series: [{
      type: 'gauge', min: 0, max: 100,
      startAngle: 200, endAngle: -20,
      axisLine: { lineStyle: { width: 12, color: [[0.2, '#1D9E75'], [0.4, '#378ADD'], [0.6, '#BA7517'], [0.8, '#D85A30'], [1, '#A32D2D']] } },
      pointer: { itemStyle: { color: '#fff' } },
      axisTick: { show: false }, splitLine: { length: 10, lineStyle: { color: '#fff', width: 1 } },
      axisLabel: { color: darkText, fontSize: 9, distance: 14 },
      detail: { valueAnimation: true, formatter: '{value}', color: '#fff', fontSize: 26, offsetCenter: [0, '70%'] },
      title: { color: darkText, fontSize: 11, offsetCenter: [0, '100%'] },
      data: [{ value: 68, name: '综合风险指数' }]
    }]
  })

  mk(barChart.value).setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 30, right: 12, top: 20, bottom: 24 },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], axisLabel: { color: darkText, fontSize: 9 }, axisLine: { lineStyle: { color: '#35506B' } } },
    yAxis: { type: 'value', axisLabel: { color: darkText, fontSize: 9 }, splitLine: { lineStyle: { color: '#243B53' } } },
    series: [
      { name: '一般', type: 'bar', stack: 'a', data: [3, 5, 2, 6, 4, 3, 2], itemStyle: { color: '#BA7517' } },
      { name: '严重', type: 'bar', stack: 'a', data: [1, 0, 2, 1, 1, 0, 1], itemStyle: { color: '#D85A30' } }
    ]
  })

  mk(barHChart.value).setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 78, right: 20, top: 10, bottom: 20 },
    xAxis: { type: 'value', axisLabel: { color: darkText, fontSize: 9 }, splitLine: { lineStyle: { color: '#243B53' } } },
    yAxis: { type: 'category', data: ['窑尾温度', '篦冷机压力', '窑头负压', '喂料量', '分解炉温度'], axisLabel: { color: darkText, fontSize: 10 } },
    series: [{ type: 'bar', data: [32, 25, 18, 12, 8], itemStyle: { color: '#378ADD' }, barWidth: 10 }]
  })

  mk(lineChart.value).setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 45, right: 20, top: 30, bottom: 28 },
    xAxis: { type: 'category', boundaryGap: false, data: ['08:00', '08:10', '08:20', '08:30', '08:40', '08:50', '09:00'], axisLabel: { color: darkText, fontSize: 10 }, axisLine: { lineStyle: { color: '#35506B' } } },
    yAxis: { type: 'value', name: '℃', nameTextStyle: { color: darkText }, axisLabel: { color: darkText, fontSize: 10 }, splitLine: { lineStyle: { color: '#243B53' } } },
    series: [{
      name: '窑尾温度', type: 'line', smooth: true, symbol: 'none',
      lineStyle: { color: '#5DCAA5', width: 2 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(93,202,165,0.35)' }, { offset: 1, color: 'rgba(93,202,165,0)' }]) },
      data: [1050, 1062, 1075, 1108, 1095, 1080, 1066],
      markLine: { silent: true, symbol: 'none', lineStyle: { color: '#F09595', type: 'dashed' }, label: { color: '#F09595', fontSize: 10 }, data: [{ yAxis: 1100, name: '预警阈值' }] }
    }]
  })

  mk(pieChart.value).setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: darkText, fontSize: 9 }, itemWidth: 8, itemHeight: 8 },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      label: { show: false },
      data: [
        { value: 18, name: '温度异常', itemStyle: { color: '#378ADD' } },
        { value: 9, name: '压力异常', itemStyle: { color: '#5DCAA5' } },
        { value: 6, name: '负压异常', itemStyle: { color: '#BA7517' } },
        { value: 4, name: '流量异常', itemStyle: { color: '#D85A30' } }
      ]
    }]
  })

  mk(radarChart.value).setOption({
    radar: { indicator: [{ name: '回转窑', max: 100 }, { name: '篦冷机', max: 100 }, { name: '分解炉', max: 100 }, { name: '喂料系统', max: 100 }, { name: '引风系统', max: 100 }], axisName: { color: darkText, fontSize: 9 }, splitLine: { lineStyle: { color: '#243B53' } }, splitArea: { areaStyle: { color: ['rgba(36,59,83,0.3)', 'rgba(20,40,60,0.3)'] } } },
    series: [{ type: 'radar', data: [{ value: [85, 72, 90, 78, 66], name: '健康度', areaStyle: { color: 'rgba(93,202,165,0.3)' }, lineStyle: { color: '#5DCAA5' }, itemStyle: { color: '#5DCAA5' } }] }]
  })

  mk(funnelChart.value).setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'funnel', top: 10, bottom: 10, left: '12%', width: '76%',
      label: { color: '#fff', fontSize: 10, position: 'inside' },
      data: [
        { value: 20, name: '已触发 20', itemStyle: { color: '#A32D2D' } },
        { value: 15, name: '已确认 15', itemStyle: { color: '#D85A30' } },
        { value: 12, name: '处理中 12', itemStyle: { color: '#BA7517' } },
        { value: 9, name: '已关闭 9', itemStyle: { color: '#1D9E75' } }
      ]
    }]
  })

  window.addEventListener('resize', handleResize)
})
const handleResize = () => charts.forEach(c => c.resize())
onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('resize', handleResize)
  charts.forEach(c => c.dispose())
})
</script>

<style scoped>
.screen { background: #0B1B2B; min-height: calc(100vh - 60px); color: #E6F1FB; padding: 0 20px 20px; }
.screen-head { height: 60px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1E3A5F; }
.head-center { font-size: 20px; font-weight: 500; letter-spacing: 2px; color: #EAF4FF; }
.head-side { width: 200px; font-size: 12px; color: #85B7EB; }
.head-time { text-align: right; }
.screen-body { display: grid; grid-template-columns: 1fr 1.6fr 1fr; gap: 14px; margin-top: 14px; }
.col { display: flex; flex-direction: column; gap: 14px; }
.box { background: rgba(20, 45, 70, 0.6); border: 1px solid #1E3A5F; border-radius: 8px; padding: 12px; }
.box-title { font-size: 13px; font-weight: 500; color: #9FC5E8; margin-bottom: 8px; padding-left: 8px; border-left: 3px solid #378ADD; }
.chart-sm { width: 100%; height: 180px; }
.chart-lg { width: 100%; height: 240px; }
.box-kpi { padding: 18px 12px; }
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.kpi { text-align: center; }
.kpi-value { font-size: 30px; font-weight: 500; }
.kpi-label { font-size: 11px; color: #85B7EB; margin-top: 4px; }
.box-trend { padding-bottom: 6px; }
.event-list { display: flex; flex-direction: column; gap: 2px; }
.event { display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 7px 4px; border-bottom: 1px solid rgba(30,58,95,0.5); }
.event-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.event-time { color: #7FA6CC; font-family: monospace; }
.event-text { flex: 1; }
.event-level { font-weight: 500; }
@media (max-width: 1100px) { .screen-body { grid-template-columns: 1fr; } }
</style>
