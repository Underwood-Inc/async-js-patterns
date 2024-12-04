<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useData } from 'vitepress';

const props = defineProps<{
  code: string;
  language?: string;
  tooltips?: Record<string, { description: string; type?: string }>;
}>();

const codeRef = ref<HTMLElement>();
const { isDark } = useData();

onMounted(() => {
  if (!codeRef.value || !props.tooltips) return;

  // Add tooltips to matching text
  Object.entries(props.tooltips).forEach(([term, info]) => {
    const text = codeRef.value!.innerHTML;
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})(?![^<]*>|[^<>]*</)`, 'g');

    codeRef.value!.innerHTML = text.replace(regex, (match) => {
      const tooltip = info.type
        ? `${info.type}\n\n${info.description}`
        : info.description;
      return `<span class="tooltip" data-tooltip="${tooltip}">${match}</span>`;
    });
  });
});
</script>

<template>
  <div class="code-preview" :class="{ 'theme-dark': isDark }">
    <div class="code-content">
      <pre><code ref="codeRef" :class="language">{{ decodeURIComponent(code) }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.code-preview {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-code-block-bg);
}

.code-content {
  padding: 1em;
  overflow-x: auto;
}

pre {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.5;
}

code {
  font-family: inherit;
}

:deep(.tooltip) {
  position: relative;
  border-bottom: 1px dashed var(--vp-c-brand);
  cursor: help;
}

:deep(.tooltip)::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 12px;
  white-space: pre-wrap;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s,
    visibility 0.2s;
  z-index: 100;
  pointer-events: none;
  max-width: 300px;
  text-align: left;
}

:deep(.tooltip):hover::before {
  opacity: 1;
  visibility: visible;
}

.theme-dark :deep(.tooltip)::before {
  background: var(--vp-c-bg-soft);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>
