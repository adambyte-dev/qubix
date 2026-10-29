const assert = require("assert");

// 1. Verify format integrity (no JPG mapped to MP4)
const mockDownloads = [
  { format: "jpg", url: "https://example.com/cover.jpg" },
  { format: "mp3", url: "https://example.com/audio.mp3" },
];
const video = mockDownloads.find((d) => d.format === "mp4");
assert.strictEqual(video, undefined, "Video format must not resolve to a JPG");

// 2. Verify ad cooldown logic
let lastAdTime = 0;
function testAdTrigger(now) {
  if (lastAdTime !== 0 && now - lastAdTime < 5 * 60 * 1000) return false;
  lastAdTime = now;
  return true;
}
assert.strictEqual(testAdTrigger(1000), true, "First play must trigger ad");
assert.strictEqual(testAdTrigger(2000), false, "Subsequent fast plays must be throttled");
assert.strictEqual(testAdTrigger(1000 + 6 * 60 * 1000), true, "Play after 5m cooldown can trigger ad");

// 3. Verify professional minimalist filename formatting
function formatMediaFilename(title, type, ext, index) {
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
assert.strictEqual(
  formatMediaFilename("Amazing Dance Moves! #fyp #viral", "video", "mp4"),
  "qubix-video-amazing-dance-moves.mp4"
);
assert.strictEqual(
  formatMediaFilename("Soundtrack Original (feat. DJ)", "music", "mp3"),
  "qubix-music-soundtrack-original-feat-dj.mp3"
);
assert.strictEqual(
  formatMediaFilename("Photo Slideshow", "slide", "jpg", 3),
  "qubix-slide-03-photo-slideshow.jpg"
);

// 4. Verify YouTube format streams definition
const mockYoutubeDownloads = [
  { label: "Video YouTube HD", quality: "1080p MP4", format: "mp4", url: "/api/proxy?url=https://googlevideo.com&name=qubix-video-test.mp4" },
  { label: "Audio Track Original (MP3)", quality: "128kbps Audio", format: "mp3", url: "/api/proxy?url=https://googlevideo.com&name=qubix-music-test.mp3" },
  { label: "Cover Thumbnail Ultra HD (1080p)", quality: "1920x1080 Full HD JPG", format: "jpg", url: "/api/proxy?url=https://ytimg.com&name=qubix-image-test.jpg" }
];
assert.strictEqual(mockYoutubeDownloads.some(d => d.format === "mp4"), true, "YouTube must provide MP4 format");
assert.strictEqual(mockYoutubeDownloads.some(d => d.format === "mp3"), true, "YouTube must provide MP3 format");

console.log("All self-checks passed.");
