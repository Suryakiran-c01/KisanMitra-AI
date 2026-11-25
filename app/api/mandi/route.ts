import { NextRequest, NextResponse } from "next/server";

const REFERENCE_MANDI_RATES = [
  { crop: "Wheat", market: "Indore / Sehore (MP)", minINR: 2275, maxINR: 2650, unit: "Quintal" },
  { crop: "Rice (Paddy)", market: "Karnal (HR)", minINR: 2300, maxINR: 3100, unit: "Quintal" },
  { crop: "Cotton", market: "Rajkot / Akola", minINR: 6800, maxINR: 7600, unit: "Quintal" },
  { crop: "Tomato", market: "Kolar / Nashik", minINR: 1100, maxINR: 2400, unit: "Quintal" },
  { crop: "Onion", market: "Lasalgaon (MH)", minINR: 1500, maxINR: 2900, unit: "Quintal" },
  { crop: "Soybean", market: "Ujjain (MP)", minINR: 4300, maxINR: 4892, unit: "Quintal" },
  { crop: "Potato", market: "Agra (UP)", minINR: 1200, maxINR: 1900, unit: "Quintal" },
  { crop: "Chilli", market: "Guntur (AP)", minINR: 11500, maxINR: 16500, unit: "Quintal" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commodity = searchParams.get("crop") || "";
  const apiKey = process.env.DATA_GOV_IN_API_KEY;

  if (apiKey && apiKey.trim()) {
    try {
      const resourceId = "9ef84268-d588-465a-a308-a864a43d0070";
      const qs = new URLSearchParams({
        "api-key": apiKey.trim(),
        format: "json",
        limit: "8",
      });
      if (commodity) {
        qs.set("filters[commodity]", commodity);
      }
      const res = await fetch(`https://api.data.gov.in/resource/${resourceId}?${qs.toString()}`, {
        signal: AbortSignal.timeout(7000),
      });
      if (res.ok) {
        const json = await res.json();
        const records = (json.records || []).map(
          (r: { commodity?: string; market?: string; state?: string; min_price?: string; max_price?: string }) => ({
            crop: r.commodity || commodity,
            market: `${r.market || "Mandi"} (${r.state || "IN"})`,
            minINR: Number(r.min_price || 0),
            maxINR: Number(r.max_price || 0),
            unit: "Quintal",
          })
        );
        if (records.length > 0) {
          return NextResponse.json({ rates: records, live: true });
        }
      }
    } catch {
      // fall through to reference rates
    }
  }

  const filtered = commodity
    ? REFERENCE_MANDI_RATES.filter((r) => r.crop.toLowerCase().includes(commodity.toLowerCase()))
    : REFERENCE_MANDI_RATES;

  return NextResponse.json({
    rates: filtered.length > 0 ? filtered : REFERENCE_MANDI_RATES,
    live: false,
  });
}
