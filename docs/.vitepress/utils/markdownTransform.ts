import { calculateReadingTime } from './readingTime';

export function addReadingTime() {
  return {
    name: 'vitepress-reading-time',
    transform(code: string, id: string) {
      // Only transform markdown files
      if (!id.endsWith('.md')) return;

      // Skip index/home pages if desired
      if (id.endsWith('index.md')) return;

      const readingTime = calculateReadingTime(code);

      // Add reading time to frontmatter
      const readingTimeLine = `reading-time: ${readingTime}`;

      if (code.startsWith('---\n')) {
        // If frontmatter exists, add reading time to it
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const [_, ...rest] = code.split('---\n');
        return `---\n${readingTimeLine}\n${rest.join('---\n')}`;
      } else {
        // If no frontmatter exists, add it with reading time
        return `---\n${readingTimeLine}\n---\n\n${code}`;
      }
    },
  };
}
