/// <reference types="vite/client" />

<template>
  <div class="debug-controls" v-if="isDev">
    <div class="debug-section">
      <h3>Log Categories</h3>
      <div class="toggle-group">
        <label v-for="category in categories" :key="category">
          <input 
            type="checkbox" 
            :checked="isCategoryEnabled(category)"
            @change="toggleCategory(category, ($event.target as HTMLInputElement).checked)"
          >
          {{ category }}
        </label>
      </div>
    </div>

    <div class="debug-section">
      <h3>Log Levels</h3>
      <div class="toggle-group">
        <label v-for="level in levels" :key="level">
          <input 
            type="checkbox" 
            :checked="isLevelEnabled(level)"
            @change="toggleLevel(level, ($event.target as HTMLInputElement).checked)"
          >
          {{ level }}
        </label>
      </div>
    </div>

    <!-- Logger Controls -->
    <div class="logger-controls">
      <a href="/logger-service/" class="icon-button" title="Logger Documentation">
        <span class="icon">📚</span>
      </a>
      <a href="http://localhost:3334" target="_blank" class="icon-button" title="Log Viewer">
        <span class="icon">📊</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  enableLogCategory, 
  enableLogLevel, 
  isLogCategoryEnabled, 
  isLogLevelEnabled,
  type LogCategory,
  type LogLevel
} from '../utils/logger'

const isDev = ref(false)

const categories: LogCategory[] = ['performance', 'tooltip', 'markdown', 'dev', 'system']
const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']

onMounted(() => {
  // Check if we're in development mode
  isDev.value = process.env.NODE_ENV === 'development'
})

const toggleCategory = (category: LogCategory, enabled: boolean) => {
  enableLogCategory(category, enabled)
}

const toggleLevel = (level: LogLevel, enabled: boolean) => {
  enableLogLevel(level, enabled)
}

const isCategoryEnabled = (category: LogCategory) => isLogCategoryEnabled(category)
const isLevelEnabled = (level: LogLevel) => isLogLevelEnabled(level)
</script>

<style scoped>
.debug-controls {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

.debug-section {
  margin-bottom: 16px;
}

.debug-section:last-child {
  margin-bottom: 0;
}

h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.toggle-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

input[type="checkbox"] {
  margin: 0;
}

.logger-controls {
  display: flex;
  gap: 8px;
  margin-left: 16px;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background: var(--vp-c-bg-mute);
}

.icon {
  font-size: 18px;
  line-height: 1;
}
</style> 