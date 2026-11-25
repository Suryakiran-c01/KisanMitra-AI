import { NextRequest, NextResponse } from "next/server";
import { runCropDiagnosis } from "@/lib/ai/diagnose";
import { DiagnoseRequestSchema } from "@/lib/ai/schemas";
import { detectLanguageFromText, LanguageCode } from "@/lib/i18n/languages";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { sanitizeUserText, validateBase64Image } from "@/lib/security/sanitize";

const MAX_BODY_BYTES = 4 * 1024 * 1024; // 4MB limit

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(`diagnose:${ip}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request is too large (max 4MB). Please use a smaller photo." },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    const rawText = await request.text();
    if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request is too large (max 4MB)." },
        { status: 413 }
      );
    }
    body = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = DiagnoseRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }

  const imgCheck = validateBase64Image(parsed.data.imageBase64);
  if (!imgCheck.valid) {
    return NextResponse.json({ error: imgCheck.error }, { status: 400 });
  }

  const cleanText = sanitizeUserText(parsed.data.text, 1500);
  const cleanLocation = sanitizeUserText(parsed.data.location, 120);
  const cleanCrop = sanitizeUserText(parsed.data.crop, 50);
  const cleanStage = sanitizeUserText(parsed.data.stage, 50);

  const requestedLang = parsed.data.language === "auto" ? "hi" : (parsed.data.language as LanguageCode);
  const effectiveLang = cleanText ? detectLanguageFromText(cleanText, requestedLang) : requestedLang;

  const result = await runCropDiagnosis({
    ...parsed.data,
    text: cleanText || undefined,
    location: cleanLocation || undefined,
    crop: cleanCrop || undefined,
    stage: cleanStage || undefined,
    language: effectiveLang,
  });

  return NextResponse.json(result, {
    headers: {
      "X-RateLimit-Remaining": String(rate.remaining),
    },
  });
}
