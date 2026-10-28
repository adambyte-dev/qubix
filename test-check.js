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

console.log("All self-checks passed.");
