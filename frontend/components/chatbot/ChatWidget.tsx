"use client";

import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  // Stop pulse animation after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsAnimating(true);
    setShowPulse(false);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 150);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 ease-out
            sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[560px] sm:rounded-2xl sm:shadow-2xl
            inset-0 sm:inset-auto
            ${isAnimating && !isOpen ? "opacity-0 sm:translate-y-4 sm:scale-95" : "opacity-100 sm:translate-y-0 sm:scale-100"}
          `}
          style={{ maxHeight: "100dvh" }}
        >
          <div className="h-full sm:rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50">
            <ChatWindow onClose={handleClose} />
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-[60px] h-[60px] bg-[#fd6d15] hover:bg-[#e55f0e] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center group"
          aria-label="Atidaryti pokalbį"
        >
          {/* Pulse ring */}
          {showPulse && (
            <span className="absolute inset-0 rounded-full bg-[#fd6d15] animate-ping opacity-30" />
          )}

          {/* Chat icon */}
          <svg
            className="w-7 h-7 transition-transform group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}
    </>
  );
}
