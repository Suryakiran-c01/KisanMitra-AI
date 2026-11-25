"use client";

import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { voiceProvider } from "@/lib/voice/provider";

interface SpeakButtonProps {
  text: string;
  label?: string;
  compact?: boolean;
  className?: string;
}

export function SpeakButton({ text, label, compact = false, className = "" }: SpeakButtonProps) {
  const { language, languageConfig, t } = useI18n();
  const [speaking, setSpeaking] = useState(false);
  const [voiceWarning, setVoiceWarning] = useState<string | null>(null);

  const toggleSpeak = async () => {
    if (speaking) {
      voiceProvider.stopSpeaking();
      setSpeaking(false);
      return;
    }
    setVoiceWarning(null);
    setSpeaking(true);
    const res = await voiceProvider.speak(text, language, () => setSpeaking(false));
    if (!res.ok && res.reason === "voice_unavailable") {
      setSpeaking(false);
      setVoiceWarning(
        `No ${languageConfig.name} voice pack found in this browser. Try Microsoft Edge / Android Chrome or add Bhashini API keys in .env.local.`
      );
    }
  };

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggleSpeak}
        aria-label={speaking ? t.stopListeningBtn : label || t.listenBtn}
        className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-colors min-h-[48px] ${
          compact ? "px-3 py-2 text-sm" : "px-4 py-3 text-base"
        } ${
          speaking
            ? "bg-alert-500 text-white"
            : "bg-wheat-100 text-soil-700 border border-wheat-500/50 hover:bg-wheat-500/20"
        } ${className}`}
      >
        {speaking ? <VolumeX className="w-5 h-5 shrink-0" /> : <Volume2 className="w-5 h-5 shrink-0" />}
        <span>{speaking ? t.stopListeningBtn : label || t.listenBtn}</span>
      </button>
      {voiceWarning && (
        <p role="status" className="text-xs text-soil-700 bg-wheat-100 border border-wheat-500/40 rounded-xl px-2.5 py-1.5 max-w-[260px] text-left">
          {voiceWarning}
        </p>
      )}
    </div>
  );
}
