"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaResponse } from "@/types";

export interface BatchItem {
  id: string;
  url: string;
  status: "loading" | "success" | "error";
  data?: MediaResponse;
  error?: string;
}

interface BatchResultProps {
  items: BatchItem[];
  onReset: () => void;
}

export default function BatchResult({ items, onReset }: BatchResultProps) {
  const [downloadingAll, setDownloadingAll] = useState(false);

  const successItems = items.filter((i) => i.status === "success" && i.data);
  const totalSuccess = successItems.length;
  const isFinished = items.every((i) => i.status !== "loading");

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    for (const item of successItems) {
      if (!item.data) continue;
      const opt = item.data.downloads[0];
      if (opt) {
        const a = document.createElement("a");
        a.href = opt.url;
        a.download = `QUBIX_${item.data.title || "download"}.${opt.format}`;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        await new Promise((r) => setTimeout(r, 400));
      }
    }
    setDownloadingAll(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 brutal-border-thick brutal-shadow-xl animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b-[2.5px] border-black gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 bg-[#4ADE80] rounded-full brutal-border"></span>
            <h3 className="text-xl sm:text-2xl font-black text-black">
              Batch Download ({totalSuccess}/{items.length})
            </h3>
          </div>
          <p className="text-xs font-bold text-neutral-500 mt-1">
            {isFinished
              ? `${totalSuccess} media berhasil diekstraksi dari total ${items.length} link.`
              : "Sedang mengekstraksi link secara paralel..."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {totalSuccess > 0 && (
            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              className="px-4 py-2 bg-[#FFD028] hover:bg-[#FFE033] rounded-xl brutal-border text-xs sm:text-sm font-black flex items-center gap-1.5 brutal-btn disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{downloadingAll ? "Mengunduh..." : "Download Semua"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl brutal-border text-xs sm:text-sm font-black text-neutral-700"
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="mt-5 space-y-3">
        {items.map((item, idx) => {
          const opt = item.data?.downloads[0];
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl brutal-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                item.status === "error"
                  ? "bg-red-50 border-red-500"
                  : item.status === "success"
                  ? "bg-[#FAF9F5] border-black hover:translate-x-0.5"
                  : "bg-white border-neutral-300"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Index badge */}
                <span className="w-6 h-6 rounded-lg bg-neutral-200 text-neutral-700 text-xs font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                {/* Thumbnail or Spinner */}
                <div className="w-14 h-14 rounded-xl brutal-border bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                  {item.status === "loading" && (
                    <svg className="animate-spin w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {item.status === "error" && (
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {item.status === "success" && item.data && (
                    <Image
                      src={item.data.thumbnail || "/logo.png"}
                      alt={item.data.title || "Media"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>

                {/* Title & Metadata */}
                <div className="min-w-0 flex-1">
                  {item.status === "loading" && (
                    <p className="text-xs font-bold text-neutral-500 truncate">
                      Mengekstraksi: {item.url}
                    </p>
                  )}
                  {item.status === "error" && (
                    <div>
                      <p className="text-xs font-black text-red-700 truncate">{item.url}</p>
                      <p className="text-[11px] font-bold text-red-500">{item.error || "Gagal diekstrak"}</p>
                    </div>
                  )}
                  {item.status === "success" && item.data && (
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="px-1.5 py-0.5 bg-black text-white text-[10px] font-black rounded uppercase">
                          {item.data.platform}
                        </span>
                        {item.data.author && (
                          <span className="text-[11px] font-bold text-neutral-500 truncate">
                            @{item.data.author.username || item.data.author.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-black text-black truncate max-w-md">
                        {item.data.title || item.url}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {item.status === "success" && item.data && opt && (
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <a
                    href={opt.url}
                    download={`QUBIX_${item.data.title || "download"}.${opt.format}`}
                    className="px-3.5 py-2 bg-[#FFD028] hover:bg-[#FFE033] rounded-xl brutal-border text-xs font-black text-black flex items-center gap-1.5 brutal-btn"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{opt.label}</span>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
