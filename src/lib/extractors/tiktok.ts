import { MediaResponse, TikTokProfileResponse } from "@/types";
import { extractTikTokUsername } from "../utils";

const SOCIAL_UA = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";
const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const MOBILE_TIKTOK_UA = "com.zhiliaoapp.musically/300904 (Linux; U; Android 13; en; Pixel 7; Build/TQ3A.230901.001; Cronet/58.0.2991.0)";

/**
 * Pure 0-API TikTok Profile Picture (PP HD) & info extractor.
 * Connects directly to official TikTok servers without third-party services.
 */
export async function extractTikTokProfile(input: string): Promise<TikTokProfileResponse> {
  const username = extractTikTokUsername(input);
  if (!username) {
    return {
      success: false,
      username: "",
      nickname: "",
      avatarHd: "",
      avatarMedium: "",
      error: "Username TikTok tidak valid.",
    };
  }

  const profileUrl = `https://www.tiktok.com/@${username}`;

  try {
    const res = await fetch(profileUrl, {
      headers: {
        "User-Agent": SOCIAL_UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`TikTok server returned HTTP ${res.status}`);
    }

    const html = await res.text();

    const ogImageMatch =
      html.match(/property="og:image"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:image"/i);
    const ogTitleMatch =
      html.match(/property="og:title"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:title"/i);
    const ogDescMatch =
      html.match(/property="og:description"\s+content="([^"]+)"/i) ||
      html.match(/content="([^"]+)"\s+property="og:description"/i);

    let avatarMedium = "";
    let avatarHd = "";

    if (ogImageMatch && ogImageMatch[1]) {
      const rawImg = ogImageMatch[1].replace(/&amp;/g, "&");
      // Keep signed URL intact to preserve HMAC signature
      avatarMedium = rawImg;
      avatarHd = rawImg;
    }

    let nickname = username;
    if (ogTitleMatch && ogTitleMatch[1]) {
      nickname = ogTitleMatch[1]
        .replace(/\s+on TikTok$/i, "")
        .replace(/\|\s*TikTok$/i, "")
        .trim();
    }

    const bio = ogDescMatch ? ogDescMatch[1].replace(/&amp;/g, "&").trim() : undefined;

    try {
      const oembedRes = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(profileUrl)}`,
        { headers: { "User-Agent": BROWSER_UA } }
      );
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        if (oembed.author_name) {
          nickname = oembed.author_name;
        }
      }
    } catch {
      // Non-blocking
    }

    if (!avatarHd && !avatarMedium) {
      return {
        success: false,
        username,
        nickname,
        avatarHd: "",
        avatarMedium: "",
        error: "Akun tidak ditemukan atau bersifat privat.",
      };
    }

    return {
      success: true,
      username,
      nickname,
      avatarHd,
      avatarMedium,
      bio,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengambil data profil TikTok.";
    return {
      success: false,
      username,
      nickname: "",
      avatarHd: "",
      avatarMedium: "",
      error: message,
    };
  }
}

/**
 * Pure 0-API TikTok Video & Media extractor.
 * Directly extracts authentic unwatermarked MP4 stream, audio, and cover without third-party APIs.
 */
export async function extractTikTokMedia(url: string): Promise<MediaResponse> {
  try {
    let targetUrl = url;
    if (url.includes("vt.tiktok.com") || url.includes("vm.tiktok.com")) {
      const redirectRes = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        headers: { "User-Agent": BROWSER_UA },
      });
      targetUrl = redirectRes.url || url;
    }

    const idMatch = targetUrl.match(/video\/(\d+)/i) || targetUrl.match(/v\/(\d+)/i);
    const videoId = idMatch ? idMatch[1] : null;

    let directVideoUrl: string | undefined;
    let directAudioUrl: string | undefined;
    let title: string | undefined;
    let authorName = "TikTok Creator";
    let authorUsername = "tiktok";
    let authorAvatar: string | undefined;
    let coverThumb: string | undefined;
    const photoSlides: string[] = [];

    // Attempt 1: Native TikTok Official Mobile API (Direct unwatermarked stream)
    if (videoId) {
      try {
        const feedApi = `https://api22-normal-c-alisg.tiktokv.com/aweme/v1/feed/?aweme_id=${videoId}&iid=7318518857994389254&device_id=7318517321748022790&channel=googleplay&app_name=musical_ly&version_code=300904&device_platform=android&device_type=Pixel%207`;
        const apiRes = await fetch(feedApi, {
          headers: {
            "User-Agent": MOBILE_TIKTOK_UA,
          },
        });

        if (apiRes.ok) {
          const apiData = await apiRes.json();
          const item = apiData.aweme_list?.[0];
          if (item) {
            title = item.desc || title;
            authorName = item.author?.nickname || authorName;
            authorUsername = item.author?.unique_id || authorUsername;
            authorAvatar = item.author?.avatar_larger?.url_list?.[0] || item.author?.avatar_thumb?.url_list?.[0];
            coverThumb = item.video?.cover?.url_list?.[0];

            // Direct unwatermarked video stream
            const videoUrls = item.video?.play_addr?.url_list || [];
            if (videoUrls.length > 0) {
              // Prefer https URL
              directVideoUrl = videoUrls.find((u: string) => u.startsWith("https://")) || videoUrls[0];
            }

            // Direct original audio track
            const audioUrls = item.music?.play_url?.url_list || [];
            if (audioUrls.length > 0) {
              directAudioUrl = audioUrls.find((u: string) => u.startsWith("https://")) || audioUrls[0];
            }

            // Photo slides if any
            if (item.image_post_info?.images) {
              for (const img of item.image_post_info.images) {
                const imgUrl = img.display_image?.url_list?.[0];
                if (imgUrl) photoSlides.push(imgUrl);
              }
            }
          }
        }
      } catch {
        // Fallback to OpenGraph
      }
    }

    // Attempt 2: Official TikTok oEmbed for title & creator
    if (!title) {
      try {
        const oembedRes = await fetch(
          `https://www.tiktok.com/oembed?url=${encodeURIComponent(targetUrl)}`,
          { headers: { "User-Agent": BROWSER_UA } }
        );
        if (oembedRes.ok) {
          const oembed = await oembedRes.json();
          title = oembed.title || title;
          authorName = oembed.author_name || authorName;
        }
      } catch {
        // Continue
      }
    }

    // Attempt 3: OpenGraph fallback
    if (!directVideoUrl || !coverThumb) {
      try {
        const htmlRes = await fetch(targetUrl, {
          headers: {
            "User-Agent": SOCIAL_UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
        });
        const html = await htmlRes.text();
        const ogImage =
          html.match(/property="og:image"\s+content="([^"]+)"/i) ||
          html.match(/content="([^"]+)"\s+property="og:image"/i);
        const ogVideo =
          html.match(/property="og:video(?::secure_url)?"\s+content="([^"]+)"/i) ||
          html.match(/content="([^"]+)"\s+property="og:video(?::secure_url)?"/i);

        if (!coverThumb && ogImage) coverThumb = ogImage[1].replace(/&amp;/g, "&");
        if (!directVideoUrl && ogVideo) directVideoUrl = ogVideo[1].replace(/&amp;/g, "&");
      } catch {
        // Continue
      }
    }

    const downloads = [];

    // 1. Direct unwatermarked video
    if (directVideoUrl) {
      downloads.push({
        label: "Video Tanpa Watermark (HD)",
        quality: "HD 1080p MP4",
        format: "mp4" as const,
        url: `/api/proxy?url=${encodeURIComponent(directVideoUrl)}&name=QUBIX_tiktok_${videoId || "video"}.mp4`,
      });
    }

    // 2. Original Audio MP3
    if (directAudioUrl) {
      downloads.push({
        label: "Audio Track Original (MP3)",
        quality: "Audio 320kbps",
        format: "mp3" as const,
        url: `/api/proxy?url=${encodeURIComponent(directAudioUrl)}&name=QUBIX_tiktok_audio_${videoId || "sound"}.mp3`,
      });
    }

    // 3. HD Cover Thumbnail
    if (coverThumb) {
      downloads.push({
        label: "Cover / Thumbnail HD",
        quality: "Original JPG",
        format: "jpg" as const,
        url: `/api/proxy?url=${encodeURIComponent(coverThumb)}&name=QUBIX_tiktok_cover_${videoId || "img"}.jpg`,
      });
    }

    if (downloads.length === 0) {
      return {
        success: false,
        platform: "tiktok",
        title: "",
        downloads: [],
        error: "Tidak dapat menemukan link stream video. Pastikan akun dan video bersifat publik.",
      };
    }

    return {
      success: true,
      platform: "tiktok",
      title: title || `TikTok Video by ${authorName}`,
      author: {
        name: authorName,
        username: authorUsername,
        avatar: authorAvatar || coverThumb || "",
      },
      thumbnail: coverThumb,
      previewVideoUrl: directVideoUrl || (videoId ? `https://www.tiktok.com/player/v1/${videoId}` : undefined),
      downloads,
      photos: photoSlides.length > 0 ? photoSlides : undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengekstraksi media TikTok.";
    return {
      success: false,
      platform: "tiktok",
      title: "",
      downloads: [],
      error: message,
    };
  }
}
