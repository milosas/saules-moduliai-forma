"use client";

import { Uzklausas } from "@/lib/google-sheets";

interface StatistikaProps {
  uzklausos: Uzklausas[];
}

const TYPE_LABELS: Record<string, string> = {
  "saules-elektrine-namams": "Namams",
  "saules-elektrine-verslui": "Verslui",
  "kaupikliai": "Kaupikliai",
  "ev-ikrovimas": "EV įkrovimas",
  "servisas": "Servisas",
};

export default function Statistika({ uzklausos }: StatistikaProps) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const parseDate = (d: string): Date | null => {
    if (!d) return null;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const today = uzklausos.filter((u) => u.data?.startsWith(todayStr)).length;
  const thisWeek = uzklausos.filter((u) => {
    const d = parseDate(u.data);
    return d && d >= weekAgo;
  }).length;
  const thisMonth = uzklausos.filter((u) => {
    const d = parseDate(u.data);
    return d && d >= monthAgo;
  }).length;

  const byType: Record<string, number> = {};
  uzklausos.forEach((u) => {
    const t = u.tipas || "Nenurodyta";
    byType[t] = (byType[t] || 0) + 1;
  });

  const stats = [
    {
      label: "Šiandien",
      value: today,
      emoji: "📊",
      gradient: "from-[#001959] to-[#055d98]",
      accentBar: "bg-gradient-to-r from-[#001959] to-[#055d98]",
      bg: "from-[#001959]/5 to-transparent",
    },
    {
      label: "Šią savaitę",
      value: thisWeek,
      emoji: "📅",
      gradient: "from-[#055d98] to-[#0077c2]",
      accentBar: "bg-gradient-to-r from-[#055d98] to-[#0077c2]",
      bg: "from-[#055d98]/5 to-transparent",
    },
    {
      label: "Šį mėnesį",
      value: thisMonth,
      emoji: "📆",
      gradient: "from-[#83bf25] to-[#5d9e13]",
      accentBar: "bg-gradient-to-r from-[#83bf25] to-[#5d9e13]",
      bg: "from-[#83bf25]/5 to-transparent",
    },
    {
      label: "Viso",
      value: uzklausos.length,
      emoji: "📈",
      gradient: "from-[#fd6d15] to-[#e55a00]",
      accentBar: "bg-gradient-to-r from-[#fd6d15] to-[#e55a00]",
      bg: "from-[#fd6d15]/5 to-transparent",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden`}
          >
            {/* Subtle gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} pointer-events-none`} />

            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base leading-none" role="img" aria-label={s.label}>
                  {s.emoji}
                </span>
                <span className="text-sm text-[#001959]/60 font-[family-name:var(--font-body)]">
                  {s.label}
                </span>
              </div>
              <div className="text-3xl font-bold text-[#001959] font-[family-name:var(--font-heading)] mt-1">
                {s.value}
              </div>
              <div className={`w-10 h-1 ${s.accentBar} rounded-full mt-3`} />
            </div>
          </div>
        ))}
      </div>

      {Object.keys(byType).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="text-sm font-semibold text-[#001959] mb-3 font-[family-name:var(--font-heading)]">
            Pagal tipą
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(byType).map(([type, count]) => (
              <div
                key={type}
                className="bg-[#001959]/5 border border-[#001959]/10 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5"
              >
                <span className="text-[#001959]/50 font-[family-name:var(--font-body)]">
                  {TYPE_LABELS[type] || type}
                </span>
                <span className="font-bold text-[#001959] bg-[#fd6d15]/10 text-[#fd6d15] rounded px-1.5 py-0.5 text-xs">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
