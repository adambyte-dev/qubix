export interface SlugConfig {
  slug: string;
  badge: string;
  title: string;
  heroHeading: string;
  heroHighlight: string;
  description: string;
  keywords: string[];
  mode: "media" | "profile" | "batch";
  platformName: string;
}

export const SLUG_CONFIGS: Record<string, SlugConfig> = {
  "download-tiktok-tanpa-watermark": {
    slug: "download-tiktok-tanpa-watermark",
    badge: "TikTok Downloader",
    title: "Download Video TikTok Tanpa Watermark HD Gratis (MP4 & MP3)",
    heroHeading: "Download Video TikTok.",
    heroHighlight: "Tanpa Watermark.",
    description:
      "Unduh video TikTok tanpa watermark online gratis dalam resolusi HD MP4 atau ekstrak audio musik MP3 tanpa aplikasi tambahan.",
    keywords: [
      "download video tiktok",
      "tiktok downloader tanpa watermark",
      "snaptik",
      "ssstiktok",
      "unduh tiktok mp4",
      "download tiktok mp3",
      "tiktok no wm",
    ],
    mode: "media",
    platformName: "TikTok",
  },
  "download-video-youtube": {
    slug: "download-video-youtube",
    badge: "YouTube Downloader",
    title: "Download Video YouTube & Shorts HD 1080p / MP3 Gratis",
    heroHeading: "Download Video YouTube.",
    heroHighlight: "MP4 & MP3 HD.",
    description:
      "Download video YouTube, YouTube Shorts, dan convert audio MP3 320kbps tercepat tanpa batasan durasi di QUBIX.",
    keywords: [
      "download video youtube",
      "youtube downloader",
      "youtube mp3",
      "download youtube shorts",
      "y2mate alternatif",
      "youtube to mp4",
    ],
    mode: "media",
    platformName: "YouTube",
  },
  "download-instagram-reels": {
    slug: "download-instagram-reels",
    badge: "Instagram Downloader",
    title: "Download Video Instagram Reels, Foto & Story HD Gratis",
    heroHeading: "Download Instagram Reels.",
    heroHighlight: "Kualitas Asli HD.",
    description:
      "Simpan video Instagram Reels, Carousel foto, dan post IG kualitas tinggi langsung ke galeri ponsel atau laptop Anda.",
    keywords: [
      "download video instagram",
      "instagram reels downloader",
      "ig downloader",
      "unduh reels instagram",
      "download foto instagram",
    ],
    mode: "media",
    platformName: "Instagram",
  },
  "download-foto-profil-tiktok": {
    slug: "download-foto-profil-tiktok",
    badge: "TikTok PP Downloader",
    title: "Download Foto Profil TikTok (PP HD) 1080p — Full Size",
    heroHeading: "Download PP TikTok.",
    heroHighlight: "Full Size HD 1080p.",
    description:
      "Lihat dan download foto profil (avatar) akun TikTok siapapun dalam resolusi tinggi asli (HD 1080p) hanya dengan username.",
    keywords: [
      "download foto profil tiktok",
      "tiktok profile picture download",
      "pp tiktok hd",
      "zoom pp tiktok",
      "unduh pp tiktok full size",
    ],
    mode: "profile",
    platformName: "TikTok Profile",
  },
  "download-video-twitter": {
    slug: "download-video-twitter",
    badge: "Twitter / X Downloader",
    title: "Download Video Twitter / X MP4 HD & GIF Online",
    heroHeading: "Download Video Twitter / X.",
    heroHighlight: "Cepat & Gratis.",
    description:
      "Unduh video Twitter (X) dan animasi GIF kualitas HD 720p & 1080p secepat kilat tanpa ribet.",
    keywords: [
      "download video twitter",
      "twitter video downloader",
      "download video x",
      "unduh twitter mp4",
      "twitter gif download",
    ],
    mode: "media",
    platformName: "Twitter / X",
  },
  "download-video-facebook": {
    slug: "download-video-facebook",
    badge: "Facebook Downloader",
    title: "Download Video Facebook HD & FB Reels Gratis",
    heroHeading: "Download Video Facebook.",
    heroHighlight: "Reels & Watch HD.",
    description:
      "Download video Facebook publik, video Watch, dan Facebook Reels dalam kualitas resolusi tinggi HD 1080p.",
    keywords: [
      "download video facebook",
      "fb video downloader",
      "download fb reels",
      "unduh video fb",
      "facebook video to mp4",
    ],
    mode: "media",
    platformName: "Facebook",
  },
  "download-capcut-no-watermark": {
    slug: "download-capcut-no-watermark",
    badge: "CapCut Downloader",
    title: "Download Video CapCut Template Tanpa Watermark HD",
    heroHeading: "Download Template CapCut.",
    heroHighlight: "Tanpa Logo Ending.",
    description:
      "Unduh hasil video template CapCut tanpa logo watermark penutup dengan kualitas jernih dan audio jernih.",
    keywords: [
      "download capcut tanpa watermark",
      "capcut template downloader",
      "unduh video capcut",
      "capcut no watermark",
    ],
    mode: "media",
    platformName: "CapCut",
  },
  "download-lagu-soundcloud-mp3": {
    slug: "download-lagu-soundcloud-mp3",
    badge: "SoundCloud Downloader",
    title: "Download Lagu SoundCloud MP3 320kbps Online",
    heroHeading: "Download Lagu SoundCloud.",
    heroHighlight: "MP3 320kbps High-Quality.",
    description:
      "Unduh lagu dan musik dari SoundCloud ke format MP3 320kbps dengan cover album dan kualitas audio tinggi.",
    keywords: [
      "download lagu soundcloud",
      "soundcloud to mp3",
      "unduh lagu soundcloud mp3",
      "soundcloud downloader 320kbps",
    ],
    mode: "media",
    platformName: "SoundCloud",
  },
};
