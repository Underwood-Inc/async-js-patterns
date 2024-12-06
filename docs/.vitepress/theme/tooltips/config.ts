import type { CustomTooltip } from '../types/tooltip';

export const globalTooltips: CustomTooltip[] = [
  {
    id: 'dd-tooltip',
    content:
      'Deep Dive: A comprehensive, in-depth exploration of a specific topic that goes beyond surface-level understanding.',
    trigger: ['DD', 'Deep Dive'],
    appearance: {
      theme: 'dark',
      position: 'bottom',
      offset: 8,
    },
  },
];
