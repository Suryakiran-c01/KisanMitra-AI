"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Landmark, PhoneCall, TrendingUp } from "lucide-react";
import schemesData from "@/data/schemes.json";
import { useI18n } from "@/lib/i18n/context";
import { SpeakButton } from "@/components/common/SpeakButton";

interface MandiRate {
  crop: string;
  market: string;
  minINR: number;
  maxINR: number;
  unit: string;
}

export function SchemesScreen({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [rates, setRates] = useState<MandiRate[]>([]);
  const [liveMandi, setLiveMandi] = useState(false);

  useEffect(() => {
    fetch("/api/mandi")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.rates)) setRates(d.rates);
        setLiveMandi(Boolean(d.live));
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[48px] px-3.5 rounded-2xl bg-surface border border-border-soft font-semibold flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.navHome}</span>
        </button>
      </div>

      <h1 className="font-heading text-2xl font-bold text-soil-700 px-1 flex items-center gap-2">
        <Landmark className="w-7 h-7 text-leaf-700" />
        <span>{t.schemesTitle}</span>
      </h1>

      <div className="space-y-3">
        {schemesData.map((scheme) => (
          <article
            key={scheme.id}
            className="bg-surface rounded-[22px] p-4 shadow-soft border border-border-soft space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-leaf-100 text-leaf-700">
                  {scheme.category}
                </span>
                <h2 className="font-heading text-lg font-bold text-ink-900 mt-1">
                  {scheme.name}
                </h2>
              </div>
              <SpeakButton text={`${scheme.name}. ${scheme.benefit}. ${scheme.howToApply}`} compact />
            </div>

            <p className="text-base text-ink-900">{scheme.benefit}</p>
            <p className="text-sm text-muted-ink">{scheme.howToApply}</p>

            <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-soil-700">
                <PhoneCall className="w-4 h-4 text-leaf-700" />
                {scheme.helpline}
              </span>
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[46px] px-4 rounded-xl bg-leaf-700 text-white font-bold text-sm inline-flex items-center gap-1.5"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Mandi Rates Card (F8) */}
      <section className="bg-surface rounded-[24px] p-4 shadow-soft border border-border-soft space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-soil-700 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-wheat-500" />
            <span>Mandi Price Reference</span>
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-wheat-100 text-soil-700 font-bold">
            {liveMandi ? "Live AGMARKNET" : "Reference Rates"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {rates.slice(0, 6).map((r) => (
            <div
              key={`${r.crop}-${r.market}`}
              className="rounded-2xl bg-cream-50 border border-border-soft p-3"
            >
              <div className="font-bold text-base text-ink-900">{r.crop}</div>
              <div className="text-xs text-muted-ink">{r.market}</div>
              <div className="text-sm font-bold text-leaf-700 mt-1">
                Rs {r.minINR} – Rs {r.maxINR} / {r.unit}
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
