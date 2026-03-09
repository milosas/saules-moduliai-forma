"use client";

import { useState, useMemo } from "react";
import { Uzklausas } from "@/lib/google-sheets";


interface UzklausuLenteleProps {
  uzklausos: Uzklausas[];
  onSelect: (u: Uzklausas) => void;
}

const TYPE_LABELS: Record<string, string> = {
  "saules-elektrine-namams": "Namams",
  "saules-elektrine-verslui": "Verslui",
  "kaupikliai": "Kaupikliai",
  "ev-ikrovimas": "EV įkrovimas",
  "servisas": "Servisas",
};

export default function UzklausuLentele({ uzklausos, onSelect }: UzklausuLenteleProps) {
  const [filterTipas, setFilterTipas] = useState("");
  const [filterStatusas, setFilterStatusas] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const tipai = useMemo(() => {
    const set = new Set(uzklausos.map((u) => u.tipas).filter(Boolean));
    return Array.from(set);
  }, [uzklausos]);

  const statusai = useMemo(() => {
    const set = new Set(uzklausos.map((u) => u.statusas).filter(Boolean));
    return Array.from(set);
  }, [uzklausos]);

  const filtered = useMemo(() => {
    return uzklausos.filter((u) => {
      if (filterTipas && u.tipas !== filterTipas) return false;
      if (filterStatusas && u.statusas !== filterStatusas) return false;
      if (dateFrom && u.data < dateFrom) return false;
      if (dateTo && u.data > dateTo) return false;
      return true;
    });
  }, [uzklausos, filterTipas, filterStatusas, dateFrom, dateTo]);

  const statusColor = (s: string) => {
    const lower = s.toLowerCase();
    if (lower.includes("naujas") || lower.includes("new"))
      return "bg-[#055d98]/10 text-[#055d98] border border-[#055d98]/20";
    if (lower.includes("apdorot") || lower.includes("process"))
      return "bg-amber-50 text-amber-700 border border-amber-200";
    if (lower.includes("issiust") || lower.includes("išsiust") || lower.includes("sent"))
      return "bg-[#83bf25]/10 text-[#5d9e13] border border-[#83bf25]/30";
    return "bg-gray-100 text-gray-500 border border-gray-200";
  };

  const hasActiveFilters = filterTipas || filterStatusas || dateFrom || dateTo;

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Filter label */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#001959]/50 uppercase tracking-wider mr-1 self-center">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filtrai
          </div>

          <div>
            <label className="block text-xs font-medium text-[#001959]/50 mb-1.5">Tipas</label>
            <select
              value={filterTipas}
              onChange={(e) => setFilterTipas(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-[#001959] bg-white hover:border-[#055d98]/40 focus:border-[#055d98] focus:ring-2 focus:ring-[#055d98]/20 outline-none transition-colors cursor-pointer"
            >
              <option value="">Visi</option>
              {tipai.map((t) => <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#001959]/50 mb-1.5">Statusas</label>
            <select
              value={filterStatusas}
              onChange={(e) => setFilterStatusas(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-[#001959] bg-white hover:border-[#055d98]/40 focus:border-[#055d98] focus:ring-2 focus:ring-[#055d98]/20 outline-none transition-colors cursor-pointer"
            >
              <option value="">Visi</option>
              {statusai.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#001959]/50 mb-1.5">Nuo</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-[#001959] hover:border-[#055d98]/40 focus:border-[#055d98] focus:ring-2 focus:ring-[#055d98]/20 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#001959]/50 mb-1.5">Iki</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-[#001959] hover:border-[#055d98]/40 focus:border-[#055d98] focus:ring-2 focus:ring-[#055d98]/20 outline-none transition-colors"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => { setFilterTipas(""); setFilterStatusas(""); setDateFrom(""); setDateTo(""); }}
              className="flex items-center gap-1.5 text-sm text-[#fd6d15] hover:text-[#e55a00] font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Valyti filtrus
            </button>
          )}

          {hasActiveFilters && (
            <span className="ml-auto text-xs text-[#001959]/40 self-center">
              {filtered.length} iš {uzklausos.length} įrašų
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gradient-to-r from-[#001959]/3 to-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-[#001959]/50 text-xs uppercase tracking-wider">Data</th>
                <th className="text-left px-4 py-3 font-semibold text-[#001959]/50 text-xs uppercase tracking-wider">Vardas</th>
                <th className="text-left px-4 py-3 font-semibold text-[#001959]/50 text-xs uppercase tracking-wider">Tipas</th>
                <th className="text-left px-4 py-3 font-semibold text-[#001959]/50 text-xs uppercase tracking-wider">Galia kWp</th>
                <th className="text-left px-4 py-3 font-semibold text-[#001959]/50 text-xs uppercase tracking-wider">Pastabos</th>
                <th className="text-left px-4 py-3 font-semibold text-[#001959]/50 text-xs uppercase tracking-wider">Statusas</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-[#001959]/30">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Nėra užklausų</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => (
                  <tr
                    key={u.id}
                    onClick={() => onSelect(u)}
                    className={`border-b border-gray-50 cursor-pointer transition-all duration-150 group
                      hover:bg-gradient-to-r hover:from-[#055d98]/5 hover:to-[#001959]/3
                      hover:shadow-[inset_3px_0_0_0_#fd6d15]
                      ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                  >
                    <td className="px-4 py-3 text-[#001959]/50 whitespace-nowrap font-[family-name:var(--font-body)] tabular-nums text-xs">
                      {u.data || "-"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#001959] group-hover:text-[#055d98] transition-colors">
                      {u.vardas || "-"}
                    </td>
                    <td className="px-4 py-3 text-[#001959]/70">
                      {TYPE_LABELS[u.tipas] || u.tipas || "-"}
                    </td>
                    <td className="px-4 py-3 text-[#001959]/70 tabular-nums">
                      {u.apskaiciuotaGaliaKwp ? `${u.apskaiciuotaGaliaKwp} kWp` : "-"}
                    </td>
                    <td className="px-4 py-3 text-[#001959]/40 text-xs max-w-[200px] truncate">
                      {u.pastabos ? (u.pastabos.length > 50 ? u.pastabos.slice(0, 50) + "..." : u.pastabos) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {u.statusas ? (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(u.statusas)}`}>
                          {u.statusas}
                        </span>
                      ) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <span className="text-xs text-[#001959]/40">
              Rodoma: <span className="font-semibold text-[#001959]/60">{filtered.length}</span> užklausų
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
