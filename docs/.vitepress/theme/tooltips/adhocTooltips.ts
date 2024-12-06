import type { CustomTooltip } from '../types/tooltip';

export function createAdHocTooltip(config: CustomTooltip): CustomTooltip {
  // Validate required fields
  if (!config.id || !config.content || !config.trigger) {
    throw new Error('Missing required tooltip configuration');
  }

  // Normalize trigger to array
  const trigger = Array.isArray(config.trigger)
    ? config.trigger
    : [config.trigger];

  // Create tooltip with defaults
  return {
    ...config,
    trigger,
    appearance: {
      theme: 'light',
      position: 'bottom',
      offset: 8,
      ...config.appearance,
    },
    portal: {
      strategy: 'fixed',
      ...config.portal,
    },
  };
}
