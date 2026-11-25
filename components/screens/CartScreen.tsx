"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { groupCartByStore, ProductItem, StoreName } from "@/lib/products/matcher";
import { useCart } from "@/lib/storage/cartContext";
import { EmptyCartIllustration } from "@/components/illustrations/FarmArtwork";

export function CartScreen() {
  const { t } = useI18n();
  const { items, updateQty, changeStore, removeItem } = useCart();
  const [catalog, setCatalog] = useState<ProductItem[]>([]);

  useEffect(() => {
    fetch("/api/products?all=1")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.products)) setCatalog(d.products);
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <div className="bg-surface rounded-[24px] p-8 shadow-soft border border-border-soft text-center space-y-4 my-4">
        <div className="flex justify-center">
          <EmptyCartIllustration />
        </div>
        <h1 className="font-heading text-2xl font-bold text-soil-700">{t.cartEmpty}</h1>
        <p className="text-base text-muted-ink">{t.cartEmptySub}</p>
      </div>
    );
  }

  const grouped = groupCartByStore(items);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h1 className="font-heading text-2xl font-bold text-soil-700 px-1">{t.cartTitle}</h1>

      {/* Clear Handoff Disclaimer */}
      <div className="rounded-2xl bg-wheat-100 border-2 border-wheat-500 p-4 flex items-start gap-3 text-sm font-semibold text-ink-900">
        <ShieldCheck className="w-6 h-6 text-leaf-700 shrink-0 mt-0.5" />
        <p>{t.cartHandoffNotice}</p>
      </div>

      {grouped.map((group) => (
        <section
          key={group.store}
          className="bg-surface rounded-[24px] p-4 shadow-soft border border-border-soft space-y-3"
        >
          <div className="flex items-center justify-between border-b border-border-soft pb-2.5">
            <h2 className="font-heading text-xl font-bold text-leaf-700">{group.store}</h2>
            <span className="text-base font-bold text-ink-900">
              ~Rs {group.subtotalINR}
            </span>
          </div>

          <div className="space-y-3">
            {group.items.map((item) => {
              const catalogMatch = catalog.find((p) => p.id === item.productId);
              return (
                <div
                  key={`${item.productId}-${item.selectedStore}`}
                  className="rounded-2xl bg-cream-50 border border-border-soft p-3 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-base text-ink-900">{item.name}</div>
                      <div className="text-xs text-leaf-700 font-medium">{item.genericName}</div>
                      <div className="text-xs text-muted-ink">
                        {item.packSize} · ~Rs {item.priceINR}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.selectedStore)}
                      aria-label={t.remove}
                      className="min-h-[44px] min-w-[44px] rounded-xl text-alert-500 hover:bg-alert-500/10 flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, item.selectedStore, -1)}
                        aria-label="Decrease quantity"
                        className="min-h-[44px] min-w-[44px] rounded-xl bg-soil-100 flex items-center justify-center font-bold"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="min-w-[28px] text-center font-bold text-base">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, item.selectedStore, 1)}
                        aria-label="Increase quantity"
                        className="min-h-[44px] min-w-[44px] rounded-xl bg-soil-100 flex items-center justify-center font-bold"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Store switcher */}
                    {catalogMatch && catalogMatch.stores.length > 1 && (
                      <select
                        aria-label="Choose store"
                        value={item.selectedStore}
                        onChange={(e) =>
                          changeStore(
                            item.productId,
                            item.selectedStore,
                            e.target.value as StoreName,
                            catalogMatch
                          )
                        }
                        className="min-h-[44px] rounded-xl bg-surface border border-border-soft px-2.5 text-sm font-semibold"
                      >
                        {catalogMatch.stores.map((s) => (
                          <option key={s.store} value={s.store}>
                            {s.store} (~Rs {s.priceINR})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <a
            href={group.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[56px] rounded-2xl bg-leaf-700 text-white font-heading font-bold text-lg flex items-center justify-center gap-2 hover:brightness-105 transition"
          >
            <span>
              {t.goToStore} ({group.store})
            </span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </section>
      ))}
    </motion.div>
  );
}
