'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ─── Scroll-reveal hook ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─── Animation keyframes injected once ─── */
const GLOBAL_STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes slideLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes gradientPan {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .anim-fadeUp   { animation: fadeUp   0.75s ease-out both; }
  .anim-fadeIn   { animation: fadeIn   0.75s ease-out both; }
  .anim-scaleIn  { animation: scaleIn  0.75s ease-out both; }
  .anim-slideL   { animation: slideLeft  0.75s ease-out both; }
  .anim-slideR   { animation: slideRight 0.75s ease-out both; }

  .delay-1 { animation-delay: 0.10s; }
  .delay-2 { animation-delay: 0.20s; }
  .delay-3 { animation-delay: 0.30s; }
  .delay-4 { animation-delay: 0.40s; }
  .delay-5 { animation-delay: 0.55s; }
  .delay-6 { animation-delay: 0.70s; }

  .ticker-track { animation: ticker 28s linear infinite; }
  .ticker-track:hover { animation-play-state: paused; }

  .hero-gradient {
    background: linear-gradient(135deg, #001959 0%, #012f7a 45%, #055d98 100%);
    background-size: 200% 200%;
    animation: gradientPan 14s ease infinite;
  }

  .cta-gradient {
    background: linear-gradient(135deg, #001959 0%, #055d98 60%, #0070b8 100%);
    background-size: 200% 200%;
    animation: gradientPan 10s ease infinite;
  }

  .accent-shimmer {
    background: linear-gradient(90deg, #fd6d15 0%, #ff9a4d 50%, #fd6d15 100%);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .card-glass {
    background: rgba(255,255,255,0.07);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.13);
  }

  .partner-logo { filter: grayscale(1) opacity(0.55); transition: filter 0.35s ease, transform 0.35s ease; }
  .partner-logo:hover { filter: grayscale(0) opacity(1); transform: scale(1.08); }

  .gallery-item { overflow: hidden; position: relative; }
  .gallery-item img { transition: transform 0.55s ease; }
  .gallery-item:hover img { transform: scale(1.07); }
  .gallery-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,25,89,0.85) 0%, transparent 55%);
    opacity: 0; transition: opacity 0.4s ease;
  }
  .gallery-item:hover .gallery-overlay { opacity: 1; }
  .gallery-caption {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 1.5rem;
    transform: translateY(12px); opacity: 0;
    transition: transform 0.4s ease, opacity 0.4s ease;
  }
  .gallery-item:hover .gallery-caption { transform: translateY(0); opacity: 1; }

  .step-connector::after {
    content: '';
    position: absolute;
    top: 2.75rem;
    left: calc(50% + 2.5rem);
    width: calc(100% - 5rem);
    height: 2px;
    background: linear-gradient(90deg, #fd6d15, #055d98);
    opacity: 0.35;
  }

  @media (max-width: 1023px) {
    .step-connector::after { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
`;

/* ═══════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function HomePage() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <main className="min-h-screen bg-white overflow-x-hidden">

        {/* ══════════ 1. HERO ══════════ */}
        <section className="hero-gradient relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">

          {/* Background photo with overlay */}
          <div className="absolute inset-0">
            <img
              src="https://ldaenergia.lt/wp-content/uploads/2026/03/Dizainas-be-pavadinimo-6.jpg"
              alt="Saulės elektrinė"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#001959]/90 via-[#012f7a]/80 to-[#055d98]/85" />
          </div>

          {/* Subtle diagonal light beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3/4 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto pt-16 pb-24">

            {/* Logo */}
            <div className={heroVisible ? 'anim-fadeIn delay-1' : 'opacity-0'}>
              <img
                src="https://ldaenergia.lt/wp-content/uploads/2025/03/logo-white-2.svg"
                alt="LDA Energija"
                className="h-14 sm:h-16 mb-10 drop-shadow-2xl"
              />
            </div>

            {/* Eyebrow */}
            <div className={`mb-5 ${heroVisible ? 'anim-fadeUp delay-2' : 'opacity-0'}`}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-sm font-medium px-4 py-1.5 rounded-full font-[family-name:var(--font-body)] tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#83bf25] inline-block animate-pulse" />
                Lietuva&rsquo;s lyderis saulės energetikoje
              </span>
            </div>

            {/* Headline */}
            <h1 className={`font-[family-name:var(--font-heading)] text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 ${heroVisible ? 'anim-fadeUp delay-3' : 'opacity-0'}`}>
              Saulės energija —<br />
              <span className="accent-shimmer">Jūsų nepriklausomybė</span>
            </h1>

            {/* Subtitle */}
            <p className={`font-[family-name:var(--font-body)] text-lg sm:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed ${heroVisible ? 'anim-fadeUp delay-4' : 'opacity-0'}`}>
              Profesionali saulės elektrinių įranga ir montavimas. Sutaupykite iki&nbsp;<strong className="text-white">80%</strong> elektros sąnaudų ir gaukite APVA subsidiją iki&nbsp;<strong className="text-white">3051&nbsp;EUR</strong>.
            </p>

            {/* CTA */}
            <div className={heroVisible ? 'anim-fadeUp delay-5' : 'opacity-0'}>
              <Link
                href="/forma"
                className="font-[family-name:var(--font-body)] inline-flex items-center gap-3 bg-[#fd6d15] hover:bg-[#e55f0e] text-white text-lg font-semibold px-9 py-4 rounded-xl shadow-2xl hover:shadow-orange-700/40 transition-all duration-300 hover:scale-105 active:scale-100"
              >
                <span>Gauti pasiūlymą nemokamai</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <p className="text-white/50 text-sm mt-4 font-[family-name:var(--font-body)]">
                Atsakome per 10 minučių &bull; Nemokama konsultacija
              </p>
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0 leading-none">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
            </svg>
          </div>
        </section>

        {/* ══════════ 2. PARTNERS STRIP ══════════ */}
        <PartnerStrip />

        {/* ══════════ 3. TRUST NUMBERS ══════════ */}
        <StatsRow />

        {/* ══════════ 4. BENEFITS ══════════ */}
        <BenefitsSection />

        {/* ══════════ 5. PROJECT GALLERY ══════════ */}
        <GallerySection />

        {/* ══════════ 6. TESTIMONIALS ══════════ */}
        <TestimonialsSection />

        {/* ══════════ 7. PROCESS STEPS ══════════ */}
        <ProcessSection />

        {/* ══════════ 8. BADGE ══════════ */}
        <BadgeSection />

        {/* ══════════ 9. FINAL CTA ══════════ */}
        <CtaSection />

        {/* ══════════ 10. FOOTER ══════════ */}
        <Footer />
      </main>
    </>
  );
}

/* ═══════════════════════════════════════════
   PARTNER STRIP
══════════════════════════════════════════════ */
const PARTNERS = [
  { src: 'https://ldaenergia.lt/wp-content/uploads/2025/01/sungrow.png',   alt: 'Sungrow' },
  { src: 'https://ldaenergia.lt/wp-content/uploads/2025/01/huawei.png',    alt: 'Huawei' },
  { src: 'https://ldaenergia.lt/wp-content/uploads/2025/01/jinko.png',     alt: 'JinkoSolar' },
  { src: 'https://ldaenergia.lt/wp-content/uploads/2025/01/jasolar.png',   alt: 'JA Solar' },
  { src: 'https://ldaenergia.lt/wp-content/uploads/2025/01/fox-ess.png',   alt: 'Fox ESS' },
  { src: 'https://ldaenergia.lt/wp-content/uploads/2025/01/solplanet.png', alt: 'Solplanet' },
  { src: 'https://ldaenergia.lt/wp-content/uploads/2025/01/growat.png',    alt: 'Growatt' },
];

function PartnerStrip() {
  const doubled = [...PARTNERS, ...PARTNERS]; // seamless loop
  return (
    <section className="py-14 px-4 bg-white border-b border-gray-100">
      <p className="font-[family-name:var(--font-body)] text-center text-sm font-semibold tracking-widest text-[#001959]/50 uppercase mb-8">
        Dirbame su geriausiais gamintojais
      </p>
      <div className="overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="ticker-track flex gap-12 items-center w-max">
          {doubled.map((p, i) => (
            <div key={i} className="flex-shrink-0 flex items-center justify-center h-12 w-32">
              <img src={p.src} alt={p.alt} className="partner-logo max-h-10 max-w-[120px] object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   STATS ROW
══════════════════════════════════════════════ */
const STATS = [
  { value: '3000+',    label: 'įrengtų sistemų',      icon: '⚡' },
  { value: '25 m.',    label: 'gamintojo garantija',   icon: '🛡' },
  { value: '3051 EUR', label: 'APVA subsidija',         icon: '💶' },
  { value: '80%',      label: 'elektros sutaupymas',   icon: '📉' },
];

function StatsRow() {
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#001959]">
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`text-center ${visible ? `anim-fadeUp delay-${i + 1}` : 'opacity-0'}`}
          >
            <div className="text-4xl mb-3">{s.icon}</div>
            <div className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-[#fd6d15] mb-2 leading-none">
              {s.value}
            </div>
            <p className="font-[family-name:var(--font-body)] text-white/70 text-sm sm:text-base uppercase tracking-wide">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   BENEFITS
══════════════════════════════════════════════ */
const BENEFITS = [
  {
    icon: <img src="https://ldaenergia.lt/wp-content/uploads/2025/03/icon-sun.svg" alt="" className="w-12 h-12" />,
    title: 'Energijos nepriklausomybė',
    desc: 'Gaminkite savo elektros energiją ir nebepriklauskite nuo kintančių rinkos kainų.',
    color: '#fd6d15',
  },
  {
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="#055d98" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'APVA subsidija iki 3051 EUR',
    desc: 'Pasinaudokite valstybės parama ir žymiai sumažinkite pradinę investiciją.',
    color: '#055d98',
  },
  {
    icon: <img src="https://ldaenergia.lt/wp-content/uploads/2025/03/icon-handshake.svg" alt="" className="w-12 h-12" />,
    title: 'Aukščiausios kokybės įranga',
    desc: 'Naudojame tik pirmaujančių gamintojų — Sungrow, Huawei, Jinko — produktus.',
    color: '#001959',
  },
  {
    icon: <img src="https://ldaenergia.lt/wp-content/uploads/2025/03/icon-paper.svg" alt="" className="w-12 h-12" />,
    title: 'Pilnas aptarnavimas',
    desc: 'Nuo projekto parengimo ir leidimų iki montavimo, derybų su tinklu ir priežiūros.',
    color: '#fd6d15',
  },
  {
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="#83bf25" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Ekologiška energija',
    desc: 'Atsinaujinanti saulės energija mažina CO₂ išmetimus ir saugo aplinką ateities kartoms.',
    color: '#83bf25',
  },
  {
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="#001959" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: '25 metų garantija',
    desc: 'Ilgalaikė gamintojo garantija užtikrina ramybę ir investicijos apsaugą daugiau nei du dešimtmečius.',
    color: '#055d98',
  },
];

function BenefitsSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${visible ? 'anim-fadeUp delay-1' : 'opacity-0'}`}>
          <span className="inline-block text-[#fd6d15] font-[family-name:var(--font-body)] text-sm font-semibold tracking-widest uppercase mb-3">
            Kodėl verta
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-[#001959] mb-4">
            Saulės energijos privalumai
          </h2>
          <p className="font-[family-name:var(--font-body)] text-gray-500 max-w-xl mx-auto text-lg">
            Investuokite į atsinaujinančią energiją ir pradėkite taupyti nuo pirmos dienos
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((b, i) => (
            <BenefitCard key={b.title} {...b} delay={i + 2} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  icon, title, desc, color, delay, visible,
}: { icon: React.ReactNode; title: string; desc: string; color: string; delay: number; visible: boolean }) {
  const d = Math.min(delay, 6);
  return (
    <div
      className={`group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 hover:border-transparent transition-all duration-500 hover:-translate-y-1 ${visible ? `anim-fadeUp delay-${d}` : 'opacity-0'}`}
      style={{ '--card-accent': color } as React.CSSProperties}
    >
      <div className="mb-5 w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
        {icon}
      </div>
      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#001959] mb-3">{title}</h3>
      <p className="font-[family-name:var(--font-body)] text-gray-500 leading-relaxed text-sm">{desc}</p>
      <div className="mt-5 w-10 h-0.5 rounded-full transition-all duration-500 group-hover:w-16" style={{ background: color }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   GALLERY
══════════════════════════════════════════════ */
const GALLERY = [
  { src: 'https://ldaenergia.lt/wp-content/uploads/2026/03/4995-kW-1000-x-1000-piks.jpg', caption: '499.5 kW pramoninė elektrinė', tag: 'Komercinis' },
  { src: 'https://ldaenergia.lt/wp-content/uploads/2026/03/Dizainas-be-pavadinimo-6.jpg', caption: 'Gyvenamųjų namų projektas',     tag: 'Namų ūkis' },
  { src: 'https://ldaenergia.lt/wp-content/uploads/2026/03/3.jpg',                         caption: 'Stogo montavimas',               tag: 'Montavimas' },
  { src: 'https://ldaenergia.lt/wp-content/uploads/2025/02/ldaenergia-1.jpg',              caption: 'LDA Energija komandos projektas', tag: 'Mūsų darbai' },
];

function GallerySection() {
  const { ref, visible } = useReveal();
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${visible ? 'anim-fadeUp delay-1' : 'opacity-0'}`}>
          <span className="inline-block text-[#fd6d15] font-[family-name:var(--font-body)] text-sm font-semibold tracking-widest uppercase mb-3">
            Mūsų darbai
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-[#001959] mb-4">
            Įgyvendinti projektai
          </h2>
          <p className="font-[family-name:var(--font-body)] text-gray-500 max-w-xl mx-auto text-lg">
            Kiekvieną projektą vykdome su meile detalėms ir aukščiausios kokybės standartais
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {GALLERY.map((g, i) => (
            <div
              key={i}
              className={`gallery-item rounded-2xl overflow-hidden aspect-video shadow-md ${visible ? `anim-scaleIn delay-${i + 2}` : 'opacity-0'}`}
            >
              <img src={g.src} alt={g.caption} className="w-full h-full object-cover" loading="lazy" />
              <div className="gallery-overlay" />
              <div className="gallery-caption">
                <span className="font-[family-name:var(--font-body)] inline-block bg-[#fd6d15] text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                  {g.tag}
                </span>
                <p className="font-[family-name:var(--font-heading)] text-white text-lg font-semibold">
                  {g.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: 'Jonas K.',
    location: 'Kaunas',
    text: 'Komanda atvyko laiku, montavimas užtruko tik dvi dienas. Viskas tvarkingai, profesionaliai — nei smulkmenos nepraleidžiama. Tikrai rekomenduoju LDA Energija visiems, kas galvoja apie saulės elektrines.',
    rating: 5,
    initial: 'J',
  },
  {
    name: 'Rasa M.',
    location: 'Vilnius',
    text: 'Pirmą mėnesį po montavimo elektros sąskaita sumažėjo beveik perpus. Po pusmečio džiaugiuosi, kad apsisprendžiau — investicija atsipirks gerokai greičiau, nei tikėjausi. Ačiū LDA Energija!',
    rating: 5,
    initial: 'R',
  },
  {
    name: 'Tomas B.',
    location: 'Klaipėda',
    text: 'Labai vertinu, kad LDA Energija padėjo su APVA paraiška nuo pradžių iki galo. Gavome 3000 EUR subsidiją — tai reikšminga suma. Specialistai atsakė į visus klausimus, procesas buvo sklandus.',
    rating: 5,
    initial: 'T',
  },
];

function TestimonialsSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f8faff]" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${visible ? 'anim-fadeUp delay-1' : 'opacity-0'}`}>
          <span className="inline-block text-[#fd6d15] font-[family-name:var(--font-body)] text-sm font-semibold tracking-widest uppercase mb-3">
            Klientų atsiliepimai
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-[#001959] mb-4">
            Ką sako mūsų klientai?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-400 hover:-translate-y-1 flex flex-col ${visible ? `anim-fadeUp delay-${i + 2}` : 'opacity-0'}`}
            >
              {/* Quote mark */}
              <svg className="w-8 h-8 text-[#fd6d15]/40 mb-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <p className="font-[family-name:var(--font-body)] text-gray-600 leading-relaxed text-sm flex-1 mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-auto">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#001959] to-[#055d98] flex items-center justify-center flex-shrink-0">
                  <span className="font-[family-name:var(--font-heading)] text-white text-lg font-bold">{t.initial}</span>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-body)] font-semibold text-[#001959] text-sm">{t.name}</p>
                  <p className="font-[family-name:var(--font-body)] text-gray-400 text-xs">{t.location}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-[#fd6d15]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PROCESS
══════════════════════════════════════════════ */
const STEPS = [
  {
    num: '01',
    title: 'Konsultacija',
    desc: 'Aptariame Jūsų poreikius, elektros sąnaudas ir stogo galimybes. Visiškai nemokamai.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Projektavimas',
    desc: 'Mūsų inžinieriai parengia techninį projektą, konfigūraciją ir pagalbą su APVA paraiška.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Montavimas',
    desc: 'Sertifikuota komanda sumontuoja sistemą per 1–2 dienas. Tvarkingai, greitai, kokybiškai.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Naudojimasis',
    desc: 'Džiaukitės savo elektros energija ir sutaupytais pinigais. Mes pasirūpiname garantine priežiūra.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

function ProcessSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${visible ? 'anim-fadeUp delay-1' : 'opacity-0'}`}>
          <span className="inline-block text-[#fd6d15] font-[family-name:var(--font-body)] text-sm font-semibold tracking-widest uppercase mb-3">
            Darbų eiga
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-[#001959] mb-4">
            Kaip tai veikia?
          </h2>
          <p className="font-[family-name:var(--font-body)] text-gray-500 max-w-xl mx-auto text-lg">
            Nuo pirmojo skambučio iki veikiančios elektrinės — paprastas ir skaidrus procesas
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line on desktop */}
          <div className="hidden lg:block absolute top-11 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#fd6d15]/30 via-[#055d98]/30 to-[#fd6d15]/30" />

          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className={`flex flex-col items-center text-center relative ${visible ? `anim-fadeUp delay-${i + 2}` : 'opacity-0'}`}
            >
              <div className="relative z-10 w-22 h-22 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#001959] to-[#055d98] flex items-center justify-center shadow-xl mx-auto">
                  {s.icon}
                </div>
                <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#fd6d15] flex items-center justify-center font-[family-name:var(--font-body)] text-white text-xs font-bold shadow-md">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#001959] mb-3">{s.title}</h3>
              <p className="font-[family-name:var(--font-body)] text-gray-500 leading-relaxed text-sm max-w-[220px]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   BADGE SECTION
══════════════════════════════════════════════ */
function BadgeSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f8faff]" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className={`flex flex-col sm:flex-row items-center gap-10 bg-white rounded-3xl p-10 shadow-md border border-gray-100 ${visible ? 'anim-scaleIn delay-1' : 'opacity-0'}`}>
          <div className="flex-shrink-0">
            <img
              src="https://ldaenergia.lt/wp-content/uploads/2025/01/stipriausi-lietuvoje-150x150.png"
              alt="Stipriausi Lietuvoje"
              className="w-32 h-32 object-contain drop-shadow-lg"
            />
          </div>
          <div>
            <div className="text-[#fd6d15] font-[family-name:var(--font-body)] text-sm font-semibold tracking-widest uppercase mb-2">
              Oficialus pripažinimas
            </div>
            <h3 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#001959] mb-3">
              Stipriausi Lietuvoje
            </h3>
            <p className="font-[family-name:var(--font-body)] text-gray-500 leading-relaxed">
              LDA Energija yra oficialiai pripažinta viena stipriausių Lietuvos įmonių. Šis prestižinis apdovanojimas — mūsų klientų pasitikėjimo ir nuoseklaus darbo kokybės įrodymas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FINAL CTA
══════════════════════════════════════════════ */
function CtaSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 cta-gradient relative overflow-hidden" ref={ref}>
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#fd6d15]/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className={visible ? 'anim-fadeUp delay-1' : 'opacity-0'}>
          <span className="inline-block bg-[#fd6d15]/20 border border-[#fd6d15]/30 text-[#fd6d15] text-sm font-semibold px-4 py-1.5 rounded-full font-[family-name:var(--font-body)] tracking-wide mb-6">
            Nemokama konsultacija
          </span>
        </div>
        <h2 className={`font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight ${visible ? 'anim-fadeUp delay-2' : 'opacity-0'}`}>
          Pradėkite gaminti<br className="hidden sm:block" /> savo energiją jau šiandien
        </h2>
        <p className={`font-[family-name:var(--font-body)] text-white/70 text-lg max-w-2xl mx-auto mb-10 ${visible ? 'anim-fadeUp delay-3' : 'opacity-0'}`}>
          Užpildykite trumpą formą ir per 10 minučių gausite individualų pasiūlymą su tiksliais skaičiavimais.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 ${visible ? 'anim-fadeUp delay-4' : 'opacity-0'}`}>
          <Link
            href="/forma"
            className="font-[family-name:var(--font-body)] inline-flex items-center gap-3 bg-[#fd6d15] hover:bg-[#e55f0e] text-white text-lg font-semibold px-10 py-4 rounded-xl shadow-2xl hover:shadow-orange-700/40 transition-all duration-300 hover:scale-105 active:scale-100 w-full sm:w-auto justify-center"
          >
            Gauti saulės elektrinės pasiūlymą
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Contact strip */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center ${visible ? 'anim-fadeIn delay-5' : 'opacity-0'}`}>
          <a href="tel:+37063082999" className="font-[family-name:var(--font-body)] flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +370 630 82999
          </a>
          <span className="hidden sm:block text-white/30">&bull;</span>
          <a href="mailto:info@ldaenergia.lt" className="font-[family-name:var(--font-body)] flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            info@ldaenergia.lt
          </a>
          <span className="hidden sm:block text-white/30">&bull;</span>
          <span className="font-[family-name:var(--font-body)] flex items-center gap-2 text-white/80 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Aido g. 6, Giraitė, Kauno r.
          </span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-[#0d1333] text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand col */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src="https://ldaenergia.lt/wp-content/uploads/2025/03/logo-white-2.svg"
              alt="LDA Energija"
              className="h-10 mb-5 opacity-90"
            />
            <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed mb-6">
              Saulės elektrinės, kaupikliai ir EV įkrovimo stotelės. Profesionaliai, kokybiškai, su garantija.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { href: 'https://www.facebook.com/ldaenergia', label: 'Facebook', path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                { href: 'https://www.instagram.com/ldaenergia', label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { href: 'https://www.linkedin.com/company/ldaenergia', label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-[#fd6d15] flex items-center justify-center transition-colors duration-300"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Paslaugos */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] text-white text-sm font-bold tracking-widest uppercase mb-5">Paslaugos</h4>
            <ul className="space-y-3 font-[family-name:var(--font-body)] text-sm">
              {['Saulės elektrinės', 'Baterijų kaupikliai', 'EV įkrovimo stotelės', 'APVA subsidijos', 'Techninė priežiūra'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontaktai */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] text-white text-sm font-bold tracking-widest uppercase mb-5">Kontaktai</h4>
            <ul className="space-y-3 font-[family-name:var(--font-body)] text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Aido g. 6, Giraitė, Kauno r.
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+37063082999" className="hover:text-white transition-colors">+370 630 82999</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@ldaenergia.lt" className="hover:text-white transition-colors">info@ldaenergia.lt</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a href="https://ldaenergia.lt" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ldaenergia.lt</a>
              </li>
            </ul>
          </div>

          {/* CTA mini */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] text-white text-sm font-bold tracking-widest uppercase mb-5">Pradėkite dabar</h4>
            <p className="font-[family-name:var(--font-body)] text-sm mb-5 leading-relaxed">
              Gaukite nemokamą konsultaciją ir individualų pasiūlymą jau šiandien.
            </p>
            <Link
              href="/forma"
              className="font-[family-name:var(--font-body)] inline-flex items-center gap-2 bg-[#fd6d15] hover:bg-[#e55f0e] text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors duration-300"
            >
              Gauti pasiūlymą
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-[family-name:var(--font-body)] text-xs text-white/40">
            &copy; {new Date().getFullYear()} LDA Energija. Visos teisės saugomos.
          </p>
          <p className="font-[family-name:var(--font-body)] text-xs text-white/40">
            Saulės elektrinės &bull; Kaupikliai &bull; EV įkrovimo stotelės
          </p>
        </div>
      </div>
    </footer>
  );
}
