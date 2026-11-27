<template>
  <div class="sc-grid wn-grid">
    <div class="sc-panel"><div class="sc-pt">预警等级统计<span class="en">LEVEL STAT</span></div><div ref="gauge" class="sc-chart"></div></div>
    <div class="sc-panel"><div class="sc-pt">近7日预警趋势<span class="en">7-DAY TREND</span></div><div ref="trend" class="sc-chart"></div></div>
    <div class="sc-panel"><div class="sc-pt">异常检测 · 测点异常率 TOP5<span class="en">ANOMALY TOP5</span></div><div ref="top" class="sc-chart"></div></div>
    <div class="sc-panel panel-flow">
      <div class="sc-pt">故障预警闭环<span class="en">WARNING FLOW</span></div>
      <div class="flow-steps">
        <div class="step" v-for="(s,i) in steps" :key="s.t"><div class="step-h">{{s.t}}</div><div class="step-d">{{s.d}}</div><div class="arrow" v-if="i<steps.length-1">→</div></div>
      </div>
    </div>
    <div class="sc-panel panel-alarm"><div class="sc-pt">实时故障预警列表<span class="en">WARNING LIST</span></div>
      <div class="sc-scroll"><table class="sc-table"><thead><tr><th>时间</th><th>测点/位置</th><th>异常描述</th><th>等级</th><th>状态</th></tr></thead>
      <tbody><tr v-for="(r,i) in warns" :key="i"><td>{{r.t}}</td><td>{{r.pos}}</td><td>{{r.info}}</td><td :class="r.cls"><span class="dot" :class="r.flash?'flash':''"></span>{{r.lv}}</td><td>{{r.st}}</td></tr></tbody></table></div>
    </div>
    <div class="sc-panel"><div class="sc-pt">预警类型分布<span class="en">TYPE</span></div><div ref="pie" class="sc-chart"></div></div>
  </div>
</template>
<script setup>
import { ref,onMounted,onUnmounted } from 'vue'
import * as echarts from 'echarts'
const gauge=ref(),trend=ref(),top=ref(),pie=ref()
const charts=[],TX='#9fc6e8',GRID='rgba(47,134,184,.18)'
const steps=[
  {t:'数据接入',d:'采集测点时序数据'},{t:'异常检测',d:'统计量/趋势偏离判定'},{t:'风险评估',d:'按程度与持续时长定级'},{t:'故障预警',d:'绿蓝黄橙红五级'},{t:'人工处置',d:'确认并记录闭环'}
]
const warns=[
  {t:'09:16:27',pos:'窑尾温度',info:'持续偏高',lv:'严重预警',cls:'lv-critical',flash:1,st:'待确认'},
  {t:'09:14:46',pos:'篦冷机压力',info:'短时波动',lv:'一般预警',cls:'lv-general',st:'处理中'},
  {t:'09:12:23',pos:'窑头负压',info:'缓慢下降趋势',lv:'提示',cls:'lv-tip',st:'已确认'},
  {t:'09:08:02',pos:'喂料量',info:'异常波动已恢复',lv:'正常',cls:'lv-normal',st:'已关闭'}
]
onMounted(()=>{
  const mk=(el,o)=>{const c=echarts.init(el);c.setOption(o);charts.push(c)}
  mk(gauge.value,{series:[{type:'gauge',min:0,max:100,startAngle:210,endAngle:-30,radius:'90%',center:['50%','58%'],axisLine:{lineStyle:{width:10,color:[[.2,'#43e0a0'],[.4,'#3ad0ff'],[.6,'#ffb648'],[.8,'#ff8a4c'],[1,'#ff5b5b']]}},axisTick:{show:false},splitLine:{length:8,lineStyle:{color:'#0a2b45'}},axisLabel:{color:TX,fontSize:9,distance:12},pointer:{width:4,itemStyle:{color:'#eaf6ff'}},detail:{valueAnimation:true,formatter:'{value}',color:'#eaf8ff',fontSize:30,offsetCenter:[0,'58%']},title:{color:TX,fontSize:11,offsetCenter:[0,'90%']},data:[{value:68,name:'综合风险指数'}]}]})
  mk(trend.value,{tooltip:{trigger:'axis'},grid:{left:34,right:12,top:16,bottom:22},xAxis:{type:'category',data:['一','二','三','四','五','六','日'],axisLabel:{color:TX,fontSize:9},axisLine:{lineStyle:{color:'#2f6f9e'}}},yAxis:{type:'value',axisLabel:{color:TX,fontSize:9},splitLine:{lineStyle:{color:GRID}}},series:[{name:'一般',type:'bar',stack:'a',data:[3,5,2,6,4,3,2],itemStyle:{color:'#ffb648'}},{name:'严重',type:'bar',stack:'a',data:[1,0,2,1,1,0,1],itemStyle:{color:'#ff5b5b'}}]})
  mk(top.value,{grid:{left:80,right:24,top:8,bottom:18},xAxis:{type:'value',axisLabel:{color:TX,fontSize:9},splitLine:{lineStyle:{color:GRID}}},yAxis:{type:'category',data:['窑尾温度','篦冷机压力','窑头负压','喂料量','分解炉温度'],axisLabel:{color:TX,fontSize:9}},series:[{type:'bar',data:[32,25,18,12,8],barWidth:9,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#3ad0ff'},{offset:1,color:'#1d4e6b'}]),borderRadius:[0,5,5,0]}}]})
  mk(pie.value,{tooltip:{trigger:'item'},legend:{bottom:0,textStyle:{color:TX,fontSize:9}},series:[{type:'pie',radius:['42%','66%'],center:['50%','44%'],data:[{value:18,name:'温度异常',itemStyle:{color:'#3ad0ff'}},{value:9,name:'压力异常',itemStyle:{color:'#43e0a0'}},{value:6,name:'负压异常',itemStyle:{color:'#ffb648'}},{value:4,name:'流量异常',itemStyle:{color:'#ff5b5b'}}]}]})
  window.addEventListener('resize',rh)
})
const rh=()=>charts.forEach(c=>c.resize())
onUnmounted(()=>{window.removeEventListener('resize',rh);charts.forEach(c=>c.dispose())})
</script>
<style scoped>
.wn-grid{grid-template-columns:1fr 1.2fr 1fr;grid-template-rows:1fr 1fr}
.panel-alarm{grid-column:span 2}
.flow-steps{display:flex;align-items:center;justify-content:space-around;height:100%;padding:10px;gap:4px}
.step{position:relative;text-align:center;flex:1}
.step-h{display:inline-block;padding:6px 10px;background:linear-gradient(180deg,#1a5c8e,#0d3a5e);border:1px solid #3a86b8;color:#dff1ff;font-size:12px;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}
.step-d{font-size:10px;color:#7fb0d4;margin-top:6px}
.arrow{position:absolute;right:-6px;top:6px;color:#5fd0ff;font-size:16px}
@media(max-width:1100px){.wn-grid{grid-template-columns:1fr 1fr}.panel-alarm{grid-column:span 2}}
</style>
