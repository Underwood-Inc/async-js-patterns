<template>
  <Layout>
    <template #nav-bar-content-after>
      <FavoritesMenu />
    </template>
    <template #doc-before>
      <FavoriteButton
        :path="page.relativePath"
        :title="frontmatter.title"
        :description="frontmatter.description"
        :date="frontmatter.date"
      />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import FavoritesMenu from './components/FavoritesMenu.vue';
import FavoriteButton from './components/FavoriteButton.vue';
import './styles/favorites.scss';

const { Layout } = DefaultTheme;
const { page, frontmatter } = useData();
</script>

<style>
.VPNavBarSearch {
  flex: 1;
  padding: 0 24px;
}
</style>
