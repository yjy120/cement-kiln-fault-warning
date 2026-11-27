<template>
  <div class="page ai-page">
    <!-- 页头 -->
    <div class="ai-hero">
      <div class="ai-hero-main">
        <div class="ai-hero-icon">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0-6 6c0 2.2 1.2 4.1 3 5.2V17a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.8A6 6 0 0 0 18 9a6 6 0 0 0-6-6Z" />
            <path d="M9 21h6" />
            <circle cx="9.5" cy="9" r=".9" fill="currentColor" stroke="none" />
            <circle cx="14.5" cy="9" r=".9" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <div>
          <div class="ai-hero-kicker">INTELLIGENT ASSISTANT · 智能问答</div>
          <h1 class="ai-hero-title">窑线智能助手</h1>
          <p class="ai-hero-desc">基于本系统功能与预警规则，回答关于工况、预警、异常检测与处置流程的问题</p>
        </div>
      </div>
      <div class="ai-hero-meta">
        <div class="ai-meta-item"><span class="ai-meta-label">模型</span><span class="ai-meta-value">DeepSeek-V4.1-Flash</span></div>
        <div class="ai-meta-item"><span class="ai-meta-label">状态</span><span class="ai-meta-value ok">在线</span></div>
        <div class="ai-meta-item"><span class="ai-meta-label">知识范围</span><span class="ai-meta-value">本系统</span></div>
      </div>
    </div>

    <!-- 三栏主体 -->
    <div class="ai-workspace">
      <!-- 左栏：能力导航 -->
      <aside class="ai-side">
        <div class="side-block">
          <div class="side-title">能力导览</div>
          <button
            v-for="c in capabilities"
            :key="c.label"
            class="cap-item"
            :class="{ active: activeCap === c.label }"
            @click="activeCap = c.label"
          >
            <span class="cap-icon" v-text="c.icon"></span>
            <span class="cap-text">
              <span class="cap-name">{{ c.label }}</span>
              <span class="cap-desc">{{ c.desc }}</span>
            </span>
          </button>
        </div>

        <div class="side-block">
          <div class="side-title">推荐提问</div>
          <div class="side-questions">
            <button v-for="q in currentQuestions" :key="q" class="side-q" @click="send(q)">
              <span class="side-q-mark">›</span>{{ q }}
            </button>
          </div>
        </div>

        <div class="side-tip">
          <span class="side-tip-dot"></span>
          回答依据系统功能与预警规则生成，工艺判断以现场规程为准
        </div>
      </aside>

      <!-- 中栏：对话区 -->
      <section class="ai-chat">
        <div class="chat-head">
          <div class="chat-head-left">
            <span class="chat-title">对话</span>
            <span class="chat-sub">{{ messages.length ? messages.filter(m => m.role === 'user').length + ' 个问题' : '开始提问' }}</span>
          </div>
          <button class="chat-clear" @click="clear" :disabled="!messages.length">清空对话</button>
        </div>

        <div class="chat-body" ref="bodyRef">
          <div class="chat-empty" v-if="!messages.length && !streaming">
            <div class="chat-empty-icon">
              <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a6 6 0 0 0-6 6c0 2.2 1.2 4.1 3 5.2V17a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.8A6 6 0 0 0 18 9a6 6 0 0 0-6-6Z" />
                <path d="M9 21h6" />
                <circle cx="9.5" cy="9" r="1" fill="currentColor" stroke="none" />
                <circle cx="14.5" cy="9" r="1" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div class="chat-empty-title">有什么可以帮你？</div>
            <div class="chat-empty-desc">从左侧选一个问题，或在下方输入你想了解的</div>
            <div class="chat-empty-chips">
              <button v-for="q in QUICK_QUESTIONS.slice(0, 3)" :key="q" class="chip" @click="send(q)">{{ q }}</button>
            </div>
          </div>

          <div v-for="m in messages" :key="m.id" class="msg" :class="m.role === 'user' ? 'msg-user' : 'msg-ai'">
            <div class="msg-avatar" v-if="m.role === 'assistant'">窑</div>
            <div class="msg-content">
              <div class="msg-role">{{ m.role === 'user' ? '我' : '智能助手' }}</div>
              <div class="msg-bubble md-body" v-html="bubbleHtml(m)"></div>
            </div>
          </div>
        </div>

        <div class="chat-input-wrap">
          <div class="chat-input-box">
            <textarea
              v-model="input"
              class="chat-input"
              rows="2"
              placeholder="输入你想问的问题，Enter 发送，Shift + Enter 换行…"
              @keydown.enter.exact.prevent="send()"
            ></textarea>
            <button class="chat-send" :disabled="loading || !input.trim()" @click="send()">
              <span>发送</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </div>
          <div class="chat-input-note">回答依据系统规则生成 · 工艺判断以现场规程为准</div>
        </div>
      </section>

      <!-- 右栏：系统信息 -->
      <aside class="ai-info">
        <div class="info-block">
          <div class="info-title">本系统概览</div>
          <div class="info-stat">
            <div class="info-stat-item"><div class="info-stat-num">5</div><div class="info-stat-label">功能模块</div></div>
            <div class="info-stat-item"><div class="info-stat-num warn">5</div><div class="info-stat-label">预警等级</div></div>
          </div>
          <div class="info-line"><span>检测方法</span><b>多元统计过程监控</b></div>
          <div class="info-line"><span>统计量</span><b>T² · eT² · S² · eS²</b></div>
          <div class="info-line"><span>过渡识别</span><b>SW-KIWS 滑窗 ADF</b></div>
          <div class="info-line"><span>数据来源</span><b>窑线过程监测数据</b></div>
        </div>

        <div class="info-block">
          <div class="info-title">预警等级</div>
          <div class="level-list">
            <div v-for="l in levels" :key="l.name" class="level-row">
              <span class="level-dot" :style="{ background: l.color, boxShadow: '0 0 8px ' + l.color }"></span>
              <span class="level-name">{{ l.name }}</span>
              <span class="level-tag">{{ l.tag }}</span>
            </div>
          </div>
        </div>

        <div class="info-block">
          <div class="info-title">使用说明</div>
          <ul class="info-list">
            <li>可问系统功能、页面字段、预警等级、状态流转</li>
            <li>可问关键变量与统计量含义</li>
            <li>系统负责异常发现与分级预警，成因由工艺人员结合工况判断</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAiChat, QUICK_QUESTIONS, renderMarkdown } from '../composables/useAiChat'

const { messages, streaming, input, bodyRef, send, clear } = useAiChat()

function bubbleHtml(m) {
  const html = renderMarkdown(m.content)
  const isLast = m.id === messages.value[messages.value.length - 1]?.id
  return html + (streaming.value && isLast ? '<span class="stream-cursor"></span>' : '')
}

const capabilities = [
  { icon: '◎', label: '系统功能', desc: '五大模块与页面字段', questions: ['这个系统能做什么？', '预警列表有哪些字段？', '处置记录怎么登记？'] },
  { icon: '◆', label: '预警规则', desc: '等级划分与状态流转', questions: ['预警等级怎么划分？', '预警状态有哪些？', '待确认到已关闭的流程'] },
  { icon: '⌁', label: '异常检测', desc: '统计量与关键变量', questions: ['异常检测用的什么方法？', 'T² 和 eT² 是什么意思？', '有哪些关键变量？'] },
  { icon: '◇', label: '工况判断', desc: '变量异常的一般含义', questions: ['窑尾温度高说明什么？', '篦下压力波动怎么看？', 'f-CaO 参考范围是多少？'] }
]

const activeCap = ref('系统功能')
const currentQuestions = computed(() => capabilities.find(c => c.label === activeCap.value)?.questions || QUICK_QUESTIONS)

const levels = [
  { name: '正常', tag: '未触发', color: '#43e0a0' },
  { name: '提示', tag: '轻微', color: '#7fd4ff' },
  { name: '一般预警', tag: '关注', color: '#ffc94d' },
  { name: '严重预警', tag: '处理', color: '#ff8a4d' },
  { name: '紧急报警', tag: '紧急', color: '#ff5c5c' }
]
</script>

<style scoped>
.ai-page { gap: 24px; height: calc(100vh - 76px - 34px - 48px); min-height: 720px; }

/* 页头 */
.ai-hero {
  display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
  background: linear-gradient(120deg, rgba(18, 64, 104, .75), rgba(8, 28, 50, .5));
  border: 1px solid var(--line);
  padding: 20px 26px;
  clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
}
.ai-hero-main { display: flex; align-items: center; gap: 16px; }
.ai-hero-icon {
  width: 72px; height: 72px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: var(--accent);
  border: 1px solid rgba(58, 208, 255, .5);
  background: rgba(58, 208, 255, .08);
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
}
.ai-hero-kicker { font-size: 14px; letter-spacing: 1.5px; color: #6aa8d6; }
.ai-hero-title { font-size: 34px; color: var(--title); letter-spacing: 2px; line-height: 1.4; margin: 2px 0 3px; }
.ai-hero-desc { font-size: 17px; color: #8fb8d9; }
.ai-hero-meta { display: flex; gap: 24px; }
.ai-meta-item { display: flex; flex-direction: column; gap: 2px; }
.ai-meta-label { font-size: 15px; color: #6aa8d6; }
.ai-meta-value { font-size: 18px; color: #cfe6ff; }
.ai-meta-value.ok { color: var(--ok); }

/* 三栏 */
.ai-workspace {
  flex: 1; min-height: 0;
  display: grid; grid-template-columns: 288px minmax(0, 1fr) 300px; gap: 22px;
}

.ai-side, .ai-info { display: flex; flex-direction: column; gap: 16px; min-height: 0; overflow-y: auto; }
.ai-side::-webkit-scrollbar, .ai-info::-webkit-scrollbar, .chat-body::-webkit-scrollbar { width: 5px; }
.ai-side::-webkit-scrollbar-thumb, .ai-info::-webkit-scrollbar-thumb, .chat-body::-webkit-scrollbar-thumb { background: rgba(58, 208, 255, .28); border-radius: 3px; }

.side-block, .info-block {
  background: linear-gradient(160deg, var(--panel-a), var(--panel-b));
  border: 1px solid var(--line); padding: 14px;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
}
.side-title, .info-title {
  font-size: 14px; color: var(--title); letter-spacing: 1px;
  padding-bottom: 9px; margin-bottom: 10px; border-bottom: 1px solid var(--line-soft);
}
.side-title::before, .info-title::before {
  content: ""; display: inline-block; width: 4px; height: 14px; margin-right: 9px;
  background: var(--accent); vertical-align: -1px;
}

.cap-item {
  width: 100%; display: flex; align-items: center; gap: 10px; text-align: left;
  background: transparent; border: 1px solid transparent; border-radius: 3px;
  padding: 11px 11px; margin-bottom: 6px; cursor: pointer; color: var(--text);
}
.cap-item:hover { background: rgba(58, 208, 255, .07); }
.cap-item.active { background: rgba(58, 208, 255, .12); border-color: rgba(58, 208, 255, .4); }
.cap-icon {
  width: 42px; height: 42px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  color: var(--accent); background: rgba(58, 208, 255, .1); border: 1px solid rgba(58, 208, 255, .3); font-size: 17px;
}
.cap-text { display: flex; flex-direction: column; }
.cap-name { font-size: 15px; color: #dff1ff; }
.cap-desc { font-size: 15px; color: #6aa8d6; }

.side-questions { display: flex; flex-direction: column; gap: 5px; }
.side-q {
  text-align: left; background: transparent; border: none; border-left: 2px solid rgba(58, 208, 255, .35);
  padding: 10px 10px 10px 14px; color: #b4d4ec; font-size: 17px; cursor: pointer; line-height: 1.55;
}
.side-q:hover { color: #fff; border-left-color: var(--accent); background: rgba(58, 208, 255, .07); }
.side-q-mark { color: var(--accent); margin-right: 5px; }

.side-tip {
  font-size: 15px; color: #8fb8d9; line-height: 1.7; padding: 14px 16px;
  border: 1px solid rgba(255, 201, 77, .35); background: rgba(255, 201, 77, .07);
}
.side-tip-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--warn); margin-right: 6px; }

/* 中间对话区 */
.ai-chat {
  min-height: 0; display: flex; flex-direction: column;
  background: linear-gradient(160deg, rgba(13, 44, 74, .85), rgba(7, 26, 46, .88));
  border: 1px solid var(--line);
  clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
  box-shadow: inset 0 0 30px rgba(20, 80, 130, .18);
}
.chat-head {
  height: 64px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
  padding: 0 18px; border-bottom: 1px solid var(--line-soft);
}
.chat-head-left { display: flex; align-items: baseline; gap: 10px; }
.chat-title { font-size: 20px; color: var(--title); letter-spacing: 1px; }
.chat-sub { font-size: 16px; color: #6aa8d6; }
.chat-clear { background: none; border: 1px solid var(--line-soft); color: #8fb8d9; padding: 8px 14px; font-size: 15px; cursor: pointer; }
.chat-clear:hover:not(:disabled) { color: #fff; border-color: var(--accent); }
.chat-clear:disabled { opacity: .4; cursor: not-allowed; }

.chat-body { flex: 1; min-height: 0; overflow-y: auto; padding: 30px 34px; display: flex; flex-direction: column; gap: 28px; }

.chat-empty { margin: auto; text-align: center; color: #8fb8d9; }
.chat-empty-icon { color: rgba(58, 208, 255, .5); margin-bottom: 10px; }
.chat-empty-title { font-size: 28px; color: var(--title); letter-spacing: 1px; }
.chat-empty-desc { font-size: 17px; margin-top: 6px; }
.chat-empty-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 18px; }
.chip {
  border: 1px solid rgba(58, 208, 255, .4); color: #9fd8ff; background: rgba(14, 52, 84, .55);
  padding: 12px 20px; font-size: 17px; cursor: pointer; border-radius: 20px;
}
.chip:hover { background: rgba(58, 208, 255, .18); color: #fff; }

.msg { display: flex; gap: 16px; max-width: 92%; }
.msg-user { align-self: flex-end; flex-direction: row-reverse; }
.msg-avatar {
  width: 44px; height: 44px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(58, 208, 255, .14); border: 1px solid rgba(58, 208, 255, .45);
  color: var(--accent); font-size: 16px; font-family: serif;
}
.msg-content { min-width: 0; }
.msg-role { font-size: 16px; color: #6aa8d6; margin-bottom: 5px; }
.msg-user .msg-role { text-align: right; }
.msg-bubble {
  padding: 18px 22px; font-size: 19px; line-height: 1.8; word-break: break-word;
}
.msg-ai .msg-bubble { background: rgba(13, 44, 74, .8); border: 1px solid var(--line-soft); border-left: 2px solid var(--accent); color: var(--text); }
.msg-user .msg-bubble { background: #12456e; border: 1px solid rgba(58, 208, 255, .4); color: #eaf8ff; }
@keyframes blink { 0%, 60%, 100% { opacity: .3; } 30% { opacity: 1; } }

.chat-input-wrap { flex-shrink: 0; padding: 16px 22px 18px; border-top: 1px solid var(--line-soft); }
.chat-input-box {
  display: flex; gap: 10px; align-items: flex-end;
  border: 1px solid var(--line); background: rgba(7, 26, 46, .7); padding: 8px;
}
.chat-input-box:focus-within { border-color: var(--accent); box-shadow: 0 0 12px rgba(58, 208, 255, .22); }
.chat-input {
  flex: 1; resize: none; border: none; background: transparent; color: var(--text);
  font-family: inherit; font-size: 18px; line-height: 1.7; padding: 4px 5px;
}
.chat-input:focus { outline: none; }
.chat-input::placeholder { color: #557a99; }
.chat-send {
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  background: linear-gradient(180deg, #7ce4ff, #35b8e8); color: #04121f;
  border: 1px solid #aef0ff; padding: 8px 16px; font-size: 15px; cursor: pointer;
}
.chat-send:disabled { opacity: .4; cursor: not-allowed; }
.chat-input-note { font-size: 15px; color: #557a99; margin-top: 7px; text-align: center; }

/* 右栏信息 */
.info-stat { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.info-stat-item { background: rgba(58, 208, 255, .07); border: 1px solid var(--line-soft); padding: 12px; text-align: center; }
.info-stat-num { font-size: 34px; color: var(--accent); font-family: var(--num); line-height: 1.2; }
.info-stat-num.warn { color: var(--warn); }
.info-stat-label { font-size: 16px; color: #6aa8d6; }
.info-line { display: flex; flex-direction: column; gap: 1px; padding: 6px 0; border-bottom: 1px dashed var(--line-soft); }
.info-line span { font-size: 16px; color: #6aa8d6; }
.info-line b { font-size: 18px; color: #cfe6ff; font-weight: 400; }
.info-line b.warn-text { color: var(--warn); }

.level-list { display: flex; flex-direction: column; gap: 7px; }
.level-row { display: flex; align-items: center; gap: 10px; }
.level-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.level-name { font-size: 17px; color: #cfe6ff; flex: 1; }
.level-tag { font-size: 14px; color: #6aa8d6; }
.info-list { list-style: none; display: flex; flex-direction: column; gap: 7px; }
.info-list li { font-size: 16px; color: #9fc3e0; line-height: 1.55; padding-left: 12px; position: relative; }
.info-list li::before { content: "▪"; position: absolute; left: 0; color: var(--accent); }

@media (max-width: 1180px) {
  .ai-workspace { grid-template-columns: 240px minmax(0, 1fr); }
  .ai-info { display: none; }
}
@media (max-width: 860px) {
  .ai-page { height: auto; }
  .ai-workspace { grid-template-columns: 1fr; }
  .ai-side { flex-direction: row; flex-wrap: wrap; }
  .ai-side .side-block { flex: 1; min-width: 220px; }
  .ai-chat { height: 600px; }
  .ai-hero-meta { display: none; }
}

:deep(.md-body p) { margin: 0 0 8px; }
:deep(.md-body p:last-child) { margin-bottom: 0; }
:deep(.md-body ul) { margin: 0 0 8px; padding-left: 20px; }
:deep(.md-body li) { margin-bottom: 5px; }
:deep(.md-body strong) { color: #8fe8ff; font-weight: 600; }
:deep(.stream-cursor) { display: inline-block; width: 2px; height: 1em; margin-left: 3px; background: var(--accent); vertical-align: -2px; animation: blink 1s steps(1) infinite; }
</style>
