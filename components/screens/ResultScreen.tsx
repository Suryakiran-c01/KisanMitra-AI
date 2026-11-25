"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  IndianRupee,
  Leaf,
  PhoneCall,
  ShieldAlert,
  ShoppingBasket,
  Sparkles,
} from "lucide-react";
import { DiagnoseResponse } from "@/lib/ai/schemas";
import { useI18n } from "@/lib/i18n/context";
import { ProductItem, StoreName } from "@/lib/products/matcher";
import { useCart } from "@/lib/storage/cartContext";
import { SpeakButton } from "@/components/common/SpeakButton";
import { ProductDetailSheet } from "@/components/products/ProductDetailSheet";

interface ResultScreenProps {
  result: DiagnoseResponse;
  crop?: string;
  onNewScan: () => void;
}

export function ResultScreen({ result, crop, onNewScan }: ResultScreenProps) {
  const { t } = useI18n();
  const { addItem } = useCart();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (result.isOffTopic) return;
    let active = true;
    const load = async () => {
      setLoadingProducts(true);
      try {
        const kw = encodeURIComponent((result.productKeywords || []).join(","));
        const cropParam = crop ? `&crop=${encodeURIComponent(crop)}` : "";
        const res = await fetch(`/api/products?keywords=${kw}${cropParam}`);
        const data = await res.json();
        if (active && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch {
        // ignore offline product fetch failure
      } finally {
        if (active) setLoadingProducts(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [result.productKeywords, result.isOffTopic, crop]);

  const fullSpeechSummary = useMemo(() => {
    const parts: string[] = [];
    if (result.diagnosis) {
      parts.push(`${result.diagnosis.name}. ${result.diagnosis.cause}`);
    }
    if (result.plan?.steps?.length) {
      parts.push(
        result.plan.steps.map((s, idx) => `${idx + 1}. ${s.text}. ${s.timing}`).join(" ")
      );
    }
    if (result.safety?.length) {
      parts.push(`${t.safetyTitle}: ${result.safety.join(". ")}`);
    }
    return parts.join(" ");
  }, [result, t.safetyTitle]);

  const handleAdd = (product: ProductItem, store?: StoreName) => {
    addItem(product, store);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const diagnosis = result.diagnosis;
  const confidence = diagnosis?.confidence || "Medium";
  const severity = diagnosis?.severity || "Medium";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onNewScan}
          className="min-h-[48px] px-3.5 rounded-2xl bg-surface border border-border-soft font-semibold text-ink-900 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.newScan}</span>
        </button>

        <SpeakButton text={fullSpeechSummary} />
      </div>

      {/* Diagnosis Header Card */}
      {diagnosis && (
        <section className="bg-surface rounded-[24px] p-5 shadow-soft border border-border-soft space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <h1 className="font-heading text-2xl font-bold text-soil-700 leading-tight">
                {diagnosis.name}
              </h1>
              <p className="text-sm font-semibold text-muted-ink">{t.causeLabel}</p>
            </div>
            <ConfidenceRing confidence={confidence} label={t.confidence} />
          </div>

          <p className="text-base text-ink-900 leading-relaxed">{diagnosis.cause}</p>

          {/* Visual Severity Meter */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-sm font-bold">
              <span>{t.severity}</span>
              <span>{severity}</span>
            </div>
            <div className="h-4 rounded-full bg-soil-100 overflow-hidden p-0.5 flex gap-1">
              <div
                className={`h-full rounded-full flex-1 ${
                  severity === "Low" || severity === "Medium" || severity === "High"
                    ? "bg-leaf-500"
                    : "bg-soil-100"
                }`}
              />
              <div
                className={`h-full rounded-full flex-1 ${
                  severity === "Medium" || severity === "High" ? "bg-wheat-500" : "bg-transparent"
                }`}
              />
              <div
                className={`h-full rounded-full flex-1 ${
                  severity === "High" ? "bg-alert-500" : "bg-transparent"
                }`}
              />
            </div>
          </div>

          {result.photoTip && (
            <div className="rounded-2xl bg-leaf-100/70 p-3 text-sm text-ink-900">
              {result.photoTip}
            </div>
          )}

          {(confidence === "Low" || result.escalate) && (
            <div className="rounded-2xl bg-wheat-100 border border-wheat-500 p-3.5 text-sm font-semibold text-soil-700">
              {t.lowConfidenceNote}
            </div>
          )}
        </section>
      )}

      {/* Treatment Steps Timeline */}
      {result.plan?.steps?.length > 0 && (
        <section className="bg-surface rounded-[24px] p-5 shadow-soft border border-border-soft space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-heading text-xl font-bold text-soil-700">{t.treatmentPlan}</h2>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-leaf-100 text-leaf-700 text-sm font-bold">
              <IndianRupee className="w-4 h-4" />
              {t.estimatedCost}: {result.costRangeINR}
            </span>
          </div>

          <ol className="space-y-3.5">
            {result.plan.steps.map((step, idx) => {
              const badgeStyle =
                step.type === "organic"
                  ? "bg-leaf-100 text-leaf-700 border-leaf-500/40"
                  : step.type === "biological"
                  ? "bg-sky-500/15 text-ink-900 border-sky-500/40"
                  : "bg-wheat-100 text-soil-700 border-wheat-500/50";
              const badgeLabel =
                step.type === "organic"
                  ? t.stepOrganic
                  : step.type === "biological"
                  ? t.stepBiological
                  : t.stepChemical;

              return (
                <li
                  key={`${step.type}-${idx}`}
                  className="rounded-2xl bg-cream-50 border border-border-soft p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-leaf-700 text-white font-bold text-sm flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeStyle}`}>
                        {badgeLabel}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-muted-ink">{step.timing}</span>
                  </div>
                  <p className="text-base text-ink-900 leading-relaxed">{step.text}</p>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Safety Box */}
      {result.safety?.length > 0 && (
        <section
          aria-labelledby="safety-heading"
          className="rounded-[24px] bg-alert-500/10 border-2 border-alert-500 p-5 space-y-3"
        >
          <div className="flex items-center gap-2.5 text-alert-500">
            <ShieldAlert className="w-7 h-7 shrink-0" />
            <h2 id="safety-heading" className="font-heading text-xl font-bold">
              {t.safetyTitle}
            </h2>
          </div>
          <p className="text-sm font-bold text-ink-900 bg-white/80 rounded-xl p-2.5 border border-alert-500/30">
            {t.safetyLabelWarning}
          </p>
          <ul className="space-y-2 list-disc pl-5 text-base text-ink-900">
            {result.safety.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Recommended Products Carousel / List */}
      {!result.isOffTopic && (
        <section className="space-y-3">
          <div className="px-1">
            <h2 className="font-heading text-xl font-bold text-soil-700">
              {t.recommendedProducts}
            </h2>
            <p className="text-sm text-muted-ink">{t.organicFirstNote}</p>
          </div>

          {loadingProducts ? (
            <div className="bg-surface rounded-2xl p-6 text-center text-muted-ink border border-border-soft">
              ...
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => {
                const cheapestOffer = product.stores
                  .slice()
                  .sort((a, b) => a.priceINR - b.priceINR)[0];
                const isAdded = addedIds[product.id];

                return (
                  <article
                    key={product.id}
                    className="bg-surface rounded-[22px] p-4 shadow-soft border border-border-soft space-y-3"
                  >
                    <div className="flex gap-3.5 items-start">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-2xl object-contain bg-leaf-100/50 p-1.5 shrink-0 border border-border-soft"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {product.isOrganic && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-leaf-100 text-leaf-700 text-xs font-bold">
                              <Leaf className="w-3.5 h-3.5" />
                              Organic / Bio
                            </span>
                          )}
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-soil-100 text-soil-700">
                            {product.packSize}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          className="font-heading font-bold text-lg text-ink-900 text-left hover:underline"
                        >
                          {product.name}
                        </button>

                        <p className="text-xs font-semibold text-leaf-700">
                          {t.genericLabel}: {product.genericName}
                        </p>
                      </div>
                    </div>

                    {/* Price Comparison Row across 2-3 stores */}
                    <div className="rounded-2xl bg-cream-50 border border-border-soft p-2.5 space-y-2">
                      <div className="text-xs text-muted-ink font-medium">
                        {t.approxPriceNote}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {product.stores.map((offer) => (
                          <a
                            key={offer.store}
                            href={offer.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[48px] rounded-xl bg-surface border border-border-soft px-3 py-2 flex items-center justify-between gap-2 hover:border-leaf-700 transition"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-soil-700 truncate">
                                {offer.store}
                              </div>
                              <div className="text-sm font-bold text-ink-900">
                                ~Rs {offer.priceINR}
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-leaf-700 shrink-0">
                              {t.buyAt} <ExternalLink className="w-3.5 h-3.5" />
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAdd(product, cheapestOffer?.store)}
                        className={`flex-1 min-h-[52px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition ${
                          isAdded
                            ? "bg-leaf-500 text-white"
                            : "bg-wheat-500 text-ink-900 hover:brightness-95"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>{t.addedToCart}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBasket className="w-5 h-5" />
                            <span>{t.addToCart}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="min-h-[52px] px-4 rounded-2xl border border-border-soft bg-soil-100/60 font-bold text-sm text-ink-900"
                      >
                        Compare
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Talk to an expert (KVK) */}
      <section className="rounded-[24px] bg-leaf-100 border-2 border-leaf-500/40 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-leaf-700 text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-bold text-leaf-700">{t.talkToExpert}</h2>
            <p className="text-sm text-ink-900">Kisan Call Centre (Toll-Free, 6 AM - 10 PM)</p>
          </div>
        </div>
        <a
          href="tel:18001801551"
          className="w-full min-h-[56px] rounded-2xl bg-leaf-700 text-white font-heading font-bold text-lg flex items-center justify-center gap-2"
        >
          <PhoneCall className="w-5 h-5" />
          <span>1800-180-1551</span>
        </a>
      </section>

      {/* AI Advice Disclaimer */}
      <div className="rounded-2xl bg-soil-100 p-3.5 flex items-center gap-2.5 text-sm font-semibold text-soil-700">
        <AlertTriangle className="w-5 h-5 shrink-0 text-wheat-500" />
        <span>{t.disclaimer}</span>
      </div>

      {selectedProduct && (
        <ProductDetailSheet
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(store) => handleAdd(selectedProduct, store)}
        />
      )}
    </motion.div>
  );
}

function ConfidenceRing({
  confidence,
  label,
}: {
  confidence: "High" | "Medium" | "Low";
  label: string;
}) {
  const pct = confidence === "High" ? 88 : confidence === "Medium" ? 60 : 30;
  const strokeColor =
    confidence === "High"
      ? "var(--leaf-700)"
      : confidence === "Medium"
      ? "var(--wheat-500)"
      : "var(--alert-500)";
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90" aria-hidden="true">
          <circle cx="32" cy="32" r={radius} stroke="var(--soil-100)" strokeWidth="6" fill="none" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <span className="absolute text-xs font-bold text-ink-900">{confidence}</span>
      </div>
      <span className="text-xs text-muted-ink font-medium">{label}</span>
    </div>
  );
}
