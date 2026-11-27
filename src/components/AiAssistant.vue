<template>
  <div class="ai-assistant">
    <!-- 悬浮球 -->
    <button
      v-if="!open"
      class="ai-fab"
      @click="open = true"
      title="智能助手"
      aria-label="打开智能助手"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a6 6 0 0 0-6 6c0 2.2 1.2 4.1 3 5.2V17a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.8A6 6 0 0 0 18 9a6 6 0 0 0-6-6Z" />
        <path d="M9 21h6" />
        <circle cx="9.5" cy="9" r=".8" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="9" r=".8" fill="currentColor" stroke="none" />
      </svg>
      <span class="ai-fab-pulse"></span>
    </button>

    <!-- 对话窗 -->
    <div v-else class="ai-panel">
      <div class="ai-head">
        <div class="ai-head-left">
          <span class="ai-head-dot"></span>
          <div>
            <div class="ai-head-title">智能助手</div>
            <div class="ai-head-sub">水泥窑线异常检测与预警系统</div>
          </div>
        </div>
        <div class="ai-head-actions">
          <button class="ai-expand" @click="goFull" title="放大为独立页面">⤢</button>
          <button class="ai-close" @click="open = false" aria-label="关闭">×</button>
        </div>
      </div>

      <div class="ai-body" ref="bodyRef">
        <div class="ai-msg ai-msg-ai">
          <div class="ai-bubble">你好，我是窑线智能助手。可为你解答系统功能、预警等级与状态流转、异常检测方法、关键变量含义等问题。</div>
        </div>

        <div class="ai-quick" v-if="messages.length <= 1">
          <button v-for="q in QUICK_QUESTIONS" :key="q" class="ai-quick-btn" @click="send(q)">{{ q }}</button>
        </div>

        <div v-for="m in messages" :key="m.id" class="ai-msg" :class="m.role === 'user' ? 'ai-msg-user' : 'ai-msg-ai'">
          <div class="ai-bubble md-body" v-html="bubbleHtml(m)"></div>
        </div>
      </div>

      <div class="ai-foot">
        <textarea
          v-model="input"
          class="ai-input"
          rows="1"
          placeholder="输入你的问题…"
          @keydown.enter.exact.prevent="send()"
        ></textarea>
        <button class="ai-send" :disabled="streaming || !input.trim()" @click="send()" aria-label="发送">↗</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAiChat, QUICK_QUESTIONS, renderMarkdown } from '../composables/useAiChat'

const router = useRouter()
const { messages, streaming, input, bodyRef, send } = useAiChat()
const open = ref(false)

function bubbleHtml(m) {
  const html = renderMarkdown(m.content)
  const isLast = m.id === messages.value[messages.value.length - 1]?.id
  return html + (streaming.value && isLast ? '<span class="stream-cursor"></span>' : '')
}

function goFull() {
  open.value = false
  router.push('/assistant')
}
</script>

<style scoped>
.ai-assistant { position: relative; z-index: 50; }

.ai-fab {
  position: fixed; right: 26px; bottom: 26px;
  width: 62px; height: 62px; border-radius: 50%;
  background: linear-gradient(180deg, #7ce4ff, #35b8e8);
  color: #04121f; border: 1px solid #aef0ff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 0 18px rgba(58, 208, 255, .5);
  transition: transform .15s;
}
.ai-fab:hover { transform: translateY(-3px); }
.ai-fab-pulse {
  position: absolute; top: 2px; right: 3px;
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--ok); border: 2px solid #04121f;
}

.ai-panel {
  position: fixed; right: 26px; bottom: 26px;
  width: 480px; height: 640px; max-height: calc(100vh - 52px);
  display: flex; flex-direction: column;
  background: linear-gradient(160deg, rgba(13, 44, 74, .98), rgba(7, 26, 46, .98));
  border: 1px solid var(--line);
  box-shadow: 0 0 30px rgba(0, 0, 0, .5), inset 0 0 24px rgba(20, 80, 130, .2);
  clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
}

.ai-head {
  height: 62px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 14px 0 16px; border-bottom: 1px solid var(--line-soft);
}
.ai-head-left { display: flex; align-items: center; gap: 10px; }
.ai-head-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 8px rgba(67, 224, 160, .8); }
.ai-head-title { color: var(--title); font-size: 19px; letter-spacing: 1px; }
.ai-head-sub { color: #6aa8d6; font-size: 15px; }
.ai-head-actions { display: flex; align-items: center; gap: 10px; }
.ai-expand, .ai-close { background: none; border: none; color: #8fb8d9; cursor: pointer; line-height: 1; padding: 2px; }
.ai-expand { font-size: 18px; }
.ai-close { font-size: 22px; }
.ai-expand:hover, .ai-close:hover { color: #fff; }

.ai-body { flex: 1; overflow-y: auto; padding: 22px; display: flex; flex-direction: column; gap: 18px; }
.ai-body::-webkit-scrollbar { width: 5px; }
.ai-body::-webkit-scrollbar-thumb { background: rgba(58, 208, 255, .3); border-radius: 3px; }
.ai-msg { display: flex; }
.ai-msg-user { justify-content: flex-end; }
.ai-msg-ai { justify-content: flex-start; }
.ai-bubble {
  max-width: 92%; padding: 14px 18px; font-size: 17px; line-height: 1.75;
  word-break: break-word;
}
.ai-msg-user .ai-bubble { background: #12456e; color: #eaf8ff; border-radius: 10px 10px 2px 10px; }
.ai-msg-ai .ai-bubble { background: rgba(13, 44, 74, .85); color: var(--text); border-left: 2px solid var(--accent); border-radius: 2px 10px 10px 10px; }

.ai-quick { display: flex; flex-wrap: wrap; gap: 6px; margin: 2px 0 4px; }
.ai-quick-btn {
  border: 1px solid rgba(58, 208, 255, .4); color: #8fd0ff;
  background: rgba(14, 52, 84, .5); border-radius: 12px;
  padding: 8px 14px; font-size: 15px; cursor: pointer;
}
.ai-quick-btn:hover { background: rgba(58, 208, 255, .18); color: #fff; }

@keyframes blink { 0%, 60%, 100% { opacity: .3; } 30% { opacity: 1; } }

.ai-foot {
  flex-shrink: 0; padding: 10px 12px; border-top: 1px solid var(--line-soft);
  display: flex; gap: 8px; align-items: flex-end;
}
.ai-input {
  flex: 1; resize: none; max-height: 84px;
  border: 1px solid var(--line); background: rgba(7, 26, 46, .7);
  color: var(--text); font-family: inherit; font-size: 17px;
  padding: 8px 10px; border-radius: 4px; line-height: 1.5;
}
.ai-input::placeholder { color: #557a99; }
.ai-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 10px rgba(58, 208, 255, .3); }
.ai-send {
  width: 34px; height: 34px; flex-shrink: 0; border-radius: 50%;
  background: linear-gradient(180deg, #7ce4ff, #35b8e8);
  color: #04121f; border: none; font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.ai-send:disabled { opacity: .4; cursor: not-allowed; }

@media (max-width: 760px) {
  .ai-panel { right: 12px; bottom: 12px; width: calc(100vw - 24px); height: 70vh; }
  .ai-fab { right: 16px; bottom: 16px; }
}

:deep(.md-body p) { margin: 0 0 8px; }
:deep(.md-body p:last-child) { margin-bottom: 0; }
:deep(.md-body ul) { margin: 0 0 8px; padding-left: 20px; }
:deep(.md-body li) { margin-bottom: 5px; }
:deep(.md-body strong) { color: #8fe8ff; font-weight: 600; }
:deep(.stream-cursor) { display: inline-block; width: 2px; height: 1em; margin-left: 3px; background: var(--accent); vertical-align: -2px; animation: blink 1s steps(1) infinite; }
</style>
