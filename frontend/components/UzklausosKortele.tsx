"use client";

import { useState } from "react";
import Image from "next/image";
import { Uzklausas } from "@/lib/google-sheets";

interface UzklausosKorteleProps {
  uzklausas: Uzklausas;
  onClose: () => void;
  onPastabosUpdate?: (id: string, pastabos: string) => void;
}

interface Produktas {
  pavadinimas?: string;
  gamintojas?: string;
  modelis?: string;
  galia?: string;
  galia_w?: number;
  efektyvumas?: string | number;
  kaina?: string | number;
  kaina_eur?: number;
  aprasymas?: string;
  priezastis?: string;
}

const EMAIL_DESCRIPTIONS: Record<string, { title: string; desc: string }> = {
  D0: {
    title: "Saulės elektrinės konfigūracijos pasiūlymas",
    desc: "Automatiškai sugeneruotas pasiūlymas su atrinktais moduliais, inverteriu, kaupikliu, kainomis ir techninėmis specifikacijomis.",
  },
  D1: {
    title: "5 saulės energijos privalumai",
    desc: "Po 1 dienos siunčiamas laiškas su saulės energijos privalumais ir naudos skaičiavimais.",
  },
  D3: {
    title: "Specialus pasiūlymas + APVA priminimas",
    desc: "Po 3 dienų siunčiamas laiškas su specialiu pasiūlymu ir APVA subsidijos priminimu.",
  },
  D5: {
    title: "Galutinis priminimas – 3000+ sistemų",
    desc: "Po 5 dienų siunčiamas paskutinis priminimas su statistika apie 3000+ įrengtų sistemų. Daugiau laiškų nesiunčiama.",
  },
};

function isValidRecommendation(p: Produktas): boolean {
  if (p.gamintojas === "Klaida") return false;
  if (p.modelis?.includes("nepavyko")) return false;
  return true;
}

export function getPriceRange(aiJson: string): { min: number; max: number } | null {
  try {
    if (!aiJson) return null;
    const parsed = JSON.parse(aiJson);
    const products: Produktas[] = Array.isArray(parsed) ? parsed : parsed.products || parsed.rekomendacijos || [];
    const valid = products.filter(isValidRecommendation);
    const prices = valid
      .map((p) => p.kaina_eur || (typeof p.kaina === "number" ? p.kaina : 0))
      .filter((p) => p > 0);
    if (prices.length === 0) return null;
    return { min: Math.min(...prices), max: Math.max(...prices) };
  } catch {
    return null;
  }
}

export default function UzklausosKortele({ uzklausas, onClose, onPastabosUpdate }: UzklausosKorteleProps) {
  const [pastabos, setPastabos] = useState(uzklausas.pastabos || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);

  let rekomendacijos: Produktas[] = [];
  try {
    if (uzklausas.aiRekomendacijos) {
      const parsed = JSON.parse(uzklausas.aiRekomendacijos);
      const all: Produktas[] = Array.isArray(parsed) ? parsed : parsed.products || parsed.rekomendacijos || [];
      rekomendacijos = all.filter(isValidRecommendation);
    }
  } catch {
    // Not valid JSON
  }

  const emailSteps = [
    { key: "D0", label: "D0 – Pasiūlymas", value: (uzklausas.statusas?.toLowerCase().includes("issiust") || uzklausas.statusas?.toLowerCase().includes("išsiust")) ? uzklausas.data : "" },
    { key: "D1", label: "D1 – Privalumai", value: uzklausas.emailSekpiD1 },
    { key: "D3", label: "D3 – APVA", value: uzklausas.emailSekpiD3 },
    { key: "D5", label: "D5 – Galutinis", value: uzklausas.emailSekpiD5 },
  ];

  const handleSavePastabos = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("https://n8n.blingo.lt/webhook/lda-saules-pastabos-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: uzklausas.id, pastabos }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      if (onPastabosUpdate) onPastabosUpdate(uzklausas.id, pastabos);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Nepavyko išsaugoti pastabų");
    }
    setSaving(false);
  };

  const priceRange = getPriceRange(uzklausas.aiRekomendacijos);

  const sentCount = emailSteps.filter((es) => !!es.value).length;

  return (
    <div
      className="fixed inset-0 bg-[#001959]/50 backdrop-blur-sm z-50 flex items-start justify-center pt-8 px-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mb-8 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#001959]/3 to-transparent rounded-t-2xl">
          <div className="flex items-center gap-4">
            <Image
              src="https://ldaenergia.lt/wp-content/uploads/2025/11/LDA-logo-2.png"
              alt="LDA Energija"
              width={80}
              height={22}
              className="h-6 w-auto object-contain opacity-80"
              unoptimized
            />
            <div className="h-5 w-px bg-gray-200" />
            <h3 className="text-lg font-bold text-[#001959] font-[family-name:var(--font-heading)]">
              Užklausos detalės
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#001959]/30 hover:text-[#001959] transition-colors p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Uždaryti"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Client info */}
          <div>
            <SectionTitle icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }>
              Kliento informacija
            </SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoItem label="Vardas" value={uzklausas.vardas} />
              <InfoItem label="El. paštas" value={uzklausas.email} />
              <InfoItem label="Telefonas" value={uzklausas.telefonas} />
              <InfoItem label="Data" value={uzklausas.data || "-"} />
            </div>
          </div>

          {/* Parameters */}
          <div>
            <SectionTitle icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            }>
              Užklausos parametrai
            </SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoItem label="Tipas" value={uzklausas.tipas} />
              <InfoItem label="Statusas" value={uzklausas.statusas} />
              <InfoItem label="Mėnesinės sąnaudos" value={uzklausas.menesinesSanaudos ? `${uzklausas.menesinesSanaudos} kWh` : "-"} />
              <InfoItem label="Stogo tipas" value={uzklausas.stogoTipas} />
              <InfoItem label="Stogo orientacija" value={uzklausas.stogoOrientacija} />
              <InfoItem label="Stogo plotas" value={uzklausas.stogoPlotas ? `${uzklausas.stogoPlotas} m²` : "-"} />
              <InfoItem label="Šešėliai" value={uzklausas.seseliai} />
              <InfoItem label="Tarifas" value={uzklausas.tarifas ? `${uzklausas.tarifas} EUR/kWh` : "-"} />
              <InfoItem label="Domina kaupiklis" value={uzklausas.dominaKaupiklis} />
              <InfoItem label="Domina APVA" value={uzklausas.dominaAPVA} />
            </div>

            {/* Calculated fields with accent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3 bg-[#001959]/2 rounded-xl border border-[#001959]/5">
              <InfoItem label="Apskaičiuota galia" value={uzklausas.apskaiciuotaGaliaKwp ? `${uzklausas.apskaiciuotaGaliaKwp} kWp` : "-"} accent />
              <InfoItem label="Panelių skaičius" value={uzklausas.paneliuSkaicius || "-"} accent />
              <InfoItem label="Metinė gamyba" value={uzklausas.metineGamyba ? `${uzklausas.metineGamyba} kWh` : "-"} accent />
              <InfoItem label="Metinis sutaupymas" value={uzklausas.metinisSutaupymas ? `${uzklausas.metinisSutaupymas} EUR` : "-"} accent />
              <InfoItem label="APVA subsidija" value={uzklausas.apvaSubsidija ? `${uzklausas.apvaSubsidija} EUR` : "-"} accent />
            </div>

            {uzklausas.papildomiPageidavimai && (
              <div className="mt-3">
                <InfoItem label="Papildomi pageidavimai" value={uzklausas.papildomiPageidavimai} />
              </div>
            )}
            {priceRange && (
              <div className="mt-3">
                <InfoItem
                  label="Pasiūlytų produktų kainų rėžis"
                  value={priceRange.min === priceRange.max
                    ? `${priceRange.min.toLocaleString()} EUR`
                    : `${priceRange.min.toLocaleString()} – ${priceRange.max.toLocaleString()} EUR`
                  }
                  highlight
                />
              </div>
            )}
          </div>

          {/* Recommendations */}
          {rekomendacijos.length > 0 && (
            <div>
              <SectionTitle icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }>
                Rekomendacijos
              </SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {rekomendacijos.slice(0, 5).map((p, i) => (
                  <div
                    key={i}
                    className="border border-[#055d98]/15 rounded-xl p-4 bg-gradient-to-br from-white to-[#055d98]/3 shadow-sm hover:shadow-md hover:border-[#055d98]/30 transition-all duration-200 relative overflow-hidden"
                  >
                    {/* Accent top border */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#fd6d15] to-[#055d98]" />

                    <div className="font-semibold text-[#001959] text-sm mb-1.5 leading-snug">
                      {p.pavadinimas || p.modelis || `Produktas ${i + 1}`}
                    </div>
                    {p.gamintojas && (
                      <div className="text-xs text-[#055d98] font-medium mb-1">{p.gamintojas}</div>
                    )}
                    <div className="space-y-0.5">
                      {(p.galia || p.galia_w) && (
                        <div className="text-xs text-[#001959]/50">Galia: {p.galia || `${p.galia_w} W`}</div>
                      )}
                      {p.efektyvumas && (
                        <div className="text-xs text-[#001959]/50">Efektyvumas: {p.efektyvumas}%</div>
                      )}
                    </div>
                    {(p.kaina_eur || p.kaina) && (
                      <div className="text-[#fd6d15] font-bold mt-2.5 text-sm">
                        {p.kaina_eur
                          ? `${p.kaina_eur.toLocaleString()} EUR`
                          : typeof p.kaina === "number"
                            ? `${p.kaina.toLocaleString()} EUR`
                            : p.kaina}
                      </div>
                    )}
                    {p.priezastis && (
                      <div className="text-xs text-[#001959]/40 mt-1.5 italic">{p.priezastis}</div>
                    )}
                    {p.aprasymas && (
                      <div className="text-xs text-[#001959]/40 mt-1">{p.aprasymas}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email sequence timeline */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }>
                Email sekos statusas
              </SectionTitle>
              <span className="text-xs text-[#001959]/40 font-medium">
                {sentCount}/{emailSteps.length} išsiųsta
              </span>
            </div>

            {/* Timeline bar */}
            <div className="relative mb-4">
              <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-gray-100 rounded-full" />
              <div
                className="absolute top-3.5 left-4 h-0.5 bg-gradient-to-r from-[#83bf25] to-[#83bf25]/50 rounded-full transition-all duration-500"
                style={{ width: sentCount > 0 ? `${((sentCount - 1) / (emailSteps.length - 1)) * (100 - 8)}%` : "0%" }}
              />
              <div className="relative grid grid-cols-4 gap-0">
                {emailSteps.map((es, idx) => {
                  const sent = !!es.value;
                  const expanded = expandedEmail === es.key;
                  const info = EMAIL_DESCRIPTIONS[es.key];
                  return (
                    <div key={es.key} className="flex flex-col items-center">
                      {/* Step dot */}
                      <button
                        onClick={() => setExpandedEmail(expanded ? null : es.key)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-200 z-10 relative
                          ${sent
                            ? "border-[#83bf25] bg-[#83bf25] shadow-[0_0_0_3px_rgba(131,191,37,0.15)]"
                            : "border-gray-200 bg-white hover:border-[#055d98]/40"
                          }`}
                      >
                        {sent ? (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        )}
                      </button>

                      {/* Step info */}
                      <button
                        onClick={() => setExpandedEmail(expanded ? null : es.key)}
                        className={`w-full rounded-xl p-2.5 border text-center transition-all duration-200
                          ${sent
                            ? "border-[#83bf25]/25 bg-[#83bf25]/5 hover:border-[#83bf25]/40 hover:bg-[#83bf25]/8"
                            : "border-gray-100 bg-gray-50/80 hover:border-[#055d98]/20 hover:bg-[#055d98]/3"
                          }`}
                      >
                        <div className={`text-xs font-semibold mb-0.5 ${sent ? "text-[#5d9e13]" : "text-[#001959]/40"}`}>
                          {es.label}
                        </div>
                        <div className={`text-xs font-medium ${sent ? "text-[#5d9e13]" : "text-[#001959]/30"}`}>
                          {sent ? "Išsiųsta" : "Laukiama"}
                        </div>
                        {es.value && (
                          <div className="text-[10px] text-[#001959]/30 mt-0.5 tabular-nums">{es.value}</div>
                        )}
                      </button>

                      {/* Step index badge */}
                      <span className={`text-[10px] mt-1 font-bold tabular-nums
                        ${sent ? "text-[#83bf25]" : "text-gray-300"}`}>
                        {idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expanded email description */}
            {expandedEmail && EMAIL_DESCRIPTIONS[expandedEmail] && (
              <div className="p-3.5 bg-[#001959]/3 rounded-xl border border-[#001959]/8 text-sm">
                <div className="font-semibold text-[#001959] mb-1">
                  {EMAIL_DESCRIPTIONS[expandedEmail].title}
                </div>
                <div className="text-[#001959]/55 text-xs leading-relaxed">
                  {EMAIL_DESCRIPTIONS[expandedEmail].desc}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <SectionTitle icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }>
              Pastabos
            </SectionTitle>
            <textarea
              value={pastabos}
              onChange={(e) => { setPastabos(e.target.value); setSaved(false); }}
              placeholder="Pridėkite pastabas..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#001959] focus:ring-2 focus:ring-[#055d98]/25 focus:border-[#055d98] outline-none resize-none text-sm transition-colors placeholder:text-[#001959]/25"
            />
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleSavePastabos}
                disabled={saving}
                className="px-5 py-1.5 text-sm rounded-lg bg-[#001959] text-white font-semibold hover:bg-[#055d98] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saugoma...
                  </>
                ) : "Išsaugoti"}
              </button>
              {saved && (
                <span className="text-sm text-[#83bf25] font-semibold flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Išsaugota!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <h4 className="flex items-center gap-2 text-xs font-bold text-[#001959]/50 uppercase tracking-widest mb-3">
      {icon && (
        <span className="text-[#fd6d15]">{icon}</span>
      )}
      {children}
    </h4>
  );
}

function InfoItem({ label, value, accent, highlight }: { label: string; value: string; accent?: boolean; highlight?: boolean }) {
  return (
    <div className={`rounded-lg px-3 py-2 ${
      highlight
        ? "bg-[#fd6d15]/8 border border-[#fd6d15]/20"
        : accent
          ? "bg-[#001959]/4 border border-[#001959]/6"
          : "bg-gray-50 border border-transparent"
    }`}>
      <div className="text-xs text-[#001959]/40 mb-0.5">{label}</div>
      <div className={`text-sm font-semibold ${highlight ? "text-[#fd6d15]" : "text-[#001959]"}`}>
        {value || "-"}
      </div>
    </div>
  );
}
