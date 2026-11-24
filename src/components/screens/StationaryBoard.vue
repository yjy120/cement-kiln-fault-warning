<template>
  <div class="sc-grid st-grid">
    <div class="sc-panel">
      <div class="sc-pt">稳态监测指标<span class="en">STATIONARY</span></div>
      <div class="sc-pad" style="display:flex;flex-direction:column;gap:4px">
        <div ref="t2" class="sc-chart"></div><div ref="te2" class="sc-chart"></div>
      </div>
    </div>
    <div class="sc-panel"><div class="sc-pt">超限统计（过去三天）<span class="en">OVERLIMIT</span></div><div ref="over" class="sc-chart"></div></div>
    <div class="sc-panel"><div class="sc-pt">异常占比<span class="en">RATIO</span></div>
      <div class="ratio-grid"><div ref="r1" class="rc"></div><div ref="r2" class="rc"></div><div ref="r3" class="rc"></div><div ref="r4" class="rc"></div></div>
    </div>
    <div class="sc-panel">
      <div class="sc-pt">动态监测指标<span class="en">DYNAMIC</span></div>
      <div class="sc-pad" style="display:flex;flex-direction:column;gap:4px">
        <div ref="s2" class="sc-chart"></div><div ref="se2" class="sc-chart"></div>
      </div>
    </div>
    <div class="sc-panel panel-alarm">
      <div class="sc-pt">报警信息<span class="en">ALARM</span></div>
      <div class="sc-scroll"><table class="sc-table">
        <thead><tr><th>DateTime</th><th>异常位置</th><th>异常详情</th><th>等级</th></tr></thead>
        <tbody><tr v-for="(r,i) in logs" :key="i"><td>{{r.t}}</td><td>{{r.pos}}</td><td>{{r.info}}</td><td :class="r.cls"><span class="dot"></span>{{r.lv}}</td></tr></tbody>
      </table></div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
const t2=ref(),te2=ref(),over=ref(),r1=ref(),r2=ref(),r3=ref(),r4=ref(),s2=ref(),se2=ref()
const charts=[],TX='#9fc6e8',GRID='rgba(47,134,184,.18)'
const logs=[
  {t:'03-18 09:18:17',pos:'S2统计量',info:'S2统计量超限，工况波动异常',lv:'严重',cls:'lv-critical'},
  {t:'03-18 09:16:46',pos:'S2统计量,Se2统计量',info:'统计量超限，工况点漂移',lv:'一般',cls:'lv-general'},
  {t:'03-18 09:14:57',pos:'S2统计量,Se2统计量',info:'统计量超限，原料波动可致',lv:'一般',cls:'lv-general'},
  {t:'03-18 09:14:26',pos:'S2统计量',info:'统计量超限，工况波动异常',lv:'提示',cls:'lv-tip'}
]
const tms=['03-18 09:05','09:07','09:09','09:11','09:13','09:15','09:17']
const line=(name,data,th)=>({title:{text:name,left:8,top:2,textStyle:{color:TX,fontSize:11,fontWeight:'normal'}},grid:{left:42,right:12,top:26,bottom:20},xAxis:{type:'category',data:tms,axisLabel:{color:TX,fontSize:8},axisLine:{lineStyle:{color:'#2f6f9e'}}},yAxis:{type:'value',axisLabel:{color:TX,fontSize:9},splitLine:{lineStyle:{color:GRID}}},series:[{type:'line',smooth:true,symbol:'none',data,lineStyle:{color:'#4dabf7',width:1.8},areaStyle:{color:'rgba(77,171,247,.18)'},markLine:{silent:true,symbol:'none',lineStyle:{color:'#ff5b5b',type:'dashed'},label:{color:'#ff8a8a',fontSize:9},data:[{yAxis:th}]}}]})
onMounted(()=>{
  const mk=(el,o)=>{const c=echarts.init(el);c.setOption(o);charts.push(c)}
  mk(t2.value,line('T2统计量（工况稳态指标）',[110,130,150,140,165,158,172],170))
  mk(te2.value,line('Te2统计量（工况残差指标）',[55,70,62,85,74,92,80],90))
  mk(s2.value,line('S2统计量（工况动态指标）',[300,420,360,540,410,480,620],600))
  mk(se2.value,line('Se2统计量（动态残差指标）',[12,18,15,24,19,28,22],26))
  mk(over.value,{grid:{left:40,right:12,top:14,bottom:24},xAxis:{type:'category',data:['T2超限','Te2超限','S2超限','Se2超限','综合超限'],axisLabel:{color:TX,fontSize:9},axisLine:{lineStyle:{color:'#2f6f9e'}}},yAxis:{type:'value',axisLabel:{color:TX,fontSize:9},splitLine:{lineStyle:{color:GRID}}},series:[{type:'bar',data:[12,8,15,6,10],barWidth:16,itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#4dabf7'},{offset:1,color:'#1d4e6b'}]),borderRadius:[3,3,0,0]}}]})
  const pie=(name,v)=>({title:{text:name,left:'center',top:0,textStyle:{color:TX,fontSize:11,fontWeight:'normal'}},series:[{type:'pie',radius:'62%',center:['50%','58%'],label:{show:false},data:[{value:v,name:'异常',itemStyle:{color:'#7ee0b8'}},{value:100-v,name:'正常',itemStyle:{color:'#1c4a6e'}}]}]})
  mk(r1.value,pie('T2异常占比',18));mk(r2.value,pie('Te2异常占比',12));mk(r3.value,pie('S2异常占比',24));mk(r4.value,pie('Se2异常占比',9))
  window.addEventListener('resize',rh)
})
const rh=()=>charts.forEach(c=>c.resize())
onUnmounted(()=>{window.removeEventListener('resize',rh);charts.forEach(c=>c.dispose())})
</script>
<style scoped>
.st-grid{grid-template-columns:1.15fr 1fr 1fr;grid-template-rows:1fr 1fr}
.st-grid>.sc-panel:nth-child(1){grid-row:span 2}
.panel-alarm{grid-column:span 2}
.ratio-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;flex:1;min-height:0;gap:2px}
.rc{min-height:0}
@media(max-width:1100px){.st-grid{grid-template-columns:1fr 1fr}.st-grid>.sc-panel:nth-child(1){grid-row:span 1}.panel-alarm{grid-column:span 2}}
</style>
