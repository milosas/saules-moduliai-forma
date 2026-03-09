"use client";

import ProductCard from "./ProductCard";
import CalculationResult from "./CalculationResult";
import EscalationCard from "./EscalationCard";
import type { Product, CalculationResult as CalcResult } from "@/lib/chatbot-tools";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  calculation?: CalcResult;
  escalation?: { reason: string };
}

interface ChatMessageProps {
  message: ChatMessageData;
  sessionId: string;
}

export default function ChatMessage({ message, sessionId }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#001959] to-[#012f7a] flex items-center justify-center flex-shrink-0 mr-2">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      )}

      <div className={`max-w-[85%] space-y-2`}>
        {/* Text bubble */}
        {message.content && (
          <div
            className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
              isUser
                ? "bg-[#e8f0ff] text-[#001959] rounded-2xl rounded-br-md"
                : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-md"
            }`}
          >
            {message.content}
          </div>
        )}

        {/* Product cards */}
        {message.products && message.products.length > 0 && (
          <div className="grid gap-2">
            {message.products.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Calculation result */}
        {message.calculation && (
          <CalculationResult result={message.calculation} />
        )}

        {/* Escalation card */}
        {message.escalation && (
          <EscalationCard reason={message.escalation.reason} sessionId={sessionId} />
        )}
      </div>
    </div>
  );
}
