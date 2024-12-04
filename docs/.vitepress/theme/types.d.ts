declare global {
  interface Window {
    initializeTooltips: (count: number) => void;
    incrementProcessedTooltips: () => void;
  }
}

export {};
