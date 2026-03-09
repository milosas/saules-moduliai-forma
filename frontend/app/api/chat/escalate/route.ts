export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message, sessionId } = body as {
      name: string;
      phone: string;
      email?: string;
      message?: string;
      sessionId: string;
    };

    if (!name || !phone || !sessionId) {
      return Response.json(
        { error: "Vardas ir telefonas privalomi" },
        { status: 400 }
      );
    }

    // Send to n8n webhook (same pattern as form submission)
    const webhookUrl = process.env.N8N_CHAT_ESCALATION_WEBHOOK;

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "chatbot",
          name,
          phone,
          email: email || "",
          message: message || "",
          sessionId,
          data: new Date().toISOString(),
        }),
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Escalation error:", error);
    return Response.json(
      { error: "Nepavyko išsaugoti kontaktų" },
      { status: 500 }
    );
  }
}
