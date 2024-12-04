<script setup lang="ts">
import { useData } from 'vitepress';

const { frontmatter } = useData();
</script>

<template>
  <div v-if="frontmatter['reading-time']" class="reading-time">
    📚 {{ frontmatter['reading-time'] }} min read
  </div>
</template>

<style scoped>
.reading-time {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style> 