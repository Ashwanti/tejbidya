import { NextResponse } from "next/server";

/**
 * POST /api/inquiry
 * ----------------------------------------------------------------------------
 * Receives sample and quote requests from the site.
 *
 * >>> INTEGRATION POINT <<<
 * This route validates and normalises the enquiry, then hands it to
 * `deliver()`. Out of the box `deliver()` forwards to a webhook if one is
 * configured and otherwise just logs, so the form works from the first deploy
 * without a mail account. Wire ONE of these up before going live:
 *
 *   1. Webhook / CRM / Zapier / Make - set INQUIRY_WEBHOOK_URL and you are done.
 *   2. Email - add an email SDK (Resend, SendGrid, Postmark) and send from
 *      deliver(). Send to site.email.
 *
 * Until then every enquiry is written to the server log, and the browser also
 * offers the visitor a pre-filled mailto so nothing is silently dropped.
 */

export const runtime = "nodejs";

type Payload = {
  kind: "sample" | "quote";
  name: string;
  company: string;
  email: string;
  phone?: string;
  country: string;
  business?: string;
  volume?: string;
  packaging?: string;
  message?: string;
  teas?: string[];
};

/**
 * Trim, collapse whitespace, cap length, and neutralise control characters.
 * Done by code point rather than a regex literal so the source file stays
 * free of literal control bytes.
 */
function clean(v: unknown, max = 2000): string {
  if (typeof v !== "string") return "";
  let out = "";
  for (const ch of v) {
    const code = ch.codePointAt(0) ?? 0;
    out += code < 32 || code === 127 ? " " : ch;
  }
  return out.replace(/\s+/g, " ").trim().slice(0, max);
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

async function deliver(inquiry: Payload & { receivedAt: string }) {
  const webhook = process.env.INQUIRY_WEBHOOK_URL;

  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
    });
    if (!res.ok) {
      throw new Error(`Webhook rejected the enquiry: ${res.status}`);
    }
    return;
  }

  // No delivery channel configured yet - record it so it is at least recoverable.
  console.info("[tejbidya] New enquiry (no INQUIRY_WEBHOOK_URL set):", inquiry);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  // Server-side validation, independent of the client's checks.
  const name = clean(raw.name, 120);
  const company = clean(raw.company, 160);
  const email = clean(raw.email, 200);
  const country = clean(raw.country, 100);

  const problems: string[] = [];
  if (!name) problems.push("name");
  if (!company) problems.push("company");
  if (!email || !isEmail(email)) problems.push("email");
  if (!country) problems.push("country");
  if (raw.consent !== "on" && raw.consent !== true) problems.push("consent");

  if (problems.length) {
    return NextResponse.json(
      { error: "Some required fields are missing or invalid.", fields: problems },
      { status: 422 }
    );
  }

  const inquiry = {
    kind: raw.kind === "quote" ? ("quote" as const) : ("sample" as const),
    name,
    company,
    email,
    phone: clean(raw.phone, 60),
    country,
    business: clean(raw.business, 80),
    volume: clean(raw.volume, 80),
    packaging: clean(raw.packaging, 80),
    message: clean(raw.message, 4000),
    teas: Array.isArray(raw.teas)
      ? raw.teas.map((t) => clean(t, 60)).filter(Boolean)
      : [],
    receivedAt: new Date().toISOString(),
  };

  try {
    await deliver(inquiry);
  } catch (err) {
    console.error("[tejbidya] Failed to deliver enquiry:", err);
    return NextResponse.json(
      { error: "We could not deliver your enquiry. Please email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
