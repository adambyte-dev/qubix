import { MediaResponse, SupportedPlatform } from "@/types";
import { formatMediaFilename } from "../utils";

const SOCIAL_UA = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";

/**
 * Pure 0-API Social Media Extractor (Instagram, Facebook, Twitter/X, Pinterest, Reddit, Threads).
 * Uses direct OpenGraph and server-side scraping without third-party APIs.
 */
export async function extractSocialMedia(url: string, platform: SupportedPlatform): Promise<MediaResponse> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": SOCIAL_UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const html = await res.text();

    const ogImage =
      html.match(/property="og:image"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:image"/i);
    const ogVideo =
      html.match(/property="og:video(?::secure_url)?"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:video(?::secure_url)?"/i);
    const ogTitle =
      html.match(/property="og:title"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:title"/i);
    const ogDesc =
      html.match(/property="og:description"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:description"/i);

    const title = ogTitle ? ogTitle[1].replace(/&amp;/g, "&").trim() : `${platform.toUpperCase()} Post`;
    const mediaThumb = ogImage ? ogImage[1].replace(/&amp;/g, "&") : undefined;
    const mediaVideo = ogVideo ? ogVideo[1].replace(/&amp;/g, "&") : undefined;

    const downloads = [];
    const videoFilename = formatMediaFilename(title, "video", "mp4");
    const imageFilename = formatMediaFilename(title, "image", "jpg");

    if (mediaVideo) {
      downloads.push({
        label: "Video Original (HD)",
        quality: "HD Stream",
        format: "mp4" as const,
        url: `/api/proxy?url=${encodeURIComponent(mediaVideo)}&name=${encodeURIComponent(videoFilename)}`,
      });
    }

    if (mediaThumb) {
      downloads.push({
        label: "Media / Cover Gambar (HD)",
        quality: "High Resolution",
        format: "jpg" as const,
        url: `/api/proxy?url=${encodeURIComponent(mediaThumb)}&name=${encodeURIComponent(imageFilename)}`,
      });
    }

    if (downloads.length === 0) {
      return {
        success: false,
        platform,
        title: "",
        downloads: [],
        error: `Konten ${platform} bersifat privat atau memerlukan otentikasi login.`,
      };
    }

    return {
      success: true,
      platform,
      title,
      author: {
        name: ogDesc ? ogDesc[1].slice(0, 30) : platform.toUpperCase(),
        username: platform,
        avatar: mediaThumb || "",
      },
      thumbnail: mediaThumb,
      downloads,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : `Gagal memproses link ${platform}.`;
    return {
      success: false,
      platform,
      title: "",
      downloads: [],
      error: message,
    };
  }
}
