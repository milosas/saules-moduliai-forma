import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/chatbot/ChatWidget";

export const metadata: Metadata = {
  title: "Saulės elektrinių pasiūlymai | LDA Energija",
  description: "Gaukite individualų komercinį pasiūlymą saulės elektrinėms, kaupikliams ir EV įkrovimo stotelėms - LDA Energija",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* BlinGO Agency Header Banner */}
        <div className="bg-black py-2 px-4">
          <a
            href="http://www.blingo.lt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-white text-sm hover:opacity-80 transition-opacity"
          >
            <span>Sukurta kartu su</span>
            <img
              src="/blingo-logo.png"
              alt="BlinGO Agency"
              className="h-7 invert"
            />
          </a>
        </div>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
