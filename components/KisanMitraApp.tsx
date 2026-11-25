"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DiagnoseResponse } from "@/lib/ai/schemas";
import { useI18n } from "@/lib/i18n/context";
import { LanguageCode } from "@/lib/i18n/languages";
import {
  appendHistory,
  clearHistoryStorage,
  HistoryEntry,
  loadHistory,
} from "@/lib/storage/localStore";
import { AppShell, AppTab } from "@/components/layout/AppShell";
import { HomeScreen, ScanModePrefill } from "@/components/screens/HomeScreen";
import { LanguagePicker } from "@/components/screens/LanguagePicker";

const ScanScreen = dynamic(
  () => import("@/components/screens/ScanScreen").then((m) => m.ScanScreen),
  { ssr: false }
);
const ResultScreen = dynamic(
  () => import("@/components/screens/ResultScreen").then((m) => m.ResultScreen),
  { ssr: false }
);
const CartScreen = dynamic(
  () => import("@/components/screens/CartScreen").then((m) => m.CartScreen),
  { ssr: false }
);
const HistoryScreen = dynamic(
  () => import("@/components/screens/HistoryScreen").then((m) => m.HistoryScreen),
  { ssr: false }
);
const SchemesScreen = dynamic(
  () => import("@/components/screens/SchemesScreen").then((m) => m.SchemesScreen),
  { ssr: false }
);

export function KisanMitraApp() {
  const { language, hasChosenLanguage, confirmLanguage } = useI18n();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [scanPrefill, setScanPrefill] = useState<ScanModePrefill | null>(null);
  const [currentResult, setCurrentResult] = useState<{
    result: DiagnoseResponse;
    crop?: string;
  } | null>(null);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistoryEntries(loadHistory());
  }, []);

  if (!hasChosenLanguage || showLanguagePicker) {
    return (
      <LanguagePicker
        onSelect={(code: LanguageCode) => {
          confirmLanguage(code);
          setShowLanguagePicker(false);
        }}
      />
    );
  }

  const handleStartScan = (mode: ScanModePrefill) => {
    setScanPrefill(mode);
    setCurrentResult(null);
    setActiveTab("scan");
  };

  const handleDiagnosed = (payload: {
    result: DiagnoseResponse;
    crop?: string;
    location?: string;
    queryText?: string;
    thumbnail?: string;
  }) => {
    setCurrentResult({ result: payload.result, crop: payload.crop });
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      language,
      crop: payload.crop,
      location: payload.location,
      queryText: payload.queryText,
      thumbnail: payload.thumbnail,
      result: payload.result,
    };
    setHistoryEntries(appendHistory(entry));
    setActiveTab("scan");
  };

  const handleOpenHistoryEntry = (entry: HistoryEntry) => {
    setCurrentResult({ result: entry.result, crop: entry.crop });
    setActiveTab("scan");
  };

  const handleClearHistory = () => {
    clearHistoryStorage();
    setHistoryEntries([]);
  };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={(tab) => {
        if (tab !== "scan") {
          setScanPrefill(null);
        }
        setActiveTab(tab);
      }}
      onOpenLanguagePicker={() => setShowLanguagePicker(true)}
    >
      {activeTab === "home" && (
        <HomeScreen
          onStartScan={handleStartScan}
          onOpenHistory={() => setActiveTab("history")}
          onOpenSchemes={() => setActiveTab("schemes")}
        />
      )}

      {activeTab === "scan" &&
        (currentResult ? (
          <ResultScreen
            result={currentResult.result}
            crop={currentResult.crop}
            onNewScan={() => setCurrentResult(null)}
          />
        ) : (
          <ScanScreen initialMode={scanPrefill} onDiagnosed={handleDiagnosed} />
        ))}

      {activeTab === "cart" && <CartScreen />}

      {activeTab === "history" && (
        <HistoryScreen
          entries={historyEntries}
          onOpenEntry={handleOpenHistoryEntry}
          onClear={handleClearHistory}
        />
      )}

      {activeTab === "schemes" && <SchemesScreen onBack={() => setActiveTab("home")} />}
    </AppShell>
  );
}
