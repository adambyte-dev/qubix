"use client";

interface CollectionCard {
  id: string;
  tabColor: string;
  tabLabel: string;
  textColor?: string;
  iconBg: string;
  badge?: string;
  formatsCount: string;
  title: string;
  description: string;
  mode: "media" | "profile" | "batch";
  icon: React.ReactNode;
}

interface PlatformCardsProps {
  onSelect: (mode: "media" | "profile" | "batch") => void;
}

export default function PlatformCards({ onSelect }: PlatformCardsProps) {
  const collections: CollectionCard[] = [
    {
      id: "tiktok-nowm",
      tabColor: "#FF4081",
      tabLabel: "TIKTOK",
      iconBg: "#FFE4EF",
      formatsCount: "HD No-WM & MP3",
      title: "TikTok Video",
      description: "Unduh video bersih tanpa watermark, audio musik original, dan slideshow foto.",
      mode: "media",
      icon: (
        <svg className="w-6 h-6 text-[#FF4081]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
        </svg>
      ),
    },
    {
      id: "tiktok-profile",
      tabColor: "#4ADE80",
      tabLabel: "AVATAR HD",
      iconBg: "#DCFCE7",
      badge: "POPULAR",
      formatsCount: "1080x1080 Resolution",
      title: "Foto Profil TikTok (PP)",
      description: "Ambil foto avatar akun TikTok resolusi penuh hanya dengan username (@user).",
      mode: "profile",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: "youtube-4k",
      tabColor: "#FFD028",
      tabLabel: "YOUTUBE",
      iconBg: "#FEF9C3",
      formatsCount: "4K, 1080p, MP3",
      title: "YouTube & Shorts",
      description: "Ekstraksi video multi-resolusi, Shorts vertikal, audio MP3, dan cover thumbnail HD.",
      mode: "media",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: "instagram-suite",
      tabColor: "#A855F7",
      tabLabel: "INSTAGRAM",
      iconBg: "#F3E8FF",
      formatsCount: "Reels, Post & Stories",
      title: "Instagram Downloader",
      description: "Unduh video Reels tanpa kompresi, album carousel multi-foto, dan video feed.",
      mode: "media",
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      id: "twitter-media",
      tabColor: "#000000",
      tabLabel: "TWITTER / X",
      textColor: "text-white",
      iconBg: "#F4F4F5",
      formatsCount: "MP4 & High-Bitrate",
      title: "Twitter / X Media",
      description: "Unduh klip video tweet resolusi tertinggi, animasi GIF MP4, dan foto resolusi original.",
      mode: "media",
      icon: (
        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: "multi-social",
      tabColor: "#3B82F6",
      tabLabel: "MULTI-MEDIA",
      iconBg: "#DBEAFE",
      badge: "EXPANDED",
      formatsCount: "FB, Pinterest, Reddit",
      title: "Multi-Platform Suite",
      description: "Dukungan penuh Facebook Video/Reels, Pin Pinterest, CapCut, Reddit, dan Threads.",
      mode: "media",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
            Supported Platforms
          </h2>
          <p className="text-xs font-bold text-neutral-500">
            Pilih platform untuk beralih mode downloader
          </p>
        </div>
      </div>

      {/* 3-Column Responsive Grid on Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {collections.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.mode)}
            className="group relative bg-white rounded-2xl p-4 pt-5 brutal-border-thick brutal-shadow text-left transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000000] flex flex-col justify-between min-h-[170px]"
          >
            {/* Top Folder Tab sticking out */}
            <div
              className={`absolute -top-3 left-4 px-3 py-0.5 rounded-t-lg brutal-border text-[10px] font-black uppercase ${
                c.textColor || "text-black"
              }`}
              style={{ backgroundColor: c.tabColor }}
            >
              {c.tabLabel}
            </div>

            {/* Top Header Row inside Card: Icon Box + Formats */}
            <div className="flex items-start justify-between w-full mb-3">
              <div
                className="w-12 h-12 rounded-xl brutal-border flex items-center justify-center shrink-0"
                style={{ backgroundColor: c.iconBg }}
              >
                {c.icon}
              </div>

              <div className="flex flex-col items-end">
                {c.badge && (
                  <span className="bg-[#FF3377] text-white text-[9px] font-black px-2 py-0.5 rounded-md mb-1 brutal-border">
                    {c.badge}
                  </span>
                )}
                <span className="text-[11px] font-bold text-neutral-500">
                  {c.formatsCount}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-black text-black group-hover:underline">
                {c.title}
              </h3>
              <p className="text-xs font-medium text-neutral-600 mt-1 line-clamp-2">
                {c.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
