export function sanitizeUserText(input: string | undefined, maxLength = 1500): string {
  if (!input) return "";
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

const ALLOWED_IMAGE_PREFIXES = [
  "data:image/jpeg;base64,",
  "data:image/jpg;base64,",
  "data:image/png;base64,",
  "data:image/webp;base64,",
];

export function validateBase64Image(
  dataUrl: string | undefined,
  maxDecodedBytes = 2_000_000
): { valid: boolean; error?: string } {
  if (!dataUrl) return { valid: true };
  const lower = dataUrl.slice(0, 40).toLowerCase();
  const hasAllowedPrefix = ALLOWED_IMAGE_PREFIXES.some((prefix) => lower.startsWith(prefix));
  if (!hasAllowedPrefix) {
    return { valid: false, error: "Unsupported image format. Please use JPG, PNG, or WebP." };
  }

  const base64Part = dataUrl.split(",")[1] || "";
  if (!base64Part || !/^[A-Za-z0-9+/=]+$/.test(base64Part)) {
    return { valid: false, error: "Invalid image data." };
  }

  const estimatedBytes = Math.floor((base64Part.length * 3) / 4);
  if (estimatedBytes > maxDecodedBytes) {
    return { valid: false, error: "Image is too large. Please keep it under 2MB." };
  }

  return { valid: true };
}
