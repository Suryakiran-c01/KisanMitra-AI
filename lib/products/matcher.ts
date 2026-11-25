import productsData from "@/data/products.json";

export type StoreName = "Amazon India" | "Flipkart" | "BigHaat" | "AgroStar" | "IFFCO Bazar";

export interface StoreOffer {
  store: StoreName;
  priceINR: number;
  searchQuery: string;
  url: string;
}

export interface ProductItem {
  id: string;
  name: string;
  genericName: string;
  category: "organic" | "biological" | "fungicide" | "insecticide" | "fertilizer" | "equipment" | "safety" | "seeds";
  isOrganic: boolean;
  packSize: string;
  description: string;
  keywords: string[];
  crops: string[];
  image: string;
  stores: StoreOffer[];
}

export interface CartItem {
  productId: string;
  name: string;
  genericName: string;
  packSize: string;
  image: string;
  selectedStore: StoreName;
  priceINR: number;
  storeUrl: string;
  quantity: number;
}

export function applyAffiliateTag(url: string, store: StoreName): string {
  try {
    const parsed = new URL(url);
    if (store === "Amazon India") {
      const tag = process.env.AFFILIATE_TAG_AMAZON;
      if (tag && tag.trim()) {
        parsed.searchParams.set("tag", tag.trim());
      }
    } else if (store === "Flipkart") {
      const affid = process.env.AFFILIATE_TAG_FLIPKART;
      if (affid && affid.trim()) {
        parsed.searchParams.set("affid", affid.trim());
      }
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export function getAllProducts(): ProductItem[] {
  return (productsData as ProductItem[]).map((item) => ({
    ...item,
    stores: item.stores.map((offer) => ({
      ...offer,
      url: applyAffiliateTag(offer.url, offer.store),
    })),
  }));
}

export function matchProducts(keywords: string[], crop?: string, limit = 6): ProductItem[] {
  const all = getAllProducts();
  const normalizedKeywords = keywords.map((k) => k.toLowerCase().trim()).filter(Boolean);
  const normalizedCrop = crop?.toLowerCase().trim();

  if (normalizedKeywords.length === 0 && !normalizedCrop) {
    return all
      .slice()
      .sort((a, b) => Number(b.isOrganic) - Number(a.isOrganic))
      .slice(0, limit);
  }

  const scored = all.map((product) => {
    let score = 0;
    const searchable = [
      product.name,
      product.genericName,
      product.description,
      product.category,
      ...product.keywords,
    ]
      .join(" ")
      .toLowerCase();

    for (const kw of normalizedKeywords) {
      if (product.keywords.some((pk) => pk.toLowerCase().includes(kw) || kw.includes(pk.toLowerCase()))) {
        score += 5;
      } else if (searchable.includes(kw)) {
        score += 3;
      }
    }

    if (normalizedCrop && product.crops.includes(normalizedCrop)) {
      score += 2;
    }

    return { product, score };
  });

  const matched = scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      // Organic & biological options first when relevant, then by match score
      if (a.product.isOrganic !== b.product.isOrganic) {
        return Number(b.product.isOrganic) - Number(a.product.isOrganic);
      }
      return b.score - a.score;
    })
    .map((entry) => entry.product);

  if (matched.length === 0) {
    return all
      .filter((p) => p.isOrganic || p.category === "safety")
      .slice(0, limit);
  }

  return matched.slice(0, limit);
}

export interface GroupedStoreCart {
  store: StoreName;
  items: CartItem[];
  subtotalINR: number;
  checkoutUrl: string;
}

export function groupCartByStore(items: CartItem[]): GroupedStoreCart[] {
  const map = new Map<StoreName, CartItem[]>();
  for (const item of items) {
    if (item.quantity <= 0) continue;
    const list = map.get(item.selectedStore) || [];
    list.push(item);
    map.set(item.selectedStore, list);
  }

  const groups: GroupedStoreCart[] = [];
  for (const [store, storeItems] of map.entries()) {
    const subtotalINR = storeItems.reduce((sum, i) => sum + i.priceINR * i.quantity, 0);
    groups.push({
      store,
      items: storeItems,
      subtotalINR,
      checkoutUrl: storeItems[0]?.storeUrl || "#",
    });
  }
  return groups;
}
