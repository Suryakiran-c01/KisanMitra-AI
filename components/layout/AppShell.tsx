"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  Globe,
  History,
  Home,
  Moon,
  ShoppingBasket,
  Sun,
  WifiOff,
  Contrast,
} from "lucide-react";
import { useI18n, ThemeMode } from "@/lib/i18n/context";
import { useCart } from "@/lib/storage/cartContext";
import { BrandLogo } from "@/components/illustrations/FarmArtwork";

export type AppTab = "home" | "scan" | "cart" | "history" | "schemes";

interface AppShellProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenLanguagePicker: () => void;
  children: React.ReactNode;
}

export function AppShell({
  activeTab,
  onTabChange,
  onOpenLanguagePicker,
  children,
}: AppShellProps) {
  const { t, languageConfig, theme, setTheme, fontScale, setFontScale } = useI18n();
  const { totalCount } = useCart();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOffline(!navigator.onLine);
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  const cycleTheme = () => {
    const order: ThemeMode[] = ["light", "high-contrast", "dark"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  const toggleFontSize = () => {
    if (fontScale === "normal") setFontScale("large");
    else if (fontScale === "large") setFontScale("small");
    else setFontScale("normal");
  };

  return (
    <div className="min-h-screen bg-field-pattern flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-border-soft">
        <div className="max-w-xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onTabChange("home")}
            className="flex items-center gap-2.5 text-left min-h-[48px] rounded-xl pr-2"
          >
            <BrandLogo size={40} />
            <div>
              <div className="font-heading font-bold text-lg leading-tight text-leaf-700">
                {t.appName}
              </div>
              <div className="text-xs text-muted-ink leading-tight">
                {languageConfig.nativeName}
              </div>
            </div>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleFontSize}
              aria-label={`${t.fontSize}: ${fontScale}`}
              title={`${t.fontSize}: ${fontScale}`}
              className="min-h-[44px] min-w-[44px] px-2.5 rounded-xl bg-soil-100 text-ink-900 font-bold text-sm border border-border-soft hover:bg-leaf-100"
            >
              {fontScale === "large" ? "A+" : fontScale === "small" ? "A-" : "A"}
            </button>

            <button
              type="button"
              onClick={cycleTheme}
              aria-label={`${t.contrastMode}: ${theme}`}
              title={`${t.contrastMode}: ${theme}`}
              className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-soil-100 text-ink-900 border border-border-soft hover:bg-leaf-100 flex items-center justify-center"
            >
              {theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : theme === "high-contrast" ? (
                <Contrast className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenLanguagePicker}
              aria-label={t.chooseLanguage}
              className="min-h-[44px] px-3 rounded-xl bg-leaf-100 text-leaf-700 font-semibold text-sm flex items-center gap-1.5 border border-leaf-500/30"
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span className="max-w-[78px] truncate">{languageConfig.nativeName}</span>
            </button>
          </div>
        </div>

        {isOffline && (
          <div
            role="status"
            className="bg-wheat-500 text-ink-900 px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>{t.offlineBanner}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-4 pb-28">{children}</main>

      {/* Footer disclosure */}
      <footer className="max-w-xl w-full mx-auto px-4 pb-24 text-center text-xs text-muted-ink space-y-1">
        <p>{t.privacyNote}</p>
        <p>{t.affiliateDisclosure}</p>
      </footer>

      {/* Mobile-first Bottom Navigation Bar (4 tabs, >= 56px touch targets) */}
      <nav
        aria-label="Primary navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border-soft shadow-soft"
      >
        <div className="max-w-xl mx-auto grid grid-cols-4 gap-1 px-2 py-1.5">
          <NavButton
            active={activeTab === "home"}
            onClick={() => onTabChange("home")}
            icon={<Home className="w-6 h-6" />}
            label={t.navHome}
          />
          <NavButton
            active={activeTab === "scan"}
            onClick={() => onTabChange("scan")}
            icon={<Camera className="w-6 h-6" />}
            label={t.navScan}
          />
          <NavButton
            active={activeTab === "cart"}
            onClick={() => onTabChange("cart")}
            icon={<ShoppingBasket className="w-6 h-6" />}
            label={t.navCart}
            badge={totalCount > 0 ? totalCount : undefined}
          />
          <NavButton
            active={activeTab === "history"}
            onClick={() => onTabChange("history")}
            icon={<History className="w-6 h-6" />}
            label={t.navHistory}
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative min-h-[56px] rounded-2xl flex flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
        active
          ? "bg-leaf-100 text-leaf-700 font-bold"
          : "text-muted-ink hover:bg-soil-100/60 font-medium"
      }`}
    >
      <div className="relative">
        {icon}
        {badge !== undefined && (
          <span className="absolute -top-1.5 -right-2.5 min-w-[20px] h-[20px] px-1 rounded-full bg-wheat-500 text-ink-900 text-xs font-bold flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="text-xs leading-none">{label}</span>
    </button>
  );
}
