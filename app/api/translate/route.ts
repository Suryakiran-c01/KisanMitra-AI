import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/ai/diagnose";
import { TranslateRequestSchema } from "@/lib/ai/schemas";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { sanitizeUserText } from "@/lib/security/sanitize";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(`translate:${ip}`, 30, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = TranslateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid translate request." }, { status: 400 });
  }

  const cleanText = sanitizeUserText(parsed.data.text, 2000);
  const translated = await translateText(cleanText, parsed.data.targetLanguage);
  return NextResponse.json({ translatedText: translated, targetLanguage: parsed.data.targetLanguage });
}
