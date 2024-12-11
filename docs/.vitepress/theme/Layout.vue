<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <AnimatedBackground />
    </template>
    <template #doc-before>
      <FavoriteButton
        :path="page.relativePath"
        :title="frontmatter.title"
        :description="frontmatter.description"
        :date="frontmatter.date"
      />
    </template>
    <template #layout-bottom>
      <CustomFooter />
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import FavoriteButton from './components/FavoriteButton.vue'
import AnimatedBackground from './components/AnimatedBackground.vue'
import CustomFooter from './components/CustomFooter.vue'
import './styles/favorites.scss'

const { page, frontmatter } = useData()
</script>

<style>
.VPNavBarSearch {
  flex: 1;
  padding: 0 24px;
}
</style>
