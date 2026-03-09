import { NextRequest, NextResponse } from "next/server";

const N8N_TEST_EMAILS_URL = "https://n8n.blingo.lt/webhook/test-emails-v2";
const N8N_SEED_DATA_URL = "https://n8n.blingo.lt/webhook/seed-fake-saules-m4x7";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email } = body;

    if (action === "send-test-emails") {
      if (!email || !email.includes("@")) {
        return NextResponse.json({ error: "Neteisingas el. pašto adresas" }, { status: 400 });
      }

      const res = await fetch(N8N_TEST_EMAILS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error(`n8n error: ${res.status}`);
      }

      return NextResponse.json({ success: true, message: "5 test emailai išsiųsti" });
    }

    if (action === "seed-fake-data") {
      const res = await fetch(N8N_SEED_DATA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error(`n8n error: ${res.status}`);
      }

      return NextResponse.json({ success: true, message: "25 fake užklausos sukurtos" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
