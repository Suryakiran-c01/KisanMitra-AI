import { z } from "zod";

export const FollowupHistoryItemSchema = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(300),
});

export const DiagnoseRequestSchema = z
  .object({
    imageBase64: z.string().max(3_800_000).optional(),
    text: z.string().max(1500).optional(),
    language: z.string().min(2).max(16).default("hi"),
    crop: z.string().max(50).optional(),
    stage: z.string().max(50).optional(),
    location: z.string().max(120).optional(),
    history: z.array(FollowupHistoryItemSchema).max(6).optional(),
  })
  .refine(
    (data) => Boolean((data.imageBase64 && data.imageBase64.length > 20) || (data.text && data.text.trim().length > 0)),
    { message: "Please provide a crop photo or describe the problem." }
  );

export type DiagnoseRequest = z.infer<typeof DiagnoseRequestSchema>;

export const FollowupQuestionSchema = z.object({
  id: z.string().min(1).max(40),
  question: z.string().min(3).max(240),
  options: z.array(z.string().min(1).max(80)).min(2).max(5),
});

export const TreatmentStepSchema = z.object({
  type: z.enum(["organic", "biological", "chemical"]),
  text: z.string().min(3).max(500),
  timing: z.string().min(2).max(180),
});

export const DiagnosisDetailSchema = z.object({
  name: z.string().min(2).max(160),
  confidence: z.enum(["High", "Medium", "Low"]),
  severity: z.enum(["Low", "Medium", "High"]),
  cause: z.string().min(3).max(500),
});

export const DiagnoseResponseSchema = z.object({
  status: z.enum(["needs_followup", "diagnosed"]),
  detectedLanguage: z.string().max(16).optional(),
  followups: z.array(FollowupQuestionSchema).max(3).optional(),
  diagnosis: DiagnosisDetailSchema.optional(),
  plan: z.object({
    steps: z.array(TreatmentStepSchema).max(8),
  }),
  safety: z.array(z.string().min(3).max(300)).max(8),
  costRangeINR: z.string().min(1).max(100),
  productKeywords: z.array(z.string().min(1).max(60)).max(12),
  escalate: z.boolean(),
  photoTip: z.string().max(300).optional(),
  isOffTopic: z.boolean().optional(),
  isFallback: z.boolean().optional(),
});

export type DiagnoseResponse = z.infer<typeof DiagnoseResponseSchema>;

export const TranslateRequestSchema = z.object({
  text: z.string().min(1).max(2000),
  targetLanguage: z.string().min(2).max(16),
});

export const SttRequestSchema = z.object({
  audioBase64: z.string().min(10).max(4_000_000),
  language: z.string().min(2).max(16).default("hi"),
  mimeType: z.string().max(60).default("audio/webm"),
});

export const TtsRequestSchema = z.object({
  text: z.string().min(1).max(1500),
  language: z.string().min(2).max(16).default("hi"),
});
