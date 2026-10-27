"use client";

import { useState } from "react";
import { createQrMatrix } from "@/lib/qrcode";

interface QrModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

export default function QrModal({ url, title, onClose }: QrModalProps) {
  const [copied, setCopied] = useState(false);
  const matrix = createQrMatrix(url);
  const size = matrix.length;
  const cellSize = 8;
  const svgSize = size * cellSize;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 brutal-border-thick brutal-shadow-lg relative text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg brutal-border bg-neutral-100 flex items-center justify-center text-black hover:bg-neutral-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <span className="inline-block px-2.5 py-0.5 bg-[#FFD028] text-black text-[10px] font-black rounded brutal-border uppercase mb-2">
          Download Di HP
        </span>

        <h3 className="text-base font-black text-black line-clamp-1 mb-4">
          {title}
        </h3>

        {/* Pure Zero-API Native SVG QR Code */}
        <div className="w-fit mx-auto p-4 bg-white rounded-xl brutal-border mb-4">
          <svg
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            className="w-44 h-44"
          >
            {matrix.map((row, r) =>
              row.map((active, c) =>
                active ? (
                  <rect
                    key={`${r}-${c}`}
                    x={c * cellSize}
                    y={r * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill="#000000"
                  />
                ) : null
              )
            )}
          </svg>
        </div>

        <p className="text-xs font-bold text-neutral-500 mb-4">
          Scan QR ini menggunakan kamera HP untuk mengunduh berkas langsung.
        </p>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-2.5 bg-[#FFD028] hover:bg-[#ffe033] rounded-xl brutal-border text-xs font-black text-black brutal-btn flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Link Berhasil Disalin!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span>Salin Link Unduhan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
