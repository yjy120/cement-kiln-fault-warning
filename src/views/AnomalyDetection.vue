<template>
  <div class="page">
    <div class="demo-note">
      本页字段依据《工业过程异常检测与故障预警系统毕设指导可视化手册》5.1、5.4；
      变量名称与阈值参考《工业智脑》《水泥工业医生》资料。当前为界面演示，未接入真实 DCS 数据。
    </div>

    <div class="cards">
      <div class="card">
        <div class="card-label">监测状态</div>
        <div class="card-value" style="color:#5F5E5A">待接入</div>
        <div class="card-foot">真实检测状态需由算法输出</div>
      </div>
      <div class="card">
        <div class="card-label">统计量数量</div>
        <div class="card-value" style="color:#185FA5">4<span class="card-unit">类</span></div>
        <div class="card-foot">T² / eT² / S² / eS²</div>
      </div>
      <div class="card">
        <div class="card-label">过渡识别方法</div>
        <div class="card-value" style="color:#BA7517">SW-KIWS</div>
        <div class="card-foot">滑窗 ADF 识别过渡起止</div>
      </div>
      <div class="card">
        <div class="card-label">数据更新时间</div>
        <div class="card-value" style="color:#5F5E5A">—</div>
        <div class="card-foot">接入数据后显示</div>
      </div>
    </div>

    <div class="panels">
      <div class="panel">
        <div class="panel-title">当前工况概览 · 关键变量</div>
        <table class="warn-table">
          <thead>
            <tr><th>变量 / 指标</th><th>所属工段</th><th>当前值</th><th>正常范围 / 参考区间</th><th>数据质量</th></tr>
          </thead>
          <tbody>
            <tr v-for="v in variables" :key="v.name">
              <td>{{ v.name }}</td>
              <td>{{ v.section }}</td>
              <td>{{ v.value }}</td>
              <td>{{ v.ref }}</td>
              <td>{{ v.quality }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="panel">
        <div class="panel-title">异常分数趋势（演示曲线 · 非真实检测结果）</div>
        <div ref="chart" class="chart"></div>
        <div class="hint">横轴为时间占位；阈值线为示意，实际阈值需结合工艺标定。</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-title">异常检测结果 · 四类统计量</div>
      <table class="warn-table">
        <thead>
          <tr><th>统计量</th><th>含义（依据文档）</th><th>检测状态</th><th>异常分数</th><th>异常区间 / 触发时间</th></tr>
        </thead>
        <tbody>
          <tr v-for="s in stats" :key="s.code">
            <td>{{ s.code }}</td>
            <td>{{ s.desc }}</td>
            <td>{{ s.state }}</td>
            <td>{{ s.score }}</td>
            <td>{{ s.range }}</td>
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
  { name: '分解炉出口温度', section: '预热器 / 分解炉', value: '—', ref: '现场标定', quality: '待接入' },
  { name: '窑尾烟室温度、负压与 O₂', section: '窑尾烟室', value: '—', ref: '现场标定', quality: '待接入' },
  { name: '窑主电机电流', section: '回转窑本体', value: '—', ref: '现场标定', quality: '待接入' },
  { name: '篦下压力与压损', section: '篦冷机', value: '—', ref: '现场标定', quality: '待接入' },
  { name: 'f-CaO（游离氧化钙）', section: '熟料质量', value: '—', ref: '≤ 1.5%（过渡判定参考）', quality: '待接入' },
  { name: '吨熟料煤耗', section: '能耗', value: '—', ref: '≤ 100 kgce/t（过渡判定参考）', quality: '待接入' },
  { name: '吨熟料电耗', section: '能耗', value: '—', ref: '≤ 26 kWh/t（过渡判定参考）', quality: '待接入' },
  { name: 'NOx 排放', section: '环保红线', value: '—', ref: '按现场环保指标标定', quality: '待接入' }
]

const stats = [
  { code: 'T²', desc: '反映稳态空间的大范围漂移', state: '待接入', score: '—', range: '—' },
  { code: 'eT²', desc: '反映残差空间的静态相关性破坏', state: '待接入', score: '—', range: '—' },
  { code: 'S²', desc: '反映动态变化速度异常', state: '待接入', score: '—', range: '—' },
  { code: 'eS²', desc: '反映残差局部抖动', state: '待接入', score: '—', range: '—' }
]

const chart = ref(null)
let inst = null
onMounted(() => {
  inst = echarts.init(chart.value)
  inst.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { fontSize: 11 }, data: ['T²（演示）', 'S²（演示）'] },
    grid: { left: 42, right: 16, top: 20, bottom: 38 },
    xAxis: { type: 'category', boundaryGap: false, data: ['09:00', '09:10', '09:20', '09:30', '09:40', '09:50', '10:00'] },
    yAxis: { type: 'value', name: '分数（示意）', min: 0, max: 1 },
    series: [
      { name: 'T²（演示）', type: 'line', smooth: true, data: [0.12, 0.18, 0.15, 0.42, 0.36, 0.22, 0.16], markLine: { silent: true, symbol: 'none', lineStyle: { type: 'dashed', color: '#D85A30' }, label: { formatter: '示意阈值', color: '#D85A30' }, data: [{ yAxis: 0.5 }] } },
      { name: 'S²（演示）', type: 'line', smooth: true, data: [0.10, 0.14, 0.22, 0.30, 0.26, 0.18, 0.12] }
    ]
  })
  window.addEventListener('resize', resize)
})
const resize = () => inst && inst.resize()
onUnmounted(() => { window.removeEventListener('resize', resize); inst && inst.dispose() })
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 16px; }
.demo-note {
  background: #FFF7E6; border: 1px solid #FFE7A8; color: #8A5A00;
  padding: 10px 14px; border-radius: 8px; font-size: 12px;
}
.hint { margin-top: 8px; font-size: 11px; color: #888780; }
.card-value { font-size: 24px; }
</style>
