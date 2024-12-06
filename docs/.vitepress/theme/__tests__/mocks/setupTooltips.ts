import { vi } from 'vitest';

export const setupTooltipsMock = vi.fn();

export default {
  setupTooltips: setupTooltipsMock,
};
