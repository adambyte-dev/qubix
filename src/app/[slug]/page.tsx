import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SLUG_CONFIGS } from "@/lib/slugs";
import Home from "@/app/page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SLUG_CONFIGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = SLUG_CONFIGS[slug];
  if (!config) return {};

  const url = `https://qubix-two.vercel.app/${slug}`;

  return {
    title: `${config.title} | QUBIX`,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url,
      siteName: "QUBIX",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function ProgrammaticPage({ params }: PageProps) {
  const { slug } = await params;
  const config = SLUG_CONFIGS[slug];

  if (!config) {
    notFound();
  }

  const pageUrl = `https://qubix-two.vercel.app/${config.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#webapp`,
        name: config.title,
        url: pageUrl,
        description: config.description,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "HowTo",
        "@id": `${pageUrl}#howto`,
        name: `Cara ${config.title}`,
        description: `Panduan mudah cara ${config.title.toLowerCase()} menggunakan QUBIX Downloader.`,
        step: [
          {
            "@type": "HowToStep",
            name: "Salin Link / Tautan",
            text: `Buka aplikasi atau website ${config.platformName}, pilih konten yang Anda sukai, lalu salin tautan (link/URL).`,
            position: 1,
          },
          {
            "@type": "HowToStep",
            name: "Tempelkan Link ke QUBIX",
            text: "Kunjungi QUBIX dan tempelkan (paste) tautan pada kotak input di halaman ini, lalu klik tombol Unduh.",
            position: 2,
          },
          {
            "@type": "HowToStep",
            name: "Pilih Format & Simpan",
            text: "Pilih opsi unduhan terbaik (HD, No-Watermark, atau MP3 audio), lalu berkas akan tersimpan langsung ke memori perangkat Anda.",
            position: 3,
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: "https://qubix-two.vercel.app",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: config.badge,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Home
        initialMode={config.mode}
        heroHeading={config.heroHeading}
        heroHighlight={config.heroHighlight}
        heroSubtitle={config.description}
      />
    </>
  );
}
