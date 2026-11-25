import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET as getHealth } from "@/app/api/health/route";
import { POST as postDiagnose } from "@/app/api/diagnose/route";
import { GET as getProducts } from "@/app/api/products/route";
import { POST as postTts } from "@/app/api/tts/route";
import { DiagnoseResponseSchema } from "@/lib/ai/schemas";

describe("API Smoke Tests", () => {
  it("GET /api/health returns ok: true", async () => {
    const res = await getHealth();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.service).toBe("kisanmitra-ai");
  });

  it("GET /api/products returns matched products with store links", async () => {
    const req = new NextRequest("http://localhost:3000/api/products?keywords=neem+oil&crop=tomato");
    const res = await getProducts(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.products)).toBe(true);
    expect(json.products.length).toBeGreaterThan(0);
    expect(json.products[0].stores.length).toBeGreaterThan(0);
  });

  it("POST /api/diagnose returns schema-valid response for sample payload", async () => {
    const req = new NextRequest("http://localhost:3000/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "hi",
        crop: "wheat",
        text: "गेहूं के पत्तों पर पीली धारियां और पाउडर दिख रहा है",
      }),
    });

    const res = await postDiagnose(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    const validated = DiagnoseResponseSchema.safeParse(json);
    expect(validated.success).toBe(true);
    expect(json.detectedLanguage).toBe("hi");
    expect(json.diagnosis?.name).toContain("रतुआ");
  });

  it("POST /api/diagnose returns Tamil leaf curl diagnosis and followups for vague text", async () => {
    const tamilReq = new NextRequest("http://localhost:3000/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "ta",
        crop: "chilli",
        text: "இலை சுருட்டல் மற்றும் வெள்ளை ஈ உள்ளது",
      }),
    });
    const tamilRes = await postDiagnose(tamilReq);
    expect(tamilRes.status).toBe(200);
    const tamilJson = await tamilRes.json();
    expect(DiagnoseResponseSchema.safeParse(tamilJson).success).toBe(true);
    expect(tamilJson.detectedLanguage).toBe("ta");

    const vagueReq = new NextRequest("http://localhost:3000/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "hi",
        text: "फसल खराब",
      }),
    });
    const vagueRes = await postDiagnose(vagueReq);
    expect(vagueRes.status).toBe(200);
    const vagueJson = await vagueRes.json();
    expect(vagueJson.status).toBe("needs_followup");
    expect(vagueJson.followups?.length).toBeGreaterThan(0);
  });

  it("POST /api/tts returns playable WAV audio for Hindi and Tamil", async () => {
    for (const [language, text] of [
      ["hi", "नमस्ते किसान भाई"],
      ["ta", "வணக்கம் விவசாயி"],
    ] as const) {
      const req = new NextRequest("http://localhost:3000/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, text }),
      });
      const res = await postTts(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(typeof json.audioBase64).toBe("string");
      expect(json.audioBase64.length).toBeGreaterThan(100);
      expect(json.mimeType).toBe("audio/wav");
    }
  });
});
