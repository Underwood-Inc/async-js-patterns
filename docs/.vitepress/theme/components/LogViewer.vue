<template>
  <div class="log-viewer">
    <div class="log-controls">
      <h2>Log Viewer</h2>
      <div class="filter-controls">
        <div class="categories">
          <h3>Categories</h3>
          <label v-for="category in categories" :key="category">
            <input 
              type="checkbox" 
              :checked="isCategoryEnabled(category)"
              @change="toggleCategory(category, $event.target.checked)"
            >
            {{ category }}
          </label>
        </div>
        <div class="levels">
          <h3>Log Levels</h3>
          <label v-for="level in levels" :key="level">
            <input 
              type="checkbox" 
              :checked="isLevelEnabled(level)"
              @change="toggleLevel(level, $event.target.checked)"
            >
            {{ level }}
          </label>
        </div>
      </div>
    </div>
    <div class="log-sections">
      <div v-for="section in sections" :key="section.id" class="log-section">
        <div class="section-header">
          <h3>{{ section.title }}</h3>
          <button @click="clearSection(section.id)">Clear</button>
        </div>
        <div class="log-content">
          <div v-for="(line, index) in section.lines" :key="index" class="log-line">
            {{ line }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { logger, type LogCategory, type LogLevel } from '../utils/logger'

const categories: LogCategory[] = ['performance', 'tooltip', 'markdown', 'dev', 'system', 'build']
const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']

const sections = ref([
  { id: 'build', title: '📦 Build Progress', lines: [] },
  { id: 'tooltip', title: '🔍 Tooltip Processing', lines: [] },
  { id: 'performance', title: '⚡ Performance Metrics', lines: [] },
  { id: 'errors', title: '❌ Errors', lines: [] },
  { id: 'debug', title: '🔧 Debug Output', lines: [] }
])

onMounted(() => {
  logger.enable(true)
  categories.forEach(category => logger.enableCategory(category, true))
  levels.forEach(level => logger.enableLevel(level, true))
})

onUnmounted(() => {
  logger.enable(false)
})

const toggleCategory = (category: LogCategory, enabled: boolean) => {
  logger.enableCategory(category, enabled)
}

const toggleLevel = (level: LogLevel, enabled: boolean) => {
  logger.enableLevel(level, enabled)
}

const isCategoryEnabled = (category: LogCategory) => logger.isCategoryEnabled(category)
const isLevelEnabled = (level: LogLevel) => logger.isLevelEnabled(level)

const clearSection = (sectionId: string) => {
  logger.clearSection(sectionId)
  const section = sections.value.find(s => s.id === sectionId)
  if (section) {
    section.lines = []
  }
}
</script>

<style scoped>
.log-viewer {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.log-controls {
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.filter-controls {
  display: flex;
  gap: 32px;
  margin-top: 16px;
}

.categories,
.levels {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.log-sections {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  overflow: auto;
}

.log-section {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.section-header {
  padding: 12px 16px;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header button {
  padding: 4px 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
}

.section-header button:hover {
  background: var(--vp-c-bg-mute);
}

.log-content {
  padding: 16px;
  height: 300px;
  overflow: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
}

.log-line {
  margin-bottom: 4px;
}

.log-line:last-child {
  margin-bottom: 0;
}
</style> 