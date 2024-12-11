<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useData } from 'vitepress';
import { parse } from '@typescript-eslint/typescript-estree';
import { parsers } from '../utils/parsers';

const props = defineProps<{
  code: string;
  language?: string;
  tooltips?: Record<string, { description: string; type?: string }>;
}>();

const codeRef = ref<HTMLElement>();
const { isDark } = useData();

onMounted(() => {
  if (!codeRef.value || !props.tooltips) return;

  // Parse the code to get the AST
  const ast = parse(props.code, {
    loc: true,
    range: true,
    tokens: true,
    comment: true,
    jsx: props.language === 'tsx' || props.language === 'jsx',
  });

  // Function to add tooltips to relevant nodes
  function addTooltips(node: any) {
    if (!node || !node.range) return;

    const { range } = node;
    const text = props.code.slice(range[0], range[1]);

    if (props.tooltips[text]) {
      const tooltip = props.tooltips[text].type
        ? `${props.tooltips[text].type}\n\n${props.tooltips[text].description}`
        : props.tooltips[text].description;

      // Calculate position relative to the node
      const position = {
        x: range[0],
        y: range[1],
      };

      // Add tooltip span with position data
      const tooltipSpan = `<span class="tooltip" 
        data-tooltip="${tooltip}" 
        data-tooltip-position="${JSON.stringify(position)}">${text}</span>`;

      codeRef.value!.innerHTML = codeRef.value!.innerHTML.replace(
        text,
        tooltipSpan
      );
    }
  }

  // Traverse the AST and add tooltips
  function traverse(node: any) {
    if (Array.isArray(node)) {
      node.forEach(traverse);
    } else if (node && typeof node === 'object') {
      addTooltips(node);
      Object.values(node).forEach(traverse);
    }
  }

  traverse(ast);
});

function getActiveParser() {
  const parser = parsers[props.language || ''];
  if (!parser) return '';

  switch (props.language) {
    case 'tsx':
    case 'jsx':
      return 'React + TS';
    case 'typescript':
      return 'TS';
    case 'css':
      return 'CSS';
    case 'scss':
      return 'SCSS';
    default:
      return props.language || '';
  }
}
</script>

<template>
  <div class="code-preview" :class="{ 'theme-dark': isDark }">
    <div class="code-content">
      <div class="code-meta">
        <span class="language-info">
          <span class="language-label">{{ language }}</span>
          <span v-if="getActiveParser()" class="parser-badge">
            <span class="parser-icon">ℹ️</span>
            <span class="parser-name">{{ getActiveParser() }}</span>
          </span>
        </span>
      </div>
      <pre><code ref="codeRef" :class="language">{{ decodeURIComponent(code) }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.code-meta {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85em;
  color: var(--vp-c-text-2);
}

.parser-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  font-size: 0.9em;
}

.parser-icon {
  font-size: 12px;
}

.parser-name {
  color: var(--vp-c-text-3);
}
</style>
