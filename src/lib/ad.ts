export const DIRECT_AD_URL = "https://auctionr.org/4/00ee9b2da80dfd428b9527192dbafe4b";

export function triggerDirectAd() {
  if (typeof window === "undefined") return;
  try {
    window.open(DIRECT_AD_URL, "_blank", "noopener,noreferrer");
  } catch {
    // Graceful fallback if pop-up is blocked
  }
}
