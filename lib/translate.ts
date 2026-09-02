/**
 * GOOGLE TRANSLATE — IN-PLACE LANGUAGE SWITCHING
 * ----------------------------------------------------------------------------
 * The naive integration writes a `googtrans` cookie and reloads, because that
 * cookie is only read at page load. That is slow and throws the whole page
 * away on every switch.
 *
 * This does it the other way round. Google's widget injects a hidden
 * `<select class="goog-te-combo">`; setting its value and firing a `change`
 * event translates the live DOM with no navigation at all. So:
 *
 *   - the widget is loaded once, lazily (on first hover/open of the selector,
 *     or immediately when a saved language needs restoring),
 *   - switching = set the select + dispatch change. No reload, no flash,
 *   - the cookie is still written, but purely so the choice survives a real
 *     page load; it is never the switching mechanism.
 *
 * The one exception is English. Google leaves the page's own language out of
 * its list and its internal revert reloads the document regardless, so that
 * single direction clears the cookie and reloads — see applyLanguage.
 *
 * The widget's container is created here in JS rather than rendered by React.
 * Google mutates that node the moment it initialises, and a React-owned node
 * being rewritten underneath it is exactly what produced the hydration error.
 */

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          config: Record<string, unknown>,
          target: string
        ) => unknown;
      };
    };
  }
}

export type LanguageOption = {
  code: string;
  label: string;
  nativeName: string;
  flag: string;
  /** Written right-to-left — used to mirror the option row, not the page. */
  rtl?: boolean;
};

/** Our short code → the code Google's `goog-te-combo` actually expects. */
export const GOOGLE_LANG_MAP: Record<string, string> = {
  ar: "ar",
  zh: "zh-CN",
  nl: "nl",
  fr: "fr",
  de: "de",
  el: "el",
  it: "it",
  fa: "fa",
  pt: "pt",
  ru: "ru",
  en: "en",
};

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ar", label: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
  { code: "zh", label: "Chinese (Simplified)", nativeName: "中文 (简体)", flag: "🇨🇳" },
  { code: "nl", label: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "fr", label: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", label: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "el", label: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "it", label: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "fa", label: "Persian", nativeName: "فارسی", flag: "🇮🇷", rtl: true },
  { code: "pt", label: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", label: "Russian", nativeName: "Русский", flag: "🇷🇺" },
];

export const DEFAULT_CODE = "en";

const CONTAINER_ID = "google_translate_element";
const SCRIPT_ID = "google-translate-script";
const SCRIPT_SRC =
  "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

/** Restricting the list keeps Google's own <select> small and guarantees every
 *  code we offer — English included, which is what "back to original" uses —
 *  is actually present as an option. */
const INCLUDED_LANGUAGES = Object.values(GOOGLE_LANG_MAP).join(",");

/* ---------------------------------------------------------------------------
   Cookie — persistence only, never the switching mechanism.
   ------------------------------------------------------------------------- */

function codeFromGoogle(mapped: string): string | null {
  const hit = Object.entries(GOOGLE_LANG_MAP).find(([, google]) => google === mapped);
  return hit ? hit[0] : null;
}

/** The language a previous visit left behind, if any. */
export function readLanguageCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  if (!match) return null;
  const mapped = decodeURIComponent(match[1]).split("/").pop();
  return mapped ? codeFromGoogle(mapped) : null;
}

/**
 * Persist the choice for the next real page load.
 *
 * English has to *delete* the cookie rather than set it to `en`: a surviving
 * cookie makes Google re-translate on the next load whatever the UI says. It
 * is expired across every path/domain form the widget may have written.
 */
export function writeLanguageCookie(code: string) {
  if (typeof document === "undefined") return;
  const mapped = GOOGLE_LANG_MAP[code] ?? "en";
  const { hostname } = window.location;

  if (mapped === "en") {
    for (const scope of [
      "path=/",
      `path=/; domain=${hostname}`,
      `path=/; domain=.${hostname}`,
    ]) {
      document.cookie = `googtrans=; ${scope}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    return;
  }

  // max-age, not a session cookie: the choice has to survive a browser restart.
  document.cookie = `googtrans=/auto/${mapped}; path=/; max-age=31536000; SameSite=Lax`;
}

/* ---------------------------------------------------------------------------
   Widget loading
   ------------------------------------------------------------------------- */

/** Google's hidden <select>. Its presence is the only reliable "ready" signal. */
export function getCombo(): HTMLSelectElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLSelectElement>("select.goog-te-combo");
}

let readyPromise: Promise<HTMLSelectElement | null> | null = null;

/**
 * Load the widget once and resolve with its <select>. Safe to call as often as
 * you like — the in-flight promise is shared, so hovering the selector twenty
 * times still loads Google exactly once. Resolves `null` if Google never
 * arrives (offline, blocked, region-restricted) so callers can fall back.
 */
export function ensureTranslateReady(): Promise<HTMLSelectElement | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const existing = getCombo();
  if (existing) return Promise.resolve(existing);
  if (readyPromise) return readyPromise;

  readyPromise = new Promise((resolve) => {
    if (!document.getElementById(CONTAINER_ID)) {
      const container = document.createElement("div");
      container.id = CONTAINER_ID;
      container.className = "notranslate";
      container.setAttribute("aria-hidden", "true");
      // Visually hidden rather than display:none — Google's <select> has to be
      // laid out for the widget to behave, it just must never be seen.
      container.style.cssText =
        "position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;" +
        "overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;";
      document.body.appendChild(container);
    }

    window.googleTranslateElementInit = () => {
      const TranslateElement = window.google?.translate?.TranslateElement;
      if (!TranslateElement) return;
      new TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: INCLUDED_LANGUAGES,
          autoDisplay: false,
        },
        CONTAINER_ID
      );
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }

    // The widget builds its <select> asynchronously after the callback fires,
    // so polling for it is the only honest way to know it is usable.
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const combo = getCombo();
      if (combo) {
        window.clearInterval(timer);
        resolve(combo);
      } else if (Date.now() - startedAt > 10000) {
        window.clearInterval(timer);
        readyPromise = null; // let a later attempt retry from scratch
        resolve(null);
      }
    }, 60);
  });

  return readyPromise;
}

/* ---------------------------------------------------------------------------
   Switching
   ------------------------------------------------------------------------- */

/** What Google says it is currently showing. It stamps this on <html> the
 *  moment a switch is accepted, which makes it the one trustworthy receipt
 *  that a dispatch actually landed. */
function activeGoogleLang(): string | null {
  const lang = document.documentElement.lang;
  return lang && lang !== "en" ? lang : null;
}

function fire(combo: HTMLSelectElement, value: string) {
  combo.value = value;
  combo.dispatchEvent(new Event("change"));
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Google rewrites swapped phrases as <font> nodes, so their appearance is the
 * first honest sign that translated text — not just an accepted request — is
 * on screen. Gives up quietly: this only sharpens the busy state, it is never
 * allowed to decide whether the switch worked.
 */
async function waitForTextSwap(budgetMs = 2500) {
  for (let elapsed = 0; elapsed < budgetMs; elapsed += 100) {
    if (document.getElementsByTagName("font").length > 0) return;
    await wait(100);
  }
}

export type ApplyResult = "applied" | "needs-reload" | "failed";

/**
 * Switch the live page to `code`.
 *
 * Two things make this less trivial than "set the select and fire change":
 *
 *  - The <select> exists in the DOM a beat before Google has wired its own
 *    handler to it, so the first dispatch is quietly swallowed. There is no
 *    ready event to wait on, so we dispatch, check whether it took, and
 *    dispatch again if it did not. In practice it lands on the first or
 *    second try and costs nothing when it lands first.
 *
 *  - Google omits the page's own language from the list, and its internal
 *    "back to the original" path reloads the document anyway. So English is
 *    not a switch at all — the caller is told to reload, which is both
 *    deterministic and no slower than what Google would have done.
 */
export async function applyLanguage(code: string): Promise<ApplyResult> {
  if (code === DEFAULT_CODE) {
    writeLanguageCookie(code);
    return "needs-reload";
  }

  const mapped = GOOGLE_LANG_MAP[code] ?? "en";
  const combo = await ensureTranslateReady();
  if (!combo) return "failed";

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const live = getCombo();
    if (!live) return "failed";
    fire(live, mapped);

    // Poll briefly for Google's receipt before trying again.
    for (let elapsed = 0; elapsed < 700; elapsed += 80) {
      await wait(80);
      if (activeGoogleLang() === mapped) {
        // Google sets its own session cookie; ours is the durable one that
        // carries the choice to the next visit.
        writeLanguageCookie(code);
        // The flag is raised when the request is accepted, not when the text
        // comes back. Hold on until the swap is visible so the caller's busy
        // state covers the wait instead of ending in the middle of it.
        await waitForTextSwap();
        return "applied";
      }
    }
  }

  return "failed";
}

/**
 * Re-run the current translation over freshly rendered content. App Router
 * navigations swap large subtrees in, and anything Google's own observer
 * misses would otherwise sit there in English.
 */
export function retranslate(code: string) {
  const combo = getCombo();
  if (!combo || code === DEFAULT_CODE) return;
  fire(combo, GOOGLE_LANG_MAP[code] ?? "en");
}

/** True once Google has actually swapped the DOM. */
export function isTranslated(): boolean {
  if (typeof document === "undefined") return false;
  const { classList } = document.documentElement;
  return classList.contains("translated-ltr") || classList.contains("translated-rtl");
}

/**
 * Run `done` when the first translation lands (or when `timeoutMs` is up, so a
 * blocked Google can never leave the page covered forever).
 */
export function onTranslated(done: () => void, timeoutMs = 6000): () => void {
  if (typeof document === "undefined") return () => {};

  let settled = false;
  let observer: MutationObserver | null = null;
  let timer = 0;

  const finish = () => {
    if (settled) return;
    settled = true;
    observer?.disconnect();
    window.clearTimeout(timer);
    // Google flags the document as translated a beat before the swapped text
    // is actually painted. Uncovering on the flag alone shows one frame of
    // English, so let it settle first.
    window.setTimeout(done, 350);
  };

  if (isTranslated()) {
    finish();
    return finish;
  }

  observer = new MutationObserver(() => {
    if (isTranslated()) finish();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  timer = window.setTimeout(finish, timeoutMs);
  return finish;
}

/* ---------------------------------------------------------------------------
   Pre-paint bootstrap
   ------------------------------------------------------------------------- */

/**
 * Inlined in <head> (app/layout.tsx). Deliberately tiny: it only raises the
 * cover when a saved non-English choice exists, so a returning visitor never
 * sees a flash of English before the swap. Loading is left to the module above,
 * which is why English visitors never fetch Google at all.
 *
 * The timeout is a hard failsafe: if the app's JS never runs, the cover still
 * lifts on its own rather than leaving a blank page.
 */
export const translateBootstrapScript = `(function () {
  var match = document.cookie.match(/(?:^|;\\s*)googtrans=([^;]*)/);
  var mapped = match ? decodeURIComponent(match[1]).split("/").pop() : null;
  if (!mapped || mapped === "en") return;
  var html = document.documentElement;
  html.setAttribute("data-translating", "");
  setTimeout(function () { html.removeAttribute("data-translating"); }, 6000);
})();`;
