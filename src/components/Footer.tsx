export default function Footer() {
  return (
    <footer className="w-full bg-[#EBEAE3] border-t-[2.5px] border-black mt-20 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-3 h-3 bg-[#FFD028] rounded-full brutal-border"></span>
            <span className="font-black text-black text-base">QUBIX DOWNLOADER</span>
          </div>
          <p className="text-xs font-bold text-neutral-600 mt-1">
            Built with 🖤 by{" "}
            <a
              href="https://github.com/adambyte-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black font-black underline decoration-2 underline-offset-2 hover:text-[#FF3377] transition-colors"
            >
              adambyte-dev
            </a>{" "}
            (Muhammad Adam Hidayat)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-black">
          <span className="px-2.5 py-1 bg-white rounded-lg brutal-border">TikTok No-WM</span>
          <span className="px-2.5 py-1 bg-white rounded-lg brutal-border">PP TikTok HD</span>
          <span className="px-2.5 py-1 bg-white rounded-lg brutal-border">YouTube 4K</span>
          <span className="px-2.5 py-1 bg-white rounded-lg brutal-border">Instagram Reels</span>
        </div>
      </div>
    </footer>
  );
}
