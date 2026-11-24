<template>
  <div class="sc-grid ev-grid">
    <div class="sc-panel"><div class="sc-pt">历史工况统计<span class="en">HISTORY</span></div><div ref="hist" class="sc-chart"></div></div>
    <div class="sc-panel"><div class="sc-pt">运行工况评估<span class="en">EVALUATION</span></div><div ref="evalc" class="sc-chart"></div></div>
    <div class="sc-panel"><div class="sc-pt">历史工况占比<span class="en">RATIO</span></div><div ref="ratio" class="sc-chart"></div></div>
    <div class="sc-panel">
      <div class="sc-pt">过程指标<span class="en">PROCESS</span></div>
      <div class="sc-pad" style="display:flex;flex-direction:column;gap:2px">
        <div ref="feed" class="sc-chart"></div><div ref="ca" class="sc-chart"></div><div ref="temp" class="sc-chart"></div>
      </div>
    </div>
    <div class="sc-panel"><div class="sc-pt">报警信息<span class="en">ALARM</span></div>
      <div class="sc-scroll"><table class="sc-table"><thead><tr><th>DateTime</th><th>异常位置</th><th>异常详情</th><th>等级</th></tr></thead>
      <tbody><tr v-for="(r,i) in logs" :key="i"><td>{{r.t}}</td><td>{{r.pos}}</td><td>{{r.info}}</td><td :class="r.cls"><span class="dot"></span>{{r.lv}}</td></tr></tbody></table></div>
    </div>
    <div class="sc-panel">
      <div class="sc-pt">能耗指标<span class="en">ENERGY</span></div>
      <div class="sc-pad" style="display:flex;flex-direction:column;gap:2px">
        <div ref="coal" class="sc-chart"></div><div ref="sys" class="sc-chart"></div><div ref="total" class="sc-chart"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref,onMounted,onUnmounted } from 'vue'
import * as echarts from 'echarts'
const hist=ref(),evalc=ref(),ratio=ref(),feed=ref(),ca=ref(),temp=ref(),coal=ref(),sys=ref(),total=ref()
const charts=[],TX='#9fc6e8',GRID='rgba(47,134,184,.18)'
const logs=[
  {t:'03-18 09:42:07',pos:'工况稳定',info:'工况稳定在限区间内',lv:'正常',cls:'lv-normal'},
  {t:'03-18 09:41:57',pos:'工况稳定',info:'工况稳定在限区间内',lv:'正常',cls:'lv-normal'},
  {t:'03-18 09:41:13',pos:'工况稳定',info:'工况稳定在限区间内',lv:'正常',cls:'lv-normal'},
  {t:'03-18 09:41:12',pos:'工况稳定',info:'工况稳定在限区间内',lv:'正常',cls:'lv-normal'}
]
const tms=['03-18 08:00','08:35','09:10','09:42']
const mini=(name,data,color,marks)=>({title:{text:name,left:6,top:1,textStyle:{color:TX,fontSize:10,fontWeight:'normal'}},grid:{left:38,right:8,top:20,bottom:16},xAxis:{type:'category',data:tms,axisLabel:{color:TX,fontSize:8},axisLine:{lineStyle:{color:'#2f6f9e'}}},yAxis:{type:'value',scale:true,axisLabel:{color:TX,fontSize:8},splitLine:{lineStyle:{color:GRID}}},series:[{type:'line',smooth:true,symbol:'none',data,lineStyle:{color:color||'#4dabf7',width:1.5},...(marks?{markLine:{silent:true,symbol:'none',lineStyle:{color:'#ff5b5b',type:'dashed'},label:{show:false},data:marks.map(v=>({yAxis:v}))}}:{})}]})
onMounted(()=>{
  const mk=(el,o)=>{const c=echarts.init(el);c.setOption(o);charts.push(c)}
  mk(hist.value,{grid:{left:40,right:10,top:12,bottom:22},xAxis:{type:'category',data:['优工况','良工况','中工况','差工况'],axisLabel:{color:TX,fontSize:9},axisLine:{lineStyle:{color:'#2f6f9e'}}},yAxis:{type:'value',axisLabel:{color:TX,fontSize:9},splitLine:{lineStyle:{color:GRID}}},series:[{type:'bar',data:[49500,12800,0,7800],barWidth:20,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#4dabf7'},{offset:1,color:'#16456e'}]),borderRadius:[3,3,0,0]}}]})
  mk(evalc.value,{...mini('运行工况评估（综合得分）',[91,90,88,89,86,85,88,87],'#4dabf7'),yAxis:{type:'value',min:60,max:95,axisLabel:{color:TX,fontSize:9},splitLine:{lineStyle:{color:GRID}}},series:[{type:'line',smooth:true,symbol:'none',data:[91,90,88,89,86,85,88,87],lineStyle:{color:'#4dabf7',width:2},markLine:{silent:true,symbol:'none',data:[{yAxis:90,lineStyle:{color:'#43e0a0'}},{yAxis:80,lineStyle:{color:'#ffb648'}},{yAxis:70,lineStyle:{color:'#ff5b5b'}}],label:{color:TX,fontSize:9}}}]})
  mk(ratio.value,{series:[{type:'pie',radius:'65%',label:{color:TX,fontSize:10,formatter:'{b}: {d}%'},data:[{value:70,name:'优工况',itemStyle:{color:'#e8c86a'}},{value:18,name:'良工况',itemStyle:{color:'#5fd0ff'}},{value:12,name:'差工况',itemStyle:{color:'#8f7fd8'}}]}]})
  mk(feed.value,mini('喂料量反馈',[410,405,398,402],'#4dabf7'))
  mk(ca.value,mini('游离钙化验值',[1.2,1.4,1.1,1.5],'#43e0a0'))
  mk(temp.value,mini('关键温度参数',[1100,1120,1150,1130],'#ff9f43'))
  mk(coal.value,mini('喂煤量反馈',[14.2,13.8,14.5,14.0],'#ff9f43'))
  mk(sys.value,mini('窑系统能耗',[13.2,12.8,13.6,13.0],'#7c9bff'))
  mk(total.value,mini('综合能耗',[26.1,25.5,26.8,26.0],'#43e0a0'))
  window.addEventListener('resize',rh)
})
const rh=()=>charts.forEach(c=>c.resize())
onUnmounted(()=>{window.removeEventListener('resize',rh);charts.forEach(c=>c.dispose())})
</script>
<style scoped>
.ev-grid{grid-template-columns:1fr 1.6fr 1fr;grid-template-rows:1fr 1fr}
@media(max-width:1100px){.ev-grid{grid-template-columns:1fr 1fr}}
</style>
