import { describe, it, expect } from "vitest";
import { DiagnoseRequestSchema, DiagnoseResponseSchema } from "@/lib/ai/schemas";
import { detectLanguageFromText } from "@/lib/i18n/languages";
import { sanitizeUserText, validateBase64Image } from "@/lib/security/sanitize";

describe("Zod Schemas, Sanitization & Language Detection", () => {
  it("rejects empty diagnose request with neither image nor text", () => {
    const res = DiagnoseRequestSchema.safeParse({ language: "hi" });
    expect(res.success).toBe(false);
  });

  it("accepts valid diagnose request with text", () => {
    const res = DiagnoseRequestSchema.safeParse({
      language: "hi",
      text: "गेहूं के पत्तों पर पीली धारियां हैं",
      crop: "wheat",
    });
    expect(res.success).toBe(true);
  });

  it("validates structured diagnosis response schema", () => {
    const validPayload = {
      status: "diagnosed",
      detectedLanguage: "en",
      diagnosis: {
        name: "Tomato Early Blight",
        confidence: "High",
        severity: "Medium",
        cause: "Fungal leaf spots on older leaves.",
      },
      plan: {
        steps: [
          {
            type: "organic",
            text: "Remove affected lower leaves and apply Neem oil.",
            timing: "Evening spray, repeat after 7 days",
          },
        ],
      },
      safety: ["Always check the product label.", "Wear gloves and mask."],
      costRangeINR: "Rs 180 - Rs 350",
      productKeywords: ["neem oil", "mancozeb"],
      escalate: false,
    };
    const parsed = DiagnoseResponseSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  it("sanitizes control characters and rejects invalid image prefixes", () => {
    const cleaned = sanitizeUserText("hello\u0000   world\u0007");
    expect(cleaned).toBe("hello world");

    const badImg = validateBase64Image("data:text/html;base64,PHNjcmlwdD4=");
    expect(badImg.valid).toBe(false);

    const okImg = validateBase64Image("data:image/jpeg;base64,/9j/4AAQSkZJRg==");
    expect(okImg.valid).toBe(true);
  });

  it("auto-detects Indian scripts accurately", () => {
    expect(detectLanguageFromText("धान की पत्ती पीली हो रही है", "en")).toBe("hi");
    expect(detectLanguageFromText("தக்காளி இலையில் புள்ளிகள்", "hi")).toBe("ta");
    expect(detectLanguageFromText("টমেটো পাতায় দাগ হয়েছে", "hi")).toBe("bn");
    expect(detectLanguageFromText("టమోటా ఆకులపై మచ్చలు", "hi")).toBe("te");
  });
});
