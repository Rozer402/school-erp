import { NextResponse } from "next/server";
import { statCardsData, scheduleData, bulletinData } from "@/data/dashboard";

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.includes("token=");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  return NextResponse.json({
    stats: statCardsData,
    schedule: scheduleData,
    bulletins: bulletinData,
  });
}
