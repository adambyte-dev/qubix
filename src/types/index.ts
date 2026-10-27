export type SupportedPlatform =
  | "tiktok"
  | "youtube"
  | "instagram"
  | "facebook"
  | "twitter"
  | "threads"
  | "pinterest"
  | "capcut"
  | "reddit"
  | "soundcloud"
  | "unknown";

export interface DownloadOption {
  label: string;
  quality?: string;
  format: "mp4" | "mp3" | "jpg" | "png" | "webp" | "zip";
  url: string;
  size?: string;
}

export interface AuthorInfo {
  name: string;
  username: string;
  avatar: string;
}

export interface MediaResponse {
  success: boolean;
  platform: SupportedPlatform;
  title: string;
  author?: AuthorInfo;
  thumbnail?: string;
  duration?: string;
  previewVideoUrl?: string;
  previewAudioUrl?: string;
  downloads: DownloadOption[];
  photos?: string[];
  error?: string;
}

export interface TikTokProfileResponse {
  success: boolean;
  username: string;
  nickname: string;
  avatarHd: string;
  avatarMedium: string;
  bio?: string;
  verified?: boolean;
  stats?: {
    followers: number;
    following: number;
    likes: number;
    videos?: number;
  };
  error?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  platform: SupportedPlatform | "profile";
  thumbnail?: string;
  url: string;
  timestamp: number;
}
