import { ref, watchEffect } from 'vue';

// Global state for dev tools
export const tooltipsEnabled = ref(true);
export const hoverEnabled = ref(true);
export const debugEnabled = ref(false);

export function setupDevTools() {
  // Initialize dev tools state
  if (import.meta.env.DEV) {
    // Load saved preferences from localStorage
    const savedTooltips = localStorage.getItem('devtools-tooltips');
    const savedHover = localStorage.getItem('devtools-hover');
    const savedDebug = localStorage.getItem('devtools-debug');

    tooltipsEnabled.value = savedTooltips ? savedTooltips === 'true' : true;
    hoverEnabled.value = savedHover ? savedHover === 'true' : true;
    debugEnabled.value = savedDebug ? savedDebug === 'true' : false;

    // Watch for changes and save to localStorage
    watchEffect(() => {
      localStorage.setItem(
        'devtools-tooltips',
        tooltipsEnabled.value.toString()
      );
      localStorage.setItem('devtools-hover', hoverEnabled.value.toString());
      localStorage.setItem('devtools-debug', debugEnabled.value.toString());
    });
  }
}
