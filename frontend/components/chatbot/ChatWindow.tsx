"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage, { type ChatMessageData } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { WELCOME_MESSAGE, QUICK_ACTIONS, MAX_MESSAGES_PER_SESSION } from "@/lib/chatbot-config";

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_MESSAGE,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageCount = useRef(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (messageCount.current >= MAX_MESSAGES_PER_SESSION) return;

    messageCount.current++;
    setShowQuickActions(false);

    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };

    // Only send user/assistant messages to API (exclude welcome)
    const conversationForApi = [
      ...messages.filter((m) => m.id !== "welcome"),
      userMessage,
    ].map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationForApi,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let textContent = "";
      let products: ChatMessageData["products"];
      let calculation: ChatMessageData["calculation"];
      let escalation: ChatMessageData["escalation"];

      const assistantId = `assistant-${Date.now()}`;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            switch (event.type) {
              case "text":
                textContent = event.content;
                break;
              case "products":
                products = event.data;
                break;
              case "calculation":
                calculation = event.data;
                break;
              case "escalation":
                escalation = event.data;
                break;
              case "done":
                break;
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      const assistantMessage: ChatMessageData = {
        id: assistantId,
        role: "assistant",
        content: textContent,
        products,
        calculation,
        escalation,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Atsiprašau, įvyko klaida. Bandykite dar kartą arba susisiekite telefonu +370 630 82999.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fb]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001959] to-[#012f7a] px-4 py-3 flex items-center gap-3 flex-shrink-0 rounded-t-2xl sm:rounded-t-2xl">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">LDA Energija</div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-white/70 text-xs">Virtualus konsultantas</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} sessionId={sessionId} />
        ))}

        {/* Quick actions */}
        {showQuickActions && (
          <div className="flex flex-wrap gap-2 ml-10 mb-4">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.message)}
                className="text-xs bg-white border border-[#012f7a]/20 text-[#012f7a] hover:bg-[#e8f0ff] hover:border-[#012f7a]/40 px-3 py-2 rounded-full transition-all shadow-sm hover:shadow"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-4 py-3 bg-white flex-shrink-0 rounded-b-2xl sm:rounded-b-2xl">
        {messageCount.current >= MAX_MESSAGES_PER_SESSION ? (
          <div className="text-center text-sm text-gray-500">
            Sesijos limitas pasiektas. Susisiekite tel. +370 630 82999
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rašykite žinutę..."
              rows={1}
              disabled={isLoading}
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#012f7a]/30 focus:border-[#012f7a] resize-none max-h-20 disabled:opacity-50"
              style={{ minHeight: "40px" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 flex items-center justify-center bg-[#fd6d15] hover:bg-[#e55f0e] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
