import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';

export function codeTooltipsPlugin(md: MarkdownIt) {
  md.use(container, 'code-with-tooltips', {
    validate: function (params: string) {
      return params.trim() === 'code-with-tooltips';
    },
    render: function (tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        // opening tag - don't add wrapper here
        return '';
      } else {
        // closing tag - don't add wrapper here
        return '';
      }
    },
  });
}
