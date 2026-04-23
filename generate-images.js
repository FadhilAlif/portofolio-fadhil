import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');

// 1. Generate OG Image (1200x630)
const ogSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a"/>
      <stop offset="100%" style="stop-color:#1a1a2e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="630" fill="none" stroke="#333" stroke-width="2"/>
  <line x1="0" y1="0" x2="1200" y2="630" stroke="#ffffff08" stroke-width="1"/>
  <line x1="1200" y1="0" x2="0" y2="630" stroke="#ffffff08" stroke-width="1"/>
  <circle cx="600" cy="250" r="150" fill="none" stroke="#ffffff10" stroke-width="1"/>
  <circle cx="600" cy="250" r="100" fill="none" stroke="#ffffff08" stroke-width="1"/>
  <text x="600" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="4">FADHIL ALIF PRIYATNO</text>
  <text x="600" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400" fill="#888888" text-anchor="middle" letter-spacing="8">SOFTWARE ENGINEER</text>
  <line x1="500" y1="370" x2="700" y2="370" stroke="#444" stroke-width="1"/>
</svg>
`;

// 2. Generate Apple Touch Icon (180x180)
const appleSvg = `
<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a"/>
      <stop offset="100%" style="stop-color:#1a1a2e"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="36" fill="url(#iconBg)"/>
  <text x="90" y="115" font-family="system-ui, -apple-system, sans-serif" font-size="80" font-weight="700" fill="#ffffff" text-anchor="middle">FD</text>
</svg>
`;

async function generateImages() {
  // Generate OG Image
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('Generated og-image.png');

  // Generate Apple Touch Icon
  await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');
}

generateImages().catch(console.error);
