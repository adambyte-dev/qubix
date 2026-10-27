import { NextRequest, NextResponse } from "next/server";
import { extractUniversalProfile, ProfilePlatform } from "@/lib/extractors/profile";

export async function POST(request: NextRequest) {
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
