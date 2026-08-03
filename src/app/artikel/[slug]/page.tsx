"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, Tag, ChevronLeft, BookOpen, ArrowRight } from "lucide-react";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  media_type: "image_url" | "image_upload" | "youtube";
  media_value: string | null;
  category_name?: string;
  category_slug?: string;
  published_at: string | null;
  created_at?: string;
}

function getYoutubeId(value: string): string {
  const match = value.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : value;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticleMedia({ article }: { article: Article }) {
  if (!article.media_value) return null;

  if (article.media_type === "youtube") {
    const videoId = getYoutubeId(article.media_value);
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl mb-10">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={article.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full aspect-[16/7] rounded-2xl overflow-hidden shadow-xl mb-10">
      <img
        src={article.media_value}
        alt={article.title}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default function ArtikelDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/articles?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.article) {
          setArticle(data.article);
          // Fetch related articles (same category)
          if (data.article.category_slug) {
            fetch(`/api/articles?status=published&limit=3&category=${data.article.category_slug}`)
              .then((r) => r.json())
              .then((d) => {
                setRelated((d.articles || []).filter((a: Article) => a.slug !== slug));
              });
          }
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Navbar />
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 text-zinc-400">
        <Navbar />
        <BookOpen className="w-16 h-16 mb-4 opacity-30" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Artikel Tidak Ditemukan</h1>
        <p className="text-sm mb-6">Artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link href="/artikel" className="text-brand-orange font-semibold hover:underline">
          ← Kembali ke Semua Artikel
        </Link>
      </div>
    );
  }

  const publishedDate = formatDate(article.published_at || article.created_at || null);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || "",
    datePublished: article.published_at || article.created_at || "",
    dateModified: article.published_at || article.created_at || "",
    author: {
      "@type": "Organization",
      name: "Master UPVC Indonesia",
      url: "https://www.masterupvc.id",
    },
    publisher: {
      "@type": "Organization",
      name: "Master UPVC Indonesia",
      logo: {
        "@type": "ImageObject",
        url: "https://www.masterupvc.id/images/logo.png",
      },
    },
    ...(article.media_type !== "youtube" && article.media_value
      ? { image: article.media_value }
      : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.masterupvc.id/artikel/${article.slug}`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: "https://www.masterupvc.id" },
      { "@type": "ListItem", position: 2, name: "Artikel", item: "https://www.masterupvc.id/artikel" },
      { "@type": "ListItem", position: 3, name: article.title, item: `https://www.masterupvc.id/artikel/${article.slug}` },
    ],
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
        <Navbar />
        {/* Breadcrumb */}
        <div className="mt-20 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs text-zinc-500">
              <Link href="/" className="hover:text-brand-orange transition-colors">Beranda</Link>
              <span>/</span>
              <Link href="/artikel" className="hover:text-brand-orange transition-colors">Artikel</Link>
              <span>/</span>
              <span className="text-zinc-700 dark:text-zinc-300 line-clamp-1">{article.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Meta */}
          <header className="mb-8">
            {article.category_name && (
              <Link
                href={`/artikel?category=${article.category_slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange bg-orange-50 dark:bg-orange-950/40 px-3 py-1.5 rounded-full mb-4 hover:bg-orange-100 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {article.category_name}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight tracking-tight mb-4">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed border-l-4 border-brand-orange pl-4">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-2 mt-5 text-zinc-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{publishedDate}</span>
              <span className="mx-1">·</span>
              <span>Master UPVC Indonesia</span>
            </div>
          </header>

          {/* Media */}
          <ArticleMedia article={article} />

          {/* Body */}
          {article.content && (
            <div
              className="prose prose-zinc dark:prose-invert prose-lg max-w-none
                prose-headings:font-extrabold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-zinc-100 prose-h2:dark:border-zinc-800 prose-h2:pb-2
                prose-p:leading-relaxed prose-p:text-zinc-700 prose-p:dark:text-zinc-300
                prose-ul:space-y-2 prose-li:text-zinc-700 prose-li:dark:text-zinc-300
                prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )}

          {/* CTA */}
          <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 text-white text-center">
            <h3 className="text-xl font-extrabold mb-2">Tertarik dengan Produk UPVC Kami?</h3>
            <p className="text-zinc-400 text-sm mb-5">Dapatkan konsultasi dan estimasi biaya gratis dari tim ahli kami.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://wa.me/628869619090"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm"
              >
                Hubungi via WhatsApp
              </a>
              <Link
                href="/katalog"
                className="px-6 py-3 bg-zinc-700 text-white font-bold rounded-xl hover:bg-zinc-600 transition-colors text-sm"
              >
                Lihat Katalog Produk
              </Link>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-6">
              Artikel Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.slice(0, 3).map((rel) => {
                const thumb =
                  rel.media_type === "youtube" && rel.media_value
                    ? `https://img.youtube.com/vi/${rel.media_value}/hqdefault.jpg`
                    : rel.media_value || null;
                return (
                  <Link
                    key={rel.id}
                    href={`/artikel/${rel.slug}`}
                    className="group flex flex-col rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="h-36 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      {thumb ? (
                        <img src={thumb} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 group-hover:text-brand-orange transition-colors leading-snug">
                        {rel.title}
                      </h3>
                      <span className="mt-2 text-brand-orange text-xs font-semibold flex items-center gap-1">
                        Baca <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="text-center pb-12">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-orange transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Lihat Semua Artikel
          </Link>
        </div>
      <Footer />
      </div>
    </>
  );
}
