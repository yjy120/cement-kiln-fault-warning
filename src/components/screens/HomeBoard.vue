<template>
  <div class="sc-grid home-grid">
    <div class="sc-panel">
      <div class="sc-pt">稳态异常监测<span class="en">STATIONARY</span></div>
      <div class="sc-pad" style="display:flex;flex-direction:column;gap:4px">
        <div ref="t2" class="sc-chart"></div>
        <div ref="te2" class="sc-chart"></div>
      </div>
    </div>

    <div class="sc-panel panel-flow">
      <div class="sc-pt">窑线工艺流程与实时测点<span class="en">PROCESS</span></div>
      <div class="flow-wrap">
        <svg viewBox="0 0 620 300" class="flow-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="hPipe" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1d4e6b"/><stop offset=".5" stop-color="#3aa0d0"/><stop offset="1" stop-color="#1d4e6b"/></linearGradient>
            <radialGradient id="hKiln"><stop offset="0" stop-color="#ffb14a"/><stop offset="1" stop-color="#b0451f"/></radialGradient>
          </defs>
          <text x="310" y="20" text-anchor="middle" class="f-title">五代旋风预热器 · 在线测点</text>
          <g transform="translate(150,40)">
            <rect x="0" y="0" width="120" height="150" fill="none" stroke="#3a86b8" stroke-width="1.5"/>
            <g v-for="(c,i) in 5" :key="i">
              <path :d="`M${20+i*20} ${10+i*22} l20 0 l-4 14 l-12 0 z`" fill="#1c5a86" stroke="#5fd0ff" stroke-width=".7"/>
              <circle :cx="30+i*20" :cy="20+i*22" r="3" class="pulse-dot"/>
            </g>
            <text x="60" y="146" text-anchor="middle" class="f-label">预热器 C1-C5</text>
          </g>
          <path d="M270 120 L330 120" stroke="url(#hPipe)" stroke-width="10" stroke-linecap="round"/>
          <circle cx="278" cy="120" r="4" class="flow-dot"/>
          <g transform="translate(330,88)">
            <rect x="0" y="0" width="70" height="64" rx="4" fill="#12405f" stroke="#ff9f43" stroke-width="1.5"/>
            <text x="35" y="38" text-anchor="middle" class="f-label">分解炉</text>
            <text x="35" y="55" text-anchor="middle" class="f-val">920℃</text>
          </g>
          <g transform="translate(150,215)">
            <rect x="0" y="0" width="280" height="34" rx="17" fill="url(#hKiln)" stroke="#ffd08a" stroke-width="1.5"/>
            <text x="140" y="22" text-anchor="middle" class="f-kiln">回转窑 · 1128℃（窑尾偏高）</text>
            <circle cx="266" cy="17" r="5" class="pulse-dot hot"/>
          </g>
          <path d="M400 120 L455 120 L455 232 L432 232" fill="none" stroke="url(#hPipe)" stroke-width="9" stroke-linejoin="round"/>
          <g transform="translate(455,205)">
            <rect x="0" y="0" width="60" height="54" rx="4" fill="#12405f" stroke="#3a86b8" stroke-width="1.5"/>
            <text x="30" y="34" text-anchor="middle" class="f-label">篦冷机</text>
          </g>
          <path d="M150 232 L96 232" stroke="url(#hPipe)" stroke-width="9" stroke-linecap="round"/>
          <g transform="translate(30,215)">
            <rect x="0" y="0" width="66" height="34" fill="#12405f" stroke="#5fd0ff" stroke-width="1.5"/>
            <text x="33" y="22" text-anchor="middle" class="f-label">原料磨</text>
          </g>
        </svg>
      </div>
    </div>

    <div class="sc-panel">
      <div class="sc-pt">动态异常监测<span class="en">DYNAMIC</span></div>
      <div class="sc-pad" style="display:flex;flex-direction:column;gap:4px">
        <div ref="s2" class="sc-chart"></div>
        <div ref="se2" class="sc-chart"></div>
      </div>
    </div>

    <div class="sc-panel">
      <div class="sc-pt">工况优性评价<span class="en">EVALUATION</span></div>
      <div ref="evalc" class="sc-chart" style="height:calc(50% - 14px)"></div>
      <div class="sc-pt">根因诊断评分<span class="en">ROOT CAUSE</span></div>
      <div ref="root" class="sc-chart" style="height:calc(50% - 14px)"></div>
    </div>

    <div class="sc-panel panel-alarm">
      <div class="sc-pt">报警与预警日志<span class="en">ALARM LOG</span></div>
      <div class="sc-scroll">
        <table class="sc-table">
          <thead><tr><th>DateTime</th><th>报警位置</th><th>异常详情</th><th>等级</th></tr></thead>
          <tbody>
            <tr v-for="(r,i) in logs" :key="i"><td>{{r.t}}</td><td>{{r.pos}}</td><td>{{r.info}}</td><td :class="r.cls"><span class="dot"></span>{{r.lv}}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
const t2=ref(),te2=ref(),s2=ref(),se2=ref(),evalc=ref(),root=ref()
const charts=[]
const TX='#9fc6e8', GRID='rgba(47,134,184,.18)'
const logs=[
  {t:'03-18 09:16:27',pos:'窑尾三次风压力',info:'传感器数值异常 当前值 53.13（合理区间 5.5-13）',lv:'严重',cls:'lv-critical'},
  {t:'03-18 09:16:17',pos:'篦冷机一段压力',info:'工况波动，接近预警阈值',lv:'一般',cls:'lv-general'},
  {t:'03-18 09:16:07',pos:'C4A下料温度',info:'持续偏高，已触发趋势预警',lv:'提示',cls:'lv-tip'},
  {t:'03-18 09:15:57',pos:'喂料量feedback',info:'短时波动，系统已记录',lv:'正常',cls:'lv-normal'}
]
const times=['09:05','09:07','09:09','09:11','09:13','09:15','09:17']
const lineOpt=(name,data,threshold,color)=>({
  title:{text:name,left:8,top:2,textStyle:{color:TX,fontSize:11,fontWeight:'normal'}},
  grid:{left:42,right:14,top:26,bottom:20},
  xAxis:{type:'category',data:times,axisLabel:{color:TX,fontSize:9},axisLine:{lineStyle:{color:'#2f6f9e'}}},
  yAxis:{type:'value',axisLabel:{color:TX,fontSize:9},splitLine:{lineStyle:{color:GRID}}},
  tooltip:{trigger:'axis',backgroundColor:'rgba(8,32,54,.9)',borderColor:'#2f86b8',textStyle:{color:'#eaf6ff'}},
  series:[{type:'line',smooth:true,symbol:'none',data,lineStyle:{color,width:1.8},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:color+'66'},{offset:1,color:'transparent'}])},markLine:{silent:true,symbol:'none',lineStyle:{color:'#ff5b5b',type:'dashed'},label:{color:'#ff8a8a',fontSize:9},data:[{yAxis:threshold,name:'阈值'}]}}]
})
onMounted(()=>{
  const mk=(el,opt)=>{const c=echarts.init(el);c.setOption(opt);charts.push(c)}
  mk(t2.value,lineOpt('T2统计量（工况稳态指标）',[110,125,140,158,150,165,172],170,'#4dabf7'))
  mk(te2.value,lineOpt('Te2统计量（工况残差指标）',[60,75,68,88,72,95,82],90,'#3ad0ff'))
  mk(s2.value,lineOpt('S2统计量（工况动态指标）',[300,420,360,520,410,480,540],600,'#7c9bff'))
  mk(se2.value,lineOpt('Se2统计量（动态残差指标）',[12,18,15,24,19,28,22],26,'#43e0a0'))
  mk(evalc.value,{...lineOpt('工况优性评价',[86,85.5,85.8,84.5,84,83.2,83.8],80,'#4dabf7'),yAxis:{...lineOpt().yAxis,min:60,max:95}})
  mk(root.value,{grid:{left:88,right:20,top:8,bottom:18},xAxis:{type:'value',axisLabel:{color:TX,fontSize:9},splitLine:{lineStyle:{color:GRID}}},yAxis:{type:'category',data:['四段下料温度','窑头罩温度','二次风温','分解炉出口','喂料量'],axisLabel:{color:TX,fontSize:9}},series:[{type:'bar',data:[0.42,0.35,0.28,0.19,0.12],itemStyle:{color:'#3ad0ff'},barWidth:9}]})
  window.addEventListener('resize',rh)
})
const rh=()=>charts.forEach(c=>c.resize())
onUnmounted(()=>{window.removeEventListener('resize',rh);charts.forEach(c=>c.dispose())})
</script>
<style scoped>
.home-grid{grid-template-columns:1fr 1.9fr 1.05fr;grid-template-rows:1fr 1fr 1fr}
.home-grid>.sc-panel:nth-child(1){grid-row:span 2}
.home-grid>.sc-panel:nth-child(2){grid-row:span 2}
.home-grid>.sc-panel:nth-child(4){grid-row:span 2}
.panel-alarm{grid-column:2;grid-row:3}
.flow-wrap{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;padding:4px}
.flow-svg{width:100%;height:100%}
.f-title{fill:#7fd4ff;font-size:12px}.f-label{fill:#bcd8f0;font-size:11px}.f-val{fill:#ffcf6b;font-size:12px}.f-kiln{fill:#fff;font-size:12px;font-weight:600}
.pulse-dot{fill:#43e0a0;animation:pb 1.8s infinite}.pulse-dot.hot{fill:#ff5b5b;animation-duration:.9s}
.flow-dot{fill:#7fe8ff;animation:fd 2.4s linear infinite}
@keyframes pb{50%{opacity:.35}}@keyframes fd{0%{opacity:0}20%{opacity:1}100%{opacity:.3}}
@media(max-width:1100px){.home-grid{grid-template-columns:1fr 1fr}.home-grid>.sc-panel:nth-child(1),.home-grid>.sc-panel:nth-child(2){grid-row:span 1}.panel-alarm{grid-column:span 2}}
</style>
