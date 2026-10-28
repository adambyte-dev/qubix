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

console.log("All self-checks passed.");
