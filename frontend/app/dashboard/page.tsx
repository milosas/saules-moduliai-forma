"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Uzklausas } from "@/lib/google-sheets";
import Statistika from "@/components/Statistika";
import UzklausuLentele from "@/components/UzklausuLentele";
import UzklausosKortele from "@/components/UzklausosKortele";
import TestEmailModal from "@/components/TestEmailModal";

export default function DashboardPage() {
  const [uzklausos, setUzklausos] = useState<Uzklausas[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [selected, setSelected] = useState<Uzklausas | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);

  const fetchUzklausos = useCallback(async () => {
    setLoading(true);
    setFetchError("");

    try {
      const res = await fetch("/api/uzklausos");

      const data = await res.json();
      if (data.error) {
        setFetchError(data.error);
      } else {
        setUzklausos(data.uzklausos || []);
      }
    } catch {
      setFetchError("Nepavyko prisijungti prie serverio");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUzklausos();
    const interval = setInterval(fetchUzklausos, 30000);
    return () => clearInterval(interval);
  }, [fetchUzklausos]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#fd6d15]/30 px-6 py-0 shadow-sm">
        <div
          className="max-w-7xl mx-auto flex items-center justify-between"
          style={{ borderTop: "3px solid #fd6d15" }}
        >
          <div className="flex items-center gap-5 py-3">
            <Link
              href="/"
              className="text-[#055d98]/60 hover:text-[#001959] transition-colors p-1.5 rounded-lg hover:bg-[#001959]/5"
              title="Grįžti į pradžią"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            {/* LDA Logo */}
            <Image
              src="https://ldaenergia.lt/wp-content/uploads/2025/11/LDA-logo-2.png"
              alt="LDA Energija"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
              unoptimized
            />

            <div className="h-6 w-px bg-gray-200" />

            <h1 className="text-lg font-bold text-[#001959] font-[family-name:var(--font-heading)] tracking-tight">
              Užklausų valdymo skydelis
            </h1>
          </div>

          <div className="flex items-center gap-3 py-3">
            <button
              onClick={() => setShowTestModal(true)}
              className="px-4 py-1.5 text-sm border border-[#055d98] text-[#055d98] rounded-lg hover:bg-[#055d98]/5 transition-colors font-medium"
            >
              Testavimas
            </button>
            <button
              onClick={fetchUzklausos}
              disabled={loading}
              className="px-4 py-1.5 text-sm bg-[#001959] text-white rounded-lg hover:bg-[#055d98] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Kraunama...
                </>
              ) : (
                "Atnaujinti"
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
            </svg>
            {fetchError}
          </div>
        )}

        <Statistika uzklausos={uzklausos} />
        <UzklausuLentele uzklausos={uzklausos} onSelect={setSelected} />

        {selected && (
          <UzklausosKortele
            uzklausas={selected}
            onClose={() => setSelected(null)}
            onPastabosUpdate={(id, pastabos) => {
              setUzklausos((prev) => prev.map((u) => u.id === id ? { ...u, pastabos } : u));
              setSelected((prev) => prev && prev.id === id ? { ...prev, pastabos } : prev);
            }}
          />
        )}

        {showTestModal && (
          <TestEmailModal
            onClose={() => setShowTestModal(false)}
            onSeedComplete={fetchUzklausos}
          />
        )}
      </main>
    </div>
  );
}
