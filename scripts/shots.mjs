/**
 * Visual QA helper. Drives the locally installed Chrome to capture full-page
 * screenshots (and a mobile pass) of every route, so layout can be eyeballed
 * rather than assumed. Not part of the app build.
 *
 *   node scripts/shots.mjs [baseUrl] [outDir]
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3112";
const OUT = process.argv[3] ?? path.join(process.env.TEMP ?? "/tmp", "shots");

const CHROME =
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const ROUTES = [
  ["home", "/"],
  ["teas", "/teas"],
  ["pdp-black", "/teas/black-tea"],
  ["pdp-white", "/teas/white-tea"],
  ["origins", "/origins"],
  ["journey", "/journey"],
  ["finder", "/tea-finder"],
  ["wholesale", "/wholesale"],
  ["request", "/request"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["faq", "/faq"],
];

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--disable-gpu"],
});

async function shoot(page, name, url, full) {
  await page.goto(`${BASE}${url}`, { waitUntil: "networkidle0", timeout: 60000 });

  // Force every scroll-reveal to its visible state and settle lazy images.
  await page.evaluate(async () => {
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => el.setAttribute("data-reveal", "visible"));
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 900));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  });
  await new Promise((r) => setTimeout(r, 700));

  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage: full,
  });
  console.log(`  ${name}`);
}

console.log("Desktop 1440x900 (full page):");
const desktop = await browser.newPage();
await desktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
for (const [name, url] of ROUTES) await shoot(desktop, name, url, true);

console.log("Mobile 390x844 (full page):");
const mobile = await browser.newPage();
await mobile.setViewport({
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
for (const [name, url] of [
  ["home", "/"],
  ["pdp-black", "/teas/black-tea"],
  ["origins", "/origins"],
  ["request", "/request"],
])
  await shoot(mobile, `m-${name}`, url, true);

await browser.close();
console.log(`\nWritten to ${OUT}`);
