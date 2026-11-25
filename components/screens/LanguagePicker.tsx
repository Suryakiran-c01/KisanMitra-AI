"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { LANGUAGES, LanguageCode } from "@/lib/i18n/languages";
import { useI18n } from "@/lib/i18n/context";
import { BrandLogo } from "@/components/illustrations/FarmArtwork";
import { SpeakButton } from "@/components/common/SpeakButton";

interface LanguagePickerProps {
  onSelect: (code: LanguageCode) => void;
}

export function LanguagePicker({ onSelect }: LanguagePickerProps) {
  const { language, t } = useI18n();

  const handleAutoDetect = () => {
    const browserLang =
      typeof navigator !== "undefined" ? navigator.language.split("-")[0] : "hi";
    const matched = LANGUAGES.find((l) => l.code === browserLang);
    onSelect(matched ? matched.code : "hi");
  };

  return (
    <div className="min-h-screen bg-field-pattern px-4 py-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-5"
      >
        <div className="bg-surface rounded-[24px] p-5 shadow-soft border border-border-soft text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size={56} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-leaf-700">{t.appName}</h1>
          <p className="text-base text-muted-ink">{t.tagline}</p>
          <div className="flex justify-center pt-1">
            <SpeakButton
              text={`${t.appName}. ${t.chooseLanguage}`}
              compact
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAutoDetect}
          className="w-full min-h-[58px] rounded-2xl bg-wheat-500 text-ink-900 font-bold text-lg px-5 py-3 shadow-soft flex items-center justify-center gap-2.5 hover:brightness-95 transition"
        >
          <Sparkles className="w-6 h-6 shrink-0" />
          <span>{t.autoDetect}</span>
        </button>

        <section aria-labelledby="lang-heading" className="space-y-3">
          <h2 id="lang-heading" className="font-heading text-xl font-bold text-soil-700 px-1">
            {t.chooseLanguage} (22+ Indian Languages)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => {
              const selected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onSelect(lang.code)}
                  className={`relative min-h-[76px] rounded-2xl p-3.5 text-left border-2 transition flex flex-col justify-between ${
                    selected
                      ? "bg-leaf-100 border-leaf-700 shadow-soft"
                      : "bg-surface border-border-soft hover:border-leaf-500"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xl font-bold text-ink-900 leading-snug">
                      {lang.nativeName}
                    </span>
                    {selected && (
                      <span className="w-6 h-6 rounded-full bg-leaf-700 text-white flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-ink font-medium">{lang.name}</span>
                </button>
              );
            })}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
