"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { HistoryEntry } from "@/lib/storage/localStore";
import { EmptyHistoryIllustration } from "@/components/illustrations/FarmArtwork";

interface HistoryScreenProps {
  entries: HistoryEntry[];
  onOpenEntry: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export function HistoryScreen({ entries, onOpenEntry, onClear }: HistoryScreenProps) {
  const { t } = useI18n();

  if (entries.length === 0) {
    return (
      <div className="bg-surface rounded-[24px] p-8 shadow-soft border border-border-soft text-center space-y-4 my-4">
        <div className="flex justify-center">
          <EmptyHistoryIllustration />
        </div>
        <h1 className="font-heading text-2xl font-bold text-soil-700">{t.historyEmpty}</h1>
        <p className="text-base text-muted-ink">{t.historyEmptySub}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between px-1">
        <h1 className="font-heading text-2xl font-bold text-soil-700">{t.historyTitle}</h1>
        <button
          type="button"
          onClick={onClear}
          className="min-h-[44px] px-3 rounded-xl text-sm font-bold text-alert-500 hover:bg-alert-500/10 flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t.clearHistory}</span>
        </button>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const dateLabel = new Date(entry.createdAt).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onOpenEntry(entry)}
              className="w-full bg-surface rounded-[22px] p-4 shadow-soft border border-border-soft flex items-center gap-3.5 text-left hover:border-leaf-500 transition"
            >
              {entry.thumbnail ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={entry.thumbnail}
                  alt="Crop thumbnail"
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-border-soft"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-leaf-100 text-leaf-700 font-bold text-sm flex items-center justify-center shrink-0">
                  {entry.crop || "Crop"}
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-1">
                <div className="font-heading font-bold text-base text-ink-900 truncate">
                  {entry.result.diagnosis?.name || entry.queryText || "Crop check"}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-ink">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{dateLabel}</span>
                  {entry.crop && (
                    <span className="px-2 py-0.5 rounded-full bg-soil-100 text-soil-700 font-semibold capitalize">
                      {entry.crop}
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-muted-ink shrink-0" />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
