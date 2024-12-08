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
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchInput = ref<HTMLInputElement | null>(null);

function handleInput(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.value) {
    // Trigger the native search dialog
    const searchButton = document.querySelector(
      '.DocSearch-Button'
    ) as HTMLButtonElement;
    if (searchButton && !document.querySelector('.DocSearch-Modal')) {
      searchButton.click();

      // Wait for the modal to open and move our input
      setTimeout(() => {
        const modalInput = document.querySelector(
          '.DocSearch-Input'
        ) as HTMLInputElement;
        if (modalInput) {
          modalInput.parentElement?.replaceChild(
            searchInput.value!,
            modalInput
          );
          searchInput.value?.focus();
        }
      }, 100);
    }
  }
}

function handleFocus() {
  const searchButton = document.querySelector(
    '.DocSearch-Button'
  ) as HTMLButtonElement;
  if (searchButton) {
    searchButton.click();

    setTimeout(() => {
      const modalInput = document.querySelector(
        '.DocSearch-Input'
      ) as HTMLInputElement;
      if (modalInput) {
        modalInput.parentElement?.replaceChild(searchInput.value!, modalInput);
        searchInput.value?.focus();
      }
    }, 100);
  }
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
</style>
