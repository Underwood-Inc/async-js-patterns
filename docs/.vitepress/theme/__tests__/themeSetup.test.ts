import { beforeEach, describe, expect, it, vi } from 'vitest';

// Create a spy for setupTooltips that is properly hoisted
const setupTooltipsMock = vi.fn(() => {
  console.log('setupTooltips mock called');
});

describe('Theme Setup', () => {
  beforeEach(() => {
    console.log('\nbeforeEach: Setting up test');
    vi.clearAllMocks();
    console.log('Mocks cleared');
  });

  it('should setup tooltips only in browser environment', async () => {
    console.log('\nStarting browser environment test');

    // Mock vitepress first
    vi.doMock('vitepress', () => ({
      inBrowser: true,
      default: {},
    }));

    // Mock the dynamic import
    vi.doMock('../setupTooltips', () => ({
      setupTooltips: setupTooltipsMock,
    }));

    // Import the theme after mocking
    const theme = (await import('../index')).default;
    console.log('Theme imported');

    // Test in browser environment
    const app = {};
    console.log('Calling enhanceApp');
    await theme.enhanceApp({ app });

    // Wait for any pending promises
    await new Promise((resolve) => setTimeout(resolve, 0));

    console.log('Mock call count:', setupTooltipsMock.mock.calls.length);
    console.log('Mock calls:', setupTooltipsMock.mock.calls);
    expect(setupTooltipsMock).toHaveBeenCalled();

    // Test non-browser environment
    vi.doMock('vitepress', () => ({
      inBrowser: false,
      default: {},
    }));

    // Re-import theme with new mocks
    const nonBrowserTheme = (await import('../index')).default;
    await nonBrowserTheme.enhanceApp({ app });

    // The mock should not have been called again
    expect(setupTooltipsMock).toHaveBeenCalledTimes(1);
  });
});
