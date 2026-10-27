import { TikTokProfileResponse } from "@/types";
import { extractTikTokProfile } from "./tiktok";

const SOCIAL_UA = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";

export type ProfilePlatform = "tiktok" | "instagram" | "twitter" | "auto";

export function detectProfilePlatform(input: string): ProfilePlatform {
  const clean = input.trim().toLowerCase();
  if (clean.includes("instagram.com") || clean.startsWith("ig:") || clean.startsWith("instagram:")) {
    return "instagram";
  }
  if (clean.includes("twitter.com") || clean.includes("x.com") || clean.startsWith("twitter:") || clean.startsWith("x:")) {
    return "twitter";
  }
  return "tiktok";
}

export function cleanUsername(input: string): string {
  let clean = input.trim();
  clean = clean.replace(/^(ig:|instagram:|twitter:|x:|tiktok:)/i, "");
  if (clean.includes("/")) {
    const parts = clean.split("/").filter(Boolean);
    clean = parts[parts.length - 1];
  }
  return clean.replace(/^@/, "").split("?")[0];
}

/**
 * Pure 0-API Instagram Profile Picture (PP HD) & Info extractor.
 */
export async function extractInstagramProfile(rawInput: string): Promise<TikTokProfileResponse> {
  const username = cleanUsername(rawInput);
  if (!username) {
    return {
      success: false,
      username: "",
      nickname: "",
      avatarHd: "",
      avatarMedium: "",
      error: "Username Instagram tidak valid.",
    };
  }

  const profileUrl = `https://www.instagram.com/${username}/`;

  try {
    const res = await fetch(profileUrl, {
      headers: {
        "User-Agent": SOCIAL_UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Instagram server returned status ${res.status}`);
    }

    const html = await res.text();

    const ogImageMatch =
      html.match(/property="og:image"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:image"/i);
    const ogTitleMatch =
      html.match(/property="og:title"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:title"/i);
    const ogDescMatch =
      html.match(/property="og:description"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:description"/i);

    if (!ogImageMatch || !ogImageMatch[1]) {
      return {
        success: false,
        username,
        nickname: username,
        avatarHd: "",
        avatarMedium: "",
        error: "Akun Instagram tidak ditemukan atau profil disetel privat.",
      };
    }

    const rawImg = ogImageMatch[1].replace(/&amp;/g, "&");
    const avatarMedium = rawImg;
    // Upgrade crop to 1080x1080
    const avatarHd = rawImg.replace(/_s100x100_/g, "_s1080x1080_").replace(/_s150x150_/g, "_s1080x1080_");

    let nickname = username;
    if (ogTitleMatch && ogTitleMatch[1]) {
      nickname = ogTitleMatch[1].split("(@")[0].replace(/&#064;/g, "@").trim();
    }

    const bio = ogDescMatch ? ogDescMatch[1].replace(/&amp;/g, "&").trim() : undefined;

    return {
      success: true,
      username,
      nickname: nickname || username,
      avatarHd,
      avatarMedium,
      bio,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengambil foto profil Instagram.";
    return {
      success: false,
      username,
      nickname: "",
      avatarHd: "",
      avatarMedium: "",
      error: message,
    };
  }
}

/**
 * Pure 0-API Twitter / X Profile Picture extractor.
 */
export async function extractTwitterProfile(rawInput: string): Promise<TikTokProfileResponse> {
  const username = cleanUsername(rawInput);
  if (!username) {
    return {
      success: false,
      username: "",
      nickname: "",
      avatarHd: "",
      avatarMedium: "",
      error: "Username Twitter / X tidak valid.",
    };
  }

  const profileUrl = `https://twitter.com/${username}`;

  try {
    const res = await fetch(profileUrl, {
      headers: {
        "User-Agent": SOCIAL_UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      next: { revalidate: 300 },
    });

    const html = await res.text();

    const ogImageMatch =
      html.match(/property="og:image"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:image"/i);
    const ogTitleMatch =
      html.match(/property="og:title"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:title"/i);
    const ogDescMatch =
      html.match(/property="og:description"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:description"/i);

    if (!ogImageMatch || !ogImageMatch[1]) {
      return {
        success: false,
        username,
        nickname: username,
        avatarHd: "",
        avatarMedium: "",
        error: "Akun Twitter/X tidak ditemukan.",
      };
    }

    const rawImg = ogImageMatch[1].replace(/&amp;/g, "&");
    const avatarMedium = rawImg;
    // Upgrade _normal. to _400x400.
    const avatarHd = rawImg.replace(/_normal\.(jpg|jpeg|png)$/i, "_400x400.$1");

    let nickname = username;
    if (ogTitleMatch && ogTitleMatch[1]) {
      nickname = ogTitleMatch[1].replace(/\s+\(@[^\)]+\)\s+on X$/i, "").trim();
    }

    return {
      success: true,
      username,
      nickname: nickname || username,
      avatarHd,
      avatarMedium,
      bio: ogDescMatch ? ogDescMatch[1].trim() : undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengambil foto profil Twitter/X.";
    return {
      success: false,
      username,
      nickname: "",
      avatarHd: "",
      avatarMedium: "",
      error: message,
    };
  }
}

/**
 * Unified Profile Extractor (TikTok, Instagram, Twitter/X).
 */
export async function extractUniversalProfile(
  input: string,
  preferredPlatform: ProfilePlatform = "auto"
): Promise<TikTokProfileResponse> {
  const platform = preferredPlatform === "auto" ? detectProfilePlatform(input) : preferredPlatform;

  if (platform === "instagram") {
    return extractInstagramProfile(input);
  }
  if (platform === "twitter") {
    return extractTwitterProfile(input);
  }
  return extractTikTokProfile(input);
}
