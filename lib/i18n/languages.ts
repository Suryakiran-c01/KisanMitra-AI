export type LanguageCode =
  | "en"
  | "hi"
  | "bn"
  | "te"
  | "mr"
  | "ta"
  | "ur"
  | "gu"
  | "kn"
  | "or"
  | "ml"
  | "pa"
  | "as"
  | "mai"
  | "sat"
  | "ks"
  | "ne"
  | "sd"
  | "kok"
  | "doi"
  | "mni"
  | "brx"
  | "sa";

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechLocale: string;
  bhashiniCode: string;
  rtl?: boolean;
  tier: "core" | "extended";
  hasUiTranslation: boolean;
  analyzingMessage: string;
}

export const LANGUAGES: LanguageConfig[] = [
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    speechLocale: "hi-IN",
    bhashiniCode: "hi",
    tier: "core",
    hasUiTranslation: true,
    analyzingMessage: "आपकी फसल की जांच हो रही है...",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    speechLocale: "bn-IN",
    bhashiniCode: "bn",
    tier: "core",
    hasUiTranslation: true,
    analyzingMessage: "আপনার ফসল পরীক্ষা করা হচ্ছে...",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    speechLocale: "te-IN",
    bhashiniCode: "te",
    tier: "core",
    hasUiTranslation: true,
    analyzingMessage: "మీ పంటను పరిశీలిస్తున్నాము...",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    speechLocale: "mr-IN",
    bhashiniCode: "mr",
    tier: "core",
    hasUiTranslation: true,
    analyzingMessage: "तुमच्या पिकाची तपासणी होत आहे...",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    speechLocale: "ta-IN",
    bhashiniCode: "ta",
    tier: "core",
    hasUiTranslation: true,
    analyzingMessage: "உங்கள் பயிர் பரிசோதிக்கப்படுகிறது...",
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    speechLocale: "gu-IN",
    bhashiniCode: "gu",
    tier: "core",
    hasUiTranslation: true,
    analyzingMessage: "તમારા પાકની તપાસ થઈ રહી છે...",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    speechLocale: "kn-IN",
    bhashiniCode: "kn",
    tier: "core",
    hasUiTranslation: true,
    analyzingMessage: "ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    speechLocale: "ml-IN",
    bhashiniCode: "ml",
    tier: "core",
    hasUiTranslation: true,
    analyzingMessage: "നിങ്ങളുടെ വിള പരിശോധിക്കുന്നു...",
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    speechLocale: "pa-IN",
    bhashiniCode: "pa",
    tier: "core",
    hasUiTranslation: true,
    analyzingMessage: "ਤੁਹਾਡੀ ਫ਼ਸਲ ਦੀ ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...",
  },
  {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    speechLocale: "or-IN",
    bhashiniCode: "or",
    tier: "core",
    hasUiTranslation: true,
    analyzingMessage: "ଆପଣଙ୍କ ଫସଲ ଯାଞ୍ଚ କରାଯାଉଛି...",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    speechLocale: "en-IN",
    bhashiniCode: "en",
    tier: "core",
    hasUiTranslation: true,
    analyzingMessage: "Analysing your crop...",
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    speechLocale: "ur-IN",
    bhashiniCode: "ur",
    rtl: true,
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "آپ کی فصل کی جانچ ہو رہی ہے...",
  },
  {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    speechLocale: "as-IN",
    bhashiniCode: "as",
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "আপোনাৰ শস্য পৰীক্ষা কৰা হৈছে...",
  },
  {
    code: "mai",
    name: "Maithili",
    nativeName: "मैथिली",
    speechLocale: "hi-IN",
    bhashiniCode: "mai",
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "अहाँक फसलक जाँच भ रहल अछि...",
  },
  {
    code: "sat",
    name: "Santali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",
    speechLocale: "hi-IN",
    bhashiniCode: "sat",
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "Analysing your crop...",
  },
  {
    code: "ks",
    name: "Kashmiri",
    nativeName: "کٲشُر",
    speechLocale: "ur-IN",
    bhashiniCode: "ks",
    rtl: true,
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "Analysing your crop...",
  },
  {
    code: "ne",
    name: "Nepali",
    nativeName: "नेपाली",
    speechLocale: "ne-NP",
    bhashiniCode: "ne",
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "तपाईंको बाली जाँच हुँदैछ...",
  },
  {
    code: "sd",
    name: "Sindhi",
    nativeName: "سنڌي",
    speechLocale: "ur-IN",
    bhashiniCode: "sd",
    rtl: true,
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "Analysing your crop...",
  },
  {
    code: "kok",
    name: "Konkani",
    nativeName: "कोंकणी",
    speechLocale: "mr-IN",
    bhashiniCode: "gom",
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "तुमच्या पिकाची तपासणी जाता...",
  },
  {
    code: "doi",
    name: "Dogri",
    nativeName: "डोगरी",
    speechLocale: "hi-IN",
    bhashiniCode: "doi",
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "Analysing your crop...",
  },
  {
    code: "mni",
    name: "Manipuri (Meitei)",
    nativeName: "ꯃꯩꯇꯩꯂꯣꯟ",
    speechLocale: "en-IN",
    bhashiniCode: "mni",
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "Analysing your crop...",
  },
  {
    code: "brx",
    name: "Bodo",
    nativeName: "बड़ो",
    speechLocale: "hi-IN",
    bhashiniCode: "brx",
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "Analysing your crop...",
  },
  {
    code: "sa",
    name: "Sanskrit",
    nativeName: "संस्कृतम्",
    speechLocale: "hi-IN",
    bhashiniCode: "sa",
    tier: "extended",
    hasUiTranslation: false,
    analyzingMessage: "सस्यपरीक्षणं प्रचलति...",
  },
];

export const LANGUAGE_MAP: Record<string, LanguageConfig> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l])
);

export function getLanguageConfig(code: string): LanguageConfig {
  return LANGUAGE_MAP[code] || LANGUAGE_MAP["en"];
}

/**
 * Best-effort script detection for Indian languages from Unicode ranges.
 * Falls back to the currently selected language if Latin/ambiguous.
 */
export function detectLanguageFromText(text: string, fallback: LanguageCode = "hi"): LanguageCode {
  if (!text || !text.trim()) return fallback;
  const checks: Array<[RegExp, LanguageCode]> = [
    [/[\u0980-\u09FF]/, "bn"], // Bengali/Assamese
    [/[\u0B80-\u0BFF]/, "ta"], // Tamil
    [/[\u0C00-\u0C7F]/, "te"], // Telugu
    [/[\u0C80-\u0CFF]/, "kn"], // Kannada
    [/[\u0D00-\u0D7F]/, "ml"], // Malayalam
    [/[\u0A80-\u0AFF]/, "gu"], // Gujarati
    [/[\u0A00-\u0A7F]/, "pa"], // Gurmukhi (Punjabi)
    [/[\u0B00-\u0B7F]/, "or"], // Odia
    [/[\u1C50-\u1C7F]/, "sat"], // Ol Chiki (Santali)
    [/[\uABC0-\uABFF]/, "mni"], // Meetei Mayek
    [/[\u0600-\u06FF]/, "ur"], // Arabic/Urdu
    [/[\u0900-\u097F]/, fallback === "mr" || fallback === "ne" || fallback === "mai" || fallback === "kok" || fallback === "doi" || fallback === "brx" || fallback === "sa" ? fallback : "hi"], // Devanagari
  ];

  for (const [regex, code] of checks) {
    if (regex.test(text)) return code;
  }

  if (/[a-zA-Z]{3,}/.test(text)) {
    return fallback === "en" ? "en" : fallback;
  }

  return fallback;
}
