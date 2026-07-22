import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => { if (msg.type() === 'error' || msg.type() === 'warning') console.log('BROWSER CONSOLE:', msg.text()) });
  page.on('pageerror', err => console.log('BROWSER EXCEPTION:', err.message));

  await page.goto('http://localhost:5173/data', { waitUntil: 'networkidle' });

  const html = await page.content();
  fs.writeFileSync('test-out.html', html);
  console.log('Saved to test-out.html');

  await browser.close();
})();
