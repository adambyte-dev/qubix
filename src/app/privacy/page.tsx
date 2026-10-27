import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Privasi (Privacy Policy) | QUBIX",
  description: "Kebijakan privasi resmi penggunaan layanan pengunduh media QUBIX dan kepatuhan periklanan Google AdSense.",
  alternates: {
    canonical: "https://qubix-two.vercel.app/privacy",
  },
};

export default function PrivacyPage() {
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
            <span className="px-3 py-1 bg-[#FFD028] text-black font-black text-xs rounded-lg brutal-border uppercase tracking-wider inline-block mb-3">
              Kepatuhan & Keamanan
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Kebijakan Privasi (Privacy Policy)
            </h1>
            <p className="text-xs font-bold text-neutral-500 mt-2">
              Terakhir diperbarui: 27 Oktober 2026
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-black">1. Ringkasan Privasi Pengguna</h2>
            <p>
              Di <strong>QUBIX</strong> (dapat diakses melalui https://qubix-two.vercel.app), privasi pengunjung kami adalah salah satu prioritas utama kami. Dokumen Kebijakan Privasi ini berisi jenis informasi yang dikumpulkan dan dicatat oleh QUBIX serta bagaimana kami menggunakannya.
            </p>
            <p>
              QUBIX <strong>tidak pernah menyimpan video, audio, foto pribadi, maupun file unduhan Anda di server database kami</strong>. Semua proses ekstraksi link media dilakukan secara langsung (on-the-fly) dan riwayat unduhan disimpan secara lokal di browser perangkat Anda sendiri (Local Storage).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-black">2. File Log & Analisis Anonim</h2>
            <p>
              QUBIX mengikuti prosedur standar penggunaan file log. File-file ini hanya mencatat pengunjung saat mereka mengunjungi situs web untuk pemeliharaan teknis sistem dan perlindungan terhadap serangan scraping/bot. Informasi yang dicatat meliputi alamat IP anonim, jenis peramban (browser), dan waktu permintaan. Informasi ini tidak ditautkan ke data identitas pribadi apapun.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-black">3. Cookie & Google AdSense</h2>
            <p>
              Situs kami bermitra dengan pihak ketiga seperti <strong>Google AdSense</strong> untuk menayangkan iklan saat Anda mengunjungi situs web kami. Google menggunakan cookie (seperti cookie DoubleClick DART) untuk menayangkan iklan kepada pengguna kami berdasarkan kunjungan mereka ke situs ini dan situs web lain di internet.
            </p>
            <p>
              Pengguna dapat memilih untuk menyisihkan penggunaan Cookie DART dengan mengunjungi Kebijakan Privasi jaringan iklan dan konten Google di URL berikut:{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black font-black underline underline-offset-2 hover:text-[#FF3377]"
              >
                https://policies.google.com/technologies/ads
              </a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-black">4. Hak Privasi GDPR & CCPA</h2>
            <p>
              Kami memastikan bahwa setiap pengguna berhak atas privasi data penuh sesuai regulasi global GDPR dan CCPA. Kami tidak menjual informasi pribadi pengguna kepada pihak manapun.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-black">5. Persetujuan</h2>
            <p>
              Dengan menggunakan situs web kami, Anda dengan ini menyetujui Kebijakan Privasi kami dan menyetujui syarat dan ketentuannya.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
