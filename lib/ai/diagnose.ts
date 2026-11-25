import Anthropic from "@anthropic-ai/sdk";
import { getLanguageConfig } from "@/lib/i18n/languages";
import { buildSmartFallbackDiagnosis } from "./knowledgeBase";
import { DiagnoseRequest, DiagnoseResponse, DiagnoseResponseSchema } from "./schemas";
import { buildSystemPrompt } from "./systemPrompt";

function extractJsonString(raw: string): string {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch && fenceMatch[1]) {
    return fenceMatch[1].trim();
  }
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed;
}

function parseDataUrl(
  dataUrl: string
): { mediaType: "image/jpeg" | "image/png" | "image/webp"; data: string } | null {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/i);
  if (!match) return null;
  const rawType = match[1].toLowerCase();
  const mediaType =
    rawType === "image/jpg" ? "image/jpeg" : (rawType as "image/jpeg" | "image/png" | "image/webp");
  return { mediaType, data: match[2] };
}

export async function runCropDiagnosis(req: DiagnoseRequest): Promise<DiagnoseResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.includes("xxxx")) {
    return buildSmartFallbackDiagnosis(req, "no_api_key");
  }

  const langConfig = getLanguageConfig(req.language);
  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514";
  const client = new Anthropic({ apiKey, timeout: 25_000 });

  const contentBlocks: Anthropic.MessageParam["content"] = [];

  if (req.imageBase64) {
    const parsedImg = parseDataUrl(req.imageBase64);
    if (parsedImg) {
      contentBlocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: parsedImg.mediaType,
          data: parsedImg.data,
        },
      });
    }
  }

  const userSummary = [
    `<farmer_input>`,
    `Language requested: ${langConfig.name} (${langConfig.code})`,
    req.crop ? `Crop: ${req.crop}` : "Crop: unspecified",
    req.stage ? `Growth stage: ${req.stage}` : "Growth stage: unspecified",
    req.location ? `Location: ${req.location}` : "Location: India",
    req.text ? `Description: ${req.text}` : "Description: (see photo)",
    req.history && req.history.length > 0
      ? `Follow-up answers:\n${req.history.map((h) => `- Q: ${h.question} | A: ${h.answer}`).join("\n")}`
      : "",
    `</farmer_input>`,
    `Return ONLY valid JSON matching the schema.`,
  ]
    .filter(Boolean)
    .join("\n");

  contentBlocks.push({ type: "text", text: userSummary });

  const systemPrompt = buildSystemPrompt(langConfig.name, langConfig.code);

  // Try up to 2 times (initial + 1 retry on invalid JSON/schema)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: 1400,
        temperature: 0.2,
        system: systemPrompt,
        messages:
          attempt === 0
            ? [{ role: "user", content: contentBlocks }]
            : [
                { role: "user", content: contentBlocks },
                {
                  role: "user",
                  content:
                    "Your previous output was not valid JSON matching the schema. Output ONLY valid JSON now.",
                },
              ],
      });

      const textPart = response.content.find((c) => c.type === "text");
      if (!textPart || textPart.type !== "text") continue;

      const jsonStr = extractJsonString(textPart.text);
      const parsedJson = JSON.parse(jsonStr);
      const validated = DiagnoseResponseSchema.safeParse(parsedJson);
      if (validated.success) {
        return validated.data;
      }
    } catch (err) {
      if (attempt === 1) {
        console.error("[KisanMitra AI] Diagnosis failed after retry:", err);
      }
    }
  }

  return buildSmartFallbackDiagnosis(req, "error");
}

export async function translateText(text: string, targetLanguageCode: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const langConfig = getLanguageConfig(targetLanguageCode);
  if (!apiKey || apiKey.includes("xxxx")) {
    return text;
  }

  const client = new Anthropic({ apiKey, timeout: 15_000 });
  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514";

  try {
    const res = await client.messages.create({
      model,
      max_tokens: 600,
      temperature: 0.1,
      system: `You are a translator for Indian farmers. Translate the input text into ${langConfig.name} (${langConfig.nativeName}) at a simple Class 6 reading level. Output ONLY the translated text, nothing else.`,
      messages: [{ role: "user", content: text }],
    });
    const textPart = res.content.find((c) => c.type === "text");
    return textPart && textPart.type === "text" ? textPart.text.trim() : text;
  } catch {
    return text;
  }
}
