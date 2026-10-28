export const DIRECT_AD_URL = "https://auctionr.org/4/00ee9b2da80dfd428b9527192dbafe4b";

let lastPlayAdTime = 0;

/**
 * ponytail: trigger ad only on video play, rate-limited to once every 5 minutes; upgrade if ad network requires impression-based capping
 */
export function triggerPlayAd() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (lastPlayAdTime !== 0 && now - lastPlayAdTime < 5 * 60 * 1000) return;
  lastPlayAdTime = now;
  try {
    window.open(DIRECT_AD_URL, "_blank", "noopener,noreferrer");
  } catch {
    // Graceful fallback if pop-up is blocked
  }
}

// Deprecated alias kept for backwards compatibility (no-op unless play triggered)
export function triggerDirectAd() {
  // no-op to prevent excessive click ads
}
