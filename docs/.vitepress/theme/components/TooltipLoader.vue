<template>
  <div class="tooltip-loader" :class="{ 'is-visible': isVisible }">
    <div class="tooltip-loader-content">
      <span class="pulse-dot"></span>
      <span class="status-text">{{ statusText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isVisible = ref(false);
const tooltipsProcessed = ref(0);
const tooltipsTotal = ref(0);
const statusText = ref('Initializing tooltips...');

// Expose methods to update the loader state
const updateProgress = (processed, total) => {
  tooltipsProcessed.value = processed;
  tooltipsTotal.value = total;
  statusText.value = `Processing tooltips: ${processed}/${total}`;
  isVisible.value = true;
};

const hideLoader = () => {
  setTimeout(() => {
    isVisible.value = false;
  }, 1500);
};

// Expose the methods globally
onMounted(() => {
  window.tooltipLoader = {
    updateProgress,
    hideLoader,
  };
});
</script>

<style scoped>
.tooltip-loader {
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 10px 16px;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-brand);
  border-radius: 8px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999998;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  backdrop-filter: blur(8px);
}

.tooltip-loader.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.tooltip-loader-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: var(--vp-c-brand);
  border-radius: 50%;
  display: inline-block;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(0.95);
    opacity: 1;
  }
}

.dark .tooltip-loader {
  background: var(--vp-c-bg-soft);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.status-text {
  font-family: var(--vp-font-family-base);
}
</style>
