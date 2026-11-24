<template>
  <div class="sc-grid tr-grid">
    <div class="sc-panel"><div class="sc-pt">历史工况统计<span class="en">HISTORY</span></div><div ref="hist" class="sc-chart"></div></div>
    <div class="sc-panel"><div class="sc-pt">窗口ADF过渡过程识别<span class="en">ADF</span></div><div ref="adf" class="sc-chart"></div></div>
    <div class="sc-panel"><div class="sc-pt">历史工况占比<span class="en">RATIO</span></div><div ref="ratio" class="sc-chart"></div></div>
    <div class="sc-panel">
      <div class="sc-pt">过程指标<span class="en">PROCESS</span></div>
      <div class="sc-pad" style="display:flex;flex-direction:column;gap:2px">
        <div ref="feed" class="sc-chart"></div><div ref="ca" class="sc-chart"></div><div ref="temp" class="sc-chart"></div>
      </div>
    </div>
    <div class="sc-panel">
      <div class="sc-pt">过渡过程异常监测<span class="en">TRANSITION</span></div>
      <div class="sc-pad" style="display:flex;flex-direction:column;gap:2px">
        <div ref="multi" class="sc-chart"></div><div ref="sfa" class="sc-chart"></div>
      </div>
    </div>
    <div class="sc-panel">
      <div class="sc-pt">日志信息<span class="en">LOG</span></div>
      <div class="sc-scroll"><table class="sc-table"><thead><tr><th>DateTime</th><th>日志详情</th></tr></thead>
      <tbody><tr v-for="(r,i) in logs" :key="i"><td>{{r.t}}</td><td>{{r.info}}</td></tr></tbody></table></div>
    </div>
  </div>
</template>
<script setup>
import { ref,onMounted,onUnmounted } from 'vue'
import * as echarts from 'echarts'
const hist=ref(),adf=ref(),ratio=ref(),feed=ref(),ca=ref(),temp=ref(),multi=ref(),sfa=ref()
const charts=[],TX='#9fc6e8',GRID='rgba(47,134,184,.18)'
const logs=[{t:'03-18 09:20:53',info:'工况波动'},{t:'03-18 09:20:37',info:'工况波动'},{t:'03-18 09:19:27',info:'离开过渡过程'},{t:'03-18 09:19:09',info:'工况波动'}]
const tms=['03-18 09:13','09:15','09:17','09:19','09:21']
const mini=(name,data,color,th)=>({title:{text:name,left:6,top:1,textStyle:{color:TX,fontSize:10,fontWeight:'normal'}},grid:{left:38,right:8,top:20,bottom:16},xAxis:{type:'category',data:tms,axisLabel:{color:TX,fontSize:8},axisLine:{lineStyle:{color:'#2f6f9e'}}},yAxis:{type:'value',axisLabel:{color:TX,fontSize:8},splitLine:{lineStyle:{color:GRID}}},series:[{type:'line',smooth:true,symbol:'none',data,lineStyle:{color:color||'#4dabf7',width:1.5},...(th?{markLine:{silent:true,symbol:'none',lineStyle:{color:'#ff5b5b',type:'dashed'},label:{show:false},data:[{yAxis:th}]}}:{})}]})
onMounted(()=>{
  const mk=(el,o)=>{const c=echarts.init(el);c.setOption(o);charts.push(c)}
  mk(hist.value,{grid:{left:40,right:10,top:12,bottom:22},xAxis:{type:'category',data:['稳定工况','过渡过程','工况波动'],axisLabel:{color:TX,fontSize:9},axisLine:{lineStyle:{color:'#2f6f9e'}}},yAxis:{type:'value',axisLabel:{color:TX,fontSize:9},splitLine:{lineStyle:{color:GRID}}},series:[{type:'bar',data:[330,145,78],barWidth:22,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#4dabf7'},{offset:1,color:'#16456e'}]),borderRadius:[3,3,0,0]}}]})
  mk(adf.value,{...mini('窗口ADF过渡过程识别',[.6,.9,.4,.8,.5,.7,.3,.9,.6],'#ff9f43'),yAxis:{...mini().yAxis,min:-.2,max:1.2}})
  mk(ratio.value,{series:[{type:'pie',radius:'65%',label:{color:TX,fontSize:10,formatter:'{b}: {d}%'},data:[{value:55,name:'稳定工况',itemStyle:{color:'#e8c86a'}},{value:25,name:'过渡过程',itemStyle:{color:'#8f7fd8'}},{value:20,name:'工况波动',itemStyle:{color:'#5fd0ff'}}]}]})
  mk(feed.value,mini('喂料量反馈（t/h）',[405,398,390,382,388,396,402],'#4dabf7'))
  mk(ca.value,mini('游离钙化验值',[1.2,1.35,1.1,1.5,1.3,1.42,1.25],'#43e0a0'))
  mk(temp.value,mini('关键温度参数（℃）',[1100,1120,1150,1130,1105,1090,1110],'#ff9f43'))
  mk(multi.value,mini('稳态异常监测（多变量）',[40,60,45,80,70,120,380],'#4dabf7',300))
  mk(sfa.value,mini('动态异常监测（SW-SFA夹角余弦）',[1.02,1.01,1.0,.98,.89,.94,.97],'#43e0a0'))
  window.addEventListener('resize',rh)
})
const rh=()=>charts.forEach(c=>c.resize())
onUnmounted(()=>{window.removeEventListener('resize',rh);charts.forEach(c=>c.dispose())})
</script>
<style scoped>
.tr-grid{grid-template-columns:1fr 1.6fr 1fr;grid-template-rows:1fr 1fr}
.tr-grid>.sc-panel:nth-child(2){grid-row:span 1}
@media(max-width:1100px){.tr-grid{grid-template-columns:1fr 1fr}}
</style>
