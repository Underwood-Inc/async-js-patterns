import { describe, expect, it } from 'vitest';
import { createAdHocTooltip } from '../tooltips/adhocTooltips';
import type { CustomTooltip } from '../types/tooltip';

describe('Ad-hoc Tooltips', () => {
  it('should create tooltip with custom content', () => {
    const tooltip: CustomTooltip = {
      id: 'dd-tooltip',
      content: 'Deep Dive: Comprehensive technical analysis',
      trigger: 'DD',
      appearance: {
        theme: 'dark',
        position: 'bottom',
      },
    };

    const result = createAdHocTooltip(tooltip);
    expect(result).toBeDefined();
    expect(result.id).toBe('dd-tooltip');
  });

  it('should support multiple trigger words', () => {
    const tooltip: CustomTooltip = {
      id: 'multi-trigger',
      content: 'Shared tooltip content',
      trigger: ['DD', 'Deep Dive'],
    };

    const result = createAdHocTooltip(tooltip);
    expect(result.trigger).toHaveLength(2);
  });
});
