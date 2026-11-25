import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, matchProducts } from "@/lib/products/matcher";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keywordsRaw = searchParams.get("keywords") || "";
  const crop = searchParams.get("crop") || undefined;
  const all = searchParams.get("all") === "1";

  if (all) {
    return NextResponse.json({ products: getAllProducts() });
  }

  const keywords = keywordsRaw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const products = matchProducts(keywords, crop, 8);
  return NextResponse.json({ products });
}
