import { NextRequest, NextResponse } from "next/server";
import { detectPlatform } from "@/lib/constants";
import { sanitizeUrl } from "@/lib/utils";
import { verifyAntiScraper } from "@/lib/antiScraper";
import { extractTikTokMedia } from "@/lib/extractors/tiktok";
import { extractYouTubeMedia } from "@/lib/extractors/youtube";
import { extractSocialMedia } from "@/lib/extractors/social";

export async function POST(request: NextRequest) {
  // Anti-scraper & Rate limiter check
  const blocked = verifyAntiScraper(request, { maxReqPerMinute: 30, isApi: true });
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const rawUrl = body.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "URL media wajib disertakan." },
        { status: 400 }
      );
    }

    const cleanUrl = sanitizeUrl(rawUrl);
    const platform = detectPlatform(cleanUrl);

    let result;

    switch (platform) {
      case "tiktok":
        result = await extractTikTokMedia(cleanUrl);
        break;
      case "youtube":
        result = await extractYouTubeMedia(cleanUrl);
        break;
      case "instagram":
      case "facebook":
      case "twitter":
      case "threads":
      case "pinterest":
      case "reddit":
      case "capcut":
      case "soundcloud":
        result = await extractSocialMedia(cleanUrl, platform);
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error:
              "Platform tidak didukung atau URL tidak dikenali. Masukkan link TikTok, YouTube, Instagram, Facebook, atau Twitter.",
          },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
