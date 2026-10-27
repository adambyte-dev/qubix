import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://qubix.ktexucoder.online"),
  title: "QUBIX — All-in-One Media Downloader | Download TikTok Tanpa Watermark & YouTube HD",
  description:
    "Unduh video TikTok tanpa watermark, foto profil (PP) TikTok HD, YouTube 4K, audio MP3 320kbps, Instagram Reels, dan potong durasi video secepat kilat gratis.",
  keywords: [
    "tiktok downloader",
    "download video tiktok tanpa watermark",
    "snaptik",
    "ssstiktok",
    "download video youtube",
    "youtube mp3",
    "instagram reels downloader",
    "download foto profil tiktok hd",
    "video trimmer online",
    "batch video downloader",
    "qubix",
    "unduh video tiktok hd",
    "pinterest video downloader",
    "capcut template download",
    "soundcloud mp3 download",
  ],
  alternates: {
    canonical: "https://qubix.ktexucoder.online",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [{ name: "Muhammad Adam Hidayat (adambyte-dev)", url: "https://github.com/adambyte-dev" }],
  creator: "adambyte-dev",
  verification: {
    google: "googleccdd65e544dc2b73",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "QUBIX — All-in-One Media Downloader | No Watermark HD",
    description:
      "Unduh video TikTok tanpa watermark, foto profil HD 1080p, YouTube 4K, audio MP3 320kbps, dan potong video.",
    url: "https://qubix.ktexucoder.online",
    siteName: "QUBIX",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QUBIX — All-in-One Media Downloader",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QUBIX — All-in-One Media Downloader",
    description:
      "Unduh video TikTok tanpa watermark, foto profil HD, YouTube 4K, audio MP3, dan potong video secepat kilat.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://qubix.ktexucoder.online/#webapp",
      name: "QUBIX",
      url: "https://qubix.ktexucoder.online",
      description:
        "Unduh video TikTok tanpa watermark, foto profil HD 1080p, YouTube 4K, audio MP3 320kbps, dan potong video secepat kilat.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://qubix.ktexucoder.online/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Bagaimana cara download video TikTok tanpa watermark di QUBIX?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Buka aplikasi TikTok, salin tautan video yang ingin Anda simpan, lalu tempelkan ke kotak input QUBIX. Klik Unduh, lalu pilih Video Tanpa Watermark (HD).",
          },
        },
        {
          "@type": "Question",
          name: "Apakah QUBIX gratis?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "QUBIX 100% gratis tanpa batasan kuota harian. Anda tidak perlu login atau mendaftar akun.",
          },
        },
        {
          "@type": "Question",
          name: "Platform apa saja yang didukung?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "TikTok, YouTube, Instagram Reels, Twitter/X, Facebook, Pinterest, CapCut, Threads, dan SoundCloud.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <head>
        {/* Literal Google AdSense script tag for raw HTML crawler */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3315503406511623"
          crossOrigin="anonymous"
        />
        {/* Google AdSense Meta Tag Verification Method */}
        <meta name="google-adsense-account" content="ca-pub-3315503406511623" />
        {/* JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#FBFBF9] text-black overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
