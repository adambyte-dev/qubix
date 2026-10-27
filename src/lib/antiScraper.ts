import { NextRequest, NextResponse } from "next/server";

// Known automated scrapers, crawling engines, and CLI tools
const BLOCKED_USER_AGENTS = [
  /python-requests/i,
  /aiohttp/i,
  /scrapy/i,
  /curl\//i,
  /wget/i,
  /go-http-client/i,
  /java\//i,
  /urllib/i,
  /postman/i,
  /insomnia/i,
  /httpie/i,
  /headlesschrome/i,
  /phantomjs/i,
  /puppeteer/i,
  /playwright/i,
  /libwww-perl/i,
  /mechanize/i,
];

// Sliding window in-memory rate limiter: IP -> { count, resetAt }
interface RateRecord {
  count: number;
  resetAt: number;
}
const ipRateMap = new Map<string, RateRecord>();

// Clean up stale IP records every 5 minutes to prevent memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipRateMap.entries()) {
      if (now > record.resetAt) {
        ipRateMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Validates request against scraper bots and rate limits.
 * Returns null if allowed, or NextResponse if blocked.
 */
export function verifyAntiScraper(
  req: NextRequest,
  options: { maxReqPerMinute?: number; isApi?: boolean } = {}
): NextResponse | null {
  const maxReq = options.maxReqPerMinute || 30;
  const userAgent = req.headers.get("user-agent") || "";

  // 1. Block empty or suspiciously short User-Agent
  if (!userAgent || userAgent.trim().length < 8) {
    return NextResponse.json(
      { error: "Access denied: Missing or invalid User-Agent." },
      { status: 403 }
    );
  }

  // 2. Block known automated scraping engines & CLI tools
  for (const pattern of BLOCKED_USER_AGENTS) {
    if (pattern.test(userAgent)) {
      return NextResponse.json(
        { error: "Access denied: Automated scraper bot detected." },
        { status: 403 }
      );
    }
  }

  // 3. Hotlink / Cross-Site API Stealing Protection (for POST API endpoints)
  if (options.isApi && req.method === "POST") {
    const secFetchSite = req.headers.get("sec-fetch-site");
    if (secFetchSite === "cross-site") {
      return NextResponse.json(
        { error: "Access denied: Cross-site API usage is forbidden." },
        { status: 403 }
      );
    }
  }

  // 4. In-Memory Sliding Window Rate Limiting per IP
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const clientIp = (forwardedFor ? forwardedFor.split(",")[0] : realIp || "127.0.0.1").trim();

  const now = Date.now();
  const record = ipRateMap.get(clientIp);

  if (!record || now > record.resetAt) {
    ipRateMap.set(clientIp, {
      count: 1,
      resetAt: now + 60 * 1000,
    });
  } else {
    record.count += 1;
    if (record.count > maxReq) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan (Rate limit exceeded). Silakan tunggu sebentar.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }
  }

  return null;
}
