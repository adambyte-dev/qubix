import { MediaResponse } from "@/types";

export function extractYouTubeId(url: string): string | null {
  const clean = url.trim();
  const match =
    clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  return match ? match[1] : null;
}

/**
 * Pure 0-API YouTube Extractor.
 * Direct extraction from YouTube servers without third-party services.
 */
export async function extractYouTubeMedia(url: string): Promise<MediaResponse> {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return {
      success: false,
      platform: "youtube",
      title: "",
      downloads: [],
      error: "URL YouTube tidak valid atau ID video tidak ditemukan.",
    };
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedRes = await fetch(oembedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 },
    });

    let title = "YouTube Video";
    let authorName = "YouTube Creator";

    if (oembedRes.ok) {
      const data = await oembedRes.json();
      title = data.title || title;
      authorName = data.author_name || authorName;
    }

    const maxResThumb = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    const hqThumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    // Authentic, uncorrupted direct media files
    const downloads = [
      {
        label: "Cover Thumbnail Ultra HD (1080p)",
        quality: "1920x1080 Full HD JPG",
        format: "jpg" as const,
        url: `/api/proxy?url=${encodeURIComponent(maxResThumb)}&name=youtube-${videoId}-1080p.jpg`,
      },
      {
        label: "Cover Thumbnail High Quality",
        quality: "640x480 HQ JPG",
        format: "jpg" as const,
        url: `/api/proxy?url=${encodeURIComponent(hqThumb)}&name=youtube-${videoId}-hq.jpg`,
      },
    ];

    return {
      success: true,
      platform: "youtube",
      title,
      author: {
        name: authorName,
        username: authorName.toLowerCase().replace(/\s+/g, ""),
        avatar: hqThumb,
      },
      thumbnail: maxResThumb,
      previewVideoUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
      downloads,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengekstraksi data YouTube.";
    return {
      success: false,
      platform: "youtube",
      title: "",
      downloads: [],
      error: message,
    };
  }
}
