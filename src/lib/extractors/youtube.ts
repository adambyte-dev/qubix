import { MediaResponse, DownloadOption } from "@/types";
import { formatMediaFilename } from "../utils";
import { Ytdl } from "@distube/ytdl-core";

const ytdl = new Ytdl();

export function extractYouTubeId(url: string): string | null {
  const clean = url.trim();
  const match =
    clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  return match ? match[1] : null;
}

/**
 * ponytail: extract YouTube video & audio streams using ytdl-core; upgrade with pool proxies if YouTube throttles server IP
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
    let title = "YouTube Video";
    let authorName = "YouTube Creator";
    let directVideoUrl: string | undefined;
    let directVideoQuality = "HD 1080p MP4";
    let directAudioUrl: string | undefined;
    let directAudioQuality = "Audio 320kbps MP3";

    // Attempt 1: Direct stream extraction via Ytdl
    try {
      const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
      if (info?.videoDetails) {
        title = info.videoDetails.title || title;
        authorName = info.videoDetails.author?.name || authorName;
      }

      const formats = info?.formats || [];

      // 1. Prioritize MP4 video stream
      const bestVideo =
        formats.find((f) => f.hasVideo && f.container === "mp4" && f.hasAudio) ||
        formats.find((f) => f.hasVideo && f.container === "mp4") ||
        formats.find((f) => f.hasVideo);

      if (bestVideo?.url) {
        directVideoUrl = bestVideo.url;
        directVideoQuality = `${bestVideo.qualityLabel || "HD"} MP4`;
      }

      // 2. High quality audio stream
      const bestAudio =
        formats.find((f) => !f.hasVideo && f.hasAudio && f.container === "mp4") ||
        formats.find((f) => !f.hasVideo && f.hasAudio);

      if (bestAudio?.url) {
        directAudioUrl = bestAudio.url;
        directAudioQuality = `${bestAudio.audioBitrate || 128}kbps Audio`;
      }
    } catch {
      // Non-blocking fallback to oEmbed if ytdl is challenged
    }

    // Attempt 2: Fallback to oEmbed for title & metadata if missing
    if (title === "YouTube Video") {
      try {
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const oembedRes = await fetch(oembedUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          next: { revalidate: 3600 },
        });

        if (oembedRes.ok) {
          const data = await oembedRes.json();
          title = data.title || title;
          authorName = data.author_name || authorName;
        }
      } catch {
        // Continue
      }
    }

    const maxResThumb = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    const hqThumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    const videoName = formatMediaFilename(title, "video", "mp4");
    const audioName = formatMediaFilename(title, "music", "mp3");
    const thumbFhd = formatMediaFilename(`${title}-1080p`, "image", "jpg");
    const thumbHq = formatMediaFilename(`${title}-hq`, "image", "jpg");

    const downloads: DownloadOption[] = [];

    // 1. Video MP4 Stream
    if (directVideoUrl) {
      downloads.push({
        label: "Video YouTube HD",
        quality: directVideoQuality,
        format: "mp4",
        url: `/api/proxy?url=${encodeURIComponent(directVideoUrl)}&name=${encodeURIComponent(videoName)}`,
      });
    }

    // 2. Audio Track MP3 / M4A
    if (directAudioUrl) {
      downloads.push({
        label: "Audio Track Original (MP3)",
        quality: directAudioQuality,
        format: "mp3",
        url: `/api/proxy?url=${encodeURIComponent(directAudioUrl)}&name=${encodeURIComponent(audioName)}`,
      });
    }

    // 3. Cover Thumbnails
    downloads.push(
      {
        label: "Cover Thumbnail Ultra HD (1080p)",
        quality: "1920x1080 Full HD JPG",
        format: "jpg",
        url: `/api/proxy?url=${encodeURIComponent(maxResThumb)}&name=${encodeURIComponent(thumbFhd)}`,
      },
      {
        label: "Cover Thumbnail High Quality",
        quality: "640x480 HQ JPG",
        format: "jpg",
        url: `/api/proxy?url=${encodeURIComponent(hqThumb)}&name=${encodeURIComponent(thumbHq)}`,
      }
    );

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
      previewVideoUrl: directVideoUrl || `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
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
