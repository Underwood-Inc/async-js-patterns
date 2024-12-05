<template>
  <div class="dev-panel" :class="{ 'is-minimized': isMinimized }">
    <div class="dev-panel-header" @click="toggleMinimize">
      <span class="icon">🛠️</span>
      <span class="title">Dev Tools</span>
      <span class="minimize-icon">{{ isMinimized ? '⬆️' : '⬇️' }}</span>
    </div>
    <div class="dev-panel-content" v-show="!isMinimized">
      <TooltipToggle />
      <HoverToggle />
      <DebugToggle />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TooltipToggle from './TooltipToggle.vue';
import HoverToggle from './HoverToggle.vue';
import DebugToggle from './DebugToggle.vue';

const isMinimized = ref(false);

function toggleMinimize() {
  isMinimized.value = !isMinimized.value;
}
</script>

<style scoped>
.dev-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  z-index: 9999998;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dev-panel-header {
  padding: 8px 12px;
  background: var(--vp-c-bg-mute);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.dev-panel-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.minimize-icon {
  font-size: 12px;
}
</style>
