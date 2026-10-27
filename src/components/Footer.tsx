import Link from "next/link";
import { SLUG_CONFIGS } from "@/lib/slugs";

export default function Footer() {
  const links = Object.values(SLUG_CONFIGS);

  return (
    <footer className="w-full bg-[#EBEAE3] border-t-[2.5px] border-black mt-20 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Top SEO Internal Links Grid */}
        <div>
          <h4 className="text-xs font-black text-neutral-500 uppercase tracking-wider mb-3 text-center md:text-left">
            Layanan Pengunduh Media Terpopuler:
          </h4>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {links.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="px-3 py-1.5 bg-white hover:bg-[#FFD028] text-black text-xs font-black rounded-lg brutal-border brutal-shadow-sm transition-all"
              >
                {item.badge}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Credits & Brand */}
        <div className="pt-6 border-t-[1.5px] border-neutral-300 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
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

          <div className="flex flex-col items-center md:items-end gap-1.5">
            <div className="flex items-center gap-3 text-xs font-black">
              <Link href="/privacy" className="hover:underline hover:text-[#FF3377]">
                Kebijakan Privasi
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:underline hover:text-[#FF3377]">
                Syarat & DMCA
              </Link>
            </div>
            <p className="text-xs font-bold text-neutral-500">
              © 2026 QUBIX. Unduh media sosial cepat, aman, dan tanpa watermark.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
