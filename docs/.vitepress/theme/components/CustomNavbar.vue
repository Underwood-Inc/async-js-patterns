<script setup lang="ts">
import VPNavBar from 'vitepress/theme';
import NavbarSearch from './NavbarSearch.vue';
</script>

<template>
  <VPNavBar>
    <template #search>
      <NavbarSearch />
    </template>
  </VPNavBar>
</template>
