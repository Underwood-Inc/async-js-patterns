import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
  'og-image.png': 1200,
};

const logoPath = join(process.cwd(), 'docs/public/logo.svg');
const logoBuffer = readFileSync(logoPath);

async function generateFavicons() {
  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(logoBuffer)
      .resize(size, size)
      .png()
      .toFile(join(process.cwd(), 'docs/public', filename));
    console.log(`Generated ${filename}`);
  }
}

generateFavicons().catch(console.error);
