"use client";

import { useState } from "react";

interface EscalationCardProps {
  reason: string;
  sessionId: string;
}

export default function EscalationCard({ reason, sessionId }: EscalationCardProps) {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) return;
    setSubmitting(true);

    try {
      await fetch("/api/chat/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, sessionId, reason }),
      });
      setSubmitted(true);
    } catch {
      // Silently handle - user can still call
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <div className="text-2xl mb-2">✅</div>
        <div className="text-sm font-semibold text-green-800">
          Ačiū! Mūsų konsultantas susisieks su jumis per 24 val.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-[#001959] to-[#012f7a] px-4 py-3">
        <div className="text-white text-sm font-semibold">Susisiekite su konsultantu</div>
      </div>
      <div className="p-4 space-y-3">
        {/* Direct contact */}
        <div className="flex gap-2">
          <a
            href="tel:+37063082999"
            className="flex-1 flex items-center justify-center gap-2 bg-[#fd6d15] hover:bg-[#e55f0e] text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Skambinti
          </a>
          <a
            href="mailto:info@ldaenergia.lt"
            className="flex-1 flex items-center justify-center gap-2 border border-[#012f7a] text-[#012f7a] hover:bg-[#e8f0ff] text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            El. paštas
          </a>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-400">arba palikite kontaktus</span>
          </div>
        </div>

        {/* Contact form */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Jūsų vardas *"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012f7a]/30 focus:border-[#012f7a]"
          />
          <input
            type="tel"
            placeholder="Telefono numeris *"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012f7a]/30 focus:border-[#012f7a]"
          />
          <textarea
            placeholder="Žinutė (neprivaloma)"
            value={formData.message}
            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
            rows={2}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012f7a]/30 focus:border-[#012f7a] resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim() || !formData.phone.trim() || submitting}
            className="w-full bg-[#001959] hover:bg-[#012f7a] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Siunčiama..." : "Palikti kontaktus"}
          </button>
        </div>

        <div className="text-xs text-gray-400 text-center">
          Pardavimai: +370 630 82999 | Servisas: +370 636 90999
        </div>
      </div>
    </div>
  );
}
