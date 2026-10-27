import { NextRequest, NextResponse } from "next/server";
import { extractUniversalProfile, ProfilePlatform } from "@/lib/extractors/profile";
import { verifyAntiScraper } from "@/lib/antiScraper";

export async function POST(request: NextRequest) {
  // Anti-scraper & Rate limiter check
  const blocked = verifyAntiScraper(request, { maxReqPerMinute: 30, isApi: true });
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const username = body.username || body.url;
    const platform = (body.platform as ProfilePlatform) || "auto";

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { success: false, error: "Username atau link profil wajib diisi." },
        { status: 400 }
      );
    }

    const result = await extractUniversalProfile(username, platform);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Format request tidak valid." },
      { status: 400 }
    );
  }
}
