import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ketentuan Layanan & DMCA | QUBIX",
  description: "Syarat dan ketentuan layanan serta pernyataan DMCA resmi untuk pengguna QUBIX Downloader.",
  alternates: {
    canonical: "https://qubix.ktexucoder.online/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-[#F5F4EE] flex flex-col justify-between overflow-x-hidden selection:bg-[#FFD028] selection:text-black">
      <Header />

      <main className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 flex-1">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:text-[#FF3377] transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 brutal-border-thick brutal-shadow-lg space-y-6 text-neutral-800 leading-relaxed text-sm sm:text-base">
          <div>
            <span className="px-3 py-1 bg-[#4ADE80] text-black font-black text-xs rounded-lg brutal-border uppercase tracking-wider inline-block mb-3">
              Legal & Ketentuan
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Syarat Layanan & Disclaimer DMCA
            </h1>
            <p className="text-xs font-bold text-neutral-500 mt-2">
              Terakhir diperbarui: 27 Oktober 2026
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-black">1. Pernyataan Penafian Hak Cipta (Disclaimer)</h2>
            <p>
              <strong>QUBIX</strong> adalah alat bantu utilitas berbasis peramban (browser) yang dirancang untuk membantu pengguna mengunduh konten media publik milik mereka sendiri atau konten yang berlisensi bebas (Fair Use / Creative Commons) untuk keperluan cadangan (backup) offline pribadi.
            </p>
            <p>
              QUBIX <strong>tidak meng-host, menyimpan, atau mendistribusikan materi berhak cipta apapun</strong> di server kami. Semua berkas diakses langsung dari server media sosial publik masing-masing pihak (TikTok, YouTube, Instagram, dsb).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-black">2. Tanggung Jawab Pengguna</h2>
            <p>
              Pengguna bertanggung jawab penuh atas setiap konten yang mereka unduh menggunakan QUBIX. Pengguna dilarang menggunakan alat ini untuk melanggar hak cipta, mendistribusikan materi ilegal tanpa izin pemilik hak cipta, atau merusak kekayaan intelektual kreator asli.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-black">3. Pemberitahuan & Prosedur DMCA Takedown</h2>
            <p>
              QUBIX sepenuhnya menghormati hak kekayaan intelektual pihak ketiga. Jika Anda adalah pemilik hak cipta sah dan ingin meminta pemblokiran akses ekstraksi link konten tertentu dari platform kami, silakan kirimkan permohonan ke repositori resmi kami di GitHub:{" "}
              <a
                href="https://github.com/adambyte-dev/qubix/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black font-black underline underline-offset-2 hover:text-[#FF3377]"
              >
                https://github.com/adambyte-dev/qubix/issues
              </a>. Permintaan Anda akan segera kami tindak lanjuti dalam waktu 1x24 jam kerja.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
