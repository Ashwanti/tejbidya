"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_CODE,
  LANGUAGES,
  applyLanguage,
  ensureTranslateReady,
  onTranslated,
  readLanguageCookie,
  retranslate,
} from "@/lib/translate";

/**
 * LANGUAGE SELECTOR
 * ----------------------------------------------------------------------------
 * Switching happens in place — no reload. Picking a language drives Google's
 * hidden <select> directly (see lib/translate.ts), so the page is retranslated
 * where it stands, scroll position and cart drawer intact.
 *
 * The widget is fetched lazily, warmed the moment a pointer touches the button.
 * By the time anyone has read down the list it is loaded, so the switch itself
 * feels immediate; a visitor who never opens the menu never downloads it.
 */
export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(DEFAULT_CODE);
  const [busy, setBusy] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  /* The cookie is the single source of truth for what is on screen: it is the
     only thing Google acts on at load, so deriving the label from anything else
     risks showing "Arabic" on a page rendering English. Read after mount, not
     during render, so server and client markup agree. */
  useEffect(() => {
    const active = readLanguageCookie();
    if (!active || active === DEFAULT_CODE) return;

    setSelected(active);

    // A saved choice means Google is about to retranslate this load. The head
    // bootstrap already covered the page; load the widget now and lift the
    // cover the moment the swap lands.
    void ensureTranslateReady();
    return onTranslated(() => {
      document.documentElement.removeAttribute("data-translating");
    });
  }, []);

  /* App Router swaps page content client-side. Anything Google's own observer
     misses on that swap would sit there in English, so nudge it after each
     navigation. */
  useEffect(() => {
    if (selected === DEFAULT_CODE) return;
    const timer = window.setTimeout(() => retranslate(selected), 150);
    return () => window.clearTimeout(timer);
  }, [pathname, selected]);

  /** Start fetching Google before it is needed, so the switch itself is instant. */
  const warm = useCallback(() => {
    void ensureTranslateReady();
  }, []);

  const changeLanguage = useCallback(
    async (code: string) => {
      setOpen(false);
      if (code === selected || busy) return;

      setBusy(true);
      const result = await applyLanguage(code);

      if (result === "applied") {
        setSelected(code);
        setBusy(false);
        return;
      }

      /* Two ways to land here, both ending in a reload:
         - "needs-reload": going back to English. Google has no in-place revert
           (it omits the page's own language and reloads internally anyway), so
           we clear the cookie and reload ourselves, which is deterministic.
         - "failed": Google is blocked or offline. The cookie is written either
           way, so the reload still lands on the right language rather than
           silently doing nothing. */
      document.documentElement.setAttribute("data-translating", "");
      window.location.reload();
    },
    [busy, selected]
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const current = LANGUAGES.find((language) => language.code === selected) ?? LANGUAGES[0];

  return (
    <div ref={containerRef} className="fixed bottom-4 left-4 z-[70]">
      <div className="relative">
        <button
          type="button"
          aria-label={`Language: ${current.label}. Change language`}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-busy={busy}
          onPointerEnter={warm}
          onFocus={warm}
          onClick={() => {
            warm();
            setOpen((value) => !value);
          }}
          translate="no"
          className="notranslate group inline-flex items-center gap-2.5 rounded-full border border-line bg-paper/90 px-2.5 py-2 text-left text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ink shadow-[0_18px_40px_-26px_rgba(34,32,28,0.45)] backdrop-blur-sm transition-all duration-300 hover:border-line-strong hover:bg-paper active:scale-[0.99]"
        >
          <span className="text-base leading-none" aria-hidden="true">
            {current.flag}
          </span>
          <span className="text-[0.7rem] tracking-[0.14em] text-ink">
            {current.code.toUpperCase()}
          </span>

          {busy ? (
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin text-ink-mute"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="8" cy="8" r="6" opacity="0.25" />
              <path d="M14 8a6 6 0 0 0-6-6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className={`h-3.5 w-3.5 text-ink-mute transition-transform duration-300 ${
                open ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3.5 6.25 8 10.75l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {open && (
          <div
            role="listbox"
            aria-label="Language options"
            translate="no"
            className="notranslate absolute bottom-[calc(100%+0.7rem)] left-0 w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-line bg-paper/98 shadow-[0_22px_60px_-30px_rgba(34,32,28,0.45)] backdrop-blur-md"
          >
            <div className="max-h-[min(70vh,20rem)] overflow-y-auto p-1.5">
              {LANGUAGES.map((language) => {
                const isActive = selected === language.code;

                return (
                  <button
                    key={language.code}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    translate="no"
                    onClick={() => void changeLanguage(language.code)}
                    className={`notranslate flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 ${
                      isActive ? "bg-paper-soft text-ink" : "text-ink-soft hover:bg-paper-soft hover:text-ink"
                    }`}
                  >
                    <span className="text-lg leading-none" aria-hidden="true">
                      {language.flag}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span
                        className="block text-[0.8rem] font-medium tracking-[0.02em] text-ink"
                        dir={language.rtl ? "rtl" : "ltr"}
                      >
                        {language.nativeName}
                      </span>
                    </span>
                    {isActive && (
                      <span className="text-[0.64rem] font-medium uppercase tracking-[0.14em] text-brass-600">
                        Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Google's terms require the attribution to stay visible once their
                own branded widget is hidden. */}
            <p className="border-t border-line px-3.5 py-2 text-[0.6rem] uppercase tracking-[0.14em] text-ink-mute">
              Translated by Google
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
