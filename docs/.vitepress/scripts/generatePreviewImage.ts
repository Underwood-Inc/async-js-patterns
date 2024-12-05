import { writeFileSync } from 'fs';
import path, { join } from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generatePreviewImage() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set viewport to match desired image size
  await page.setViewport({ width: 1200, height: 630 });

  // Create HTML with canvas
  await page.setContent(`
    <style>
      body { margin: 0; }
      canvas { width: 1200px; height: 630px; }
    </style>
    <canvas id="preview" width="1200" height="630"></canvas>
    <script>
      const canvas = document.getElementById('preview');
      const ctx = canvas.getContext('2d');
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
      gradient.addColorStop(0, '#646cff');
      gradient.addColorStop(1, '#42b883');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 630);
      
      // Add text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 72px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Web Patterns', 600, 315);
      
      ctx.font = '32px system-ui';
      ctx.fillText('Modern JavaScript & TypeScript Patterns', 600, 400);
    </script>
  `);

  // Capture the canvas as PNG
  const element = await page.$('#preview');
  const image = await element?.screenshot();

  if (image) {
    writeFileSync(join(__dirname, '../../public/social-preview.png'), image);
  }

  await browser.close();
  console.log('Social preview image generated successfully!');
}

generatePreviewImage().catch(console.error);
