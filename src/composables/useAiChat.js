import { ref, nextTick } from 'vue'

// 系统知识：面向企业使用者的专业问答，依据系统功能与业务规则作答
export const SYSTEM_PROMPT = `你是"水泥窑线异常检测与故障预警系统"的智能助手，面向工厂运行、工艺、设备与管理人员，解答系统功能、预警规则、异常检测方法与关键变量含义等问题。

【回答准则】
- 用简洁、专业的中文作答，像有经验的同事在回答，不要客套、不要反复声明边界。
- 依据下方系统知识给出确定答复；系统已具备的功能直接说明，不模棱两可地推脱。
- 当问题涉及"系统如何帮助生产决策、如何沉淀经验、数据到处置如何闭环"时，结合下方【平台价值】作答，说明数据、模型与业务应用的衔接关系，体现从异常发现到处置改进的完整链路。
- 涉及现场阈值、具体故障成因等系统未固化的内容，说明应以现场工艺规程、标定值及工艺人员判断为准，不臆造数值与因果结论。
- 系统职责是异常发现、分级预警与处置闭环；成因诊断属工艺范畴，按此边界简要说明即可。
- 排版克制：一般控制在 250 字内，复杂问题不超过 400 字。用短段落说明，必要时列 3～5 条要点；标题或关键词可加粗，但不要整段整句加粗。列表用 "- " 开头，不要使用 Markdown 标题符（#）或表格。

【系统定位】水泥窑线智能管控平台，以异常检测与分级预警为核心，贯通工况监视、异常识别、预警管理与处置闭环，支撑运行人员从"发现异常"到"辅助决策"的完整链路。

【平台价值】以数据为底座、以模型为手段、以生产决策为目标：多源工况数据统一汇聚形成可信数据底座；多元统计与过渡识别模型持续监视工况、前置预警风险；预警与处置记录沉淀为可追溯的工艺经验，帮助新人快速熟悉异常特征、帮助管理人员评估处置效果，实现经验可传、决策有据。

【功能模块】
1. 工况总览（/）：当前工况、活跃预警数、监测测点数、数据更新时间；窑尾温度趋势、预警等级分布与最新预警列表。
2. 预警大屏（/screen）：面向调度大屏的可视化展示。
3. 异常检测（/detection）：采用多元统计过程监控，统计量为 T²、eT²、S²、eS²；过渡工况识别采用 SW-KIWS 滑窗 ADF。关键变量覆盖分解炉出口温度、窑尾烟室温度/负压/O₂、窑主电机电流、篦下压力与压损、f-CaO、吨熟料煤耗、吨熟料电耗、NOx 排放。
4. 预警列表（/warnings）：字段含预警编号、设备/工艺段、等级、触发时间、触发条件/依据、状态；支持检索、等级与状态筛选、详情查看。等级为正常、提示、一般预警、严重预警、紧急报警；状态为待确认、已确认、处理中、已关闭。
5. 处置记录（/records）：记录预警编号、关联预警、确认人、处理状态、处理时间与处置备注，支持登记与查询，形成预警处置闭环。

【关键变量参考】f-CaO ≤1.5%、吨熟料煤耗 ≤100 kgce/t、吨熟料电耗 ≤26 kWh/t 为过渡判定参考值；其余变量阈值按现场工艺规程标定。
【统计量含义】T²：稳态空间大范围漂移；eT²：残差空间静态相关性破坏；S²：动态变化速度异常；eS²：残差局部抖动。

【措辞要求】不要自称"原型""演示系统"，不要出现"老师""答辩""课程设计"等字样。回答工艺类问题时，可给出该场景通常关注的相关因素作为参考，并明确最终判断以现场工艺人员为准。`

export const QUICK_QUESTIONS = [
  '这个系统能做什么？',
  '数据到处置是怎么闭环的？',
  '预警等级怎么划分？',
  '异常检测用的什么方法？',
  '系统怎么帮新人积累经验？'
]

// 先做 HTML 转义再解析极简 Markdown，避免把模型输出当 HTML 注入
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch])
}

export function renderMarkdown(text) {
  if (!text) return ''
  const lines = escapeHtml(text).split('\n')
  let html = ''
  let inList = false
  const closeList = () => {
    if (inList) { html += '</ul>'; inList = false }
  }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { closeList(); continue }
    const inline = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    if (/^[-*]\s+/.test(line)) {
      if (!inList) { html += '<ul>'; inList = true }
      html += '<li>' + inline.replace(/^[-*]\s+/, '') + '</li>'
    } else {
      closeList()
      html += '<p>' + inline + '</p>'
    }
  }
  closeList()
  return html
}

const API_URL = 'https://api.siliconflow.cn/v1/chat/completions'
const MODEL = 'deepseek-ai/DeepSeek-V4.1-Flash'
const API_KEY = import.meta.env.VITE_AI_API_KEY || ''
const TIMEOUT_MS = 90000

export function useAiChat() {
  const messages = ref([])
  const loading = ref(false)
  const streaming = ref(false)
  const input = ref('')
  const bodyRef = ref(null)
  let seq = 0
  let controller = null

  const scrollToBottom = async () => {
    await nextTick()
    if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
  }

  async function send(preset) {
    const text = (preset || input.value).trim()
    if (!text || loading.value) return
    input.value = ''
    messages.value.push({ id: ++seq, role: 'user', content: text })

    const replyId = ++seq
    messages.value.push({ id: replyId, role: 'assistant', content: '' })
    loading.value = true
    streaming.value = true
    controller = new AbortController()
    const timer = setTimeout(() => controller && controller.abort(), TIMEOUT_MS)
    await scrollToBottom()

    const setReply = (content) => {
      const idx = messages.value.findIndex(m => m.id === replyId)
      if (idx >= 0) messages.value[idx].content = content
    }

    try {
      const history = messages.value
        .filter(m => m.role !== 'assistant' || m.id !== replyId)
        .slice(0, -1)
        .map(m => ({ role: m.role, content: m.content }))

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: text }
          ],
          max_tokens: 900,
          temperature: 0.5,
          stream: true
        }),
        signal: controller.signal
      })

      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} ${detail.slice(0, 120)}`)
      }

      let full = ''
      if (res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split('\n')
          buffer = parts.pop() || ''
          for (const part of parts) {
            const line = part.trim()
            if (!line.startsWith('data:')) continue
            const payload = line.slice(5).trim()
            if (!payload || payload === '[DONE]') continue
            try {
              const data = JSON.parse(payload)
              const delta = data?.choices?.[0]?.delta?.content
              if (delta) {
                full += delta
                setReply(full)
                await scrollToBottom()
              }
            } catch (e) {
              // 分片可能不完整，忽略后继续读下一片
            }
          }
        }
      } else {
        const data = await res.json()
        full = data?.choices?.[0]?.message?.content || ''
      }

      if (!full) setReply('（模型未返回内容，请重试）')
    } catch (e) {
      const reason = e.name === 'AbortError' ? '请求超时' : e.message
      setReply(`调用失败：${reason}。请确认网络畅通、API Key 有效且额度充足。`)
    } finally {
      clearTimeout(timer)
      controller = null
      loading.value = false
      streaming.value = false
      await scrollToBottom()
    }
  }

  function clear() {
    if (controller) controller.abort()
    messages.value = []
    input.value = ''
  }

  return { messages, loading, streaming, input, bodyRef, send, clear }
}
