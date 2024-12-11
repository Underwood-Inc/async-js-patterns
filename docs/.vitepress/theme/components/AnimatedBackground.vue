<template>
  <div class="animated-background">
    <div class="gradient-container">
      <div class="radial-element" v-for="n in 3" :key="n"></div>
    </div>
    <div class="overlay"></div>
  </div>
</template>

<style scoped>
.animated-background {
  position: fixed;
  inset: 0;
  z-index: -2;
  overflow: hidden;
}

.gradient-container {
  position: absolute;
  inset: -50%;
  background: linear-gradient(
    45deg,
    var(--gradient-color-1),
    var(--gradient-color-2),
    var(--gradient-color-3)
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

.radial-element {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--gradient-color-2) 0%,
    transparent 70%
  );
  opacity: 0.4;
  will-change: transform;
}

.radial-element:nth-child(1) {
  width: 80vh;
  height: 80vh;
  top: 20%;
  left: 30%;
  animation: float-1 20s ease-in-out infinite;
}

.radial-element:nth-child(2) {
  width: 60vh;
  height: 60vh;
  top: 50%;
  right: 20%;
  animation: float-2 15s ease-in-out infinite;
}

.radial-element:nth-child(3) {
  width: 70vh;
  height: 70vh;
  bottom: 10%;
  left: 40%;
  animation: float-3 25s ease-in-out infinite;
}

.overlay {
  position: absolute;
  inset: 0;
  background: var(--gradient-overlay);
  backdrop-filter: blur(50px);
  z-index: -1;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes float-1 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(20%, 10%) rotate(180deg);
  }
}

@keyframes float-2 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-15%, -20%) rotate(-180deg);
  }
}

@keyframes float-3 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(10%, -15%) rotate(90deg);
  }
}
</style> 