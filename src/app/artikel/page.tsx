"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Tag, ArrowRight, Search, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  media_type: "image_url" | "image_upload" | "youtube";
  media_value: string | null;
  category_name?: string;
  category_slug?: string;
  published_at: string | null;
  created_at?: string;
}

function getYoutubeThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function getMediaUrl(article: Article): string | null {
  if (!article.media_value) return null;
  if (article.media_type === "youtube") return getYoutubeThumbnail(article.media_value);
  return article.media_value;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ArtikelPage() {
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState("semua");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const LIMIT = 9;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetch("/api/article-categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        status: "published",
        limit: String(LIMIT),
        page: String(page),
      });
      if (activeCategory !== "semua") qs.set("category", activeCategory);

      const res = await fetch(`/api/articles?${qs.toString()}`);
      const data = await res.json();

      let filtered = data.articles || [];
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        filtered = filtered.filter(
          (a: Article) =>
            a.title.toLowerCase().includes(q) ||
            (a.excerpt || "").toLowerCase().includes(q)
        );
      }

      setArticles(filtered);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, page, debouncedSearch]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setPage(1);
  };

  return (
    <>
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      <Navbar />
      {/* Hero */}
      <section className="pt-36 pb-20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#FF6B0015,transparent_40%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-brand-orange uppercase bg-orange-950/60 px-3 py-1.5 rounded-full border border-orange-500/20 mb-4">
            Blog & Artikel
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Tips, Inspirasi &{" "}
            <span className="text-brand-orange">Info UPVC</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Panduan lengkap seputar material UPVC, inspirasi desain, dan informasi produk terbaru dari tim Master UPVC.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari artikel..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-orange transition-colors text-sm"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-20 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleCategoryChange("semua")}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "semua"
                  ? "bg-brand-orange text-white shadow-md"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-orange-50 dark:hover:bg-zinc-700"
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.slug
                    ? "bg-brand-orange text-white shadow-md"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-orange-50 dark:hover:bg-zinc-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse h-72" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
            <BookOpen className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium">Belum ada artikel</p>
            <p className="text-sm mt-1">Coba pilih kategori lain atau ubah kata pencarian</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Menampilkan <strong>{articles.length}</strong> dari <strong>{total}</strong> artikel
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const thumb = getMediaUrl(article);
                return (
                  <Link
                    key={article.id}
                    href={`/artikel/${article.slug}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-52 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                        </div>
                      )}
                      {article.media_type === "youtube" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      {article.category_name && (
                        <span className="absolute top-3 left-3 bg-brand-orange/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {article.category_name}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      <h2 className="text-base font-bold text-zinc-900 dark:text-white line-clamp-2 group-hover:text-brand-orange transition-colors leading-snug mb-2">
                        {article.title}
                      </h2>
                      {article.excerpt && (
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                        <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(article.published_at || article.created_at || null)}</span>
                        </div>
                        <span className="text-brand-orange text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Baca <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 hover:border-brand-orange hover:text-brand-orange transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      page === i + 1
                        ? "bg-brand-orange text-white shadow-md"
                        : "border border-zinc-200 dark:border-zinc-700 hover:border-brand-orange hover:text-brand-orange"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 hover:border-brand-orange hover:text-brand-orange transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Back to Home */}
      <div className="text-center pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-orange transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
    <Footer />
    </>
  );
}
