import type MarkdownIt from 'markdown-it';

export function readingTime(md: MarkdownIt) {
  const render = md.render.bind(md);
  md.render = (...args) => {
    const html = render(...args);
    const words = html
      .replace(/<[^>]*>/g, '')
      .trim()
      .split(/\s+/).length;
    const time = Math.ceil(words / 200); // Assuming 200 words per minute
    return `<div class="reading-time">📚 ${time} min read</div>${html}`;
  };
}
