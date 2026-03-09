"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

type PaslaugosTipas = "saules-elektrine-namams" | "saules-elektrine-verslui" | "kaupikliai" | "ev-ikrovimas" | "servisas" | "";

interface FormData {
  tipas: PaslaugosTipas;
  menesinesSanaudos: number;
  stogoTipas: string;
  stogoOrientacija: string;
  stogoPlotas: number;
  seseliai: string;
  tarifas: number;
  dominaKaupiklis: boolean;
  dominaAPVA: boolean;
  esamaSistema: string;
  kaupiklioTalpa: string;
  naudojimoPaternas: string;
  automobilioTipas: string;
  ikrovimoGalia: string;
  vidusLauke: string;
  tureSaulesSistema: boolean;
  servisoTipas: string;
  irangosModelis: string;
  gedimoAprasymas: string;
  skubumas: "skubus" | "neskubus" | "";
  vardas: string;
  email: string;
  telefonas: string;
  papildomiPageidavimai: string;
}

const INITIAL_DATA: FormData = {
  tipas: "",
  menesinesSanaudos: 300,
  stogoTipas: "",
  stogoOrientacija: "",
  stogoPlotas: 50,
  seseliai: "",
  tarifas: 0.22,
  dominaKaupiklis: false,
  dominaAPVA: true,
  esamaSistema: "",
  kaupiklioTalpa: "",
  naudojimoPaternas: "",
  automobilioTipas: "",
  ikrovimoGalia: "",
  vidusLauke: "",
  tureSaulesSistema: false,
  servisoTipas: "",
  irangosModelis: "",
  gedimoAprasymas: "",
  skubumas: "",
  vardas: "",
  email: "",
  telefonas: "",
  papildomiPageidavimai: "",
};

const STOGO_TIPAI = [
  { value: "slaitinis", label: "Šlaitinis stogas", desc: "Čerpių, skardos ar kita šlaitinė danga" },
  { value: "plokscias", label: "Plokščias stogas", desc: "Plokščia stogo konstrukcija" },
  { value: "metalinis", label: "Metalinis stogas", desc: "Profiliuota skarda arba stoginis skardinis" },
  { value: "cerpes", label: "Čerpinis stogas", desc: "Keraminės arba betoninės čerpės" },
];

const STOGO_ORIENTACIJOS = [
  { value: "pietus", label: "Pietūs", desc: "Optimaliausia - didžiausia gamyba" },
  { value: "pietu-rytai", label: "Pietryčiai", desc: "Labai gera - ~95% gamybos" },
  { value: "pietu-vakarai", label: "Pietvakariai", desc: "Labai gera - ~95% gamybos" },
  { value: "rytai", label: "Rytai", desc: "Gera - ~80% gamybos" },
  { value: "vakarai", label: "Vakarai", desc: "Gera - ~80% gamybos" },
];

const SESELIU_LYGIAI = [
  { value: "nera", label: "Nėra šešėlių", desc: "Stogas visą dieną apšviestas" },
  { value: "dalinis", label: "Dalinis šešėlis", desc: "Medžiai ar pastatai dalį dienos dengia" },
  { value: "reikšmingas", label: "Reikšmingas šešėlis", desc: "Didelė stogo dalis dažnai šešėlyje" },
];

const KAUPIKLIU_TALPOS = [
  { value: "5", label: "5 kWh", desc: "Mažam namui, baziniam kaupimui" },
  { value: "10", label: "10 kWh", desc: "Vidutiniam namui, dienos energijai" },
  { value: "15", label: "15 kWh", desc: "Dideliam namui, pilnam nepriklausomumui" },
  { value: "20+", label: "20+ kWh", desc: "Verslui arba dideliam vartojimui" },
];

const NAUDOJIMO_PATERNAI = [
  { value: "savivartojimas", label: "Savivartojimo optimizavimas", desc: "Maksimaliai išnaudoti saulės energiją" },
  { value: "atsarginis", label: "Atsarginė energija", desc: "Energija elektros dingimo metu" },
  { value: "piko-sumažinimas", label: "Piko mažinimas", desc: "Sumažinti vartojimą piko valandomis" },
];

const IKROVIMO_GALIOS = [
  { value: "7kW", label: "7 kW", desc: "Lėtas įkrovimas, tinka namams" },
  { value: "11kW", label: "11 kW", desc: "Vidutinis, populiariausias pasirinkimas" },
  { value: "22kW", label: "22 kW", desc: "Greitas, tinka verslui" },
];

const SERVISO_TIPAI = [
  { value: "gedimu-salinimas", label: "Gedimų šalinimas", desc: "Saulės elektrinės ar kaupiklio remonto darbai" },
  { value: "profilaktine-prieziura", label: "Profilaktinė priežiūra", desc: "Reguliarus modulių valymas ir sistemos patikra" },
  { value: "garantinis-aptarnavimas", label: "Garantinis aptarnavimas", desc: "Aptarnavimas garantinio laikotarpio metu" },
  { value: "diagnostika", label: "Diagnostika", desc: "Sistemos efektyvumo patikrinimas ir diagnostika" },
];

const TIPAI = [
  {
    value: "saules-elektrine-namams" as PaslaugosTipas,
    title: "Saulės elektrinė namams",
    desc: "Saulės moduliai ir inverteriai gyvenamajam namui",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="12" width="32" height="20" rx="1" />
        <line x1="8" y1="19" x2="40" y2="19" />
        <line x1="8" y1="26" x2="40" y2="26" />
        <line x1="16" y1="12" x2="16" y2="32" />
        <line x1="24" y1="12" x2="24" y2="32" />
        <line x1="32" y1="12" x2="32" y2="32" />
        <circle cx="24" cy="6" r="4" strokeWidth="1.5" />
        <path d="M20 32v6h8v-6" />
        <line x1="16" y1="38" x2="32" y2="38" />
      </svg>
    ),
  },
  {
    value: "saules-elektrine-verslui" as PaslaugosTipas,
    title: "Saulės elektrinė verslui",
    desc: "Komercinės saulės elektrinės įmonėms ir gamykloms",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="14" width="40" height="22" rx="1" />
        <line x1="4" y1="21" x2="44" y2="21" />
        <line x1="4" y1="28" x2="44" y2="28" />
        <line x1="12" y1="14" x2="12" y2="36" />
        <line x1="20" y1="14" x2="20" y2="36" />
        <line x1="28" y1="14" x2="28" y2="36" />
        <line x1="36" y1="14" x2="36" y2="36" />
        <path d="M10 36v6M38 36v6M6 42h36" />
      </svg>
    ),
  },
  {
    value: "kaupikliai" as PaslaugosTipas,
    title: "Energijos kaupikliai",
    desc: "Baterijų sistemos perteklinei energijai kaupti",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="10" y="8" width="28" height="32" rx="3" />
        <rect x="18" y="4" width="12" height="4" rx="1" />
        <line x1="18" y1="16" x2="30" y2="16" />
        <line x1="18" y1="24" x2="30" y2="24" />
        <line x1="18" y1="32" x2="30" y2="32" />
        <path d="M22 19l4 0M24 17l0 4" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    value: "ev-ikrovimas" as PaslaugosTipas,
    title: "EV įkrovimo stotelės",
    desc: "Elektromobilių įkrovimo stotelių montavimas",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="12" y="6" width="20" height="32" rx="3" />
        <circle cx="22" cy="18" r="6" />
        <path d="M20 16l2.5 4h-1.5l2.5 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="16" y="28" width="12" height="4" rx="1" />
        <path d="M32 24h6v12h-6" />
        <line x1="22" y1="38" x2="22" y2="44" />
      </svg>
    ),
  },
  {
    value: "servisas" as PaslaugosTipas,
    title: "Servisas ir priežiūra",
    desc: "Saulės elektrinių aptarnavimas, diagnostika, remontas",
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M28.5 6.5a6 6 0 00-9 0L17 9l3 3-2 2-3-3-3.5 3.5a6 6 0 000 8.5l1.5 1.5-5 5a3 3 0 004.24 4.24l5-5 1.5 1.5a6 6 0 008.5 0L31 27l-3-3 2-2 3 3 2.5-2.5a6 6 0 000-9L34 12l-3 3-2-2 3-3z" />
      </svg>
    ),
  },
];

function apskaiciuotiSaulesSistema(data: FormData) {
  const metinisVartojimas = data.menesinesSanaudos * 12;
  const sistemosGalia = metinisVartojimas / 1050;
  const paneliuSkaicius = Math.ceil(sistemosGalia / 0.44);
  const metineGamyba = sistemosGalia * 1050;
  const metinisSutaupymas = metineGamyba * data.tarifas;
  const apvaSubsidija = data.tipas === "saules-elektrine-namams"
    ? Math.min(sistemosGalia * 255, 3051)
    : 0;

  return {
    sistemosGalia: Number(sistemosGalia.toFixed(1)),
    paneliuSkaicius,
    metineGamyba: Math.round(metineGamyba),
    metinisSutaupymas: Math.round(metinisSutaupymas),
    apvaSubsidija: Math.round(apvaSubsidija),
  };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-3 px-4 bg-gray-50 border-b border-gray-100">
      <span className="flex items-center gap-1.5 text-xs text-gray-500 font-[family-name:var(--font-body)]">
        <svg className="w-3.5 h-3.5 text-[var(--color-green)] shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        3000+ sistemų
      </span>
      <span className="text-gray-300 text-xs hidden sm:inline">|</span>
      <span className="flex items-center gap-1.5 text-xs text-gray-500 font-[family-name:var(--font-body)]">
        <svg className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Nemokama konsultacija
      </span>
      <span className="text-gray-300 text-xs hidden sm:inline">|</span>
      <span className="flex items-center gap-1.5 text-xs text-gray-500 font-[family-name:var(--font-body)]">
        <svg className="w-3.5 h-3.5 text-[var(--color-secondary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        APVA subsidija iki 3051 EUR
      </span>
    </div>
  );
}

function ContextualTip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-5">
      <svg className="w-4 h-4 text-[var(--color-secondary)] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <p className="text-xs text-blue-700 font-[family-name:var(--font-body)] leading-relaxed">{text}</p>
    </div>
  );
}

function MiniTestimonial() {
  return (
    <div className="mt-5 pt-5 border-t border-gray-100 flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold shrink-0">
        J
      </div>
      <p className="text-xs text-gray-400 italic leading-relaxed font-[family-name:var(--font-body)]">
        &ldquo;Užpildžiau formą ir per 24h gavau profesionalų pasiūlymą&rdquo;
        <span className="not-italic font-medium text-gray-500 ml-1">– Jonas K., Kaunas</span>
      </p>
    </div>
  );
}

function PartnerLogos() {
  const partners = [
    { name: "Sungrow", url: "https://ldaenergia.lt/wp-content/uploads/2025/01/sungrow.png" },
    { name: "Huawei", url: "https://ldaenergia.lt/wp-content/uploads/2025/01/huawei.png" },
    { name: "JinkoSolar", url: "https://ldaenergia.lt/wp-content/uploads/2025/01/jinko.png" },
  ];

  return (
    <div className="mt-6 text-center">
      <p className="text-xs text-gray-400 mb-3 font-[family-name:var(--font-body)] uppercase tracking-wide">Patikimi partneriai</p>
      <div className="flex items-center justify-center gap-8">
        {partners.map((p) => (
          <div key={p.name} className="grayscale opacity-50 hover:opacity-70 transition-opacity">
            <Image
              src={p.url}
              alt={p.name}
              width={80}
              height={32}
              className="h-8 w-auto object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface CalcCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  highlight?: boolean;
  span?: boolean;
}

function CalcCard({ icon, value, label, highlight, span }: CalcCardProps) {
  return (
    <div className={`rounded-xl p-4 flex flex-col gap-1 border ${span ? "col-span-2" : ""} ${highlight ? "bg-[var(--color-accent)]/5 border-[var(--color-accent)]/20" : "bg-white border-gray-100"} shadow-sm`}>
      <div className="text-xl leading-none">{icon}</div>
      <div className={`text-xl font-bold font-[family-name:var(--font-heading)] leading-tight ${highlight ? "text-[var(--color-accent)]" : "text-[var(--color-primary)]"}`}>{value}</div>
      <div className="text-xs text-gray-500 font-[family-name:var(--font-body)]">{label}</div>
    </div>
  );
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────

interface ProgressBarProps {
  step: number;
  step2Label: string;
}

function ProgressBar({ step, step2Label }: ProgressBarProps) {
  const steps = ["Paslauga", step2Label, "Kontaktai", "Patvirtinimas"];
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" style={{ margin: "0 2rem" }} />
        <div
          className="absolute top-4 left-0 h-0.5 bg-[var(--color-primary)] z-0 transition-all duration-500"
          style={{ width: `calc(${((step - 1) / 3) * 100}% - 1rem)`, marginLeft: "2rem" }}
        />
        {steps.map((label, i) => {
          const num = i + 1;
          const isCompleted = num < step;
          const isActive = num === step;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5 z-10 min-w-0 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-[var(--color-green)] text-white"
                    : isActive
                    ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20"
                    : "bg-white border-2 border-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span
                className={`text-xs text-center font-[family-name:var(--font-body)] leading-tight px-1 ${
                  isActive ? "text-[var(--color-primary)] font-semibold" : isCompleted ? "text-[var(--color-green)] font-medium" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function FormaWizard() {
  const [step, setStep] = useState(1);
  const [servisoStep, setServisoStep] = useState<"tipas" | "detales">("tipas");
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const skaiciavimai = (data.tipas === "saules-elektrine-namams" || data.tipas === "saules-elektrine-verslui")
    ? apskaiciuotiSaulesSistema(data)
    : null;

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};

    if (data.tipas === "saules-elektrine-namams" || data.tipas === "saules-elektrine-verslui") {
      if (!data.menesinesSanaudos || data.menesinesSanaudos < 50) errs.menesinesSanaudos = "Įveskite mėnesines sąnaudas (min 50 kWh)";
      if (!data.stogoTipas) errs.stogoTipas = "Pasirinkite stogo tipą";
      if (!data.stogoOrientacija) errs.stogoOrientacija = "Pasirinkite stogo orientaciją";
      if (!data.stogoPlotas || data.stogoPlotas < 10) errs.stogoPlotas = "Stogo plotas turi būti bent 10 m²";
      if (!data.seseliai) errs.seseliai = "Pasirinkite šešėlių lygį";
    } else if (data.tipas === "kaupikliai") {
      if (!data.esamaSistema) errs.esamaSistema = "Nurodykite esamą sistemą";
      if (!data.kaupiklioTalpa) errs.kaupiklioTalpa = "Pasirinkite kaupiklio talpą";
      if (!data.naudojimoPaternas) errs.naudojimoPaternas = "Pasirinkite naudojimo scenarijų";
    } else if (data.tipas === "ev-ikrovimas") {
      if (!data.ikrovimoGalia) errs.ikrovimoGalia = "Pasirinkite įkrovimo galią";
      if (!data.vidusLauke) errs.vidusLauke = "Pasirinkite montavimo vietą";
    } else if (data.tipas === "servisas") {
      if (servisoStep === "tipas") {
        if (!data.servisoTipas) errs.servisoTipas = "Pasirinkite serviso tipą";
      } else {
        if (!data.gedimoAprasymas.trim()) errs.gedimoAprasymas = "Aprašykite problemą";
        if (!data.skubumas) errs.skubumas = "Pasirinkite skubumą";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!data.vardas.trim()) errs.vardas = "Įveskite vardą";
    if (!data.email.trim()) errs.email = "Įveskite el. paštą";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Neteisingas el. pašto formatas";
    if (!data.telefonas.trim()) errs.telefonas = "Įveskite telefono numerį";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (data.tipas === "servisas" && step === 2) {
      if (servisoStep === "tipas") {
        if (validateStep2()) {
          setServisoStep("detales");
          setErrors({});
        }
        return;
      }
    }
    if (validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step === 2 && data.tipas === "servisas" && servisoStep === "detales") {
      setServisoStep("tipas");
      setErrors({});
      return;
    }
    if (step === 2) {
      setStep(1);
      return;
    }
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setSubmitting(true);

    const payload: Record<string, unknown> = {
      tipas: data.tipas,
      vardas: data.vardas,
      email: data.email,
      telefonas: data.telefonas,
      papildomiPageidavimai: data.papildomiPageidavimai,
    };

    if (data.tipas === "saules-elektrine-namams" || data.tipas === "saules-elektrine-verslui") {
      payload.menesinesSanaudos = data.menesinesSanaudos;
      payload.stogoTipas = data.stogoTipas;
      payload.stogoOrientacija = data.stogoOrientacija;
      payload.stogoPlotas = data.stogoPlotas;
      payload.seseliai = data.seseliai;
      payload.tarifas = data.tarifas;
      payload.dominaKaupiklis = data.dominaKaupiklis;
      payload.dominaAPVA = data.dominaAPVA;
      if (skaiciavimai) {
        payload.apskaiciuotaGaliaKwp = skaiciavimai.sistemosGalia;
        payload.paneliuSkaicius = skaiciavimai.paneliuSkaicius;
        payload.metineGamyba = skaiciavimai.metineGamyba;
        payload.metinisSutaupymas = skaiciavimai.metinisSutaupymas;
        payload.apvaSubsidija = skaiciavimai.apvaSubsidija;
      }
    } else if (data.tipas === "kaupikliai") {
      payload.esamaSistema = data.esamaSistema;
      payload.kaupiklioTalpa = data.kaupiklioTalpa;
      payload.naudojimoPaternas = data.naudojimoPaternas;
    } else if (data.tipas === "ev-ikrovimas") {
      payload.automobilioTipas = data.automobilioTipas;
      payload.ikrovimoGalia = data.ikrovimoGalia;
      payload.vidusLauke = data.vidusLauke;
      payload.tureSaulesSistema = data.tureSaulesSistema;
    } else if (data.tipas === "servisas") {
      payload.servisoTipas = data.servisoTipas;
      payload.irangosModelis = data.irangosModelis;
      payload.gedimoAprasymas = data.gedimoAprasymas;
      payload.skubumas = data.skubumas;
    }

    // Fire-and-forget: iškart pereiti į sėkmės ekraną, n8n siunčia fone
    setSubmitting(false);
    setStep(4);

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } catch {
      // Background send error - user already sees success
    }
  };

  const step2Label = data.tipas === "servisas" ? "Servisas" : data.tipas === "kaupikliai" ? "Kaupiklis" : data.tipas === "ev-ikrovimas" ? "EV stotelė" : "Parametrai";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-dark-light hover:text-primary transition mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Grįžti į pradžią
        </Link>

        {step < 4 && (
          <ProgressBar step={step} step2Label={step2Label} />
        )}

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Logo + trust strip header */}
          <div className="border-b border-gray-100">
            <div className="flex items-center justify-center px-6 pt-5 pb-4">
              <Image
                src="https://ldaenergia.lt/wp-content/uploads/2025/11/LDA-logo-2.png"
                alt="LDA Energija"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            </div>
            <TrustStrip />
          </div>

          {/* Form content */}
          <div className="p-6 sm:p-8">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">Ko jums reikia?</h2>
                <p className="text-dark-light mb-4 font-[family-name:var(--font-body)]">Pasirinkite saulės energijos sprendimą arba paslaugą</p>
                <ContextualTip text="Vidutinis lietuvos namas sunaudoja ~300 kWh/mėn. Saulės elektrinė leistų padengti didžiąją dalį šio vartojimo." />
                <div className="grid gap-4">
                  {TIPAI.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => {
                        update("tipas", t.value);
                        if (t.value === "servisas") setServisoStep("tipas");
                        setStep(2);
                      }}
                      className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                        data.tipas === t.value ? "border-[var(--color-primary)] bg-blue-50" : "border-gray-200 hover:border-[var(--color-primary)]/50"
                      }`}
                    >
                      <div className="text-[var(--color-primary)] shrink-0">{t.icon}</div>
                      <div>
                        <div className="font-semibold text-dark text-lg font-[family-name:var(--font-heading)]">{t.title}</div>
                        <div className="text-dark-light text-sm mt-1 font-[family-name:var(--font-body)]">{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <MiniTestimonial />
              </div>
            )}

            {step === 2 && (
              <div>
                {data.tipas === "servisas" ? (
                  <>
                    {servisoStep === "tipas" ? (
                      <>
                        <h2 className="text-2xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">Kokio serviso reikia?</h2>
                        <p className="text-dark-light mb-4 font-[family-name:var(--font-body)]">Pasirinkite serviso paslaugos tipą</p>
                        <div className="grid gap-4 mb-6">
                          {SERVISO_TIPAI.map((st) => (
                            <button
                              key={st.value}
                              onClick={() => update("servisoTipas", st.value)}
                              className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                                data.servisoTipas === st.value ? "border-[var(--color-primary)] bg-blue-50" : "border-gray-200 hover:border-[var(--color-primary)]/50"
                              }`}
                            >
                              <div className="font-semibold text-dark font-[family-name:var(--font-heading)]">{st.label}</div>
                              <div className="text-dark-light text-sm mt-1 font-[family-name:var(--font-body)]">{st.desc}</div>
                            </button>
                          ))}
                        </div>
                        {errors.servisoTipas && <p className="text-red-500 text-sm mb-4">{errors.servisoTipas}</p>}
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">Įrangos ir gedimo informacija</h2>
                        <p className="text-dark-light mb-4 font-[family-name:var(--font-body)]">Aprašykite problemą ir įrangą</p>
                        <div className="mb-5">
                          <label className="block text-sm font-medium text-dark mb-1.5">Įrangos modelis (neprivaloma)</label>
                          <input type="text" value={data.irangosModelis} onChange={(e) => update("irangosModelis", e.target.value)} placeholder="pvz. Sungrow SG10RT, Huawei SUN2000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-dark focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
                        </div>
                        <div className="mb-5">
                          <label className="block text-sm font-medium text-dark mb-1.5">Problemos aprašymas</label>
                          <textarea value={data.gedimoAprasymas} onChange={(e) => update("gedimoAprasymas", e.target.value)} placeholder="Aprašykite gedimą ar problemą..." rows={3} className={`w-full border rounded-lg px-4 py-2.5 text-dark focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none ${errors.gedimoAprasymas ? "border-red-400" : "border-gray-300"}`} />
                          {errors.gedimoAprasymas && <p className="text-red-500 text-sm mt-1">{errors.gedimoAprasymas}</p>}
                        </div>
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-dark mb-1.5">Skubumas</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => update("skubumas", "skubus")} className={`p-3 rounded-xl border-2 text-center transition-all ${data.skubumas === "skubus" ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-red-300"}`}>
                              <div className="font-medium text-dark text-sm">Skubus</div>
                              <div className="text-xs text-dark-light mt-0.5">Reikia kuo greičiau</div>
                            </button>
                            <button onClick={() => update("skubumas", "neskubus")} className={`p-3 rounded-xl border-2 text-center transition-all ${data.skubumas === "neskubus" ? "border-[var(--color-primary)] bg-blue-50" : "border-gray-200 hover:border-[var(--color-primary)]/50"}`}>
                              <div className="font-medium text-dark text-sm">Neskubus</div>
                              <div className="text-xs text-dark-light mt-0.5">Galiu palaukti</div>
                            </button>
                          </div>
                          {errors.skubumas && <p className="text-red-500 text-sm mt-1">{errors.skubumas}</p>}
                        </div>
                      </>
                    )}
                  </>
                ) : data.tipas === "kaupikliai" ? (
                  <>
                    <h2 className="text-2xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">Energijos kaupiklio parametrai</h2>
                    <p className="text-dark-light mb-4 font-[family-name:var(--font-body)]">Padėsime parinkti optimalų kaupiklį</p>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-dark mb-1.5">Esama saulės elektrinė</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "nauja", label: "Dar neturiu", desc: "Planuoju naują sistemą" },
                          { value: "iki-5kw", label: "Iki 5 kWp", desc: "Maža sistema" },
                          { value: "5-10kw", label: "5-10 kWp", desc: "Vidutinė sistema" },
                          { value: "virs-10kw", label: "Virš 10 kWp", desc: "Didelė sistema" },
                        ].map((opt) => (
                          <button key={opt.value} onClick={() => update("esamaSistema", opt.value)} className={`p-3 rounded-xl border-2 text-center transition-all ${data.esamaSistema === opt.value ? "border-[var(--color-primary)] bg-blue-50" : "border-gray-200 hover:border-[var(--color-primary)]/50"}`}>
                            <div className="font-medium text-dark text-sm">{opt.label}</div>
                            <div className="text-xs text-dark-light mt-0.5">{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                      {errors.esamaSistema && <p className="text-red-500 text-sm mt-1">{errors.esamaSistema}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-dark mb-1.5">Pageidaujama kaupiklio talpa</label>
                      <div className="grid grid-cols-2 gap-3">
                        {KAUPIKLIU_TALPOS.map((kt) => (
                          <button key={kt.value} onClick={() => update("kaupiklioTalpa", kt.value)} className={`p-3 rounded-xl border-2 text-center transition-all ${data.kaupiklioTalpa === kt.value ? "border-[var(--color-primary)] bg-blue-50" : "border-gray-200 hover:border-[var(--color-primary)]/50"}`}>
                            <div className="font-medium text-dark text-sm">{kt.label}</div>
                            <div className="text-xs text-dark-light mt-0.5">{kt.desc}</div>
                          </button>
                        ))}
                      </div>
                      {errors.kaupiklioTalpa && <p className="text-red-500 text-sm mt-1">{errors.kaupiklioTalpa}</p>}
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-dark mb-1.5">Naudojimo scenarijus</label>
                      <div className="grid gap-3">
                        {NAUDOJIMO_PATERNAI.map((np) => (
                          <button key={np.value} onClick={() => update("naudojimoPaternas", np.value)} className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${data.naudojimoPaternas === np.value ? "border-[var(--color-primary)] bg-blue-50" : "border-gray-200 hover:border-[var(--color-primary)]/50"}`}>
                            <div className="font-semibold text-dark font-[family-name:var(--font-heading)]">{np.label}</div>
                            <div className="text-dark-light text-sm mt-1 font-[family-name:var(--font-body)]">{np.desc}</div>
                          </button>
                        ))}
                      </div>
                      {errors.naudojimoPaternas && <p className="text-red-500 text-sm mt-1">{errors.naudojimoPaternas}</p>}
                    </div>
                  </>
                ) : data.tipas === "ev-ikrovimas" ? (
                  <>
                    <h2 className="text-2xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">EV įkrovimo stotelės parametrai</h2>
                    <p className="text-dark-light mb-4 font-[family-name:var(--font-body)]">Parinkite tinkamą įkrovimo sprendimą</p>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-dark mb-1.5">Automobilio tipas/markė (neprivaloma)</label>
                      <input type="text" value={data.automobilioTipas} onChange={(e) => update("automobilioTipas", e.target.value)} placeholder="pvz. Tesla Model 3, VW ID.4, BMW iX3" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-dark focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
                    </div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-dark mb-1.5">Įkrovimo galia</label>
                      <div className="grid grid-cols-3 gap-3">
                        {IKROVIMO_GALIOS.map((ig) => (
                          <button key={ig.value} onClick={() => update("ikrovimoGalia", ig.value)} className={`p-3 rounded-xl border-2 text-center transition-all ${data.ikrovimoGalia === ig.value ? "border-[var(--color-primary)] bg-blue-50" : "border-gray-200 hover:border-[var(--color-primary)]/50"}`}>
                            <div className="font-medium text-dark text-sm">{ig.label}</div>
                            <div className="text-xs text-dark-light mt-0.5">{ig.desc}</div>
                          </button>
                        ))}
                      </div>
                      {errors.ikrovimoGalia && <p className="text-red-500 text-sm mt-1">{errors.ikrovimoGalia}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-dark mb-1.5">Montavimo vieta</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "viduje", label: "Viduje (garažas)", desc: "Apsaugota nuo oro sąlygų" },
                          { value: "lauke", label: "Lauke", desc: "Reikia lauko apsaugos" },
                        ].map((opt) => (
                          <button key={opt.value} onClick={() => update("vidusLauke", opt.value)} className={`p-3 rounded-xl border-2 text-center transition-all ${data.vidusLauke === opt.value ? "border-[var(--color-primary)] bg-blue-50" : "border-gray-200 hover:border-[var(--color-primary)]/50"}`}>
                            <div className="font-medium text-dark text-sm">{opt.label}</div>
                            <div className="text-xs text-dark-light mt-0.5">{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                      {errors.vidusLauke && <p className="text-red-500 text-sm mt-1">{errors.vidusLauke}</p>}
                    </div>
                    <div className="mb-6">
                      <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--color-primary)]/50 cursor-pointer transition-all">
                        <input type="checkbox" checked={data.tureSaulesSistema} onChange={(e) => update("tureSaulesSistema", e.target.checked)} className="w-5 h-5 rounded accent-primary" />
                        <div>
                          <div className="font-medium text-dark text-sm">Turiu saulės elektrinę</div>
                          <div className="text-xs text-dark-light">Stotelę galima integruoti su esama sistema</div>
                        </div>
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">
                      {data.tipas === "saules-elektrine-namams" ? "Jūsų namo parametrai" : "Verslo objekto parametrai"}
                    </h2>
                    <p className="text-dark-light mb-4 font-[family-name:var(--font-body)]">Užpildykite informaciją tiksliam saulės elektrinės pasiūlymui</p>
                    <ContextualTip text="Pietinis stogas gamina ~15% daugiau energijos. Net rytų ar vakarų orientacija išlieka efektyvi Lietuvos klimate." />
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-dark mb-1.5">Vidutinės mėnesinės elektros sąnaudos (kWh)</label>
                      <div className="flex items-center gap-4">
                        <input type="range" min={50} max={data.tipas === "saules-elektrine-verslui" ? 5000 : 1500} step={10} value={data.menesinesSanaudos} onChange={(e) => update("menesinesSanaudos", Number(e.target.value))} className="flex-1 accent-primary" />
                        <input type="number" min={50} max={data.tipas === "saules-elektrine-verslui" ? 5000 : 1500} value={data.menesinesSanaudos} onChange={(e) => update("menesinesSanaudos", Number(e.target.value))} className={`w-24 border rounded-lg px-3 py-2 text-center text-dark focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none ${errors.menesinesSanaudos ? "border-red-400" : "border-gray-300"}`} />
                      </div>
                      {errors.menesinesSanaudos && <p className="text-red-500 text-sm mt-1">{errors.menesinesSanaudos}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-dark mb-1.5">Stogo tipas</label>
                      <div className="grid grid-cols-2 gap-3">
                        {STOGO_TIPAI.map((st) => (
                          <button key={st.value} onClick={() => update("stogoTipas", st.value)} className={`p-3 rounded-xl border-2 text-center transition-all ${data.stogoTipas === st.value ? "border-[var(--color-primary)] bg-blue-50" : "border-gray-200 hover:border-[var(--color-primary)]/50"}`}>
                            <div className="font-medium text-dark text-sm">{st.label}</div>
                            <div className="text-xs text-dark-light mt-0.5">{st.desc}</div>
                          </button>
                        ))}
                      </div>
                      {errors.stogoTipas && <p className="text-red-500 text-sm mt-1">{errors.stogoTipas}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-dark mb-1.5">Stogo orientacija</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {STOGO_ORIENTACIJOS.map((so) => (
                          <button key={so.value} onClick={() => update("stogoOrientacija", so.value)} className={`p-3 rounded-xl border-2 text-center transition-all ${data.stogoOrientacija === so.value ? "border-[var(--color-primary)] bg-blue-50" : "border-gray-200 hover:border-[var(--color-primary)]/50"}`}>
                            <div className="font-medium text-dark text-sm">{so.label}</div>
                            <div className="text-xs text-dark-light mt-0.5">{so.desc}</div>
                          </button>
                        ))}
                      </div>
                      {errors.stogoOrientacija && <p className="text-red-500 text-sm mt-1">{errors.stogoOrientacija}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-dark mb-1.5">Stogo plotas saulės moduliams (m²)</label>
                      <div className="flex items-center gap-4">
                        <input type="range" min={10} max={500} value={data.stogoPlotas} onChange={(e) => update("stogoPlotas", Number(e.target.value))} className="flex-1 accent-primary" />
                        <input type="number" min={10} max={500} value={data.stogoPlotas} onChange={(e) => update("stogoPlotas", Number(e.target.value))} className={`w-24 border rounded-lg px-3 py-2 text-center text-dark focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none ${errors.stogoPlotas ? "border-red-400" : "border-gray-300"}`} />
                      </div>
                      {errors.stogoPlotas && <p className="text-red-500 text-sm mt-1">{errors.stogoPlotas}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-dark mb-1.5">Šešėliai ant stogo</label>
                      <div className="grid grid-cols-3 gap-3">
                        {SESELIU_LYGIAI.map((sl) => (
                          <button key={sl.value} onClick={() => update("seseliai", sl.value)} className={`p-3 rounded-xl border-2 text-center transition-all ${data.seseliai === sl.value ? "border-[var(--color-primary)] bg-blue-50" : "border-gray-200 hover:border-[var(--color-primary)]/50"}`}>
                            <div className="font-medium text-dark text-sm">{sl.label}</div>
                          </button>
                        ))}
                      </div>
                      {errors.seseliai && <p className="text-red-500 text-sm mt-1">{errors.seseliai}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-dark mb-1.5">Elektros tarifas (EUR/kWh)</label>
                      <input type="number" step={0.01} min={0.05} max={1} value={data.tarifas} onChange={(e) => update("tarifas", Number(e.target.value))} className="w-32 border border-gray-300 rounded-lg px-4 py-2.5 text-dark focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-3 mb-6">
                      <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--color-primary)]/50 cursor-pointer transition-all">
                        <input type="checkbox" checked={data.dominaKaupiklis} onChange={(e) => update("dominaKaupiklis", e.target.checked)} className="w-5 h-5 rounded accent-primary" />
                        <div>
                          <div className="font-medium text-dark text-sm">Domina energijos kaupiklis</div>
                          <div className="text-xs text-dark-light">Baterija perteklinei energijai kaupti</div>
                        </div>
                      </label>
                      {data.tipas === "saules-elektrine-namams" && (
                        <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--color-primary)]/50 cursor-pointer transition-all">
                          <input type="checkbox" checked={data.dominaAPVA} onChange={(e) => update("dominaAPVA", e.target.checked)} className="w-5 h-5 rounded accent-primary" />
                          <div>
                            <div className="font-medium text-dark text-sm">Domina APVA subsidija</div>
                            <div className="text-xs text-dark-light">Valstybės parama iki 255 EUR/kWp (maks. 3051 EUR)</div>
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Modernized calculation results */}
                    {skaiciavimai && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-px flex-1 bg-gray-100" />
                          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wide font-[family-name:var(--font-body)]">Preliminarūs skaičiavimai</span>
                          <div className="h-px flex-1 bg-gray-100" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4">
                          <CalcCard
                            icon={<span className="text-[var(--color-primary)]">⚡</span>}
                            value={`${skaiciavimai.sistemosGalia} kWp`}
                            label="Rekomenduojama galia"
                          />
                          <CalcCard
                            icon={<span className="text-[var(--color-primary)]">&#9633;</span>}
                            value={`~${skaiciavimai.paneliuSkaicius} vnt.`}
                            label="Modulių skaičius"
                          />
                          <CalcCard
                            icon={<span className="text-[var(--color-green)]">&#9728;</span>}
                            value={`${skaiciavimai.metineGamyba.toLocaleString()} kWh`}
                            label="Metinė gamyba"
                          />
                          <CalcCard
                            icon={<span className="text-[var(--color-accent)]">&#8364;</span>}
                            value={`~${skaiciavimai.metinisSutaupymas} EUR`}
                            label="Metinis sutaupymas"
                            highlight
                          />
                          {skaiciavimai.apvaSubsidija > 0 && (
                            <CalcCard
                              icon={<span className="text-[var(--color-green)]">&#9733;</span>}
                              value={`iki ${skaiciavimai.apvaSubsidija} EUR`}
                              label="APVA subsidija"
                              span
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-3 mt-2">
                  <button onClick={handleBack} className="px-6 py-2.5 rounded-lg border border-gray-300 text-dark hover:bg-gray-50 transition font-[family-name:var(--font-body)]">Atgal</button>
                  <button onClick={handleNext} className="flex-1 px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition font-[family-name:var(--font-body)]">Toliau</button>
                </div>
                <MiniTestimonial />
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">Kontaktinė informacija</h2>
                <p className="text-dark-light mb-4 font-[family-name:var(--font-body)]">Pasiūlymą atsiųsime el. paštu</p>
                <ContextualTip text="Atsakome per 10 minučių. Jūsų duomenys saugūs ir neperduodami trečiosioms šalims." />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark mb-1.5">Vardas</label>
                  <input type="text" value={data.vardas} onChange={(e) => update("vardas", e.target.value)} placeholder="Jūsų vardas" className={`w-full border rounded-lg px-4 py-2.5 text-dark focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none ${errors.vardas ? "border-red-400" : "border-gray-300"}`} />
                  {errors.vardas && <p className="text-red-500 text-sm mt-1">{errors.vardas}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark mb-1.5">El. paštas</label>
                  <input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="jusu@pastas.lt" className={`w-full border rounded-lg px-4 py-2.5 text-dark focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none ${errors.email ? "border-red-400" : "border-gray-300"}`} />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark mb-1.5">Telefono numeris</label>
                  <input type="tel" value={data.telefonas} onChange={(e) => update("telefonas", e.target.value)} placeholder="+370 600 00000" className={`w-full border rounded-lg px-4 py-2.5 text-dark focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none ${errors.telefonas ? "border-red-400" : "border-gray-300"}`} />
                  {errors.telefonas && <p className="text-red-500 text-sm mt-1">{errors.telefonas}</p>}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark mb-1.5">Papildomi pageidavimai</label>
                  <textarea value={data.papildomiPageidavimai} onChange={(e) => update("papildomiPageidavimai", e.target.value)} placeholder="Jūsų papildomi pageidavimai ar klausimai (neprivaloma)" rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-dark focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-dark hover:bg-gray-50 transition font-[family-name:var(--font-body)]">Atgal</button>
                  <button onClick={handleSubmit} disabled={submitting} className="flex-1 px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition disabled:opacity-50 font-[family-name:var(--font-body)]">
                    {submitting ? "Siunčiama..." : "Siųsti užklausą"}
                  </button>
                </div>
                <MiniTestimonial />
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-6">
                {/* LDA logo */}
                <div className="flex justify-center mb-6">
                  <Image
                    src="https://ldaenergia.lt/wp-content/uploads/2025/11/LDA-logo-2.png"
                    alt="LDA Energija"
                    width={120}
                    height={40}
                    className="h-10 w-auto object-contain"
                    unoptimized
                  />
                </div>

                {/* Success icon */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-[var(--color-green)]/10 animate-ping opacity-30" />
                  <div className="relative w-24 h-24 bg-[var(--color-green)]/10 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-[var(--color-green)]/20 rounded-full flex items-center justify-center">
                      <svg className="w-9 h-9 text-[var(--color-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">Ačiū! Jūsų užklausa priimta.</h2>
                <p className="text-dark-light text-base mb-4 font-[family-name:var(--font-body)]">
                  {data.tipas === "servisas" ? "Susisieksime su jumis dėl serviso artimiausiu metu." : "Saulės elektrinės pasiūlymą gausite el. paštu."}
                </p>

                {/* Dashboard button */}
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition mb-6 font-[family-name:var(--font-body)]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Užeiti į valdymo skydą
                </a>

                {/* Contact info */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                  <a href="tel:+37063082999" className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-dark hover:border-[var(--color-primary)]/40 transition text-sm font-[family-name:var(--font-body)]">
                    <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +370 630 82999
                  </a>
                  <a href="mailto:info@ldaenergia.lt" className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-dark hover:border-[var(--color-primary)]/40 transition text-sm font-[family-name:var(--font-body)]">
                    <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@ldaenergia.lt
                  </a>
                </div>

                {/* Stipriausi Lietuvoje badge */}
                <div className="flex justify-center">
                  <Image
                    src="https://ldaenergia.lt/wp-content/uploads/2025/01/stipriausi-lietuvoje-150x150.png"
                    alt="Stipriausi Lietuvoje"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain opacity-80"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Partner logos – outside the card */}
        {step < 4 && <PartnerLogos />}
      </div>
    </div>
  );
}
