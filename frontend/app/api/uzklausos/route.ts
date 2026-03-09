import { NextResponse } from "next/server";
import { getUzklausos } from "@/lib/google-sheets";

export async function GET() {
  try {
    const uzklausos = await getUzklausos();

    // Filter out blank rows (no ID) and sort newest first
    const filtered = uzklausos
      .filter((u) => u.id && u.id.trim() !== "")
      .sort((a, b) => b.data.localeCompare(a.data));

    return NextResponse.json({ uzklausos: filtered });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
