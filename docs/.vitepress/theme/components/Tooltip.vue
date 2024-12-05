<template>
  <div class="tooltip-content" :style="{ left: x + 'px', top: y + 'px' }">
    <div class="tooltip-pointer"></div>

    <div class="tooltip-background">
      <div class="tooltip-bg-content"></div>
      <ShimmerEffect class="tooltip-body-shimmer" />
    </div>

    <div class="tooltip-content-inner">
      <p
        v-for="(line, index) in contentLines"
        :key="index"
        :style="{ marginTop: index > 0 ? '0.5em' : '0' }"
      >
        {{ line }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ShimmerEffect from './ShimmerEffect.vue';

const props = defineProps<{
  content: string;
  x: number;
  y: number;
}>();

const contentLines = computed(() => props.content.split('<br>'));
</script>

<style scoped>
.tooltip-content {
  position: fixed;
  padding: 12px 16px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1.6;
  pointer-events: none;
  max-width: 360px;
  text-align: left;
  font-family: var(--vp-font-family-base);
  z-index: 9999999;
  transform: translate(-50%, -100%) translateY(-8px);
  animation: float 3s ease-in-out infinite;
}

.tooltip-body-shimmer {
  position: absolute;
  inset: 0;
  z-index: 2;
  mask: linear-gradient(#fff 0 0);
  -webkit-mask: linear-gradient(#fff 0 0);
}

.tooltip-background {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  overflow: hidden;
  pointer-events: none;
  z-index: 3;
  border: 2px solid #b3a5e3;
}

.tooltip-bg-content {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    rgba(42, 36, 56, 0.95),
    rgba(45, 39, 60, 0.95)
  );
  border-radius: 12px;
  box-shadow:
    0 0 15px rgba(157, 140, 214, 0.2),
    0 0 30px rgba(157, 140, 214, 0.1);
  backdrop-filter: blur(8px);
}

.tooltip-pointer {
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 20px;
  height: 20px;
  transform-origin: 0 0;
  transform: rotate(45deg) translateX(-50%);
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
  background: #b3a5e3;
}

.tooltip-content-inner {
  position: relative;
  padding: 8px 12px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
  z-index: 4;
}

@keyframes float {
  0%,
  100% {
    transform: translate(-50%, -100%) translateY(-8px);
  }
  50% {
    transform: translate(-50%, -100%) translateY(-12px);
  }
}
</style>
