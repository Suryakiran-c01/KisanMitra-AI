import { DiagnoseResponse } from "@/lib/ai/schemas";
import { CartItem } from "@/lib/products/matcher";

export interface HistoryEntry {
  id: string;
  createdAt: string;
  language: string;
  crop?: string;
  location?: string;
  queryText?: string;
  thumbnail?: string;
  result: DiagnoseResponse;
}

const CART_KEY = "kisanmitra_cart_v1";
const HISTORY_KEY = "kisanmitra_history_v1";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendHistory(entry: HistoryEntry): HistoryEntry[] {
  const existing = loadHistory();
  // Keep latest 25 entries, trim oversized thumbnails if needed
  const next = [entry, ...existing].slice(0, 25);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      // Retry without thumbnail if localStorage quota exceeded
      const slim = next.map((e, i) => (i === 0 ? { ...e, thumbnail: undefined } : e));
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(slim));
      } catch {
        // ignore
      }
    }
  }
  return next;
}

export function clearHistoryStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}
