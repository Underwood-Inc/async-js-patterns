<template>
  <button
    class="dev-button"
    :class="{ 'is-active': isPersistent }"
    @click="togglePersistence"
  >
    <span class="icon">📌</span>
    {{ isPersistent ? 'Unpin Tooltips' : 'Pin Tooltips' }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toggleTooltipPersistence } from '../../setupTooltips';

const isPersistent = ref(false);

function togglePersistence() {
  isPersistent.value = !isPersistent.value;
  toggleTooltipPersistence(isPersistent.value);
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
