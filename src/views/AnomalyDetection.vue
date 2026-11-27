<template>
  <div class="page">
    <div class="demo-note">
      本页字段依据《工业过程异常检测与故障预警系统毕设指导可视化手册》5.1、5.4；
      覆盖窑线关键工艺变量与多元统计监控指标，阈值按现场工艺规程标定。
    </div>

    <div class="method-strip">
      <div class="method">
        <span class="method-tag">检测方法</span>
        <span class="method-name">多元统计过程监控</span>
      </div>
      <div class="method">
        <span class="method-tag">统计量</span>
        <span class="method-name">T² · eT² · S² · eS²</span>
      </div>
      <div class="method">
        <span class="method-tag">过渡识别</span>
        <span class="method-name">SW-KIWS 滑窗 ADF</span>
      </div>
      <div class="method">
        <span class="method-tag">检测状态</span>
        <span class="method-name">在线运行</span>
      </div>
    </div>

    <div class="panels">
      <div class="panel">
        <div class="panel-title">关键变量与参考区间<span class="sub">阈值按现场规程标定</span></div>
        <table class="warn-table">
          <thead>
            <tr><th>变量 / 指标</th><th>所属工段</th><th>当前值</th><th>正常范围 / 参考区间</th><th>数据质量</th></tr>
          </thead>
          <tbody>
            <tr v-for="v in variables" :key="v.name">
              <td>{{ v.name }}</td>
              <td>{{ v.section }}</td>
              <td class="dash">{{ v.value }}</td>
              <td>{{ v.ref }}</td>
              <td>{{ v.quality }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="panel">
        <div class="panel-title">异常分数趋势<span class="sub">近期趋势</span></div>
        <div ref="chart" class="chart"></div>
        <div class="hint">横轴为时间占位；阈值线为示意，实际阈值需结合工艺标定。</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-title">四类统计量<span class="sub">含义依据文档</span></div>
      <table class="warn-table">
        <thead>
          <tr><th>统计量</th><th>含义（依据文档）</th><th>检测状态</th><th>异常分数</th><th>异常区间 / 触发时间</th></tr>
        </thead>
        <tbody>
          <tr v-for="s in stats" :key="s.code">
            <td class="code">{{ s.code }}</td>
            <td>{{ s.desc }}</td>
            <td>{{ s.state }}</td>
            <td class="dash">{{ s.score }}</td>
            <td class="dash">{{ s.range }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const variables = [
  { name: '分解炉出口温度', section: '预热器 / 分解炉', value: '—', ref: '现场标定', quality: '在线' },
  { name: '窑尾烟室温度、负压与 O₂', section: '窑尾烟室', value: '—', ref: '现场标定', quality: '在线' },
  { name: '窑主电机电流', section: '回转窑本体', value: '—', ref: '现场标定', quality: '在线' },
  { name: '篦下压力与压损', section: '篦冷机', value: '—', ref: '现场标定', quality: '在线' },
  { name: 'f-CaO（游离氧化钙）', section: '熟料质量', value: '—', ref: '≤ 1.5%（过渡判定参考）', quality: '在线' },
  { name: '吨熟料煤耗', section: '能耗', value: '—', ref: '≤ 100 kgce/t（过渡判定参考）', quality: '在线' },
  { name: '吨熟料电耗', section: '能耗', value: '—', ref: '≤ 26 kWh/t（过渡判定参考）', quality: '在线' },
  { name: 'NOx 排放', section: '环保红线', value: '—', ref: '按现场环保指标标定', quality: '在线' }
]

const stats = [
  { code: 'T²', desc: '反映稳态空间的大范围漂移', state: '在线', score: '—', range: '—' },
  { code: 'eT²', desc: '反映残差空间的静态相关性破坏', state: '在线', score: '—', range: '—' },
  { code: 'S²', desc: '反映动态变化速度异常', state: '在线', score: '—', range: '—' },
  { code: 'eS²', desc: '反映残差局部抖动', state: '在线', score: '—', range: '—' }
]

const chart = ref(null)
let inst = null
onMounted(() => {
  inst = echarts.init(chart.value)
  inst.setOption({
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(7,26,46,.92)', borderColor: '#2a6f9e', textStyle: { color: '#cfe6ff' } },
    legend: { bottom: 0, textStyle: { fontSize: 11, color: '#8fb8d9' }, data: ['T²', 'S²'] },
    grid: { left: 40, right: 14, top: 16, bottom: 38 },
    xAxis: {
      type: 'category', boundaryGap: false,
      data: ['09:00', '09:10', '09:20', '09:30', '09:40', '09:50', '10:00'],
      axisLine: { lineStyle: { color: '#2a6f9e' } }, axisTick: { show: false },
      axisLabel: { color: '#8fb8d9' }
    },
    yAxis: { type: 'value', name: '分数（示意）', min: 0, max: 1, splitLine: { lineStyle: { color: 'rgba(58,208,255,.12)' } }, nameTextStyle: { color: '#8fb8d9', fontSize: 11 }, axisLabel: { color: '#8fb8d9' } },
    series: [
      { name: 'T²', type: 'line', symbol: 'circle', symbolSize: 4, lineStyle: { color: '#3ad0ff', width: 2 }, itemStyle: { color: '#3ad0ff' }, data: [0.12, 0.18, 0.15, 0.42, 0.36, 0.22, 0.16], markLine: { silent: true, symbol: 'none', lineStyle: { type: 'dashed', color: '#ff5c5c' }, label: { formatter: '预警阈值', color: '#ff5c5c', fontSize: 11 }, data: [{ yAxis: 0.5 }] } },
      { name: 'S²', type: 'line', symbol: 'circle', symbolSize: 4, lineStyle: { color: '#43e0a0', width: 2 }, itemStyle: { color: '#43e0a0' }, data: [0.10, 0.14, 0.22, 0.30, 0.26, 0.18, 0.12] }
    ]
  })
  window.addEventListener('resize', resize)
})
const resize = () => inst && inst.resize()
onUnmounted(() => { window.removeEventListener('resize', resize); inst && inst.dispose() })
</script>

<style scoped>
.method-strip {
  display: grid; grid-template-columns: repeat(4, 1fr);
  background: linear-gradient(160deg, var(--panel-a), var(--panel-b));
  border: 1px solid var(--line); border-left: 3px solid var(--accent);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  box-shadow: inset 0 0 24px rgba(20, 80, 130, .25);
}
.method { padding: 13px 18px; border-right: 1px solid var(--line-soft); }
.method:last-child { border-right: none; }
.method-tag { display: block; font-size: 16px; color: #7fb3d8; margin-bottom: 4px; letter-spacing: 1px; }
.method-name { font-size: 17px; font-family: var(--num); letter-spacing: .5px; color: var(--accent-bright); }
.method-name.pending { color: var(--warn); font-size: 18px; font-family: inherit; }
.dash { color: #557a99; }
.code { font-family: var(--num); font-size: 18px; color: var(--accent-bright); }
@media (max-width: 900px) {
  .method-strip { grid-template-columns: repeat(2, 1fr); }
  .method:nth-child(2) { border-right: none; }
  .method:nth-child(-n+2) { border-bottom: 1px solid var(--line-soft); }
}
</style>
