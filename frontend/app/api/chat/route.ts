import OpenAI from "openai";
import {
  CHATBOT_MODEL,
  CHATBOT_MAX_TOKENS,
  CHATBOT_TEMPERATURE,
  SYSTEM_PROMPT,
  CHATBOT_TOOLS,
  MAX_CONVERSATION_MESSAGES,
} from "@/lib/chatbot-config";
import {
  getProducts,
  calculateSystem,
  escalateToHuman,
} from "@/lib/chatbot-tools";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, sessionId } = body as {
      messages: ChatMessage[];
      sessionId: string;
    };

    if (!messages || !Array.isArray(messages) || !sessionId) {
      return Response.json(
        { error: "Invalid request: messages and sessionId required" },
        { status: 400 }
      );
    }

    // Truncate to last N messages
    const recentMessages = messages.slice(-MAX_CONVERSATION_MESSAGES);

    // Build OpenAI messages
    const openaiMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...recentMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // First call - may include tool calls
    const response = await openai.chat.completions.create({
      model: CHATBOT_MODEL,
      messages: openaiMessages,
      tools: CHATBOT_TOOLS,
      temperature: CHATBOT_TEMPERATURE,
      max_tokens: CHATBOT_MAX_TOKENS,
    });

    const choice = response.choices[0];

    // If no tool calls, stream-like response with structured data
    if (!choice.message.tool_calls || choice.message.tool_calls.length === 0) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const data = JSON.stringify({
            type: "text",
            content: choice.message.content || "",
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          controller.enqueue(encoder.encode("data: {\"type\":\"done\"}\n\n"));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Handle tool calls
    const toolResults: Array<{
      type: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any;
    }> = [];

    const toolMessages: OpenAI.ChatCompletionMessageParam[] = [
      ...openaiMessages,
      choice.message,
    ];

    for (const toolCall of choice.message.tool_calls) {
      if (toolCall.type !== "function") continue;
      const args = JSON.parse(toolCall.function.arguments);
      let result: unknown;

      switch (toolCall.function.name) {
        case "get_products": {
          const products = await getProducts(args);
          result = products;
          toolResults.push({ type: "products", data: products });
          break;
        }
        case "calculate_system": {
          const calculation = calculateSystem(args);
          result = calculation;
          toolResults.push({ type: "calculation", data: calculation });
          break;
        }
        case "escalate_to_human": {
          const escalation = escalateToHuman(args.reason);
          result = escalation;
          toolResults.push({ type: "escalation", data: escalation });
          break;
        }
        default:
          result = { error: "Unknown tool" };
      }

      toolMessages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }

    // Second call with tool results
    const followUp = await openai.chat.completions.create({
      model: CHATBOT_MODEL,
      messages: toolMessages,
      temperature: CHATBOT_TEMPERATURE,
      max_tokens: CHATBOT_MAX_TOKENS,
    });

    const finalContent = followUp.choices[0].message.content || "";

    // Stream structured response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send text content
        const textEvent = JSON.stringify({
          type: "text",
          content: finalContent,
        });
        controller.enqueue(encoder.encode(`data: ${textEvent}\n\n`));

        // Send structured data (products, calculations, escalation)
        for (const result of toolResults) {
          const event = JSON.stringify(result);
          controller.enqueue(encoder.encode(`data: ${event}\n\n`));
        }

        controller.enqueue(encoder.encode("data: {\"type\":\"done\"}\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Įvyko klaida. Bandykite dar kartą." },
      { status: 500 }
    );
  }
}
