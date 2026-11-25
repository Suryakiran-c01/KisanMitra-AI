import { NextRequest, NextResponse } from "next/server";
import { SttRequestSchema } from "@/lib/ai/schemas";
import { getLanguageConfig } from "@/lib/i18n/languages";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(`stt:${ip}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = SttRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid audio payload." }, { status: 400 });
  }

  const userId = process.env.BHASHINI_USER_ID;
  const apiKey = process.env.BHASHINI_API_KEY;
  const pipelineId = process.env.BHASHINI_PIPELINE_ID;

  if (!userId || !apiKey || !pipelineId) {
    return NextResponse.json(
      {
        error: "Bhashini voice fallback is not configured on this server. Please use Chrome/Android speech input or type your question.",
        configured: false,
      },
      { status: 503 }
    );
  }

  const langCfg = getLanguageConfig(parsed.data.language);
  const rawBase64 = parsed.data.audioBase64.includes(",")
    ? parsed.data.audioBase64.split(",")[1]
    : parsed.data.audioBase64;

  try {
    const configRes = await fetch("https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userID: userId,
        ulcaApiKey: apiKey,
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: "asr",
            config: { language: { sourceLanguage: langCfg.bhashiniCode } },
          },
        ],
        pipelineRequestConfig: { pipelineId },
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!configRes.ok) {
      throw new Error("Bhashini pipeline config failed");
    }

    const configData = await configRes.json();
    const callbackUrl = configData?.pipelineInferenceAPIEndPoint?.callbackUrl;
    const authHeaderName = configData?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name;
    const authHeaderVal = configData?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value;
    const serviceId = configData?.pipelineResponseConfig?.[0]?.config?.[0]?.serviceId;

    if (!callbackUrl || !serviceId) {
      throw new Error("Missing Bhashini ASR endpoint");
    }

    const asrRes = await fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeaderName && authHeaderVal ? { [authHeaderName]: authHeaderVal } : {}),
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: "asr",
            config: {
              language: { sourceLanguage: langCfg.bhashiniCode },
              serviceId,
              audioFormat: "webm",
              samplingRate: 16000,
            },
          },
        ],
        inputData: {
          audio: [{ audioContent: rawBase64 }],
        },
      }),
      signal: AbortSignal.timeout(15_000),
    });

    const asrData = await asrRes.json();
    const text = asrData?.pipelineResponse?.[0]?.output?.[0]?.source || "";
    return NextResponse.json({ text, provider: "bhashini" });
  } catch {
    return NextResponse.json(
      { error: "Could not transcribe voice via Bhashini right now." },
      { status: 502 }
    );
  }
}
