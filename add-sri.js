import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found! Run npm run build first.');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Function to calculate SHA-384 hash
function getSha384(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha384').update(fileBuffer).digest('base64');
  return `sha384-${hash}`;
}

// Replace script tags: <script type="module" crossorigin src="/assets/index-GNMmXDb4.js"></script>
html = html.replace(/<script([^>]+)src=["']\/?([^"']+)["']([^>]*)>/g, (match, before, srcPath, after) => {
  if (!srcPath.startsWith('http') && !srcPath.startsWith('//')) {
    const cleanSrcPath = srcPath.replace(/^\//, ''); // remove leading slash
    const fullPath = path.join(distDir, cleanSrcPath);
    if (fs.existsSync(fullPath)) {
      const integrity = getSha384(fullPath);
      const cleanedBefore = before.replace(/\s*integrity="[^"]*"/g, '').trimEnd();
      const cleanedAfter = after.replace(/\s*integrity="[^"]*"/g, '').trim();
      return `<script ${cleanedBefore} src="/${cleanSrcPath}" integrity="${integrity}" ${cleanedAfter}>`;
    }
  }
  return match;
});

// Replace stylesheet link tags: <link rel="stylesheet" crossorigin href="/assets/index-Pnnf7CsK.css">
html = html.replace(/<link([^>]+)href=["']\/?([^"']+)["']([^>]*)>/g, (match, before, hrefPath, after) => {
  if (before.includes('rel="stylesheet"') || after.includes('rel="stylesheet"')) {
    if (!hrefPath.startsWith('http') && !hrefPath.startsWith('//')) {
      const cleanHrefPath = hrefPath.replace(/^\//, ''); // remove leading slash
      const fullPath = path.join(distDir, cleanHrefPath);
      if (fs.existsSync(fullPath)) {
        const integrity = getSha384(fullPath);
        const cleanedBefore = before.replace(/\s*integrity="[^"]*"/g, '').trimEnd();
        const cleanedAfter = after.replace(/\s*integrity="[^"]*"/g, '').trim();
        return `<link ${cleanedBefore} href="/${cleanHrefPath}" integrity="${integrity}" ${cleanedAfter}>`;
      }
    }
  }
  return match;
});

// Format cleanup (remove extra spaces)
html = html.replace(/\s+>/g, '>');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully added Subresource Integrity (SRI) to dist/index.html');
