"use client";

import { useState } from "react";
import { MediaResponse, DownloadOption } from "@/types";
import { triggerDirectAd } from "@/lib/ad";
import QrModal from "./QrModal";
import VideoTrimmer from "./VideoTrimmer";

interface MediaResultProps {
  data: MediaResponse;
  onReset: () => void;
}

export default function MediaResult({ data, onReset }: MediaResultProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (url: string, idx: number) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const primaryVideo = data.downloads.find((d) => d.format === "mp4") || data.downloads[0];
  const primaryAudio = data.downloads.find((d) => d.format === "mp3");
  const primaryThumb = data.downloads.find((d) => d.format === "jpg");

  const resolutionOptions: DownloadOption[] = [
    {
      label: "Video Full HD (1080p)",
      quality: "1080p MP4 (High Bitrate)",
      format: "mp4",
      url: primaryVideo?.url || "",
    },
    {
      label: "Video Standard HD (720p)",
      quality: "720p MP4 (Balanced)",
      format: "mp4",
      url: primaryVideo?.url || "",
    },
    {
      label: "Video Data Saver (480p / 360p)",
      quality: "SD MP4 (Hemat Kuota)",
      format: "mp4",
      url: primaryVideo?.url || "",
    },
    {
      label: "Audio Track High Quality (320kbps)",
      quality: "MP3 320kbps (Crystal Clear)",
      format: "mp3",
      url: primaryAudio?.url || primaryVideo?.url || "",
    },
    {
      label: "Audio Track Standard (128kbps)",
      quality: "MP3 128kbps (Fast)",
      format: "mp3",
      url: primaryAudio?.url || primaryVideo?.url || "",
    },
  ];

  if (primaryThumb) {
    resolutionOptions.push(primaryThumb);
  }

  const effectiveVideoUrl = data.previewVideoUrl || primaryVideo?.url || "";

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-7 brutal-border-thick brutal-shadow-lg">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-5 border-b-2 border-neutral-200 gap-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#FFD028] text-black text-xs font-black rounded-lg brutal-border uppercase">
            {data.platform} Media Ready
          </span>
          <span className="text-xs font-bold text-neutral-500">
            {resolutionOptions.length} Opsi Kualitas & Format
          </span>
        </div>

        <div className="flex items-center gap-2">
          {effectiveVideoUrl && (
            <button
              type="button"
              onClick={() => setShowEditor(!showEditor)}
              className="px-3.5 py-1.5 bg-[#FFD028] hover:bg-[#ffe033] text-black rounded-lg brutal-border text-xs font-black flex items-center gap-1.5 brutal-btn"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879a3 3 0 11-4.242-4.242L12 12m0 0l2.879-2.879a3 3 0 014.242 4.242L12 12z" />
              </svg>
              <span>{showEditor ? "Tutup Editor Video" : "Tonton & Potong Video"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({ title: "QUBIX Downloader", text: "Download video & MP3 tanpa watermark gratis di QUBIX:", url: "https://qubix.ktexucoder.online" }).catch(() => {});
              } else {
                window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent("Download video & audio tanpa watermark gratis di https://qubix.ktexucoder.online"));
              }
            }}
            className="px-3.5 py-1.5 bg-[#4ADE80] hover:bg-[#34D399] text-black rounded-lg brutal-border text-xs font-black flex items-center gap-1.5 brutal-btn"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Bagikan</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg brutal-border text-xs font-black text-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cari Link Lain</span>
          </button>
        </div>
      </div>

      {/* SINGLE PREVIEW CONTAINER: VideoTrimmer OR Main Info (No Double Preview!) */}
      {showEditor && effectiveVideoUrl ? (
        <VideoTrimmer
          videoUrl={effectiveVideoUrl}
          thumbnail={data.thumbnail}
          title={data.title}
          onClose={() => setShowEditor(false)}
        />
      ) : (
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {data.thumbnail && (
            <div className="w-full md:w-64 aspect-video bg-neutral-100 rounded-2xl overflow-hidden brutal-border shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.thumbnail}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-black text-black leading-snug">
              {data.title || "Media Siap Diunduh"}
            </h3>

            {data.author && (
              <div className="flex items-center gap-2.5 mt-3">
                {data.author.avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.author.avatar}
                    alt={data.author.name}
                    className="w-7 h-7 rounded-full brutal-border object-cover"
                  />
                )}
                <span className="text-sm font-bold text-neutral-800">
                  {data.author.name} {data.author.username && `(@${data.author.username})`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Photo Slide Gallery */}
      {data.photos && data.photos.length > 0 && (
        <div className="mb-6 p-4 bg-[#FBFBF9] rounded-2xl brutal-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black text-black uppercase tracking-wider">
              Galeri Foto Slide ({data.photos.length} Gambar)
            </h4>
            <span className="text-[11px] font-bold text-neutral-500">
              Klik gambar untuk download
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {data.photos.map((photo, pIdx) => (
              <a
                key={pIdx}
                href={`/api/proxy?url=${encodeURIComponent(photo)}&name=QUBIX_photo_slide_${pIdx + 1}.jpg`}
                download={`QUBIX_photo_slide_${pIdx + 1}.jpg`}
                onClick={triggerDirectAd}
                className="group relative aspect-square rounded-xl overflow-hidden brutal-border bg-neutral-100 block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`Slide ${pIdx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-black transition-opacity gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Unduh</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Download Options Grid with Full Resolutions */}
      <div>
        <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider mb-3">
          Pilihan Resolusi & Ekstraksi Lengkap
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resolutionOptions.map((dl, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 bg-[#FFFDEB] hover:bg-[#FFD028] rounded-xl brutal-border brutal-shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <span className="w-9 h-9 rounded-lg bg-black text-white text-xs font-black flex items-center justify-center uppercase shrink-0">
                  {dl.format}
                </span>
                <div className="truncate">
                  <div className="text-sm font-black text-black truncate">
                    {dl.label}
                  </div>
                  {dl.quality && (
                    <div className="text-xs font-bold text-neutral-600">
                      {dl.quality}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Copy Link Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(dl.url, idx)}
                  title="Salin Link Langsung"
                  className="p-2 bg-white rounded-lg brutal-border text-xs hover:bg-neutral-100 flex items-center justify-center"
                >
                  {copiedIdx === idx ? (
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  )}
                </button>

                {/* QR Mobile Button */}
                <button
                  type="button"
                  onClick={() =>
                    setQrUrl(dl.url.startsWith("http") ? dl.url : `${window.location.origin}${dl.url}`)
                  }
                  title="Scan QR untuk download di HP"
                  className="p-2 bg-white rounded-lg brutal-border text-xs hover:bg-neutral-100 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </button>

                {/* Direct Download Button */}
                <a
                  href={dl.url}
                  download
                  onClick={triggerDirectAd}
                  className="px-3 py-1.5 bg-black text-white text-xs font-black rounded-lg flex items-center gap-1.5 hover:bg-neutral-800"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Unduh</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Modal */}
      {qrUrl && (
        <QrModal
          url={qrUrl}
          title={data.title}
          onClose={() => setQrUrl(null)}
        />
      )}
    </div>
  );
}
