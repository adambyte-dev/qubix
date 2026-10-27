"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import DownloaderForm from "@/components/DownloaderForm";
import PlatformCards from "@/components/PlatformCards";
import MediaResult from "@/components/MediaResult";
import ProfileResult from "@/components/ProfileResult";
import BatchResult, { BatchItem } from "@/components/BatchResult";
import HistoryDrawer from "@/components/HistoryDrawer";
import SeoContent from "@/components/SeoContent";
import Footer from "@/components/Footer";
import { MediaResponse, TikTokProfileResponse, HistoryItem } from "@/types";

const HISTORY_KEY = "qubix_download_history_v1";

export interface HomeProps {
  initialMode?: "media" | "profile" | "batch";
  heroHeading?: string;
  heroHighlight?: string;
  heroSubtitle?: string;
}

export default function Home({
  initialMode = "media",
  heroHeading,
  heroHighlight,
  heroSubtitle,
}: HomeProps = {}) {
  const [mode, setMode] = useState<"media" | "profile" | "batch">(initialMode);
  const [profilePlatform, setProfilePlatform] = useState<"tiktok" | "instagram" | "twitter">("tiktok");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mediaData, setMediaData] = useState<MediaResponse | null>(null);
  const [profileData, setProfileData] = useState<TikTokProfileResponse | null>(null);
  const [batchItems, setBatchItems] = useState<BatchItem[] | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveToHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    try {
      const newItem: HistoryItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
      };
      const updated = [newItem, ...history.filter(h => h.url !== item.url)].slice(0, 10);
      setHistory(updated);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // Ignore
    }
  };

  const handleReset = () => {
    setMediaData(null);
    setProfileData(null);
    setBatchItems(null);
    setErrorMsg(null);
  };

  const handleSelectCard = (selectedMode: "media" | "profile" | "batch") => {
    setMode(selectedMode);
    handleReset();
  };

  const handleFetch = async (input: string, activeMode = mode) => {
    setIsLoading(true);
    setErrorMsg(null);
    setMediaData(null);
    setProfileData(null);
    setBatchItems(null);

    try {
      if (activeMode === "batch") {
        const rawUrls = input
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0 && (l.startsWith("http://") || l.startsWith("https://")));

        if (rawUrls.length === 0) {
          throw new Error("Tidak ada link URL valid. Pastikan setiap baris diawali http:// atau https://");
        }

        const urls = Array.from(new Set(rawUrls)).slice(0, 10);
        const initialItems: BatchItem[] = urls.map((u, i) => ({
          id: `batch-${Date.now()}-${i}`,
          url: u,
          status: "loading",
        }));
        setBatchItems(initialItems);

        // Process all links concurrently
        await Promise.allSettled(
          urls.map(async (url, idx) => {
            try {
              const res = await fetch("/api/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
              });
              const data = await res.json();
              if (!res.ok || !data.success) {
                throw new Error(data.error || "Gagal ekstraksi");
              }
              setBatchItems((prev) =>
                prev
                  ? prev.map((item, i) =>
                      i === idx ? { ...item, status: "success", data } : item
                    )
                  : null
              );
              saveToHistory({
                title: data.title || "Media File",
                platform: data.platform,
                thumbnail: data.thumbnail,
                url,
              });
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Gagal unduh";
              setBatchItems((prev) =>
                prev
                  ? prev.map((item, i) =>
                      i === idx ? { ...item, status: "error", error: msg } : item
                    )
                  : null
              );
            }
          })
        );
      } else if (activeMode === "profile") {
        const res = await fetch("/api/tiktok/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: input, platform: profilePlatform }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Gagal mengambil foto profil.");
        }
        setProfileData(data);
        saveToHistory({
          title: `Foto Profil @${data.username} (${profilePlatform.toUpperCase()})`,
          platform: "profile",
          thumbnail: data.avatarMedium || data.avatarHd,
          url: input,
        });
      } else {
        const res = await fetch("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: input }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Gagal mengekstraksi media dari link tersebut.");
        }
        setMediaData(data);
        saveToHistory({
          title: data.title || "Media File",
          platform: data.platform,
          thumbnail: data.thumbnail,
          url: input,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F4EE] flex flex-col justify-between selection:bg-[#FFD028] selection:text-black overflow-x-hidden">
      {/* Top Navbar */}
      <Header />

      {/* Main Web Content */}
      <main className="w-full max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-10 flex-1 overflow-x-hidden">
        {/* Hero & Input Section */}
        <DownloaderForm
          mode={mode}
          onModeChange={(m) => {
            setMode(m);
            handleReset();
          }}
          profilePlatform={profilePlatform}
          onProfilePlatformChange={(p) => setProfilePlatform(p)}
          onSubmit={(input) => handleFetch(input, mode)}
          isLoading={isLoading}
          heroHeading={heroHeading}
          heroHighlight={heroHighlight}
          heroSubtitle={heroSubtitle}
        />

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="w-full max-w-3xl mx-auto mt-4">
            <div className="bg-[#FFF1F2] border-[2.5px] border-red-500 rounded-2xl p-4 brutal-shadow flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="text-sm font-black text-red-950">Gagal Mengunduh</h4>
                <p className="text-xs font-bold text-red-800 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Result (TikTok & IG PP HD) */}
        {profileData && (
          <div className="w-full max-w-3xl mx-auto mt-6">
            <ProfileResult data={profileData} onReset={handleReset} />
          </div>
        )}

        {/* Media Result (Video / Audio / Slide / Multi-Res) */}
        {mediaData && (
          <div className="w-full max-w-3xl mx-auto mt-6">
            <MediaResult data={mediaData} onReset={handleReset} />
          </div>
        )}

        {/* Batch Result (Multi-Link Downloads) */}
        {batchItems && (
          <div className="w-full max-w-3xl mx-auto mt-6">
            <BatchResult items={batchItems} onReset={handleReset} />
          </div>
        )}

        {/* Platform Collections Grid */}
        {!mediaData && !profileData && !batchItems && (
          <div className="w-full max-w-3xl mx-auto mt-10">
            <PlatformCards onSelect={handleSelectCard} />
          </div>
        )}

        {/* Local Download History Shelf */}
        <div className="w-full max-w-3xl mx-auto">
          <HistoryDrawer
            history={history}
            onSelect={(url) => {
              handleReset();
              handleFetch(url, url.startsWith("@") || (!url.startsWith("http") && !url.includes(".com")) ? "profile" : "media");
            }}
            onClear={handleClearHistory}
          />
        </div>

        {/* SEO Long-form Content & FAQs */}
        <SeoContent />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
