"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Bug,
  Camera,
  Droplets,
  ImagePlus,
  Leaf,
  MapPin,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { DiagnoseResponse } from "@/lib/ai/schemas";
import { useI18n } from "@/lib/i18n/context";
import { compressImageToUnder1MB } from "@/lib/utils/imageCompress";
import { SpeechRecognitionHandle, voiceProvider } from "@/lib/voice/provider";
import { CropIcon, SproutLoaderSVG } from "@/components/illustrations/FarmArtwork";
import { SpeakButton } from "@/components/common/SpeakButton";
import { ScanModePrefill } from "./HomeScreen";

const CROP_KEYS = [
  "wheat",
  "rice",
  "cotton",
  "tomato",
  "sugarcane",
  "maize",
  "soybean",
  "chilli",
  "potato",
  "onion",
  "other",
] as const;

const STAGE_KEYS = ["seedling", "vegetative", "flowering", "fruiting", "harvest"] as const;

const QUICK_SYMPTOMS: Array<{
  id: string;
  labels: Partial<Record<string, string>>;
  appendTexts: Partial<Record<string, string>>;
}> = [
  {
    id: "spots",
    labels: {
      hi: "पीले/भूरे धब्बे",
      mr: "पिवळे/तपकिरी डाग",
      bn: "হলুদ/বাদামী দাগ",
      ta: "மஞ்சள்/பழுப்பு புள்ளி",
      te: "పసుపు/గోధుమ మచ్చలు",
      gu: "પીળા/કથ્થઈ ડાઘ",
      kn: "ಹಳದಿ/ಕಂದು ಚುಕ್ಕೆ",
      ml: "മഞ്ഞ/തവിട്ട് പാട്",
      pa: "ਪੀਲੇ/ਭੂਰੇ ਧੱਬੇ",
      or: "ହଳଦିଆ/ବାଦାମୀ ଦାଗ",
      en: "Brown/Yellow spots",
    },
    appendTexts: {
      hi: "पत्तों पर पीले और भूरे धब्बे दिख रहे हैं",
      en: "Yellow and brown spots on leaves",
    },
  },
  {
    id: "rust",
    labels: {
      hi: "पीला पाउडर / रतुआ",
      mr: "तांबेरा / पावडर",
      bn: "হলুদ গুঁড়ো / মরিচা",
      ta: "மஞ்சள் தூள் / துரு",
      te: "పసుపు పొడి / తుప్పు",
      en: "Orange/Yellow powder",
    },
    appendTexts: {
      hi: "पत्तों पर पीली धारियां और पाउडर लग रहा है",
      en: "Yellow powder streaks (rust) on leaves",
    },
  },
  {
    id: "borer",
    labels: {
      hi: "छेद / इल्ली-कीड़े",
      mr: "छिद्रे / अळी",
      bn: "ছিদ্র / পোকা",
      ta: "துளை / புழு",
      te: "రంధ్రాలు / పురుగు",
      en: "Holes / Worms",
    },
    appendTexts: {
      hi: "पत्तों और फलों में छेद हैं और सुंडी/इल्ली दिख रही है",
      en: "Holes in leaves or fruit with caterpillars",
    },
  },
  {
    id: "whitefly",
    labels: {
      hi: "सफेद मक्खी / पत्ता मुड़ना",
      mr: "पांढरी माशी / चुरडा",
      bn: "সাদা মাছি / পাতা কোঁকড়ানো",
      ta: "வெள்ளை ஈ / இலை சுருள்",
      te: "తెల్ల దోమ / ఆకు ముడత",
      en: "Whitefly / Leaf curl",
    },
    appendTexts: {
      hi: "पत्ते मुड़ रहे हैं और नीचे सफेद मक्खी है",
      en: "Leaves curling with tiny whiteflies underneath",
    },
  },
  {
    id: "wilt",
    labels: {
      hi: "पौधा मुरझाना / जड़ गलन",
      mr: "मर रोग / मूळकुज",
      bn: "গাছ ঢলে পড়া / গোড়া পচা",
      ta: "வாடல் / வேர் அழுகல்",
      te: "మొక్క ఎండిపోవడం / వేరు కుళ్ళు",
      en: "Wilting / Root rot",
    },
    appendTexts: {
      hi: "पौधे अचानक मुरझा रहे हैं और जड़ें सड़ रही हैं",
      en: "Plants suddenly wilting and roots rotting",
    },
  },
  {
    id: "mildew",
    labels: {
      hi: "सफेद आटे जैसा चूर्ण",
      mr: "पांढरी भुरी",
      bn: "সাদা পাউডারি দাগ",
      ta: "வெள்ளை சாம்பல் நோய்",
      te: "తెల్ల బూడిద తెగులు",
      en: "White flour coating",
    },
    appendTexts: {
      hi: "पत्तों पर सफेद आटे जैसा पाउडर जमा है",
      en: "White powdery coating on top of leaves",
    },
  },
];

interface FollowupPair {
  question: string;
  answer: string;
}

interface ScanScreenProps {
  initialMode?: ScanModePrefill | null;
  onDiagnosed: (payload: {
    result: DiagnoseResponse;
    crop?: string;
    location?: string;
    queryText?: string;
    thumbnail?: string;
  }) => void;
}

export function ScanScreen({ initialMode, onDiagnosed }: ScanScreenProps) {
  const { language, languageConfig, t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const speechHandleRef = useRef<SpeechRecognitionHandle | null>(null);
  const baseTextRef = useRef<string>("");
  const autoStartedVoiceRef = useRef(false);

  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [compressing, setCompressing] = useState(false);
  const [text, setText] = useState("");
  const textRef = useRef("");
  textRef.current = text;
  const [crop, setCrop] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [location, setLocation] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [sttMode, setSttMode] = useState<"native" | "hi-IN" | "en-IN">("native");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Follow-up state
  const [followups, setFollowups] = useState<Array<{ id: string; question: string; options: string[] }>>([]);
  const [followupIdx, setFollowupIdx] = useState(0);
  const [followupHistory, setFollowupHistory] = useState<FollowupPair[]>([]);

  const startVoice = useCallback(() => {
    setErrorMsg(null);
    baseTextRef.current = textRef.current.trim();
    setIsListening(true);

    const localeOverride = sttMode === "native" ? undefined : sttMode;
    speechHandleRef.current = voiceProvider.startListening(
      language,
      (transcript) => {
        const combined = baseTextRef.current
          ? `${baseTextRef.current} ${transcript}`.trim()
          : transcript;
        setText(combined);
      },
      (err) => {
        setIsListening(false);
        if (err) {
          setErrorMsg(err);
        }
      },
      () => {
        setIsListening(false);
      },
      localeOverride
    );
  }, [language, sttMode]);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      speechHandleRef.current?.stop();
      setIsListening(false);
      return;
    }
    startVoice();
  }, [isListening, startVoice]);

  useEffect(() => {
    if (initialMode === "text") {
      textAreaRef.current?.focus();
    } else if (initialMode === "voice" && !autoStartedVoiceRef.current) {
      autoStartedVoiceRef.current = true;
      textAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      startVoice();
    }
  }, [initialMode, startVoice]);

  useEffect(() => {
    return () => {
      speechHandleRef.current?.stop();
    };
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    setCompressing(true);
    try {
      const compressed = await compressImageToUnder1MB(file, 950_000);
      setImageBase64(compressed);
    } catch {
      setErrorMsg(t.errorGeneric);
    } finally {
      setCompressing(false);
    }
  };

  const handleQuickSymptom = (symptomText: string) => {
    setErrorMsg(null);
    setText((prev) => {
      const trimmed = prev.trim();
      if (trimmed.toLowerCase().includes(symptomText.toLowerCase())) return prev;
      return trimmed ? `${trimmed}. ${symptomText}` : symptomText;
    });
  };

  const submitDiagnosis = async (extraHistory?: FollowupPair[]) => {
    if (isListening) {
      speechHandleRef.current?.stop();
      setIsListening(false);
    }

    if (!imageBase64 && !text.trim()) {
      const msg = t.describePlaceholder;
      setErrorMsg(msg);
      void voiceProvider.speak(msg, language);
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    void voiceProvider.speak(languageConfig.analyzingMessage || t.analyzing, language);

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          text: text.trim() || undefined,
          language,
          crop: crop || undefined,
          stage: stage || undefined,
          location: location.trim() || undefined,
          history: extraHistory ?? followupHistory,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.errorGeneric);
      }

      const result = data as DiagnoseResponse;
      if (result.status === "needs_followup" && result.followups && result.followups.length > 0 && !extraHistory) {
        setFollowups(result.followups);
        setFollowupIdx(0);
        setFollowupHistory([]);
        return;
      }

      onDiagnosed({
        result,
        crop: crop || undefined,
        location: location.trim() || undefined,
        queryText: text.trim() || undefined,
        thumbnail: imageBase64,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : t.errorGeneric;
      setErrorMsg(msg);
      void voiceProvider.speak(msg, language);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowupAnswer = (answer: string) => {
    const currentQ = followups[followupIdx];
    const updatedHistory = [...followupHistory, { question: currentQ.question, answer }];
    setFollowupHistory(updatedHistory);

    if (followupIdx + 1 < followups.length) {
      setFollowupIdx(followupIdx + 1);
    } else {
      setFollowups([]);
      void submitDiagnosis(updatedHistory);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-[24px] p-8 shadow-soft border border-border-soft text-center space-y-4 my-6">
        <div className="flex justify-center">
          <SproutLoaderSVG />
        </div>
        <h2 className="font-heading text-2xl font-bold text-leaf-700">{t.analyzing}</h2>
        <p className="text-base text-muted-ink">{languageConfig.analyzingMessage}</p>
      </div>
    );
  }

  // Conditional Follow-up Question Screen (one question at a time)
  if (followups.length > 0 && followups[followupIdx]) {
    const currentQ = followups[followupIdx];
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-[24px] p-5 shadow-soft border border-border-soft space-y-5"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold px-3 py-1 rounded-full bg-wheat-100 text-soil-700">
            {t.followupHeading} ({followupIdx + 1}/{followups.length})
          </span>
          <SpeakButton text={`${currentQ.question}. ${currentQ.options.join(", ")}`} compact />
        </div>

        <h2 className="font-heading text-2xl font-bold text-ink-900 leading-snug">
          {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleFollowupAnswer(opt)}
              className="w-full min-h-[60px] rounded-2xl bg-leaf-100 hover:bg-leaf-500/20 border-2 border-leaf-500/40 px-4 py-3 text-left font-bold text-lg text-ink-900 transition"
            >
              {opt}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  const activeSttLabel =
    sttMode === "native" ? languageConfig.nativeName : sttMode === "hi-IN" ? "हिन्दी" : "English";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 pb-28"
    >
      {errorMsg && (
        <div
          role="alert"
          className="rounded-2xl bg-alert-500/10 border-2 border-alert-500 p-4 flex items-start gap-3 text-ink-900"
        >
          <AlertCircle className="w-6 h-6 text-alert-500 shrink-0 mt-0.5" />
          <p className="text-base font-semibold">{errorMsg}</p>
        </div>
      )}

      {/* Photo Upload / Camera Capture */}
      <section className="bg-surface rounded-[24px] p-4 shadow-soft border border-border-soft space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoChange}
          className="hidden"
          aria-label={t.uploadPhoto}
        />

        {imageBase64 ? (
          <div className="relative rounded-2xl overflow-hidden border border-border-soft bg-soil-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageBase64}
              alt="Selected crop leaf preview"
              className="w-full max-h-64 object-contain bg-black/5"
            />
            <button
              type="button"
              onClick={() => setImageBase64(undefined)}
              aria-label="Remove photo"
              className="absolute top-3 right-3 min-h-[48px] min-w-[48px] rounded-2xl bg-alert-500 text-white px-3 flex items-center gap-1.5 font-bold shadow-soft"
            >
              <Trash2 className="w-5 h-5" />
              <span>{t.remove}</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={compressing}
            className="w-full min-h-[116px] rounded-2xl border-2 border-dashed border-leaf-700/60 bg-leaf-100/50 hover:bg-leaf-100 p-5 flex flex-col items-center justify-center gap-2 text-leaf-700 transition"
          >
            <div className="flex items-center gap-3">
              <Camera className="w-8 h-8" />
              <ImagePlus className="w-8 h-8" />
            </div>
            <span className="font-heading text-lg font-bold">
              {compressing ? t.compressing : t.uploadPhoto}
            </span>
          </button>
        )}
      </section>

      {/* Crop Chips */}
      <section className="bg-surface rounded-[24px] p-4 shadow-soft border border-border-soft space-y-3">
        <h2 className="font-heading text-lg font-bold text-soil-700">{t.selectCrop}</h2>
        <div className="flex flex-wrap gap-2">
          {CROP_KEYS.map((key) => {
            const active = crop === key;
            const label = t.crops[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCrop(active ? "" : key)}
                className={`min-h-[48px] px-3.5 py-2 rounded-2xl border-2 flex items-center gap-2 font-semibold text-base transition ${
                  active
                    ? "bg-leaf-700 text-white border-leaf-700"
                    : "bg-cream-50 text-ink-900 border-border-soft hover:border-leaf-500"
                }`}
              >
                <CropIcon crop={key} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Growth Stage */}
        <h3 className="font-heading text-base font-bold text-soil-700 pt-2">{t.selectStage}</h3>
        <div className="flex flex-wrap gap-2">
          {STAGE_KEYS.map((key) => {
            const active = stage === key;
            const label = t.stages[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setStage(active ? "" : key)}
                className={`min-h-[46px] px-3.5 py-1.5 rounded-xl border text-sm font-semibold transition ${
                  active
                    ? "bg-wheat-500 text-ink-900 border-wheat-500"
                    : "bg-soil-100/60 text-ink-900 border-border-soft"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Location */}
        <div className="pt-2">
          <div className="relative flex items-center">
            <MapPin className="w-5 h-5 text-muted-ink absolute left-3.5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t.locationPlaceholder}
              maxLength={100}
              className="w-full min-h-[52px] pl-11 pr-4 rounded-2xl bg-cream-50 border border-border-soft text-base text-ink-900"
            />
          </div>
        </div>
      </section>

      {/* Voice, Quick Symptom Chips & Text Description */}
      <section className="bg-surface rounded-[24px] p-4 shadow-soft border border-border-soft space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-heading text-lg font-bold text-soil-700">{t.askTextTitle}</span>
          <div className="flex items-center gap-2">
            {/* Voice Recognition Language Switcher for all 22+ languages */}
            <select
              aria-label="Voice input language"
              value={sttMode}
              onChange={(e) => setSttMode(e.target.value as "native" | "hi-IN" | "en-IN")}
              className="min-h-[44px] rounded-2xl bg-soil-100 border border-border-soft px-2.5 text-xs font-bold text-ink-900"
            >
              <option value="native">🎤 {languageConfig.nativeName}</option>
              {language !== "hi" && <option value="hi-IN">🎤 हिन्दी (Hindi)</option>}
              {language !== "en" && <option value="en-IN">🎤 English (India)</option>}
            </select>

            <button
              type="button"
              onClick={toggleVoice}
              className={`min-h-[44px] px-3.5 rounded-2xl font-semibold text-sm inline-flex items-center gap-1.5 border transition ${
                isListening
                  ? "bg-alert-500 text-white border-alert-500"
                  : "bg-wheat-100 text-soil-700 border-wheat-500/60 hover:bg-wheat-500/20"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? t.listening : t.tapToSpeak}</span>
            </button>
          </div>
        </div>

        {/* 1-Tap Visual Symptom Chips */}
        <div className="flex flex-wrap gap-2" aria-label="Common symptoms">
          {QUICK_SYMPTOMS.map((sym) => {
            const chipLabel = sym.labels[language] || sym.labels.en || "";
            const appendText = sym.appendTexts[language] || sym.appendTexts.en || chipLabel;
            return (
              <button
                key={sym.id}
                type="button"
                onClick={() => handleQuickSymptom(appendText)}
                className="min-h-[44px] px-3 py-1.5 rounded-xl bg-leaf-100/70 hover:bg-leaf-100 border border-leaf-500/30 text-xs font-bold text-leaf-700 inline-flex items-center gap-1.5 transition"
              >
                {sym.id === "borer" || sym.id === "whitefly" ? (
                  <Bug className="w-3.5 h-3.5 shrink-0" />
                ) : sym.id === "wilt" ? (
                  <Droplets className="w-3.5 h-3.5 shrink-0" />
                ) : sym.id === "mildew" ? (
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Leaf className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{chipLabel}</span>
              </button>
            );
          })}
        </div>

        <textarea
          ref={textAreaRef}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.describePlaceholder}
          maxLength={1400}
          className="w-full rounded-2xl bg-cream-50 border border-border-soft p-3.5 text-base text-ink-900 leading-relaxed"
        />

        <button
          type="button"
          onClick={() => void submitDiagnosis()}
          className="w-full min-h-[60px] rounded-2xl bg-leaf-700 text-white font-heading font-bold text-xl flex items-center justify-center gap-3 shadow-lift hover:brightness-105 transition"
        >
          <Send className="w-6 h-6" />
          <span>{t.diagnoseBtn}</span>
        </button>
      </section>

      {/* Sticky Floating Giant Mic Button (80px, wheat-500 with pulsing ring) */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 w-[90%] max-w-md pointer-events-none">
        {(isListening || (errorMsg && !loading)) && (
          <div
            role="status"
            className={`pointer-events-auto rounded-2xl px-4 py-2 text-sm font-semibold shadow-lift border text-center max-w-full ${
              errorMsg
                ? "bg-surface border-alert-500 text-alert-500"
                : "bg-surface border-wheat-500 text-ink-900"
            }`}
          >
            {errorMsg
              ? errorMsg
              : text
              ? text
              : `${t.listening} (${activeSttLabel})`}
          </div>
        )}

        <div className="relative flex items-center justify-center pointer-events-auto">
          {isListening && (
            <span
              aria-hidden="true"
              className="absolute w-20 h-20 rounded-full bg-wheat-500 animate-mic-pulse"
            />
          )}
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={isListening ? t.listening : t.tapToSpeak}
            className={`relative w-20 h-20 rounded-full shadow-lift border-4 border-white flex items-center justify-center transition ${
              isListening ? "bg-alert-500 text-white" : "bg-wheat-500 text-ink-900"
            }`}
          >
            {isListening ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
