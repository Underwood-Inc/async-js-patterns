const debouncedWatch = computed(() => {
  return debounce(async (query: string) => {
    try {
      if (!query.trim()) {
        searchResults.value = [];
        return;
      }
      
      // Ensure searchIndex exists before filtering
      if (!searchIndex.value?.length) {
        await initializeSearchIndex();
      }
      
      searchResults.value = searchIndex.value
        ?.filter(item => {
          // Safe access to properties
          const title = item.title?.toLowerCase() || '';
          const content = item.content?.toLowerCase() || '';
          const q = query.toLowerCase();
          return title.includes(q) || content.includes(q);
        })
        .slice(0, 10) || [];
    } catch (error) {
      console.error('Search error:', error);
      searchResults.value = [];
    }
  }, 200);
}); 