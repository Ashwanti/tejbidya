"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PACKAGING, teas } from "@/lib/teas";
import { site } from "@/lib/site";
import { Arrow, Eyebrow, LeafMark } from "./ui";

/**
 * INQUIRY FORM — Request a Sample / Request a Quote
 * ----------------------------------------------------------------------------
 * The primary conversion path on the site. Tejbidya sells by the 50-100 kg lot,
 * so the goal is a qualified enquiry, not a checkout.
 *
 * SUBMISSION. Posts to /api/inquiry. That route validates server-side and
 * forwards to whatever the client wires up (see the route file). Until an email
 * service or CRM is connected it records the enquiry and returns success, and
 * the confirmation panel also offers a pre-filled mailto so nothing is lost in
 * the meantime.
 */

type Status = "idle" | "sending" | "sent" | "error";

const VOLUMES = [
  "Sample only",
  "50 – 100 kg",
  "100 – 500 kg",
  "500 – 2,000 kg",
  "Over 2,000 kg",
  "Not sure yet",
] as const;

/* Underlined fields rather than boxes: on a warm paper ground a grid of outlined
   inputs reads as a database form. A single hairline that darkens on focus keeps
   the page editorial and still marks focus unambiguously. */
const FIELD =
  "w-full border-b border-line-strong bg-transparent px-0 py-3 text-[0.95rem] " +
  "text-ink placeholder:text-ink-mute/70 transition-colors " +
  "focus:border-ink focus:outline-none";

const LABEL = "t-meta block text-ink-mute";

export default function InquiryForm() {
  const params = useSearchParams();

  const [kind, setKind] = useState<"sample" | "quote">("sample");
  const [selectedTeas, setSelectedTeas] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentName, setSentName] = useState("");

  /** Deep links: /request?type=quote&tea=black-tea */
  useEffect(() => {
    const t = params.get("type");
    if (t === "quote" || t === "sample") setKind(t);

    const tea = params.get("tea");
    if (tea && teas.some((x) => x.slug === tea)) {
      setSelectedTeas((prev) => (prev.includes(tea) ? prev : [...prev, tea]));
    }
  }, [params]);

  const toggleTea = (slug: string) =>
    setSelectedTeas((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );

  /** A mailto fallback, pre-filled, shown on success and on error. */
  const mailtoHref = useMemo(() => {
    const subject = `${kind === "sample" ? "Sample request" : "Quote request"} — Tejbidya`;
    return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
  }, [kind]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // ---- Client-side validation (the API validates again, independently) ----
    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = "Please tell us your name.";
    if (!data.company?.trim()) next.company = "Please add your company.";
    if (!data.email?.trim()) next.email = "We need an email to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email))
      next.email = "That email doesn't look right.";
    if (!data.country?.trim()) next.country = "Which market are you in?";
    if (!data.consent) next.consent = "Please confirm before sending.";

    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind, teas: selectedTeas }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setSentName(data.name.split(" ")[0] ?? "");
      setStatus("sent");
      form.reset();
      setSelectedTeas([]);
    } catch {
      setStatus("error");
    }
  }

  /* --------------------------------------------------------- SUCCESS PANEL */
  if (status === "sent") {
    return (
      <div className="fade-swap rounded-xs border border-line bg-paper p-8 text-center sm:p-12">
        <LeafMark className="mx-auto h-8 w-8 text-brass-600" />
        <h3 className="t-h1 mt-5">
          Thank you{sentName ? `, ${sentName}` : ""}.
        </h3>
        <p className="t-body mx-auto mt-4 max-w-md text-ink-soft">
          Your {kind === "sample" ? "sample request" : "quote request"} has been
          received. Someone from the team will come back to you directly.
        </p>
        <p className="t-small mx-auto mt-5 max-w-md text-ink-mute">
          If it is urgent, you can also reach us at{" "}
          <a href={mailtoHref} className="link-draw text-ink/75">
            {site.email}
          </a>{" "}
          or{" "}
          <a href={`tel:${site.phoneHref}`} className="link-draw text-ink/75">
            {site.phone}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link-draw mt-7 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-mute transition-colors hover:text-ink"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  /* ------------------------------------------------------------------ FORM */
  return (
    <form onSubmit={onSubmit} noValidate className="overflow-hidden rounded-xs border border-line bg-paper">
      {/* Type switch */}
      <div className="grid grid-cols-2 gap-px bg-line">
        {(["sample", "quote"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={`px-5 py-5 text-left transition-colors duration-300 ${
              kind === k ? "bg-leaf-900 text-paper" : "bg-paper hover:bg-paper-soft"
            }`}
          >
            <span className="t-h3 block">
              {k === "sample" ? "Request samples" : "Request a quote"}
            </span>
            <span
              className={`mt-1 block text-[0.82rem] ${
                kind === k ? "text-paper/60" : "text-ink-mute"
              }`}
            >
              {k === "sample"
                ? "Cup it before you commit"
                : "Pricing for your volume and format"}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-9 p-6 sm:p-9">
        {/* ---- About you ---- */}
        <fieldset>
          <legend className="sr-only">Your details</legend>
          <Eyebrow className="text-brass-600">Your details</Eyebrow>

          <div className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            <Field label="Full name" name="name" error={errors.name} required autoComplete="name" />
            <Field label="Company" name="company" error={errors.company} required autoComplete="organization" />
            <Field label="Email" name="email" type="email" error={errors.email} required autoComplete="email" />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" optional />
            <Field
              label="Country / market"
              name="country"
              error={errors.country}
              required
              autoComplete="country-name"
              placeholder="e.g. United Kingdom"
            />
            <div>
              <label htmlFor="business" className={LABEL}>
                Type of business <span className="normal-case tracking-normal opacity-50">(optional)</span>
              </label>
              <select id="business" name="business" className={`${FIELD} cursor-pointer`} defaultValue="">
                <option value="">Select…</option>
                <option>Importer / distributor</option>
                <option>Retailer / grocery</option>
                <option>Café or foodservice</option>
                <option>Private label / own brand</option>
                <option>Blender / repacker</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* ---- Teas ---- */}
        <fieldset>
          <legend className="sr-only">Teas of interest</legend>
          <Eyebrow className="text-brass-600">Teas of interest</Eyebrow>
          <div className="mt-6 flex flex-wrap gap-2">
            {teas.map((t) => {
              const on = selectedTeas.includes(t.slug);
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => toggleTea(t.slug)}
                  aria-pressed={on}
                  className={`rounded-xs border px-3.5 py-2 text-[0.78rem] transition-colors duration-300 ${
                    on
                      ? "border-leaf-900 bg-leaf-900 text-paper"
                      : "border-line-strong text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
          {/* Selections travel with the form for non-JS-parsed submissions too. */}
          <input type="hidden" name="teasCsv" value={selectedTeas.join(", ")} />
        </fieldset>

        {/* ---- Requirement ---- */}
        <fieldset>
          <legend className="sr-only">Your requirement</legend>
          <Eyebrow className="text-brass-600">Your requirement</Eyebrow>

          <div className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            <div>
              <label htmlFor="volume" className={LABEL}>
                Estimated volume
              </label>
              <select id="volume" name="volume" className={`${FIELD} cursor-pointer`} defaultValue="">
                <option value="">Select…</option>
                {VOLUMES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="packaging" className={LABEL}>
                Packaging format
              </label>
              <select id="packaging" name="packaging" className={`${FIELD} cursor-pointer`} defaultValue="">
                <option value="">Select…</option>
                {PACKAGING.map((p) => (
                  <option key={p.name}>{p.name}</option>
                ))}
                <option>Not decided</option>
              </select>
            </div>
          </div>

          <div className="mt-7">
            <label htmlFor="message" className={LABEL}>
              Anything else we should know?{" "}
              <span className="normal-case tracking-normal opacity-50">(optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className={`${FIELD} resize-y`}
              placeholder="Target price point, certifications you require, delivery deadline, blend brief…"
            />
          </div>
        </fieldset>

        {/* ---- Consent ---- */}
        <div>
          <label className="flex cursor-pointer items-start gap-3.5">
            <input
              type="checkbox"
              name="consent"
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#232B22]"
            />
            <span className="text-[0.85rem] leading-relaxed text-ink-soft">
              I agree that Tejbidya may use these details to respond to my
              enquiry.
            </span>
          </label>
          {errors.consent && (
            <p className="mt-2 text-[0.8rem] text-[#9B3A2F]">{errors.consent}</p>
          )}
        </div>

        {/* ---- Submit ---- */}
        <div className="flex flex-wrap items-center gap-5 border-t border-line pt-7">
          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex items-center gap-2.5 rounded-xs bg-leaf-900 px-6 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-paper transition-colors duration-300 hover:bg-leaf-700 disabled:pointer-events-none disabled:opacity-40"
          >
            {status === "sending"
              ? "Sending…"
              : kind === "sample"
                ? "Send sample request"
                : "Send quote request"}
            {status !== "sending" && <Arrow />}
          </button>

          <p className="text-[0.8rem] text-ink-mute">
            Or email{" "}
            <a href={mailtoHref} className="link-draw text-ink-soft">
              {site.email}
            </a>
          </p>
        </div>

        {status === "error" && (
          <p
            role="alert"
            className="border border-[#9B3A2F]/30 bg-[#9B3A2F]/5 px-5 py-4 text-[0.875rem] text-[#7d2f26]"
          >
            Something went wrong sending that. Please email us directly at{" "}
            <a href={mailtoHref} className="link-draw font-medium">
              {site.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}

/* --------------------------------------------------------------- SUB-FIELD */

function Field({
  label,
  name,
  type = "text",
  error,
  required,
  optional,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={LABEL}>
        {label}
        {optional && (
          <span className="normal-case tracking-normal opacity-50"> (optional)</span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${FIELD} ${error ? "border-[#9B3A2F]" : ""}`}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[0.78rem] text-[#9B3A2F]">
          {error}
        </p>
      )}
    </div>
  );
}
