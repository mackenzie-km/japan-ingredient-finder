import { NextResponse } from "next/server";
import { searchAllServices } from "@/lib/services/aggregate";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "Missing query param 'q'" }, { status: 400 });
  }
  const data = await searchAllServices(q);
  return NextResponse.json(data);
}
