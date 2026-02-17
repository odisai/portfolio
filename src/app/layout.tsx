import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LedgerGrid } from "@/components/ui/ledger-grid";

// Body font - Satoshi Variable
const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Variable.woff2",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
});

// Mono font - JetBrains Mono
const jetbrains = localFont({
  src: "../../public/fonts/JetBrainsMono.woff2.ttf",
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070708",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "Taylor Allen | Builder. Architect. Founder.",
  description:
    "Founder and systems architect building premium software from MVP to enterprise scale.",
  keywords: [
    "Taylor Allen",
    "CTO",
    "Founder",
    "Software Architect",
    "OdisAI",
    "Bay Area",
  ],
  authors: [{ name: "Taylor Allen" }],
  creator: "Taylor Allen",
  openGraph: {
    title: "Taylor Allen | Builder. Architect. Founder.",
    description: "Designing and shipping durable software systems.",
    url: "https://taylorallen.dev",
    siteName: "Taylor Allen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Taylor Allen Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taylor Allen | Builder. Architect. Founder.",
    description: "Designing and shipping durable software systems.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-obsidian text-pearl antialiased">
        <div className="site-shell">{children}</div>

        <div className="global-atmosphere" aria-hidden="true">
          <div className="atmosphere-mesh" />
          <div className="atmosphere-bloom" />
          <div className="atmosphere-haze" />
          <div className="atmosphere-sweep" />
        </div>

        {/* Global ledger grid texture */}
        <div className="fixed inset-0 z-[9995] pointer-events-none opacity-[0.04]">
          <LedgerGrid />
        </div>

        {/* Noise overlay for cinematic grain */}
        <div className="noise-overlay" aria-hidden="true" />
        {/* Vignette for depth */}
        <div className="vignette-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
