/**
 * Functional + accessibility audit. Drives real Chrome against a running build.
 *   node scripts/audit.mjs http://localhost:3115
 */
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] ?? "http://localhost:3115";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const ROUTES = [
  "/", "/teas", "/teas/black-tea", "/teas/white-tea", "/origins", "/journey",
  "/tea-finder", "/wholesale", "/request", "/about", "/contact", "/faq",
  "/privacy", "/terms", "/no-such-page",
];

let failures = 0;
const fail = (m) => { console.log(`  FAIL  ${m}`); failures++; };
const pass = (m) => console.log(`  ok    ${m}`);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars"],
});

/* ---------------------------------------------------- 1. Page-level audit */
console.log("\n1. Page audit (structure, alt text, overflow)");
const page = await browser.newPage();
const consoleErrors = [];
// The suite deliberately visits a missing URL to check the 404 page, which
// logs a resource error of its own. Only record errors outside that visit.
let capturing = true;
page.on("console", (m) => capturing && m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => capturing && consoleErrors.push(String(e)));

for (const route of ROUTES) {
  capturing = route !== "/no-such-page";
  await page.setViewport({ width: 1440, height: 900 });
  const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
  const status = res.status();
  const expected = route === "/no-such-page" ? 404 : 200;
  if (status !== expected) fail(`${route} returned ${status}, expected ${expected}`);

  const r = await page.evaluate(() => {
    const h1s = [...document.querySelectorAll("h1")];
    const imgsNoAlt = [...document.querySelectorAll("img")].filter(
      (i) => !i.hasAttribute("alt")
    ).length;
    const emptyLinks = [...document.querySelectorAll("a")].filter(
      (a) => !a.textContent.trim() && !a.getAttribute("aria-label")
    ).length;
    const unlabelled = [...document.querySelectorAll("input,select,textarea")].filter(
      (el) => {
        if (el.type === "hidden") return false;
        const id = el.id;
        return !(
          (id && document.querySelector(`label[for="${id}"]`)) ||
          el.closest("label") ||
          el.getAttribute("aria-label")
        );
      }
    ).length;
    const buttonsNoName = [...document.querySelectorAll("button")].filter(
      (b) => !b.textContent.trim() && !b.getAttribute("aria-label")
    ).length;
    return {
      h1Count: h1s.length,
      h1: h1s[0]?.textContent.trim().slice(0, 50) ?? "",
      title: document.title,
      desc:
        document.querySelector('meta[name="description"]')?.content?.length ?? 0,
      imgsNoAlt,
      emptyLinks,
      unlabelled,
      buttonsNoName,
      lang: document.documentElement.lang,
    };
  });

  if (r.h1Count !== 1) fail(`${route} has ${r.h1Count} <h1> (want exactly 1)`);
  if (r.imgsNoAlt) fail(`${route} has ${r.imgsNoAlt} <img> without alt`);
  if (r.emptyLinks) fail(`${route} has ${r.emptyLinks} links with no accessible name`);
  if (r.unlabelled) fail(`${route} has ${r.unlabelled} unlabelled form controls`);
  if (r.buttonsNoName) fail(`${route} has ${r.buttonsNoName} buttons with no name`);
  if (!r.title) fail(`${route} has no <title>`);
  if (route !== "/no-such-page" && r.desc < 50)
    fail(`${route} meta description too short (${r.desc})`);
  if (r.lang !== "en") fail(`${route} html lang is "${r.lang}"`);

  // Horizontal overflow across three widths.
  for (const w of [390, 768, 1440]) {
    await page.setViewport({ width: w, height: 900 });
    await new Promise((r2) => setTimeout(r2, 250));
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    if (over > 1) fail(`${route} overflows horizontally by ${over}px at ${w}px`);
  }
}
capturing = true;
if (!failures) pass("all routes: structure, alt text, labels, no overflow");

/* ------------------------------------------------------- 2. Tea Finder */
console.log("\n2. Tea Finder flow");
await page.setViewport({ width: 1440, height: 900 });
await page.goto(`${BASE}/tea-finder`, { waitUntil: "networkidle0" });
for (let step = 0; step < 4; step++) {
  const btns = await page.$$('[aria-pressed]');
  const target = btns.find(Boolean);
  if (!target) { fail(`no options at step ${step + 1}`); break; }
  await target.click();
  await new Promise((r) => setTimeout(r, 500));
}
// .eyebrow uppercases via CSS text-transform, and innerText reflects the
// rendered casing - so this match must be case-insensitive.
const finderResult = await page.evaluate(() => ({
  hasMatch: /your match/i.test(document.body.innerText),
}));
finderResult.hasMatch
  ? pass("four answers produce a recommendation")
  : fail("Tea Finder did not reach a result");

/* ------------------------------------------------------- 3. Inquiry form */
console.log("\n3. Inquiry form");
await page.goto(`${BASE}/request?type=quote&tea=black-tea`, {
  waitUntil: "networkidle0",
});

// Validation should block an empty submit.
await page.click('button[type="submit"]');
await new Promise((r) => setTimeout(r, 400));
const blocked = await page.evaluate(() =>
  document.body.innerText.includes("Please tell us your name")
);
blocked ? pass("empty submit is blocked with field errors") : fail("empty submit was not validated");

// Fill and submit for real.
await page.type("#name", "Jane Doe");
await page.type("#company", "Alba Tea Co");
await page.type("#email", "jane@albatea.co.uk");
await page.type("#country", "United Kingdom");
await page.click('input[name="consent"]');
await page.click('button[type="submit"]');
await new Promise((r) => setTimeout(r, 1800));
const sent = await page.evaluate(() => document.body.innerText.includes("Thank you"));
sent ? pass("valid submission reaches the confirmation panel") : fail("form did not confirm");

/* ------------------------------------------------------- 4. Console errors */
console.log("\n4. Runtime errors");
// Only favicon noise is ignored; a real 404 for any other asset should fail.
const real = consoleErrors.filter((e) => !/favicon/i.test(e));
real.length ? fail(`console errors: ${real.slice(0, 3).join(" | ")}`) : pass("no console errors");

await browser.close();
console.log(`\n${failures === 0 ? "PASS — no issues found" : `${failures} issue(s) found`}`);
process.exit(failures ? 1 : 0);
