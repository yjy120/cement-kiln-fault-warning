<template>
  <div class="sc-grid dg-grid">
    <div class="sc-panel panel-table">
      <div class="sc-pt">各因素贡献度<span class="en">CONTRIBUTION</span></div>
      <div class="sc-scroll"><table class="sc-table"><thead><tr><th>因素</th><th>轻参数均值</th><th>贡献度</th><th>C1C4温度</th><th>C2出口</th></tr></thead>
      <tbody><tr v-for="(r,i) in factors" :key="i"><td>{{r.n}}</td><td>{{r.a}}</td><td :class="r.pos>0?'lv-critical':'lv-normal'">{{r.pos}}</td><td>{{r.b}}</td><td>{{r.c}}</td></tr></tbody></table></div>
    </div>
    <div class="sc-panel"><div class="sc-pt">RootScore根因评分<span class="en">ROOT SCORE</span></div><div ref="root" class="sc-chart"></div></div>
    <div class="sc-panel"><div class="sc-pt">主要因素关系变化<span class="en">RELATION</span></div><div ref="rel" class="sc-chart"></div></div>
    <div class="sc-panel panel-table"><div class="sc-pt">主要异常路径<span class="en">PATH</span></div>
      <div class="sc-scroll"><table class="sc-table"><thead><tr><th>DateTime</th><th>诊断结果</th><th>详情</th></tr></thead>
      <tbody><tr v-for="(r,i) in paths" :key="i"><td>{{r.t}}</td><td>{{r.r}}</td><td>{{r.d}}</td></tr></tbody></table></div>
    </div>
  </div>
</template>
<script setup>
import { ref,onMounted,onUnmounted } from 'vue'
import * as echarts from 'echarts'
const root=ref(),rel=ref()
const charts=[],TX='#9fc6e8',GRID='rgba(47,134,184,.18)'
const factors=[
  {n:'C1A下料温度',a:'76.01',pos:16.90,b:13.42,c:-1.97},
  {n:'C2A下料温度',a:'35.10',pos:5.75,b:15.75,c:0.39},
  {n:'分解炉出口温度',a:'28.55',pos:17.31,b:22.69,c:3.02},
  {n:'三次风温',a:'140.65',pos:26.59,b:38.46,c:-3.40},
  {n:'二次风温1',a:'0.00',pos:-50.63,b:6.48,c:-26.87}
]
const paths=[
  {t:'03-18 09:57:47',r:'异常根因',d:"RootScore判断下料温度 RootScore score为5735.98"},
  {t:'03-18 09:55:07',r:'异常路径',d:'二次风温平均值(367.01)→二次风温'},
  {t:'03-18 09:55:06',r:'异常根因',d:"RootScore score为0.23"},
  {t:'03-18 09:55:07',r:'异常路径',d:'二次风温平均值(367.04)→二次风温'}
]
onMounted(()=>{
  const mk=(el,o)=>{const c=echarts.init(el);c.setOption(o);charts.push(c)}
  mk(root.value,{grid:{left:120,right:20,top:8,bottom:18},xAxis:{type:'value',axisLabel:{color:TX,fontSize:9},splitLine:{lineStyle:{color:GRID}}},yAxis:{type:'category',data:['四段下料温度','窑头罩温度','二次风温','分解炉出口','喂料量','C4A下料'],axisLabel:{color:TX,fontSize:9}},series:[{type:'bar',data:[58000,52000,31000,15000,12000,9000],barWidth:10,itemStyle:{color:'#4dabf7'},label:{show:true,position:'right',color:'#7fd4ff',fontSize:9,formatter:v=>'Root '+(v.value/1000).toFixed(0)+'k'}}]})
  const tms=['09:02','09:16','09:30','09:44','09:58']
  const colors=['#4dabf7','#43e0a0','#ff9f43','#7c9bff','#ff5b5b']
  mk(rel.value,{grid:{left:40,right:12,top:12,bottom:22},xAxis:{type:'category',data:tms,axisLabel:{color:TX,fontSize:9},axisLine:{lineStyle:{color:'#2f6f9e'}}},yAxis:{type:'value',axisLabel:{color:TX,fontSize:9},splitLine:{lineStyle:{color:GRID}}},series:[100,260,180,320,140].map((b,i)=>({name:['C1A下料','二次风温','分解炉','喂料量','窑头罩'][i],type:'line',smooth:true,symbol:'none',data:[b,b*1.2,b*.8,b*1.5,b*1.1],lineStyle:{color:colors[i],width:1.5}}))})
  window.addEventListener('resize',rh)
})
const rh=()=>charts.forEach(c=>c.resize())
onUnmounted(()=>{window.removeEventListener('resize',rh);charts.forEach(c=>c.dispose())})
</script>
<style scoped>
.dg-grid{grid-template-columns:1.5fr 1fr;grid-template-rows:1fr 1fr}
@media(max-width:1100px){.dg-grid{grid-template-columns:1fr}}
</style>
