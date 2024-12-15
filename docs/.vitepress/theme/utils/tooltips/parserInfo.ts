import { createAdHocTooltip } from '../../tooltips/adhocTooltips';
import type { CustomTooltip } from '../../types/tooltip';
import { parsers } from '../parsers';

export function createParserTooltip(language: string): CustomTooltip {
  const parserInfo = getParserInfo(language);
  const parser = parsers[language];

  // Get parser capabilities
  const capabilities = {
    jsx: language === 'tsx' || language === 'jsx',
    typeChecking: language === 'typescript' || language === 'tsx',
    styling: language === 'css' || language === 'scss',
  };

  const description = [
    'This code block is parsed using:',
    ...parserInfo.map((parser) => `* ${parser.replace('• ', '')}`),
    '',
    'Available Features:',
    ...Object.entries(capabilities)
      .filter(([_, enabled]) => enabled)
      .map(
        ([feature]) =>
          `* ${feature.charAt(0).toUpperCase() + feature.slice(1)} support`
      ),
  ].join('\n');

  return createAdHocTooltip({
    id: `parser-${language}`,
    trigger: 'hover',
    content: {
      title: 'Parser Information',
      description,
      type: 'info',
      color: { text: '#666', background: 'rgba(102, 102, 102, 0.1)' },
    },
    appearance: {
      theme: 'light',
      position: 'bottom',
      offset: 8,
    },
  });
}

function getParserInfo(language: string): string[] {
  const parsers = [];

  switch (language) {
    case 'tsx':
    case 'jsx':
      parsers.push('• React JSX Parser');
      break;
    case 'typescript':
    case 'ts':
      parsers.push('• TypeScript Parser');
      break;
    case 'css':
    case 'scss':
      parsers.push('• CSS/SCSS Parser');
      break;
    default:
      parsers.push('• Default Parser');
  }

  return parsers;
}
