/**
 * Image QA helper. Renders every entry in lib/images.ts as a labelled contact
 * sheet — the photograph beside the alt text written for it — so the two can be
 * compared at a glance. Not part of the app build.
 *
 * This exists because stock-CDN photographs drift: nine entries had to be
 * removed and six alts corrected during the redesign, including one product card
 * whose caption described a brass kettle and whose photograph was a street stall.
 *
 *   node scripts/contactsheet.mjs [outFile]
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const OUT = path.resolve(process.argv[2] ?? "shots/images.png");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const TMP = path.join(path.dirname(OUT), ".contact-sheet.html");

const src = fs.readFileSync("lib/images.ts", "utf8");
const rows = [...src.matchAll(/^ {2}(\w+):\s*img\((\d+),\s*"([^"]+)"/gm)].map((m) => ({
  key: m[1],
  id: m[2],
  alt: m[3],
}));

if (!rows.length) {
  console.error("No image entries found in lib/images.ts.");
  process.exit(1);
}

const cells = rows
  .map(
    (r) => `<figure>
  <img src="https://images.pexels.com/photos/${r.id}/pexels-photo-${r.id}.jpeg?auto=compress&cs=tinysrgb&w=400" alt="">
  <figcaption><b>${r.key}</b><br>${r.alt}</figcaption>
</figure>`
  )
  .join("");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  TMP,
  `<!doctype html><meta charset="utf-8"><style>
    body { font: 11px/1.35 system-ui, sans-serif; background: #fff; margin: 0; padding: 12px }
    .g { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px }
    figure { margin: 0 }
    img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; background: #eee }
    figcaption { margin-top: 4px }
    b { color: #b00 }
  </style><div class="g">${cells}</div>`
);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--disable-gpu"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1500, height: 1000 });
await page.goto(`file://${TMP.split(path.sep).join("/")}`, {
  waitUntil: "networkidle0",
  timeout: 120000,
});
await page.screenshot({ path: OUT, fullPage: true });
await browser.close();
fs.rmSync(TMP, { force: true });

console.log(`${rows.length} images → ${OUT}`);
