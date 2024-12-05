<template>
  <div
    class="tooltip-content"
    :class="{
      'is-error': isErrorOnly,
      'is-hovered': isHovered,
      'position-below': isPositionBelow,
    }"
    :style="{
      transform: transformStyle,
      maxWidth: `${maxWidth}px`,
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="tooltip-pointer"></div>
    <div class="tooltip-background">
      <ShimmerEffect />
    </div>
    <div class="tooltip-content-inner">
      <template v-for="(message, index) in messages" :key="index">
        <div :class="getMessageClass(message)">
          <span v-if="hasIcon(message)" class="message-icon">{{
            getIcon(message)
          }}</span>
          <span v-html="formatMessage(message)"></span>
        </div>
      </template>
    </div>
    <button class="close-button" @click="handleClose">✖</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { isTooltipPinned } from '../setupTooltips';
import ShimmerEffect from './ShimmerEffect.vue';

const props = defineProps<{
  content: string;
  position: 'above' | 'below';
  maxWidth?: number;
}>();

const transformStyle = computed(() => {
  return props.position === 'above'
    ? 'translate(-50%, -100%) translateY(-8px)'
    : 'translate(-50%, 0) translateY(8px)';
});

const maxWidth = computed(() => {
  return props.maxWidth || Math.min(600, window.innerWidth * 0.5);
});

const isPositionBelow = computed(() => props.position === 'below');

const messages = computed(() => props.content.split('|||'));

function getMessageClass(message: string) {
  if (message.startsWith('error:::')) return 'message error-message';
  if (message.startsWith('warning:::')) return 'message warning-message';
  if (message.startsWith('info:::')) return 'message info-message';
  if (message.startsWith('success:::')) return 'message success-message';
  return 'message';
}

function hasIcon(message: string) {
  return /^(error|warning|info|success):::/.test(message);
}

function getIcon(message: string) {
  if (message.startsWith('error:::')) return '⚠';
  if (message.startsWith('warning:::')) return '⚡';
  if (message.startsWith('info:::')) return 'ℹ';
  if (message.startsWith('success:::')) return '✓';
  return '';
}

function formatMessage(content: string) {
  if (!content) return '';

  return content
    .split('|||')
    .map((message) => {
      const [type, rawContent] = message.split(':::');

      if (type === 'info' && rawContent.includes('type:')) {
        const [desc, typeInfoStr] = rawContent
          .split('type:')
          .map((s) => s.trim());
        try {
          const decodedTypeInfo = decodeURIComponent(typeInfoStr);
          const typeInfo = JSON.parse(decodedTypeInfo);

          // Create a colored type span using the typeInfo colors
          const typeSpan = `<span class="type-text" style="color: ${typeInfo.color.text}; background: ${typeInfo.color.background}">${typeInfo.type}</span>`;

          // Return formatted message without the type prefix
          return `${typeSpan}${typeInfo.description ? `: ${typeInfo.description}` : ''}`;
        } catch (error) {
          console.error('Error parsing tooltip content:', error);
          return rawContent;
        }
      }

      // Remove the type prefix for other messages
      return rawContent;
    })
    .join('\n');
}

const isErrorOnly = computed(() => {
  return (
    messages.value.length === 1 && messages.value[0].startsWith('error:::')
  );
});

const isPinned = computed(() => isTooltipPinned());

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function handleClose(event: MouseEvent) {
  event.stopPropagation(); // Prevent event bubbling
  const tooltipEl = (event.target as HTMLElement).closest('.tooltip-content');
  if (tooltipEl) {
    const app = (tooltipEl as any).__vue_app__;
    if (app) {
      app.unmount();
    }
    tooltipEl.remove();
  }
  emit('close');
}

const isHovered = ref(false);
</script>

<style lang="scss">
@use '../styles/variables' as *;

@keyframes float {
  0% {
    transform: translate(-50%, -100%) translateY(-8px);
  }
  50% {
    transform: translate(-50%, -100%) translateY(-12px);
  }
  100% {
    transform: translate(-50%, -100%) translateY(-8px);
  }
}

.tooltip-content {
  position: fixed;
  padding: 12px 16px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1.6;
  pointer-events: auto;
  text-align: left;
  font-family: var(--vp-font-family-base);
  z-index: get-z-index('tooltip');
  will-change: transform;
  box-sizing: border-box;
  width: fit-content;
  min-width: 200px;
  max-width: min(600px, 50vw);
  animation: float 3s ease-in-out infinite;
  position: relative;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform-style: preserve-3d;
  perspective: 1000px;

  @media (max-width: 768px) {
    min-width: 160px;
    max-width: 90vw;
  }

  &.is-error {
    .tooltip-background {
      border-color: var(--vp-c-red);
    }
    .tooltip-pointer {
      border-color: var(--vp-c-red);
      background: var(--vp-c-red);
    }
  }

  &.is-hovered {
    animation-play-state: paused;
  }

  .tooltip-background {
    position: absolute;
    inset: 0;
    background: var(--vp-c-bg-soft);
    border: 2px solid var(--vp-c-brand);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    backface-visibility: hidden;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }

  .tooltip-pointer {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: var(--vp-c-brand);
    border-right: 2px solid var(--vp-c-brand);
    border-bottom: 2px solid var(--vp-c-brand);
    z-index: -1;
  }

  .type-text {
    font-family: var(--vp-font-family-mono);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
  }

  &.position-below {
    .tooltip-pointer {
      top: -6px;
      bottom: auto;
      transform: translateX(-50%) rotate(225deg);
    }

    animation: float-below 3s ease-in-out infinite;
  }
}

.tooltip-content-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .message {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px;
    padding: 8px;
    font-family: var(--vp-font-family-mono);
    font-size: 0.9em;
    border-radius: 4px;
    color: var(--vp-c-text-1);

    .message-icon {
      flex-shrink: 0;
      line-height: 1.6;
      font-size: 1.1em;
      align-self: start;
      justify-self: center;
    }

    span:not(.message-icon) {
      line-height: 1.6;
    }
  }

  .error-message {
    background-color: rgba(255, 0, 0, 0.08);
    .message-icon {
      color: var(--vp-c-red);
    }
  }

  .warning-message {
    background-color: rgba(255, 197, 23, 0.08);
    .message-icon {
      color: #e8a206;
    }
  }

  .info-message {
    background-color: transparent;
    .message-icon {
      color: #0c8fff;
    }
  }

  .success-message {
    background-color: rgba(0, 200, 83, 0.08);
    .message-icon {
      color: #00c853;
    }
  }
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: var(--vp-c-text-1);
  font-size: 16px;
  cursor: pointer;
  pointer-events: auto;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  z-index: 10;

  &:hover {
    opacity: 1;
    background: var(--vp-c-bg-mute);
  }

  &:active {
    transform: scale(0.95);
  }
}

:deep(.shimmer-container) {
  --shimmer-mask: linear-gradient(90deg, transparent, #fff 50%, transparent);
  border-radius: inherit;
}

// Type-specific colors
.tooltip-content {
  .type-text {
    font-family: var(--vp-font-family-mono);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
  }
}

// Ensure tooltip has enough padding
.tooltip-content {
  padding-right: 36px;
}

@keyframes float-below {
  0% {
    transform: translate(-50%, 0) translateY(8px);
  }
  50% {
    transform: translate(-50%, 0) translateY(12px);
  }
  100% {
    transform: translate(-50%, 0) translateY(8px);
  }
}
</style>
