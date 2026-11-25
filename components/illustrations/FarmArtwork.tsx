"use client";

import React from "react";

export function BrandLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="64" height="64" rx="16" fill="var(--leaf-700)" />
      <path d="M32 50V26" stroke="#FFFDF7" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M32 36C22 36 16 30 16 20C26 20 32 26 32 36Z"
        fill="#4CAF50"
        stroke="#FFFDF7"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 31C42 31 48 25 48 15C38 15 32 21 32 31Z"
        fill="#F9A825"
        stroke="#FFFDF7"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroFarmIllustration() {
  return (
    <svg
      viewBox="0 0 360 150"
      fill="none"
      className="w-full h-auto rounded-2xl"
      role="img"
      aria-label="Sunrise over green farm fields with a farmer holding a smartphone"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF8E1" />
          <stop offset="100%" stopColor="#E8F5E9" />
        </linearGradient>
      </defs>
      <rect width="360" height="150" rx="20" fill="url(#skyGrad)" />
      {/* Morning sun */}
      <circle cx="265" cy="54" r="30" fill="#F9A825" fillOpacity="0.9" />
      <circle cx="265" cy="54" r="42" fill="#F9A825" fillOpacity="0.2" />
      {/* Distant hills */}
      <path d="M0 105C65 76 135 82 200 102C265 120 315 84 360 94V150H0V105Z" fill="#A5D6A7" />
      {/* Mid field */}
      <path d="M0 116C85 96 175 128 260 108C305 98 338 104 360 112V150H0V116Z" fill="#66BB6A" />
      {/* Foreground field */}
      <path d="M0 128C110 118 220 138 360 124V150H0V128Z" fill="#2E7D32" />
      {/* Crop rows */}
      <path d="M40 144L62 128M95 146L112 130M155 146L165 132" stroke="#E8F5E9" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" />
      {/* Smiling farmer silhouette holding phone */}
      <g transform="translate(230, 42)">
        {/* Turban / Pagdi */}
        <ellipse cx="44" cy="24" rx="18" ry="12" fill="#F9A825" />
        <path d="M27 25C34 18 54 18 61 25" stroke="#5D4037" strokeWidth="2" />
        {/* Head */}
        <circle cx="44" cy="36" r="11" fill="#8D6E63" />
        {/* Smile */}
        <path d="M40 39C42 41 46 41 48 39" stroke="#FFFDF7" strokeWidth="1.8" strokeLinecap="round" />
        {/* Body / Kurta */}
        <path d="M24 84C24 62 32 50 44 50C56 50 64 62 64 84H24Z" fill="#FFFDF7" stroke="#2E7D32" strokeWidth="2.5" />
        {/* Arm + Phone */}
        <path d="M28 64L12 58" stroke="#8D6E63" strokeWidth="7" strokeLinecap="round" />
        <rect x="3" y="42" width="14" height="22" rx="3" fill="#1F2A1F" stroke="#F9A825" strokeWidth="1.5" />
        <rect x="6" y="46" width="8" height="12" rx="1" fill="#4CAF50" />
      </g>
      {/* Sprout emblem on left */}
      <g transform="translate(26, 26)">
        <circle cx="24" cy="24" r="22" fill="#FFFFFF" fillOpacity="0.85" />
        <path d="M24 38V18" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 27C16 27 12 22 12 15C20 15 24 20 24 27Z" fill="#4CAF50" />
        <path d="M24 24C32 24 36 19 36 12C28 12 24 17 24 24Z" fill="#F9A825" />
      </g>
    </svg>
  );
}

export function SproutLoaderSVG() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <ellipse cx="48" cy="80" rx="28" ry="8" fill="#5D4037" fillOpacity="0.25" />
      <g className="animate-sprout">
        <path d="M48 78V36" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" />
        <path
          d="M48 54C32 54 22 44 22 28C38 28 48 38 48 54Z"
          fill="#4CAF50"
          stroke="#2E7D32"
          strokeWidth="2.5"
        />
        <path
          d="M48 46C64 46 74 36 74 20C58 20 48 30 48 46Z"
          fill="#F9A825"
          stroke="#5D4037"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export function EmptyCartIllustration() {
  return (
    <svg width="130" height="110" viewBox="0 0 130 110" fill="none" aria-hidden="true">
      <circle cx="65" cy="55" r="46" fill="var(--leaf-100)" />
      <path d="M30 48H100L91 88H39L30 48Z" fill="#FFF8E1" stroke="#5D4037" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M46 48C46 32 54 24 65 24C76 24 84 32 84 48" stroke="#2E7D32" strokeWidth="4" strokeLinecap="round" />
      <path d="M44 62H86M47 74H83" stroke="#F9A825" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyHistoryIllustration() {
  return (
    <svg width="130" height="110" viewBox="0 0 130 110" fill="none" aria-hidden="true">
      <circle cx="65" cy="55" r="46" fill="var(--wheat-100)" />
      <rect x="40" y="24" width="50" height="64" rx="10" fill="#FFFDF7" stroke="#5D4037" strokeWidth="3" />
      <path d="M65 64V44" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
      <path d="M65 53C57 53 53 48 53 42C61 42 65 46 65 53Z" fill="#4CAF50" />
      <path d="M65 49C73 49 77 44 77 38C69 38 65 42 65 49Z" fill="#F9A825" />
    </svg>
  );
}

export function CropIcon({ crop }: { crop: string }) {
  switch (crop) {
    case "wheat":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 21V5M12 10L8 7M12 14L8 11M12 10L16 7M12 14L16 11M12 6L10 3M12 6L14 3" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "rice":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 20V8C12 5 15 4 17 5M12 13C9 13 7 11 7 8M12 16C15 16 17 14 17 11" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "cotton":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="9" r="4" fill="#FFFDF7" stroke="#5D4037" strokeWidth="1.8" />
          <circle cx="8.5" cy="12" r="3.5" fill="#FFFDF7" stroke="#5D4037" strokeWidth="1.8" />
          <circle cx="15.5" cy="12" r="3.5" fill="#FFFDF7" stroke="#5D4037" strokeWidth="1.8" />
          <path d="M12 15V21" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "tomato":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="14" r="6.5" fill="#E53935" />
          <path d="M9 7L12 9L15 7M12 4V9" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "sugarcane":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 20L15 4M10 15H13M12 10H15" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "maize":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <ellipse cx="12" cy="11" rx="4" ry="7" fill="#F9A825" stroke="#5D4037" strokeWidth="1.5" />
          <path d="M8 15C8 19 12 21 12 21C12 21 16 19 16 15" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "soybean":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 16C8 10 14 7 19 7C18 13 13 18 6 16Z" fill="#8BC34A" stroke="#2E7D32" strokeWidth="1.8" />
          <circle cx="11" cy="13" r="1.5" fill="#FFFDF7" />
          <circle cx="15" cy="10.5" r="1.5" fill="#FFFDF7" />
        </svg>
      );
    case "chilli":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M16 7C16 14 11 19 6 19C9 15 11 11 12 7C13 6 15 6 16 7Z" fill="#E53935" />
          <path d="M14 6L17 3" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "potato":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <ellipse cx="12" cy="13" rx="7" ry="5.5" fill="#D7CCC8" stroke="#5D4037" strokeWidth="1.8" />
          <circle cx="10" cy="12" r="1" fill="#5D4037" />
          <circle cx="14" cy="14" r="1" fill="#5D4037" />
        </svg>
      );
    case "onion":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4C12 7 18 10 18 15C18 18.5 15.3 20 12 20C8.7 20 6 18.5 6 15C6 10 12 7 12 4Z" fill="#CE93D8" stroke="#6A1B9A" strokeWidth="1.6" />
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 20V10M12 14C8 14 6 11 6 7C10 7 12 10 12 14ZM12 12C16 12 18 9 18 5C14 5 12 8 12 12Z" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
