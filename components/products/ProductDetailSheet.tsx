"use client";

import React, { useState } from "react";
import { ExternalLink, Leaf, ShoppingBasket, X } from "lucide-react";
import { ProductItem, StoreName } from "@/lib/products/matcher";
import { useI18n } from "@/lib/i18n/context";

interface ProductDetailSheetProps {
  product: ProductItem;
  onClose: () => void;
  onAddToCart: (store: StoreName) => void;
}

export function ProductDetailSheet({
  product,
  onClose,
  onAddToCart,
}: ProductDetailSheetProps) {
  const { t } = useI18n();
  const [selectedStore, setSelectedStore] = useState<StoreName>(
    product.stores[0]?.store || "BigHaat"
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-sheet-title"
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="bg-surface w-full max-w-lg rounded-t-[28px] sm:rounded-[28px] p-5 max-h-[90vh] overflow-y-auto space-y-4 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded-2xl bg-leaf-100/50 p-1.5 border border-border-soft"
            />
            <div>
              <h2 id="product-sheet-title" className="font-heading text-xl font-bold text-ink-900">
                {product.name}
              </h2>
              <p className="text-sm font-semibold text-leaf-700">
                {t.genericLabel}: {product.genericName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="min-h-[44px] min-w-[44px] rounded-full bg-soil-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {product.isOrganic && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-leaf-100 text-leaf-700 text-xs font-bold">
              <Leaf className="w-4 h-4" />
              Organic / Bio
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-soil-100 text-soil-700 text-xs font-bold">
            {product.packSize}
          </span>
        </div>

        <p className="text-base text-ink-900">{product.description}</p>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-ink">{t.approxPriceNote}</div>
          {product.stores.map((offer) => {
            const active = offer.store === selectedStore;
            return (
              <div
                key={offer.store}
                className={`rounded-2xl p-3 border-2 flex items-center justify-between gap-3 ${
                  active ? "border-leaf-700 bg-leaf-100/50" : "border-border-soft bg-cream-50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedStore(offer.store)}
                  className="text-left flex-1 min-h-[44px]"
                >
                  <div className="font-bold text-base text-ink-900">{offer.store}</div>
                  <div className="text-sm font-semibold text-leaf-700">~Rs {offer.priceINR}</div>
                </button>

                <a
                  href={offer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-4 rounded-xl bg-leaf-700 text-white font-bold text-sm flex items-center gap-1.5"
                >
                  <span>{t.buyAt}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            onAddToCart(selectedStore);
            onClose();
          }}
          className="w-full min-h-[58px] rounded-2xl bg-wheat-500 text-ink-900 font-heading font-bold text-lg flex items-center justify-center gap-2"
        >
          <ShoppingBasket className="w-6 h-6" />
          <span>
            {t.addToCart} ({selectedStore})
          </span>
        </button>
      </div>
    </div>
  );
}
