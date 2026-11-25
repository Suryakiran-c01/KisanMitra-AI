import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat") || "20.5937");
  const lon = Number(searchParams.get("lon") || "78.9629");

  if (Number.isNaN(lat) || Number.isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=precipitation_probability&forecast_days=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(7000) });
    if (!res.ok) throw new Error("Open-Meteo error");
    const data = await res.json();

    const temp = Math.round(data?.current?.temperature_2m ?? 28);
    const humidity = Math.round(data?.current?.relative_humidity_2m ?? 55);
    const wind = Math.round(data?.current?.wind_speed_10m ?? 8);
    const rainNow = Number(data?.current?.precipitation ?? 0);
    const nextHoursRainProb = Math.max(
      ...((data?.hourly?.precipitation_probability?.slice(0, 6) as number[] | undefined) || [0])
    );

    const isGoodToSpray = rainNow === 0 && nextHoursRainProb < 40 && wind < 15;

    return NextResponse.json({
      tempC: temp,
      humidityPct: humidity,
      windKmh: wind,
      rainProbPct: nextHoursRainProb,
      isGoodToSpray,
      source: "open-meteo",
    });
  } catch {
    return NextResponse.json({
      tempC: null,
      humidityPct: null,
      windKmh: null,
      rainProbPct: null,
      isGoodToSpray: true,
      source: "offline-fallback",
    });
  }
}
