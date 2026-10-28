import { NextRequest, NextResponse } from "next/server";
import { verifyAntiScraper } from "@/lib/antiScraper";

export async function GET(request: NextRequest) {
  // Anti-scraper & Rate limiter check
  const blocked = verifyAntiScraper(request, { maxReqPerMinute: 60, isApi: false });
  if (blocked) return blocked;

  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");
  const filename = searchParams.get("name") || "download";

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);

    // SSRF protection
    if (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname.startsWith("192.168.") ||
      parsed.hostname.startsWith("10.") ||
      parsed.hostname.startsWith("172.16.")
    ) {
      return NextResponse.json({ error: "Forbidden network target" }, { status: 403 });
    }

    // Whitelist CDN domain to prevent open proxy / SSRF abuse
    const ALLOWED_CDN = /tiktok|byte|tikwm|instagram|fbcdn|twimg|twitter|x\.com|youtube|googlevideo|ytimg|pinterest|pinimg|reddit|redd\.it|threads|capcut|sndcdn|soundcloud/i;
    if (!ALLOWED_CDN.test(parsed.hostname)) {
      return NextResponse.json({ error: "Domain target tidak diizinkan." }, { status: 403 });
    }

    // Set appropriate referer based on target CDN
    let referer = "";
    if (parsed.hostname.includes("tiktok") || parsed.hostname.includes("byteicdn") || parsed.hostname.includes("ibytedtos")) {
      referer = "https://www.tiktok.com/";
    } else if (parsed.hostname.includes("tikwm")) {
      referer = "https://www.tikwm.com/";
    } else if (parsed.hostname.includes("youtube") || parsed.hostname.includes("ytimg") || parsed.hostname.includes("googlevideo")) {
      referer = "https://www.youtube.com/";
    } else if (parsed.hostname.includes("instagram") || parsed.hostname.includes("cdninstagram")) {
      referer = "https://www.instagram.com/";
    } else if (parsed.hostname.includes("twitter") || parsed.hostname.includes("twimg") || parsed.hostname.includes("x.com")) {
      referer = "https://twitter.com/";
    }

    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "Accept-Encoding": "identity",
    };

    if (referer) {
      headers["Referer"] = referer;
    }

    const upstreamRes = await fetch(targetUrl, {
      headers,
      redirect: "follow",
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: `Upstream CDN returned status ${upstreamRes.status}` },
        { status: upstreamRes.status }
      );
    }

    const contentType = upstreamRes.headers.get("content-type") || "application/octet-stream";
    const contentLength = upstreamRes.headers.get("content-length");

    // Don't download HTML pages if expected media
    if (contentType.includes("text/html") && (filename.endsWith(".mp4") || filename.endsWith(".mp3") || filename.endsWith(".jpg"))) {
      return NextResponse.json(
        { error: "Target URL adalah halaman web, bukan berkas media langsung." },
        { status: 422 }
      );
    }

    // ponytail: stream upstreamRes.body directly to avoid buffering big files in server RAM; upgrade to chunked transformer if on-the-fly transcoding needed
    let cleanName = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
    if (!cleanName.toLowerCase().startsWith("qubix")) {
      cleanName = `QUBIX_${cleanName}`;
    }
    const safeFilename = cleanName;

    const resHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeFilename}"`,
      "Cache-Control": "public, max-age=86400",
    };

    if (contentLength) {
      resHeaders["Content-Length"] = contentLength;
    }

    return new NextResponse(upstreamRes.body, {
      status: 200,
      headers: resHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy download error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
