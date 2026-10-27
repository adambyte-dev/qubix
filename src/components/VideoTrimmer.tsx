"use client";

import { useState, useRef } from "react";
import { triggerDirectAd } from "@/lib/ad";

interface VideoTrimmerProps {
  videoUrl: string;
  thumbnail?: string;
  title: string;
  onClose: () => void;
}

export default function VideoTrimmer({
  videoUrl,
  thumbnail,
  title,
  onClose,
}: VideoTrimmerProps) {
  const isEmbed = videoUrl.includes("embed") || videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState<number>(60);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Trimmer markers in seconds
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(30);
  const [draggingHandle, setDraggingHandle] = useState<"start" | "end" | null>(null);

  const [speed, setSpeed] = useState<number>(1);
  const [exportMode, setExportMode] = useState<"video" | "ringtone">("video");

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);

  // Capture current video frame as Full HD JPG
  const handleCaptureFrame = () => {
    triggerDirectAd();
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const a = document.createElement("a");
    a.download = `QUBIX_frame_${Math.floor(v.currentTime)}s.jpg`;
    a.href = canvas.toDataURL("image/jpeg", 0.95);
    a.click();
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) videoRef.current.playbackRate = newSpeed;
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // When metadata loads
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = Math.floor(videoRef.current.duration) || 60;
      setDuration(dur);
      setStartTime(0);
      setEndTime(Math.min(dur, Math.max(10, Math.floor(dur * 0.5))));
    }
  };

  // Video time update loop
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);

      // Loop inside trimmed range if playing trimmed preview
      if (current >= endTime) {
        videoRef.current.currentTime = startTime;
      }
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        if (videoRef.current.currentTime < startTime || videoRef.current.currentTime >= endTime) {
          videoRef.current.currentTime = startTime;
        }
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Play trimmed segment specifically
  const playTrimmedOnly = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Robust Pointer-based Dragging for Left & Right Handles
  const handleStartPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingHandle("start");
  };

  const handleEndPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingHandle("end");
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingHandle || !timelineRef.current || duration <= 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newSec = (x / rect.width) * duration;

    if (draggingHandle === "start") {
      const clamped = Math.min(Math.max(0, newSec), endTime - 1);
      const rounded = Number(clamped.toFixed(1));
      setStartTime(rounded);
      if (videoRef.current) {
        videoRef.current.currentTime = rounded;
        setCurrentTime(rounded);
      }
    } else if (draggingHandle === "end") {
      const clamped = Math.max(Math.min(duration, newSec), startTime + 1);
      const rounded = Number(clamped.toFixed(1));
      setEndTime(rounded);
      if (videoRef.current) {
        videoRef.current.currentTime = rounded;
        setCurrentTime(rounded);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingHandle) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
      setDraggingHandle(null);
    }
  };

  // Clicking on track directly
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingHandle || !timelineRef.current || duration <= 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const clickSec = (x / rect.width) * duration;

    // Move whichever marker is closer
    const distToStart = Math.abs(clickSec - startTime);
    const distToEnd = Math.abs(clickSec - endTime);

    if (distToStart < distToEnd) {
      const clamped = Math.min(clickSec, endTime - 1);
      setStartTime(Number(clamped.toFixed(1)));
      if (videoRef.current) videoRef.current.currentTime = clamped;
    } else {
      const clamped = Math.max(clickSec, startTime + 1);
      setEndTime(Number(clamped.toFixed(1)));
      if (videoRef.current) videoRef.current.currentTime = clamped;
    }
  };

  // Preset cutters
  const applyPreset = (seconds: number) => {
    const newEnd = Math.min(duration, startTime + seconds);
    setEndTime(newEnd);
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  };

  // Client-side instant video slice using MediaRecorder
  const handleExportTrim = async () => {
    triggerDirectAd();
    const video = videoRef.current;
    if (!video) {
      // Direct URL fallback
      const safeStart = Math.floor(startTime);
      const safeEnd = Math.floor(endTime);
      window.open(`${videoUrl}&start=${safeStart}&end=${safeEnd}#t=${safeStart},${safeEnd}`, "_blank");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      video.pause();
      setIsPlaying(false);
      video.currentTime = startTime;

      const stream = (video as unknown as { captureStream?: () => MediaStream }).captureStream
        ? (video as unknown as { captureStream: () => MediaStream }).captureStream()
        : null;

      if (!stream || typeof MediaRecorder === "undefined") {
        const safeStart = Math.floor(startTime);
        const safeEnd = Math.floor(endTime);
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(videoUrl)}&name=QUBIX_clip_${safeStart}s_to_${safeEnd}s.mp4#t=${safeStart},${safeEnd}`;
        const a = document.createElement("a");
        a.href = proxyUrl;
        a.download = `QUBIX_clip_${safeStart}s_${safeEnd}s.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setIsExporting(false);
        return;
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("video/mp4") ? "video/mp4" : "video/webm",
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const ext = recorder.mimeType.includes("mp4") ? "mp4" : "webm";
        const prefix = exportMode === "ringtone" ? "QUBIX_ringtone" : "QUBIX_clip";
        a.download = `${prefix}_${Math.floor(startTime)}s_${Math.floor(endTime)}s.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setExportProgress(100);
      };

      const clipDurationMs = Math.max(1000, (endTime - startTime) * 1000);
      recorder.start();
      video.play();

      const progressInterval = setInterval(() => {
        if (video.currentTime >= endTime) {
          clearInterval(progressInterval);
          recorder.stop();
          video.pause();
        } else {
          const elapsed = (video.currentTime - startTime) * 1000;
          setExportProgress(Math.min(100, Math.round((elapsed / clipDurationMs) * 100)));
        }
      }, 100);
    } catch {
      window.open(videoUrl, "_blank");
      setIsExporting(false);
    }
  };

  const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
  const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;
  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const clipLength = Math.max(0, endTime - startTime);

  return (
    <div className="w-full bg-[#18181B] text-white rounded-3xl p-5 sm:p-7 brutal-border-thick brutal-shadow-lg mb-8 relative overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 bg-[#FFD028] rounded-full brutal-border"></span>
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-white truncate max-w-xs sm:max-w-md">
            Video Trimmer & Editor: {title}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg brutal-border text-neutral-300 hover:text-white transition-colors"
          title="Tutup Editor"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Video Viewport (Single Player Only) */}
      <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden brutal-border mb-4 flex items-center justify-center">
        {isEmbed ? (
          <iframe
            src={videoUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              poster={thumbnail}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
              playsInline
            />

            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-16 h-16 bg-[#FFD028] text-black rounded-2xl brutal-border brutal-shadow flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              >
                <svg className="w-7 h-7 fill-current ml-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* Custom Controls Bar */}
      {!isEmbed && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900 p-3 rounded-xl brutal-border mb-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="w-9 h-9 bg-[#FFD028] text-black rounded-lg brutal-border flex items-center justify-center hover:bg-[#ffe033] transition-colors"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={playTrimmedOnly}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg brutal-border text-xs font-black flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#FFD028]" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Preview Klip ({formatTime(startTime)} - {formatTime(endTime)})</span>
            </button>
          </div>

          <div className="text-xs font-mono font-bold text-neutral-300 bg-black/50 px-3 py-1.5 rounded-lg brutal-border">
            <span className="text-[#FFD028]">{formatTime(currentTime)}</span>
            <span className="text-neutral-500"> / </span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg brutal-border">
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSpeedChange(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                  speed === s ? "bg-[#FFD028] text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* HD Frame Wallpaper Grabber Button */}
          <button
            type="button"
            onClick={handleCaptureFrame}
            title="Ambil Foto Frame HD dari video di detik ini"
            className="px-2.5 py-1.5 bg-[#FFD028] hover:bg-[#ffe033] text-black rounded-lg brutal-border text-xs font-black flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Foto HD</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }
            }}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg brutal-border text-xs font-black"
          >
            {isMuted ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Interactive Editor Timeline Scrubber (Independent Drag Handles) */}
      <div
        className="bg-black p-4 sm:p-5 rounded-2xl brutal-border mb-6 touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center justify-between mb-3 text-xs font-black">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#FFD028]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879a3 3 0 11-4.242-4.242L12 12m0 0l2.879-2.879a3 3 0 014.242 4.242L12 12z" />
            </svg>
            <span className="uppercase tracking-wider text-neutral-300">
              Interactive Timeline Scrubber
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-neutral-400">Durasi Klip:</span>
            <span className="bg-[#FFD028] text-black px-2 py-0.5 rounded font-black">
              {formatTime(clipLength)} ({Math.round(clipLength)}s)
            </span>
          </div>
        </div>

        {/* Visual Filmstrip Bar */}
        <div
          ref={timelineRef}
          onClick={handleTrackClick}
          className="relative w-full h-16 bg-neutral-900 rounded-xl brutal-border overflow-hidden select-none mb-4 cursor-pointer"
        >
          {/* Background Filmstrip Tick Marks */}
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-20 pointer-events-none">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className={`w-[2px] bg-white ${i % 4 === 0 ? "h-8" : "h-4"}`} />
            ))}
          </div>

          {/* Highlighted Active Cut Window */}
          <div
            className="absolute top-0 bottom-0 bg-[#FFD028]/35 border-y-2 border-[#FFD028] pointer-events-none"
            style={{
              left: `${startPercent}%`,
              width: `${Math.max(2, endPercent - startPercent)}%`,
            }}
          />

          {/* Playhead Needle Indicator */}
          {!isEmbed && (
            <div
              className="absolute top-0 bottom-0 w-[3px] bg-red-500 z-20 pointer-events-none"
              style={{ left: `${currentPercent}%` }}
            >
              <div className="w-3.5 h-3.5 bg-red-500 rounded-full -ml-[5px] -mt-1 shadow-md" />
            </div>
          )}

          {/* LEFT CUTTER HANDLE (START) — INDEPENDENT POINTER CAPTURE */}
          <div
            onPointerDown={handleStartPointerDown}
            className="absolute top-0 bottom-0 w-6 bg-[#FFD028] text-black rounded-l-lg brutal-border flex flex-col items-center justify-center font-black text-xs cursor-ew-resize z-40 select-none shadow-lg active:scale-105 transition-transform"
            style={{ left: `calc(${startPercent}% - 3px)` }}
            title={`Tarik Menit Awal: ${formatTime(startTime)}`}
          >
            <div className="w-1 h-5 bg-black/40 rounded-full mb-0.5" />
            <span className="text-[10px] leading-none">‹</span>
          </div>

          {/* RIGHT CUTTER HANDLE (END) — INDEPENDENT POINTER CAPTURE */}
          <div
            onPointerDown={handleEndPointerDown}
            className="absolute top-0 bottom-0 w-6 bg-[#FF4081] text-white rounded-r-lg brutal-border flex flex-col items-center justify-center font-black text-xs cursor-ew-resize z-40 select-none shadow-lg active:scale-105 transition-transform"
            style={{ left: `calc(${endPercent}% - 21px)` }}
            title={`Tarik Menit Akhir: ${formatTime(endTime)}`}
          >
            <div className="w-1 h-5 bg-white/40 rounded-full mb-0.5" />
            <span className="text-[10px] leading-none">›</span>
          </div>
        </div>

        {/* Time Inputs & Quick Presets Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Start & End Values */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 font-bold">Awal:</span>
              <span className="bg-neutral-800 text-[#FFD028] px-2.5 py-1 rounded font-mono font-bold brutal-border">
                {formatTime(startTime)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 font-bold">Akhir:</span>
              <span className="bg-neutral-800 text-[#FF4081] px-2.5 py-1 rounded font-mono font-bold brutal-border">
                {formatTime(endTime)}
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset(15)}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-[11px] font-black text-neutral-300"
            >
              15s
            </button>
            <button
              type="button"
              onClick={() => applyPreset(30)}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-[11px] font-black text-neutral-300"
            >
              30s
            </button>
            <button
              type="button"
              onClick={() => applyPreset(60)}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-[11px] font-black text-neutral-300"
            >
              60s
            </button>
            <button
              type="button"
              onClick={() => {
                setStartTime(0);
                setEndTime(duration);
              }}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-[11px] font-black text-neutral-400"
            >
              Reset Full
            </button>
          </div>
        </div>
      </div>

      {/* Export Format & Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExportMode("video")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black brutal-border ${
              exportMode === "video" ? "bg-[#FFD028] text-black" : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            🎬 Klip Video
          </button>
          <button
            type="button"
            onClick={() => setExportMode("ringtone")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black brutal-border ${
              exportMode === "ringtone" ? "bg-[#FF3377] text-white" : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            🎵 Nada Dering MP3
          </button>
        </div>

        <button
          type="button"
          onClick={handleExportTrim}
          disabled={isExporting}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#FFD028] hover:bg-[#ffe033] text-black font-black text-sm rounded-xl brutal-btn flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <svg className="w-4 h-4 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Memproses {exportMode === "ringtone" ? "Nada Dering" : "Klip"}... ({exportProgress}%)</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>
                Unduh {exportMode === "ringtone" ? "Nada Dering" : "Klip"} ({formatTime(startTime)} - {formatTime(endTime)})
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
