"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Bagaimana cara download video TikTok tanpa watermark di QUBIX?",
    a: "Buka aplikasi TikTok, salin tautan video yang ingin Anda simpan, lalu tempelkan (paste) link tersebut ke kotak input QUBIX di atas. Klik tombol 'Unduh', lalu pilih resolusi 'Video Tanpa Watermark (HD)'. File akan otomatis terunduh tanpa logo TikTok.",
  },
  {
    q: "Apakah QUBIX gratis dan apakah perlu mendaftar akun?",
    a: "QUBIX 100% gratis tanpa batasan kuota harian. Anda tidak perlu login, tidak perlu mendaftar, dan tidak perlu memasang ekstensi peramban apapun.",
  },
  {
    q: "Platform media sosial apa saja yang didukung?",
    a: "QUBIX mendukung pengunduhan dari TikTok (Video HD No-WM, Audio Musik MP3, Slide Foto Carousel, dan Foto Profil HD), YouTube & YouTube Shorts (1080p, 720p, MP3, Cover 4K), Instagram (Reels, Feed, Carousel), Twitter / X, Facebook Watch, Pinterest, CapCut Template, Threads, dan SoundCloud.",
  },
  {
    q: "Bagaimana cara kerja fitur Potong Durasi Video (Video Trimmer)?",
    a: "Setelah link video diekstrak, klik tombol 'Potong Menit Video'. Tampilan pemutar video kustom akan muncul beserta garis waktu (timeline scrubber). Geser handle kiri untuk menentukan detik awal dan handle kanan untuk detik akhir, lalu klik 'Ekspor & Unduh Klip'.",
  },
  {
    q: "Bagaimana cara download banyak link sekaligus (Batch Downloader)?",
    a: "Pilih tab 'Batch Multi-Link' di atas form input. Masukkan hingga 10 tautan video (satu tautan per baris). QUBIX akan memproses semua tautan secara paralel sehingga Anda dapat mengunduh semuanya sekaligus dengan sekali klik.",
  },
  {
    q: "Apakah aman mengunduh video melalui QUBIX?",
    a: "Sangat aman. Server QUBIX tidak menyimpan riwayat berkas unduhan pribadi Anda di database. Seluruh riwayat aktivitas hanya disimpan secara lokal di browser Anda (Local Storage) dan dapat dihapus kapan saja.",
  },
];

export default function SeoContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="w-full max-w-3xl mx-auto mt-16 pt-10 border-t-[2.5px] border-black">
      {/* SEO Headline */}
      <div className="text-center sm:text-left mb-10">
        <span className="px-3 py-1 bg-[#FFD028] text-black font-black text-xs rounded-lg brutal-border uppercase tracking-wider inline-block mb-3">
          Panduan & Edukasi
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight">
          Download Video, Audio MP3, & Foto Profil HD Tanpa Batas
        </h2>
        <p className="mt-3 text-sm sm:text-base font-bold text-neutral-600 leading-relaxed">
          QUBIX adalah alat pengunduh media sosial universal all-in-one yang dirancang untuk kecepatan, kebersihan berkas, dan kemudahan akses. Nikmati kualitas audio MP3 320kbps murni, video definisi tinggi tanpa watermark, dan fitur potong klip video instan langsung dari peramban Anda.
        </p>
      </div>

      {/* 3 Step Guide Cards */}
      <div className="mb-14">
        <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-[#FF3377] rounded-full brutal-border"></span>
          Cara Cepat Mengunduh Media
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 bg-white rounded-2xl brutal-border brutal-shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-[#FFD028] text-black font-black flex items-center justify-center text-sm brutal-border mb-3">
              1
            </div>
            <h4 className="text-sm font-black text-black mb-1">Salin Tautan</h4>
            <p className="text-xs font-bold text-neutral-600">
              Buka aplikasi TikTok, YouTube, atau Instagram lalu salin link URL video/postingan yang ingin Anda unduh.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl brutal-border brutal-shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-[#4ADE80] text-black font-black flex items-center justify-center text-sm brutal-border mb-3">
              2
            </div>
            <h4 className="text-sm font-black text-black mb-1">Tempel & Pilih</h4>
            <p className="text-xs font-bold text-neutral-600">
              Tempel link pada kolom input QUBIX. Sistem otomatis mendeteksi platform dan menampilkan pilihan format/resolusi.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl brutal-border brutal-shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-[#A855F7] text-white font-black flex items-center justify-center text-sm brutal-border mb-3">
              3
            </div>
            <h4 className="text-sm font-black text-black mb-1">Simpan File</h4>
            <p className="text-xs font-bold text-neutral-600">
              Klik opsi unduhan yang diinginkan atau scan QR Code untuk langsung mentransfer media ke galeri smartphone Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mb-14">
        <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-[#4ADE80] rounded-full brutal-border"></span>
          Keunggulan Utama QUBIX
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 bg-[#FAF9F5] rounded-2xl brutal-border">
            <h4 className="text-sm font-black text-black mb-1 flex items-center gap-2">
              <span className="text-[#FF4081]">✦</span> Bebas Watermark Murni
            </h4>
            <p className="text-xs font-bold text-neutral-600">
              Video TikTok yang diunduh bersih tanpa watermark logo melayang sehingga siap untuk diputar ulang dengan jernih.
            </p>
          </div>

          <div className="p-4 bg-[#FAF9F5] rounded-2xl brutal-border">
            <h4 className="text-sm font-black text-black mb-1 flex items-center gap-2">
              <span className="text-red-600">✦</span> Resolusi Penuh hingga 4K
            </h4>
            <p className="text-xs font-bold text-neutral-600">
              Dukungan ekstraksi YouTube 1080p, 720p, audio bitrate tinggi 320kbps, dan thumbnail cover resolusi ultra tinggi.
            </p>
          </div>

          <div className="p-4 bg-[#FAF9F5] rounded-2xl brutal-border">
            <h4 className="text-sm font-black text-black mb-1 flex items-center gap-2">
              <span className="text-emerald-600">✦</span> Foto Profil (PP HD 1080p)
            </h4>
            <p className="text-xs font-bold text-neutral-600">
              Melihat dan menyimpan avatar akun profil TikTok & Instagram dalam ukuran original 1080x1080 hanya dengan username.
            </p>
          </div>

          <div className="p-4 bg-[#FAF9F5] rounded-2xl brutal-border">
            <h4 className="text-sm font-black text-black mb-1 flex items-center gap-2">
              <span className="text-purple-600">✦</span> Native Scraper Tanpa Pihak Ketiga
            </h4>
            <p className="text-xs font-bold text-neutral-600">
              Dibangun dengan arsitektur mandiri (Pure 0-API) tanpa perantara server rentan, menjamin waktu respons cepat dan stabil.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <div className="mb-10">
        <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-[#FFD028] rounded-full brutal-border"></span>
          Pertanyaan yang Sering Diajukan (FAQ)
        </h3>
        <div className="space-y-2.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl brutal-border transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 font-black text-xs sm:text-sm text-black hover:bg-neutral-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`w-5 h-5 rounded-md bg-neutral-100 flex items-center justify-center shrink-0 brutal-border transition-transform ${
                      isOpen ? "rotate-180 bg-[#FFD028]" : ""
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs font-bold text-neutral-600 border-t border-neutral-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
