import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { CartProvider } from "@/lib/storage/cartContext";
import { ServiceWorkerRegister } from "@/components/common/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "KisanMitra AI — Crop Doctor for Indian Farmers",
  description:
    "Multilingual AI crop doctor and farm assistant for small and marginal Indian farmers.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2E7D32",
};

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Bengali:wght@400;600;700&family=Noto+Sans+Gujarati:wght@400;600;700&family=Noto+Sans+Gurmukhi:wght@400;600;700&family=Noto+Sans+Kannada:wght@400;600;700&family=Noto+Sans+Malayalam:wght@400;600;700&family=Noto+Sans+Ol+Chiki:wght@400;600&family=Noto+Sans+Oriya:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600;700&display=swap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
      </head>
      <body className="antialiased">
        <I18nProvider>
          <CartProvider>
            <ServiceWorkerRegister />
            {children}
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
