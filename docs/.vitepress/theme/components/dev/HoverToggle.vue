<template>
  <button
    class="dev-button"
    :class="{ 'is-active': isHoverEnabled }"
    @click="toggleHover"
  >
    <span class="icon">👆</span>
    {{ isHoverEnabled ? 'Disable Hover' : 'Enable Hover' }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toggleTooltipHover } from '../../setupTooltips';

const isHoverEnabled = ref(true); // Default to true

function toggleHover() {
  isHoverEnabled.value = !isHoverEnabled.value;
  toggleTooltipHover(isHoverEnabled.value);
}
</script>

<style scoped>
.dev-button {
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  width: 100%;
}

.dev-button:hover {
  background: var(--vp-c-bg-mute);
}

.dev-button.is-active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand-dark);
}

.icon {
  font-size: 16px;
}
</style>
