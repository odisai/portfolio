import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Display font - Satoshi Variable
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

// Body font - Inter Variable
const inter = localFont({
  src: [
    {
      path: "../../public/fonts/InterVariable.woff2",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterVariable-Italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-inter",
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
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "Taylor Allen | Builder. Architect. Founder.",
  description:
    "Co-Founder & CTO building technology that matters. From startup MVPs to enterprise health systems.",
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
    description: "Creating technology that matters.",
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
    description: "Creating technology that matters.",
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
      className={`${satoshi.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-space text-white antialiased">
        {children}
        
        {/* Noise overlay for cinematic grain */}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
