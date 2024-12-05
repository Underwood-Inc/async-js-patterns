<template>
  <Layout>
    <template #layout-bottom>
      <DevPanel v-if="isDev" />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import { computed } from 'vue';
import DevPanel from './components/dev/DevPanel.vue';

const { Layout } = DefaultTheme;
const isDev = computed(() => import.meta.env.DEV);
</script>

<style>
.VPNavBarSearch {
  flex: 1;
  padding: 0 24px;
}
</style>
