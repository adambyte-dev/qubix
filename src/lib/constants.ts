import { SupportedPlatform } from "@/types";

export const ALLOWED_DOMAINS = [
  "tiktok.com",
  "vm.tiktok.com",
  "vt.tiktok.com",
  "youtube.com",
  "youtu.be",
  "music.youtube.com",
  "instagram.com",
  "facebook.com",
  "fb.watch",
  "twitter.com",
  "x.com",
  "threads.net",
  "pinterest.com",
  "pin.it",
  "capcut.com",
  "reddit.com",
  "v.redd.it",
  "soundcloud.com",
];

export interface PlatformMeta {
  id: SupportedPlatform;
  name: string;
  badge: string;
  tabColor: string; // Tailwind hex or class
  bgColor: string;
  description: string;
  countLabel: string;
}

export const PLATFORMS_SHOWCASE: PlatformMeta[] = [
  {
    id: "tiktok",
    name: "TikTok & PP HD",
    badge: "POPULAR",
    tabColor: "#FF4081",
    bgColor: "#FFF0F5",
    description: "Video No-WM, Sound MP3, Slide Foto, & Foto Profil HD",
    countLabel: "6 formats",
  },
  {
    id: "youtube",
    name: "YouTube & Shorts",
    badge: "4K / MP3",
    tabColor: "#FF0000",
    bgColor: "#FFF5F5",
    description: "MP4 1080p/4K, Shorts vertical, Audio MP3 & Thumbnail",
    countLabel: "5 formats",
  },
  {
    id: "instagram",
    name: "Instagram",
    badge: "HD",
    tabColor: "#A855F7",
    bgColor: "#FAF5FF",
    description: "Reels, Post Foto/Video, Story & Carousel multi-slide",
    countLabel: "4 formats",
  },
  {
    id: "facebook",
    name: "Facebook",
    badge: "REELS",
    tabColor: "#3B82F6",
    bgColor: "#EFF6FF",
    description: "Video Publik HD/SD, Facebook Watch, dan FB Reels",
    countLabel: "3 formats",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    badge: "ORIG",
    tabColor: "#000000",
    bgColor: "#F4F4F5",
    description: "Video MP4 Bitrate tinggi, Animasi GIF, dan Foto HD",
    countLabel: "3 formats",
  },
  {
    id: "pinterest",
    name: "Pinterest & Lainnya",
    badge: "EXPANDED",
    tabColor: "#10B981",
    bgColor: "#ECFDF5",
    description: "Pin Video, Gambar Original, CapCut, Reddit, & Threads",
    countLabel: "Multi",
  },
];

export function detectPlatform(input: string): SupportedPlatform {
  const clean = input.trim().toLowerCase();
  if (clean.includes("tiktok.com") || clean.includes("vt.tiktok") || clean.includes("vm.tiktok")) return "tiktok";
  if (clean.includes("youtube.com") || clean.includes("youtu.be")) return "youtube";
  if (clean.includes("instagram.com")) return "instagram";
  if (clean.includes("facebook.com") || clean.includes("fb.watch")) return "facebook";
  if (clean.includes("twitter.com") || clean.includes("x.com")) return "twitter";
  if (clean.includes("threads.net")) return "threads";
  if (clean.includes("pinterest.com") || clean.includes("pin.it")) return "pinterest";
  if (clean.includes("capcut.com")) return "capcut";
  if (clean.includes("reddit.com") || clean.includes("v.redd.it")) return "reddit";
  if (clean.includes("soundcloud.com")) return "soundcloud";
  return "unknown";
}
