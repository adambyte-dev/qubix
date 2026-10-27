<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# QUBIX Downloader — Developer & Agent Specification

Panduan teknis arsitektur, desain sistem, dan standardisasi kode untuk QUBIX Downloader.

---

## 1. Desain Sistem & Inspirasi UI (Tuckii Neo-Brutalism)
- **Gaya Visual**: Neo-Brutalism murni.
  - Border tebal hitam (`2.5px` s/d `3px solid #000000`).
  - Hard drop shadow tegas tanpa blur (`box-shadow: 4px 4px 0px #000000` / `6px 6px 0px #000000`).
  - Sudut melengkung halus (`rounded-2xl`).
  - Logo brand: `/public/logo.png` (aksen kuning `#FFD028` dan tipografi tebal).
  - Folder Tab Cards: Kartu platform menampilkan tab warna di bagian atas seperti tab arsip pada desain inspirasi Tuckii.

---

## 2. Prinsip Pure 0-API (Zero 3rd-Party Scrapers/APIs)
- **Larangan Keras**: Dilarang mengintegrasikan API pihak ketiga/SaaS eksternal (seperti RapidAPI, Cobalt API, TikWM, SnapTik, dsb).
- **Ekstraksi Mandiri Dari 0**:
  - `src/lib/extractors/tiktok.ts`: Menggunakan native fetch dengan social crawler headers (`facebookexternalhit/1.1`) dan official TikTok oEmbed untuk mengambil video stream, audio, dan foto profil 1080x1080 HD langsung dari server TikTok CDN.
  - `src/lib/extractors/youtube.ts`: Menggunakan YouTube oEmbed & direktori thumbnail `i.ytimg.com/vi/{id}/maxresdefault.jpg`.
  - `src/lib/extractors/social.ts`: Parsing metadata OpenGraph dari Instagram, Facebook, X, Pinterest, Threads, Reddit.
  - `src/app/api/proxy/route.ts`: Streaming internal untuk menghindari CORS dan menyertakan header `Content-Disposition: attachment; filename=...`.

---

## 3. Struktur Berkas & Modul

```text
src/
├── app/
│   ├── api/
│   │   ├── download/route.ts        # POST universal media endpoint
│   │   ├── tiktok/profile/route.ts  # POST TikTok HD avatar endpoint
│   │   └── proxy/route.ts           # GET direct attachment stream proxy
│   ├── globals.css                  # Variabel & kelas utility Neo-Brutalism
│   ├── layout.tsx                   # Font Geist & title metadata
│   └── page.tsx                     # Dashboard utama downloader
├── components/
│   ├── Header.tsx                   # Logo Qubix & status badge
│   ├── DownloaderForm.tsx           # Input bar gaya Tuckii (Paste + Big Yellow Button)
│   ├── PlatformCards.tsx            # Grid folder tabs ala Tuckii
│   ├── MediaResult.tsx              # Card hasil ekstraksi video & tombol unduhan
│   ├── ProfileResult.tsx            # Card hasil foto profil TikTok HD
│   └── Footer.tsx                   # Footer & copyright
├── lib/
│   ├── constants.ts                 # Whitelist domain & metadata platform
│   ├── utils.ts                     # Format angka, ukuran byte, sanitasi URL
│   └── extractors/
│       ├── tiktok.ts
│       ├── youtube.ts
│       └── social.ts
└── types/
    └── index.ts                     # Kontrak TypeScript
```

---

## 4. Validasi Keamanan
1. **SSRF Guard**: Tolak semua alamat IP loopback (`127.0.0.1`, `localhost`), link file lokal (`file://`), atau subnet privat (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
2. **Sanitasi Username TikTok**: Validasi karakter menggunakan ekspresi reguler `^@?[a-zA-Z0-9_.-]{2,24}$`.
