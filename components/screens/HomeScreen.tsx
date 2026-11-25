"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  CloudSun,
  History,
  Keyboard,
  Landmark,
  Mic,
  PhoneCall,
  Sprout,
  Wind,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { HeroFarmIllustration } from "@/components/illustrations/FarmArtwork";
import { SpeakButton } from "@/components/common/SpeakButton";

export type ScanModePrefill = "camera" | "voice" | "text";

interface WeatherData {
  tempC: number | null;
  humidityPct: number | null;
  windKmh: number | null;
  rainProbPct: number | null;
  isGoodToSpray: boolean;
}

interface HomeScreenProps {
  onStartScan: (mode: ScanModePrefill) => void;
  onOpenHistory: () => void;
  onOpenSchemes: () => void;
}

export function HomeScreen({ onStartScan, onOpenHistory, onOpenSchemes }: HomeScreenProps) {
  const { t } = useI18n();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const checkWeather = async () => {
    setWeatherLoading(true);
    let lat = 20.5937;
    let lon = 78.9629;

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4500 })
        );
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } catch {
        // Use central India fallback coordinates if permission denied
      }
    }

    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setWeather(data);
    } catch {
      setWeather({
        tempC: null,
        humidityPct: null,
        windKmh: null,
        rainProbPct: null,
        isGoodToSpray: true,
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Hero Card */}
      <section className="bg-surface rounded-[24px] p-4 shadow-soft border border-border-soft space-y-3">
        <HeroFarmIllustration />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-soil-700 leading-tight">
              {t.greeting}
            </h1>
            <p className="text-base text-muted-ink mt-1">{t.greetingSub}</p>
          </div>
          <SpeakButton text={`${t.greeting} ${t.greetingSub}`} compact />
        </div>
      </section>

      {/* Primary Action Cards */}
      <section className="space-y-3" aria-label="Crop diagnosis options">
        <button
          type="button"
          onClick={() => onStartScan("camera")}
          className="w-full min-h-[76px] rounded-[20px] bg-leaf-700 text-white p-4 shadow-lift flex items-center gap-4 text-left hover:brightness-105 transition"
        >
          <span className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Camera className="w-8 h-8" />
          </span>
          <div className="flex-1">
            <div className="font-heading text-xl font-bold">{t.scanCropTitle}</div>
            <div className="text-sm text-leaf-100">{t.scanCropSub}</div>
          </div>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onStartScan("voice")}
            className="min-h-[72px] rounded-[20px] bg-wheat-500 text-ink-900 p-4 shadow-soft flex items-center gap-3.5 text-left hover:brightness-95 transition"
          >
            <span className="w-12 h-12 rounded-2xl bg-white/55 flex items-center justify-center shrink-0">
              <Mic className="w-7 h-7 text-soil-700" />
            </span>
            <div>
              <div className="font-heading text-lg font-bold">{t.askVoiceTitle}</div>
              <div className="text-xs font-medium opacity-85">{t.askVoiceSub}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onStartScan("text")}
            className="min-h-[72px] rounded-[20px] bg-surface text-ink-900 p-4 shadow-soft border-2 border-border-soft flex items-center gap-3.5 text-left hover:border-leaf-500 transition"
          >
            <span className="w-12 h-12 rounded-2xl bg-leaf-100 text-leaf-700 flex items-center justify-center shrink-0">
              <Keyboard className="w-7 h-7" />
            </span>
            <div>
              <div className="font-heading text-lg font-bold">{t.askTextTitle}</div>
              <div className="text-xs text-muted-ink">{t.askTextSub}</div>
            </div>
          </button>
        </div>
      </section>

      {/* Spray Weather Strip (F8) */}
      <button
        type="button"
        onClick={checkWeather}
        disabled={weatherLoading}
        className="w-full min-h-[64px] rounded-[20px] bg-surface border border-sky-500/40 p-4 shadow-soft flex items-center gap-3.5 text-left hover:bg-leaf-100/40 transition"
      >
        <span className="w-11 h-11 rounded-2xl bg-sky-500/15 text-sky-500 flex items-center justify-center shrink-0">
          {weather ? <Wind className="w-6 h-6" /> : <CloudSun className="w-6 h-6" />}
        </span>
        <div className="flex-1">
          <div className="font-bold text-base text-ink-900 flex items-center gap-2">
            <span>{t.weatherTitle}</span>
            {weather?.tempC !== null && weather?.tempC !== undefined && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-leaf-100 text-leaf-700">
                {weather.tempC}°C · {weather.windKmh} km/h
              </span>
            )}
          </div>
          <div className="text-sm text-muted-ink">
            {weatherLoading
              ? "..."
              : !weather
              ? t.weatherAllowLocation
              : weather.isGoodToSpray
              ? t.weatherGood
              : t.weatherCaution}
          </div>
        </div>
      </button>

      {/* Quick Links */}
      <section className="grid grid-cols-2 gap-3" aria-label="Quick links">
        <button
          type="button"
          onClick={onOpenSchemes}
          className="min-h-[64px] rounded-[20px] bg-surface border border-border-soft p-3.5 shadow-soft flex items-center gap-3 text-left hover:border-leaf-500 transition"
        >
          <span className="w-10 h-10 rounded-xl bg-wheat-100 text-soil-700 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5" />
          </span>
          <span className="font-bold text-sm text-ink-900">{t.quickSchemes}</span>
        </button>

        <button
          type="button"
          onClick={onOpenHistory}
          className="min-h-[64px] rounded-[20px] bg-surface border border-border-soft p-3.5 shadow-soft flex items-center gap-3 text-left hover:border-leaf-500 transition"
        >
          <span className="w-10 h-10 rounded-xl bg-leaf-100 text-leaf-700 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </span>
          <span className="font-bold text-sm text-ink-900">{t.quickHistory}</span>
        </button>
      </section>

      {/* Kisan Call Centre Quick Strip */}
      <a
        href="tel:18001801551"
        className="w-full min-h-[56px] rounded-[20px] bg-leaf-100 border border-leaf-500/30 px-4 py-3 flex items-center justify-center gap-2.5 font-bold text-leaf-700 text-base"
      >
        <PhoneCall className="w-5 h-5 shrink-0" />
        <span>{t.quickHelpline}</span>
        <Sprout className="w-5 h-5 shrink-0 opacity-70" />
      </a>
    </motion.div>
  );
}
