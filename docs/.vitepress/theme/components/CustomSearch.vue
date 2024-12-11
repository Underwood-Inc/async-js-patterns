<template>
  <div class="VPNavBarSearch">
    <form class="search-bar" role="search" @submit.prevent>
      <label title="Search" id="localsearch-label" for="localsearch-input">
        <span aria-hidden="true" class="vpi-search search-icon"></span>
      </label>
      <input
        ref="searchInput"
        aria-autocomplete="both"
        aria-labelledby="localsearch-label"
        autocapitalize="off"
        autocomplete="off"
        autocorrect="off"
        class="search-input"
        id="localsearch-input"
        enterkeyhint="go"
        maxlength="64"
        placeholder="Search"
        spellcheck="false"
        type="search"
        @input="handleInput"
        @focus="handleFocus"
      />
      <div v-if="searchResults.length" class="search-results">
        <a 
          v-for="result in searchResults" 
          :key="result.path"
          :href="result.path"
          class="search-result"
        >
          <h3>{{ result.title }}</h3>
          <p>{{ result.content.slice(0, 100) }}...</p>
        </a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { SearchItem } from '../types';

const searchInput = ref<HTMLInputElement | null>(null);
const searchResults = ref<SearchItem[]>([]);
const searchIndex = ref<SearchItem[]>([]);

onMounted(async () => {
  try {
    const response = await fetch('/search-index.json');
    searchIndex.value = await response.json();
  } catch (error) {
    console.error('Failed to load search index:', error);
  }
});

// Add error handling for search results
const processSearchResults = (results: SearchItem[]) => {
  return results.map(item => ({
    ...item,
    // Add default values for potentially undefined properties
    title: item.title || 'Untitled',
    content: item.content || '',
    // Remove references to undefined os property
    description: item.description?.replace(/\${os\..+?}/g, '') || ''
  }));
};

function handleInput(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.value.trim()) {
    searchResults.value = [];
    return;
  }

  const query = input.value.toLowerCase();
  try {
    searchResults.value = processSearchResults(
      searchIndex.value
        .filter(item => 
          item.title?.toLowerCase().includes(query) || 
          item.content?.toLowerCase().includes(query)
        )
        .slice(0, 10)
    );
  } catch (error) {
    console.error('Search error:', error);
    searchResults.value = [];
  }
}

function handleFocus() {
  // Just focus the input, no need to hijack DocSearch
  searchInput.value?.focus();
}
</script>

<style>
.VPNavBarSearch {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 12px;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  height: var(--vp-nav-height);
}

.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
}

.search-input {
  flex: 1;
  width: 100%;
  padding: 0 8px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: transparent;
  border: none;
  outline: none;
}

.search-icon {
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-2);
}

/* Ensure search modal is above navigation */
:deep(.DocSearch-Modal) {
  z-index: 999999 !important;
}

@media (max-width: 767px) {
  .VPNavBarSearch {
    padding: 0 8px;
    max-width: none;
    flex: 1;
  }

  .search-bar {
    width: 100%;
    height: 36px;
    padding: 0 8px;
    display: flex !important;
    visibility: visible !important;
  }

  .search-input {
    display: block !important;
    visibility: visible !important;
    width: 100% !important;
    font-size: 14px;
  }

  .search-icon {
    display: flex !important;
    visibility: visible !important;
  }
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-top: 8px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
}

.search-result {
  display: block;
  padding: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-decoration: none;
  color: var(--vp-c-text-1);
}

.search-result:hover {
  background: var(--vp-c-bg-alt);
}

.search-result h3 {
  font-size: 14px;
  margin: 0 0 4px;
}

.search-result p {
  font-size: 12px;
  margin: 0;
  color: var(--vp-c-text-2);
}
</style>
