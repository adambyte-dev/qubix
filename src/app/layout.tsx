import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://qubix-two.vercel.app"),
  title: "QUBIX — All-in-One Media Downloader",
  description:
    "Unduh video TikTok tanpa watermark, foto profil (PP) TikTok HD, YouTube 4K, audio MP3, dan potong durasi video secepat kilat.",
  authors: [{ name: "Muhammad Adam Hidayat (adambyte-dev)", url: "https://github.com/adambyte-dev" }],
  creator: "adambyte-dev",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "QUBIX — All-in-One Media Downloader",
    description:
      "Unduh video TikTok tanpa watermark, foto profil HD 1080p, YouTube 4K, audio MP3 320kbps, dan potong video.",
    url: "/",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FBFBF9] text-black">
        {children}
      </body>
    </html>
  );
}
