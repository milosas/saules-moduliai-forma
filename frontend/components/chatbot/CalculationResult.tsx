"use client";

import type { CalculationResult as CalcResult } from "@/lib/chatbot-tools";

interface CalculationResultProps {
  result: CalcResult;
}

export default function CalculationResult({ result }: CalculationResultProps) {
  const stats = [
    { label: "Rekomenduojama galia", value: `${result.galia_kwp} kWp`, icon: "⚡" },
    { label: "Panelių skaičius", value: `${result.moduliu_skaicius} vnt.`, icon: "🔲" },
    { label: "Metinė gamyba", value: `${result.metine_gamyba_kwh.toLocaleString()} kWh`, icon: "☀️" },
    { label: "Metinis sutaupymas", value: `€${result.metinis_sutaupymas_eur}`, icon: "💰" },
  ];

  return (
    <div className="bg-gradient-to-br from-[#f0f4ff] to-[#e8f0ff] rounded-xl p-4 border border-[#dde8ff]">
      <div className="text-sm font-semibold text-[#001959] mb-3">
        Sistemos skaičiavimo rezultatai
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/80 rounded-lg p-2.5 text-center">
            <div className="text-lg mb-0.5">{stat.icon}</div>
            <div className="font-bold text-[#012f7a] text-sm">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 p-2 bg-[#fd6d15]/10 rounded-lg text-center">
        <div className="text-xs text-gray-600">APVA subsidija iki</div>
        <div className="font-bold text-[#fd6d15]">€{result.apva_subsidija_eur}</div>
      </div>
      <a
        href="/forma"
        className="mt-3 block w-full text-center bg-[#fd6d15] hover:bg-[#e55f0e] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
      >
        Gauti detalų pasiūlymą
      </a>
    </div>
  );
}
