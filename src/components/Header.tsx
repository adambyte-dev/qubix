"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Header() {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    // Register Service Worker for PWA
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Check if running in standalone mode (no browser UI)
    if (typeof window !== "undefined") {
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
      ) {
        setIsInstalled(true);
      }

      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
      return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "QUBIX — All-in-One Media Downloader",
      text: "Unduh video TikTok tanpa watermark, foto profil HD, YouTube 4K, dan potong video gratis!",
      url: typeof window !== "undefined" ? window.location.href : "https://qubix.ktexucoder.online",
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user dismissed
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="w-full bg-[#F5F4EE] border-b-[2.5px] border-black sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 h-14 sm:h-18 flex items-center justify-between">
        {/* Logo Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="QUBIX Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-black">
                QUBIX
              </span>
              <a
                href="https://github.com/adambyte-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] sm:text-[10px] font-black bg-black text-white px-1.5 sm:px-2 py-0.5 rounded-md hover:bg-neutral-800 transition-colors"
                title="GitHub adambyte-dev"
              >
                by adambyte-dev
              </a>
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase tracking-wider hidden sm:block">
              Universal Media Downloader
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* PWA Standalone Install Button */}
          {!isInstalled && (
            <button
              type="button"
              onClick={handleInstallClick}
              title="Unduh & Pasang Aplikasi Layar Penuh (Tanpa Browser Bar)"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#4ADE80] hover:bg-[#34D399] text-black text-xs font-black rounded-xl brutal-border brutal-shadow-sm transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Unduh App</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            title="Bagikan Website"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#FFD028] hover:bg-[#FFE033] text-black text-xs font-black rounded-xl brutal-border brutal-shadow-sm transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="hidden xs:inline">{copied ? "Tersalin!" : "Bagikan"}</span>
          </button>

          <div className="hidden md:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl brutal-border brutal-shadow-sm text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            PURE NATIVE SCRAPER
          </div>

          <div className="hidden sm:block px-3 py-1.5 bg-[#FF3377] text-white text-xs font-black rounded-xl brutal-border brutal-shadow-sm">
            NO WATERMARK
          </div>
        </div>
      </div>

      {/* PWA Install Guide Modal (Mobile & Safari Fallback) */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 brutal-border-thick brutal-shadow-xl text-black">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#4ADE80] rounded-full brutal-border"></span>
                <h3 className="font-black text-base">Pasang Aplikasi QUBIX</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 brutal-border text-xs font-black flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-neutral-600 mb-4">
              Jalankan QUBIX di HP atau Laptop Anda dalam <strong>mode aplikasi penuh tanpa bilah browser (tanpa URL bar)</strong>:
            </p>

            <div className="space-y-3 text-xs font-bold">
              <div className="p-3 bg-[#FFFDEB] rounded-xl brutal-border">
                <div className="font-black text-black mb-1">📱 Android / Chrome:</div>
                <p className="text-neutral-700">
                  Ketuk titik tiga (⋮) di pojok kanan atas browser Chrome, lalu pilih <strong>&quot;Pasang Aplikasi&quot;</strong> atau <strong>&quot;Tambah ke Layar Utama&quot;</strong>.
                </p>
              </div>

              <div className="p-3 bg-[#FFF1F2] rounded-xl brutal-border">
                <div className="font-black text-black mb-1">🍎 iPhone / Safari:</div>
                <p className="text-neutral-700">
                  Ketuk tombol Bagikan (ikon kotak panah ke atas <span className="font-mono">⎋</span>) di bawah Safari, lalu gulir dan pilih <strong>&quot;Tambah ke Layar Utama&quot;</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInstallGuide(false)}
              className="w-full mt-5 py-3 bg-[#FFD028] hover:bg-[#FFE033] text-black font-black text-xs rounded-xl brutal-btn text-center"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
