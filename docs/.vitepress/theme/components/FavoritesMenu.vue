<script setup lang="ts">
import { useFavorites } from '../composables/useFavorites';

const { favorites } = useFavorites();
</script>

<template>
  <div class="favorites-menu">
    <h3>Favorites</h3>
    <div v-if="favorites.length === 0" class="empty-state">
      No favorites yet
    </div>
    <ul v-else>
      <li v-for="favorite in favorites" :key="favorite.path">
        <a :href="favorite.path">
          <h4>{{ favorite.title }}</h4>
          <p v-if="favorite.description">{{ favorite.description }}</p>
          <span v-if="favorite.date" class="date">{{ favorite.date }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.favorites-menu {
  padding: 1rem;
}

.empty-state {
  color: var(--vp-c-text-2);
  font-style: italic;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 1rem;
}

a {
  text-decoration: none;
  color: inherit;
}

h4 {
  margin: 0;
}

p {
  margin: 0.25rem 0;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}

.date {
  font-size: 0.8em;
  color: var(--vp-c-text-3);
}
</style>
