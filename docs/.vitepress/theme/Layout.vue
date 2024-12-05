<template>
  <Layout>
    <template #layout-bottom>
      <TooltipDevToggle v-if="isDev" />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import TooltipDevToggle from './components/TooltipDevToggle.vue';

const { Layout } = DefaultTheme;

// Check if the environment is development
const isDev = import.meta.env.DEV;
</script>

<style>
.VPNavBarSearch {
  flex: 1;
  padding: 0 24px;
}
</style>
