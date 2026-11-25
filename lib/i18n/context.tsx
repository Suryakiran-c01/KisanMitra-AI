"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import enMessages from "@/i18n/en.json";
import hiMessages from "@/i18n/hi.json";
import bnMessages from "@/i18n/bn.json";
import teMessages from "@/i18n/te.json";
import mrMessages from "@/i18n/mr.json";
import taMessages from "@/i18n/ta.json";
import guMessages from "@/i18n/gu.json";
import knMessages from "@/i18n/kn.json";
import mlMessages from "@/i18n/ml.json";
import paMessages from "@/i18n/pa.json";
import orMessages from "@/i18n/or.json";
import { getLanguageConfig, LanguageCode, LanguageConfig } from "./languages";

export type TranslationDict = typeof enMessages;

const DICTIONARIES: Partial<Record<LanguageCode, TranslationDict>> = {
  en: enMessages,
  hi: hiMessages,
  bn: bnMessages,
  te: teMessages,
  mr: mrMessages,
  ta: taMessages,
  gu: guMessages,
  kn: knMessages,
  ml: mlMessages,
  pa: paMessages,
  or: orMessages,
};

export type ThemeMode = "light" | "dark" | "high-contrast";
export type FontScale = "small" | "normal" | "large";

interface I18nContextValue {
  language: LanguageCode;
  languageConfig: LanguageConfig;
  setLanguage: (lang: LanguageCode) => void;
  hasChosenLanguage: boolean;
  confirmLanguage: (lang: LanguageCode) => void;
  t: TranslationDict;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_LANG_KEY = "kisanmitra_lang_v1";
const STORAGE_THEME_KEY = "kisanmitra_theme_v1";
const STORAGE_FONT_KEY = "kisanmitra_font_v1";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("hi");
  const [hasChosenLanguage, setHasChosenLanguage] = useState<boolean>(false);
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [fontScale, setFontScaleState] = useState<FontScale>("normal");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_LANG_KEY) as LanguageCode | null;
      if (savedLang) {
        setLanguageState(savedLang);
        setHasChosenLanguage(true);
      }
      const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) as ThemeMode | null;
      if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "high-contrast") {
        setThemeState(savedTheme);
      }
      const savedFont = localStorage.getItem(STORAGE_FONT_KEY) as FontScale | null;
      if (savedFont === "small" || savedFont === "normal" || savedFont === "large") {
        setFontScaleState(savedFont);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    const cfg = getLanguageConfig(language);
    document.documentElement.lang = cfg.code;
    document.documentElement.dir = cfg.rtl ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-font-scale", fontScale);
    try {
      localStorage.setItem(STORAGE_FONT_KEY, fontScale);
    } catch {
      // ignore
    }
  }, [fontScale]);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const confirmLanguage = useCallback(
    (lang: LanguageCode) => {
      setLanguage(lang);
      setHasChosenLanguage(true);
    },
    [setLanguage]
  );

  const value = useMemo<I18nContextValue>(() => {
    const t = DICTIONARIES[language] || enMessages;
    return {
      language,
      languageConfig: getLanguageConfig(language),
      setLanguage,
      hasChosenLanguage,
      confirmLanguage,
      t,
      theme,
      setTheme: setThemeState,
      fontScale,
      setFontScale: setFontScaleState,
    };
  }, [language, hasChosenLanguage, theme, fontScale, setLanguage, confirmLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
