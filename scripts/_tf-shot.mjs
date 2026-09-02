import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3151";
const OUT = process.argv[3] ?? path.join(process.env.TEMP ?? "/tmp", "tf");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--disable-gpu"],
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR:", String(e).split("\n")[0].slice(0, 200)));
page.on("console", (m) => {
  if (/error|hydrat/i.test(m.text())) console.log("CONSOLE:", m.text().slice(0, 200));
});

await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
await page.goto(`${BASE}/tea-finder`, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 1500));

const shotSection = async (name) => {
  const h = await page.evaluateHandle(() => {
    const el = document.querySelector("main section:nth-of-type(2)");
    return el;
  });
  const el = h.asElement();
  if (el) {
    await el.scrollIntoView();
    await new Promise((r) => setTimeout(r, 600));
    await el.screenshot({ path: path.join(OUT, name) });
    console.log("saved", name);
  }
};

await shotSection("q1.png");

// answer through to the result
for (let i = 0; i < 4; i++) {
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button[aria-pressed]')];
    btns[0]?.click();
  });
  await new Promise((r) => setTimeout(r, 700));
}
await new Promise((r) => setTimeout(r, 1200));
await shotSection("result.png");

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto(`${BASE}/tea-finder`, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 1200));
await shotSection("q1-mobile.png");

const overflow = await page.evaluate(() => ({
  s: document.documentElement.scrollWidth,
  c: document.documentElement.clientWidth,
}));
console.log("mobile overflow:", JSON.stringify(overflow), overflow.s <= overflow.c + 1 ? "OK" : "**H-SCROLL**");

await browser.close();
console.log("out:", OUT);
