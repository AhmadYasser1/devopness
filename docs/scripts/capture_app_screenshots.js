const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function capture(urls, outDir) {
  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await fs.promises.mkdir(outDir, { recursive: true });
    for (const { url, name } of urls) {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      const filepath = path.join(outDir, `${name}.png`);
      await page.setViewport({ width: 1500, height: 900 });
      await page.screenshot({ path: filepath, fullPage: true });
      console.log(`Saved: ${filepath}`);
    }
  } finally {
    await browser.close();
  }
}

(async () => {
  const mode = process.argv[2] || 'before';
  const base = process.env.DOCS_BASE || 'http://localhost:5050';
  const urls = [
    { url: `${base}/docs/applications/list-applications`, name: `${mode}-applications-list-applications` },
    { url: `${base}/docs/applications/view-application`, name: `${mode}-applications-view-application` },
  ];
  const outDir = path.resolve(process.cwd(), 'screenshots', mode);
  await capture(urls, outDir);
})().catch((e) => { console.error(e); process.exit(1); });
