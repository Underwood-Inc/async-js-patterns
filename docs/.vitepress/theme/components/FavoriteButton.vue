<script setup lang="ts">
import { useFavorites } from '../composables/useFavorites';
import { computed } from 'vue';

interface Props {
  path: string;
  title: string;
  description?: string;
  date?: string;
}

const props = defineProps<Props>();
const { toggleFavorite, isFavorited } = useFavorites();
const favorited = computed(() => isFavorited(props.path));
</script>

<template>
  <button
    @click="toggleFavorite({ path, title, description, date })"
    class="favorite-button"
    :aria-label="favorited ? 'Remove from favorites' : 'Add to favorites'"
  >
    <svg viewBox="0 0 24 24" :class="['star-icon', { favorited }]">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  </button>
</template>
