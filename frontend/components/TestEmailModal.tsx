"use client";

import { useState } from "react";

interface TestEmailModalProps {
  onClose: () => void;
  onSeedComplete?: () => void;
}

export default function TestEmailModal({ onClose, onSeedComplete }: TestEmailModalProps) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSendEmails = async () => {
    if (!email.includes("@")) return;
    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/test-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-test-emails", email }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ type: "success", message: `5 testiniai el. laiškai išsiųsti į ${email}` });
      } else {
        setResult({ type: "error", message: data.error || "Klaida" });
      }
    } catch {
      setResult({ type: "error", message: "Nepavyko prisijungti prie serverio" });
    }

    setSending(false);
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setResult(null);

    try {
      const res = await fetch("/api/test-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed-fake-data" }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ type: "success", message: "25 testinės užklausos sukurtos! Atnaujinkite lentelę." });
        onSeedComplete?.();
      } else {
        setResult({ type: "error", message: data.error || "Klaida" });
      }
    } catch {
      setResult({ type: "error", message: "Nepavyko prisijungti prie serverio" });
    }

    setSeeding(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-dark font-[family-name:var(--font-heading)]">
              Testavimo įrankiai
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Test Emails Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-dark mb-2">Siųsti testinius el. laiškus</h3>
            <p className="text-sm text-gray-600 mb-3">
              Bus išsiųsti <strong>5 automatizuotų el. laiškų pavyzdžiai</strong> su testiniais kliento duomenimis (Jonas Saulėtis, 8 kWp saulės elektrinė):
            </p>
            <ul className="text-xs text-gray-500 mb-4 space-y-1 ml-4 list-disc">
              <li><strong>D0</strong> – Saulės elektrinės konfigūracijos pasiūlymas</li>
              <li><strong>D0-Kaup</strong> – Kaupiklio pasiūlymas</li>
              <li><strong>D1</strong> – 5 saulės energijos privalumai (po 1 d.)</li>
              <li><strong>D3</strong> – Specialus pasiūlymas + APVA priminimas (po 3 d.)</li>
              <li><strong>D5</strong> – Galutinis priminimas – 3000+ sistemų (po 5 d.)</li>
            </ul>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jūsų@email.com"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
              <button
                onClick={handleSendEmails}
                disabled={sending || !email.includes("@")}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition disabled:opacity-50 whitespace-nowrap"
              >
                {sending ? "Siunčiama..." : "Siųsti"}
              </button>
            </div>
          </div>

          {/* Seed Data Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-dark mb-2">Perkrauti testinius duomenis</h3>
            <p className="text-sm text-gray-600 mb-3">
              Ištrina visas esamas užklausas ir sukuria <strong>25 naujus testinius įrašus</strong> su įvairiais tipais, statusais ir datomis.
            </p>
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {seeding ? "Kuriama..." : "Ištrinti ir sukurti 25 testinius"}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className={`rounded-lg p-3 text-sm ${
              result.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {result.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
