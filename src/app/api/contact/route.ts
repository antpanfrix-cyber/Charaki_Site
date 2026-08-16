import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  console.log("[api/contact] submission:", payload);

  return NextResponse.json({ success: true });
}
