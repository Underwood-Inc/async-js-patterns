import { describe, expect, it } from 'vitest';
import { CodePreview, Tooltip, TooltipLoader } from '../components';

describe('Dynamic Component Imports', () => {
  it('should load components asynchronously', async () => {
    const codePreview = await CodePreview();
    const tooltipLoader = await TooltipLoader();
    const tooltip = await Tooltip();

    expect(codePreview).toBeDefined();
    expect(tooltipLoader).toBeDefined();
    expect(tooltip).toBeDefined();
  });
});
