import { NextRequest, NextResponse } from "next/server";
import { TtsRequestSchema } from "@/lib/ai/schemas";
import { getLanguageConfig } from "@/lib/i18n/languages";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { synthesizeWithEspeak } from "@/lib/voice/espeakTts";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(`tts:${ip}`, 30, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = TtsRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid TTS payload." }, { status: 400 });
  }

  const userId = process.env.BHASHINI_USER_ID;
  const apiKey = process.env.BHASHINI_API_KEY;
  const pipelineId = process.env.BHASHINI_PIPELINE_ID;
  const langCfg = getLanguageConfig(parsed.data.language);

  // 1. Try Bhashini ULCA TTS if configured
  if (userId && apiKey && pipelineId) {
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
              taskType: "tts",
              config: { language: { sourceLanguage: langCfg.bhashiniCode } },
            },
          ],
          pipelineRequestConfig: { pipelineId },
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (configRes.ok) {
        const configData = await configRes.json();
        const callbackUrl = configData?.pipelineInferenceAPIEndPoint?.callbackUrl;
        const authHeaderName = configData?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name;
        const authHeaderVal = configData?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value;
        const serviceId = configData?.pipelineResponseConfig?.[0]?.config?.[0]?.serviceId;

        if (callbackUrl && serviceId) {
          const ttsRes = await fetch(callbackUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(authHeaderName && authHeaderVal ? { [authHeaderName]: authHeaderVal } : {}),
            },
            body: JSON.stringify({
              pipelineTasks: [
                {
                  taskType: "tts",
                  config: {
                    language: { sourceLanguage: langCfg.bhashiniCode },
                    serviceId,
                    gender: "female",
                  },
                },
              ],
              inputData: {
                input: [{ source: parsed.data.text }],
              },
            }),
            signal: AbortSignal.timeout(15_000),
          });

          const ttsData = await ttsRes.json();
          const audioBase64 = ttsData?.pipelineResponse?.[0]?.audio?.[0]?.audioContent || null;
          if (audioBase64) {
            return NextResponse.json({ audioBase64, mimeType: "audio/wav", provider: "bhashini" });
          }
        }
      }
    } catch {
      // Fall through to local eSpeak-NG WASM synthesizer
    }
  }

  // 2. Local offline open-source eSpeak-NG fallback for all Indian languages
  try {
    const synthesized = await synthesizeWithEspeak(parsed.data.text, langCfg.code);
    if (synthesized) {
      return NextResponse.json({
        audioBase64: synthesized.audioBase64,
        mimeType: synthesized.mimeType,
        provider: "espeak-ng",
      });
    }
  } catch (err) {
    console.error("[KisanMitra TTS] eSpeak-NG synthesis failed:", err);
  }

  return NextResponse.json({ audioBase64: null });
}
