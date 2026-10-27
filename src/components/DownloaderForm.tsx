"use client";

import { useState, useEffect } from "react";
import { detectPlatform } from "@/lib/constants";
import { triggerDirectAd } from "@/lib/ad";

function PlatformInputIcon({
  mode,
  inputVal,
  profilePlatform,
}: {
  mode: "media" | "profile";
  inputVal: string;
  profilePlatform: string;
}) {
  const platform = mode === "profile" ? profilePlatform : detectPlatform(inputVal);

  if (platform === "tiktok") {
    return (
      <svg className="w-5 h-5 text-[#FF4081] shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
      </svg>
    );
  }
  if (platform === "youtube") {
    return (
      <svg className="w-5 h-5 text-[#FF0000] shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (platform === "instagram") {
    return (
      <svg className="w-5 h-5 text-[#A855F7] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  if (platform === "twitter") {
    return (
      <svg className="w-5 h-5 text-black shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (platform === "facebook") {
    return (
      <svg className="w-5 h-5 text-[#1877F2] shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (platform === "pinterest") {
    return (
      <svg className="w-5 h-5 text-[#E60023] shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0a12 12 0 0 0-4.37 23.18c-.05-.98-.1-2.49.02-3.56.11-.98.71-6.15.71-6.15s-.18-.36-.18-.9c0-.84.49-1.47 1.1-1.47.52 0 .77.39.77.86 0 .52-.33 1.3-.5 2.02-.14.61.3 1.1.91 1.1 1.09 0 1.93-1.15 1.93-2.8 0-1.47-1.05-2.49-2.56-2.49-1.74 0-2.77 1.31-2.77 2.66 0 .53.2 1.09.46 1.4.05.06.06.12.04.18l-.17.72c-.03.11-.1.15-.22.1-1.03-.48-1.68-1.98-1.68-3.19 0-2.6 1.89-4.99 5.45-4.99 2.86 0 5.08 2.04 5.08 4.77 0 2.85-1.79 5.14-4.28 5.14-.84 0-1.62-.43-1.89-.95l-.51 1.96c-.19.72-.69 1.63-1.03 2.18A12 12 0 1 0 12 0z" />
      </svg>
    );
  }

  return (
    <svg className="w-5 h-5 text-neutral-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

interface DownloaderFormProps {
  mode: "media" | "profile" | "batch";
  onModeChange: (mode: "media" | "profile" | "batch") => void;
  profilePlatform: "tiktok" | "instagram" | "twitter";
  onProfilePlatformChange: (p: "tiktok" | "instagram" | "twitter") => void;
  onSubmit: (input: string) => void;
  isLoading: boolean;
  heroHeading?: string;
  heroHighlight?: string;
  heroSubtitle?: string;
}

export default function DownloaderForm({
  mode,
  onModeChange,
  profilePlatform,
  onProfilePlatformChange,
  onSubmit,
  isLoading,
  heroHeading,
  heroHighlight,
  heroSubtitle,
}: DownloaderFormProps) {
  const [inputVal, setInputVal] = useState("");
  const [hasClipboard, setHasClipboard] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && Boolean(navigator.clipboard)) {
      setHasClipboard(true);
    }
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputVal(text.trim());
      }
    } catch {
      // Clipboard denied
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isLoading) {
      triggerDirectAd();
      onSubmit(inputVal.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center sm:text-left">
      {/* Tuckii Signature Bold Headline */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-black tracking-tight leading-[1.08]">
          {heroHeading || "Download Anything."}
          <br />
          <span className="inline-block relative">
            <span className="relative z-10">{heroHighlight || "No Watermark."}</span>
            <span
              className="absolute left-0 bottom-1 w-full h-4 sm:h-5 bg-[#FFD028] -z-0 rounded-xs"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base font-bold text-neutral-600 max-w-xl">
          {heroSubtitle ||
            "Unduh video TikTok tanpa watermark, foto profil HD, audio MP3, potong durasi klip, dan media sosial lainnya dalam satu platform."}
        </p>
      </div>

      {/* Main Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-3">
        <button
          type="button"
          onClick={() => onModeChange("media")}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 sm:gap-2 ${
            mode === "media"
              ? "bg-[#FFD028] text-black brutal-border brutal-shadow-sm"
              : "bg-white text-neutral-700 brutal-border hover:bg-neutral-100"
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span>Multi Media <span className="hidden sm:inline">(Video / Audio / Slide)</span></span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("profile")}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 sm:gap-2 ${
            mode === "profile"
              ? "bg-[#FF3377] text-white brutal-border brutal-shadow-sm"
              : "bg-white text-neutral-700 brutal-border hover:bg-neutral-100"
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Foto Profil <span className="hidden sm:inline">(PP HD)</span></span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("batch")}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 sm:gap-2 ${
            mode === "batch"
              ? "bg-[#4ADE80] text-black brutal-border brutal-shadow-sm"
              : "bg-white text-neutral-700 brutal-border hover:bg-neutral-100"
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Batch <span className="hidden sm:inline">Multi-Link</span></span>
        </button>
      </div>

      {/* Sub-Platform Selector for Profile Picture Mode */}
      {mode === "profile" && (
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
          <span className="text-xs font-black text-neutral-600">Platform:</span>
          {(["tiktok", "instagram", "twitter"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onProfilePlatformChange(p)}
              className={`px-3 py-1 rounded-lg text-xs font-black capitalize brutal-border transition-all ${
                profilePlatform === p
                  ? "bg-black text-white brutal-shadow-sm"
                  : "bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {p === "tiktok" ? "TikTok" : p === "instagram" ? "Instagram" : "Twitter / X"}
            </button>
          ))}
        </div>
      )}

      {/* Responsive Input Bar (Single or Multi-Link Batch) */}
      {mode === "batch" ? (
        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 brutal-border-thick brutal-shadow-lg transition-all focus-within:translate-x-[-1px] focus-within:translate-y-[-1px] focus-within:shadow-[6px_6px_0px_#000000]">
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b-2 border-neutral-100">
              <span className="text-xs font-black text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Paste 1 Link Per Baris (Maks. 10 link)
              </span>
              {hasClipboard && (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg brutal-border text-xs font-black text-neutral-800 flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  Paste
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={"https://www.tiktok.com/@user/video/12345\nhttps://www.instagram.com/reel/abcde\nhttps://www.youtube.com/watch?v=xyz"}
              className="w-full bg-transparent text-xs sm:text-sm font-mono font-bold text-black placeholder:text-neutral-400 outline-none resize-none leading-relaxed"
              disabled={isLoading}
            />

            <div className="flex items-center justify-between pt-2.5 border-t-2 border-neutral-100 mt-2">
              <span className="text-xs font-black text-neutral-500">
                {inputVal.split("\n").filter((l) => l.trim()).length} link terdeteksi
              </span>
              <button
                type="submit"
                disabled={isLoading || !inputVal.trim()}
                className="px-5 py-2.5 bg-[#4ADE80] hover:bg-[#3ec470] rounded-xl brutal-border text-black font-black text-xs sm:text-sm flex items-center gap-2 brutal-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Memproses Batch...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Sekaligus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-2xl p-2 sm:p-2.5 pl-3 sm:pl-4 brutal-border-thick brutal-shadow-lg transition-all focus-within:translate-x-[-1px] focus-within:translate-y-[-1px] focus-within:shadow-[6px_6px_0px_#000000]">
            {/* Dynamic Platform / URL Icon */}
            <div className="flex items-center justify-center w-7 h-7 shrink-0">
              <PlatformInputIcon mode={mode} inputVal={inputVal} profilePlatform={profilePlatform} />
            </div>

            {/* Text Input */}
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                mode === "profile"
                  ? `Ketik username ${profilePlatform} (@username) atau link profil...`
                  : "Paste link video TikTok, YouTube, Instagram, Facebook, X, dll..."
              }
              className="flex-1 bg-transparent py-2 text-sm sm:text-base font-bold text-black placeholder:text-neutral-400 outline-none min-w-0"
              disabled={isLoading}
            />

            {/* Paste Clipboard Icon Button */}
            {hasClipboard && (
              <button
                type="button"
                onClick={handlePaste}
                title="Paste dari Clipboard"
                className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg brutal-border text-xs font-black text-neutral-800 transition-colors hidden sm:flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Paste
              </button>
            )}

            {/* Big Yellow Download Button */}
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-4 sm:px-6 h-12 sm:h-13 bg-[#FFD028] hover:bg-[#FFE033] rounded-xl brutal-border flex items-center justify-center gap-2 text-black font-black text-sm sm:text-base brutal-btn shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="hidden sm:inline">Memproses...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Unduh</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
