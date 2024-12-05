import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(__dirname, '../public/search-index.json');

interface SearchItem {
  title: string;
  path: string;
  content: string;
}

async function buildSearchIndex() {
  const searchIndex: SearchItem[] = [];

  function processDirectory(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        processDirectory(fullPath);
        continue;
      }

      if (path.extname(file) !== '.md') continue;

      const content = fs.readFileSync(fullPath, 'utf-8');
      const { data, content: markdown } = matter(content);
      const relativePath = path.relative(DOCS_DIR, fullPath);
      const urlPath = '/' + relativePath.replace(/\.md$/, '');

      searchIndex.push({
        title: data.title || file.replace(/\.md$/, ''),
        path: urlPath,
        content: markdown
          .replace(/```[\s\S]*?```/g, '')
          .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1')
          .replace(/#{1,6}\s+/g, '')
          .slice(0, 1000),
      });
    }
  }

  processDirectory(DOCS_DIR);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2));
}

buildSearchIndex();
