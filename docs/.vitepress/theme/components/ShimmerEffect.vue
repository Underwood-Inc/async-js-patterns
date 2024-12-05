<template>
  <div class="shimmer-container">
    <div class="shimmer-overlay"></div>
  </div>
</template>

<style scoped>
.shimmer-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.shimmer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 100%
  );
  animation: shimmer 3s infinite linear;
  mask: var(--shimmer-mask, none);
  -webkit-mask: var(--shimmer-mask, none);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
