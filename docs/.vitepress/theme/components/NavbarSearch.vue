<script setup lang="ts">
import { ref } from 'vue';
import FuzzySearch from './FuzzySearch.vue';

const isExpanded = ref(false);
const searchButtonRef = ref<HTMLButtonElement | null>(null);

function toggleSearch() {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    // Focus search input after expansion animation
    setTimeout(() => {
      const input = document.querySelector(
        '.fuzzy-search input'
      ) as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  }
}
</script>

<template>
  <div class="nav-search">
    <!-- Search button (visible on mobile) -->
    <button
      ref="searchButtonRef"
      class="search-button"
      aria-label="Search documentation"
      @click="toggleSearch"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057-4.126-4.127A5.5 5.5 0 1 1 8.5 3Zm0 1a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"
          fill="currentColor"
        />
      </svg>
    </button>

    <!-- Search container -->
    <div class="search-container" :class="{ expanded: isExpanded }">
      <FuzzySearch @close="isExpanded = false" />
    </div>
  </div>
</template>

<style scoped>
.nav-search {
  position: relative;
  margin-right: 1rem;
}

.search-button {
  display: none; /* Hidden on desktop */
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.search-button:hover {
  color: var(--vp-c-text-1);
}

.search-container {
  width: 200px; /* Default width */
  transition: width 0.3s ease;
}

/* Responsive design */
@media (max-width: 768px) {
  .search-button {
    display: flex;
  }

  .search-container {
    position: fixed;
    top: var(--vp-nav-height);
    left: 0;
    right: 0;
    width: 100%;
    padding: 0 1rem;
    background: var(--vp-c-bg);
    border-bottom: 1px solid var(--vp-c-divider);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
    z-index: 20;
  }

  .search-container.expanded {
    transform: translateY(0);
  }
}

/* Desktop hover expansion */
@media (min-width: 769px) {
  .search-container:hover,
  .search-container:focus-within {
    width: 300px;
  }
}
</style>
