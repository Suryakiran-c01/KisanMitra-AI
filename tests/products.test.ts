import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  applyAffiliateTag,
  CartItem,
  groupCartByStore,
  matchProducts,
} from "@/lib/products/matcher";

describe("Products Matcher & Cart Grouping", () => {
  const origAmazon = process.env.AFFILIATE_TAG_AMAZON;
  const origFlipkart = process.env.AFFILIATE_TAG_FLIPKART;

  beforeEach(() => {
    process.env.AFFILIATE_TAG_AMAZON = "kisanmitra-21";
    process.env.AFFILIATE_TAG_FLIPKART = "kmflipkart";
  });

  afterEach(() => {
    process.env.AFFILIATE_TAG_AMAZON = origAmazon;
    process.env.AFFILIATE_TAG_FLIPKART = origFlipkart;
  });

  it("matches relevant products and prioritizes organic/biological options first", () => {
    const results = matchProducts(["mancozeb", "neem oil", "trichoderma"], "tomato", 6);
    expect(results.length).toBeGreaterThan(0);
    // Organic items must precede non-organic items
    const firstNonOrganicIdx = results.findIndex((p) => !p.isOrganic);
    if (firstNonOrganicIdx !== -1) {
      const anyOrganicAfter = results.slice(firstNonOrganicIdx).some((p) => p.isOrganic);
      expect(anyOrganicAfter).toBe(false);
    }
  });

  it("appends Amazon and Flipkart affiliate tags from env vars", () => {
    const amazonUrl = applyAffiliateTag("https://www.amazon.in/s?k=Neem+Oil", "Amazon India");
    expect(amazonUrl).toContain("tag=kisanmitra-21");

    const flipkartUrl = applyAffiliateTag("https://www.flipkart.com/search?q=Neem+oil", "Flipkart");
    expect(flipkartUrl).toContain("affid=kmflipkart");
  });

  it("groups cart items by store and computes accurate subtotals", () => {
    const sampleCart: CartItem[] = [
      {
        productId: "neem-oil-1500",
        name: "Neem Oil 1500 PPM",
        genericName: "Azadirachtin",
        packSize: "500 ml",
        image: "/images/products/organic-bottle.svg",
        selectedStore: "BigHaat",
        priceINR: 240,
        storeUrl: "https://www.bighaat.com/search?q=Neem",
        quantity: 2,
      },
      {
        productId: "trichoderma-viride",
        name: "Trichoderma Viride",
        genericName: "Trichoderma viride 1% WP",
        packSize: "1 kg",
        image: "/images/products/bio-pack.svg",
        selectedStore: "BigHaat",
        priceINR: 165,
        storeUrl: "https://www.bighaat.com/search?q=Trichoderma",
        quantity: 1,
      },
      {
        productId: "safety-ppe-kit",
        name: "Farmer Spray Safety Kit",
        genericName: "PPE Kit",
        packSize: "1 Set",
        image: "/images/products/safety-kit.svg",
        selectedStore: "Amazon India",
        priceINR: 349,
        storeUrl: "https://www.amazon.in/s?k=ppe",
        quantity: 1,
      },
    ];

    const groups = groupCartByStore(sampleCart);
    expect(groups).toHaveLength(2);
    const bigHaat = groups.find((g) => g.store === "BigHaat");
    const amazon = groups.find((g) => g.store === "Amazon India");
    expect(bigHaat?.items).toHaveLength(2);
    expect(bigHaat?.subtotalINR).toBe(645);
    expect(amazon?.subtotalINR).toBe(349);
  });
});
