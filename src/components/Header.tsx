"use client";

import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "QUBIX — All-in-One Media Downloader",
      text: "Unduh video TikTok tanpa watermark, foto profil HD, YouTube 4K, dan potong video gratis!",
      url: typeof window !== "undefined" ? window.location.href : "https://qubix.app",
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Logo Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="QUBIX Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-black">
                QUBIX
              </span>
              <a
                href="https://github.com/adambyte-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded-md hover:bg-neutral-800 transition-colors"
                title="GitHub adambyte-dev"
              >
                by adambyte-dev
              </a>
            </div>
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider hidden sm:block">
              Universal Media Downloader
            </p>
          </div>
        </div>

        {/* Right Badges & Share Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleShare}
            title="Bagikan Website"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFD028] hover:bg-[#FFE033] text-black text-xs font-black rounded-xl brutal-border brutal-shadow-sm transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>{copied ? "Tersalin!" : "Bagikan"}</span>
          </button>

          <div className="hidden md:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl brutal-border brutal-shadow-sm text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            PURE NATIVE SCRAPER
          </div>

          <div className="px-3 py-1.5 bg-[#FF3377] text-white text-xs font-black rounded-xl brutal-border brutal-shadow-sm">
            NO WATERMARK
          </div>
        </div>
      </div>
    </header>
  );
}
