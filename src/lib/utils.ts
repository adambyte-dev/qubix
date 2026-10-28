export function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return "0";
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

export function formatBytes(bytes: number | undefined): string {
  if (!bytes || bytes <= 0) return "Unknown";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export function sanitizeUrl(input: string): string {
  let url = input.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

export function extractTikTokUsername(input: string): string {
  const clean = input.trim();
  // If @username
  if (clean.startsWith("@")) {
    return clean.slice(1).split(/[/?#]/)[0];
  }
  // If URL like https://www.tiktok.com/@username
  const match = clean.match(/tiktok\.com\/@([a-zA-Z0-9_.-]+)/i);
  if (match) {
    return match[1];
  }
  // Otherwise clean string
  return clean.replace(/[^a-zA-Z0-9_.-]/g, "");
}

/**
 * ponytail: sanitize filename to clean alphanumeric slug; upgrade with international transliteration if non-Latin scripts needed
 */
export function formatMediaFilename(
  title: string | undefined,
  type: "video" | "music" | "image" | "slide" | "profile" | "clip" | "frame",
  ext: string,
  index?: number
): string {
  const cleanTitle = (title || "")
    .toLowerCase()
    .replace(/[#@][\w-]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 35)
    .replace(/-+$/, "");

  const slug = cleanTitle || "media";
  const indexPrefix = typeof index === "number" ? `-${String(index).padStart(2, "0")}` : "";
  return `qubix-${type}${indexPrefix}-${slug}.${ext}`;
}
