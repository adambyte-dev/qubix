"use client";

import { useState } from "react";
import { TikTokProfileResponse } from "@/types";
import QrModal from "./QrModal";

interface ProfileResultProps {
  data: TikTokProfileResponse;
  onReset: () => void;
}

export default function ProfileResult({ data, onReset }: ProfileResultProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const downloadHdUrl = `/api/proxy?url=${encodeURIComponent(data.avatarHd)}&name=QUBIX_PP_${data.username}_1080p.jpg`;
  const downloadMediumUrl = `/api/proxy?url=${encodeURIComponent(data.avatarMedium)}&name=QUBIX_PP_${data.username}_720p.jpg`;

  const handleCopy = () => {
    const fullUrl = `${window.location.origin}${downloadHdUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8 brutal-border-thick brutal-shadow-lg">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-neutral-200">
        <span className="px-3 py-1 bg-[#FF3377] text-white text-xs font-black rounded-lg brutal-border uppercase">
          TikTok Foto Profil (PP) HD Ditemukan
        </span>
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg brutal-border text-xs font-black text-neutral-800 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Cari Akun Lain</span>
        </button>
      </div>

      {/* Main Profile Info Row */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
        {/* Large HD Avatar Preview */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl brutal-border-thick brutal-shadow overflow-hidden bg-neutral-100 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.avatarHd || data.avatarMedium}
            alt={data.nickname}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-black">
              {data.nickname}
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded brutal-border">
              AKUN AKTIF
            </span>
          </div>

          <p className="text-base font-bold text-neutral-500 mt-1">
            @{data.username}
          </p>

          {data.bio && (
            <div className="mt-3 bg-[#FBFBF9] p-3.5 rounded-xl brutal-border text-xs sm:text-sm font-semibold text-neutral-800 max-w-lg">
              {data.bio}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg brutal-border text-xs font-black flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Link Disalin!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  <span>Salin Link Avatar</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setQrUrl(`${window.location.origin}${downloadHdUrl}`)}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg brutal-border text-xs font-black flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span>Transfer ke HP (QR)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Download Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <a
          href={downloadHdUrl}
          download={`QUBIX_PP_${data.username}_1080p.jpg`}
          className="py-4 px-5 bg-[#FFD028] hover:bg-[#FFE033] text-black font-black text-sm rounded-xl brutal-btn flex items-center justify-center gap-2.5 text-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Unduh Foto Profil HD (1080x1080 Original)</span>
        </a>

        <a
          href={downloadMediumUrl}
          download={`QUBIX_PP_${data.username}_720p.jpg`}
          className="py-4 px-5 bg-white hover:bg-neutral-50 text-black font-black text-sm rounded-xl brutal-border flex items-center justify-center gap-2 text-center"
        >
          <span>Unduh Resolusi Standar (720x720)</span>
        </a>
      </div>

      {/* QR Modal */}
      {qrUrl && (
        <QrModal
          url={qrUrl}
          title={`Foto Profil @${data.username}`}
          onClose={() => setQrUrl(null)}
        />
      )}
    </div>
  );
}
