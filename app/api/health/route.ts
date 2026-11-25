import { NextResponse } from "next/server";

export async function GET() {
  const aiKey = process.env.ANTHROPIC_API_KEY;
  const aiConfigured = Boolean(aiKey && !aiKey.includes("xxxx"));
  const bhashiniConfigured = Boolean(
    process.env.BHASHINI_USER_ID && process.env.BHASHINI_API_KEY && process.env.BHASHINI_PIPELINE_ID
  );

  return NextResponse.json({
    ok: true,
    service: "kisanmitra-ai",
    aiConfigured,
    bhashiniConfigured,
    timestamp: new Date().toISOString(),
  });
}
