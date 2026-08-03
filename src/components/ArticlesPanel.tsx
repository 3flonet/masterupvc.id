"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus, Edit, Trash2, X, Save, Search, Eye,
  Tv, Link as LinkIcon, ImageIcon, FileText, Tag, BookOpen
} from "lucide-react";
import {
  Article, ArticleCategory,
  getArticles, addArticle, updateArticle, deleteArticle,
  getArticleCategories, addArticleCategory, deleteArticleCategory
} from "@/utils/db";

interface Toast {
  type: "success" | "error";
  message: string;
}

function ArticleForm({
  initial,
  categories,
  onSave,
  onCancel,
  loading,
}: {
  initial?: Partial<Article>;
  categories: ArticleCategory[];
  onSave: (data: Partial<Article>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content || "");
  const [categoryId, setCategoryId] = useState<number | "">(initial?.category_id || "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status || "draft");
  const [mediaType, setMediaType] = useState<"image_url" | "image_upload" | "youtube">(
    initial?.media_type || "image_url"
  );
  const [mediaValue, setMediaValue] = useState(initial?.media_value || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaValue(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      title,
      excerpt: excerpt || null,
      content: content || null,
      category_id: categoryId === "" ? null : Number(categoryId),
      status,
      media_type: mediaType,
      media_value: mediaValue || null,
      published_at: null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5">
          Judul Artikel <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Masukkan judul artikel..."
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition"
        />
      </div>

      {/* Category & Status row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5">Kategori</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition"
          >
            <option value="">— Pilih Kategori —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition"
          >
            <option value="draft">Draft (Tersembunyi)</option>
            <option value="published">Published (Tampil di Website)</option>
          </select>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5">
          Ringkasan / Excerpt{" "}
          <span className="font-normal text-zinc-400">(maks. 160 karakter, untuk SEO)</span>
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value.slice(0, 160))}
          rows={2}
          placeholder="Deskripsi singkat artikel ini..."
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition resize-none"
        />
        <p className="text-right text-xs text-zinc-400 mt-1">{excerpt.length}/160</p>
      </div>

      {/* Media */}
      <div>
        <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-2">
          Media Utama
        </label>
        <div className="flex gap-2 mb-3">
          {[
            { value: "image_url", icon: <LinkIcon className="w-3.5 h-3.5" />, label: "Link URL Gambar" },
            { value: "image_upload", icon: <ImageIcon className="w-3.5 h-3.5" />, label: "Upload Gambar" },
            { value: "youtube", icon: <Tv className="w-3.5 h-3.5" />, label: "YouTube" },
          ].map(({ value, icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => { setMediaType(value as any); setMediaValue(""); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                mediaType === value
                  ? "bg-brand-orange text-white border-brand-orange"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-brand-orange hover:text-brand-orange"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {mediaType === "image_url" && (
          <input
            type="url"
            value={mediaValue}
            onChange={(e) => setMediaValue(e.target.value)}
            placeholder="https://example.com/gambar.jpg"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 transition"
          />
        )}
        {mediaType === "youtube" && (
          <input
            type="text"
            value={mediaValue}
            onChange={(e) => setMediaValue(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... atau ID video"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 transition"
          />
        )}
        {mediaType === "image_upload" && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2.5 border border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl text-sm text-zinc-500 hover:border-brand-orange hover:text-brand-orange transition w-full text-center"
            >
              {mediaValue ? "✓ Gambar dipilih — klik untuk ganti" : "Klik untuk pilih gambar"}
            </button>
            {mediaValue && mediaValue.startsWith("data:") && (
              <img src={mediaValue} alt="preview" className="mt-2 h-24 rounded-lg object-cover" />
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5">
          Konten Artikel <span className="font-normal text-zinc-400">(HTML didukung)</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder="<h2>Judul Bagian</h2><p>Isi artikel di sini...</p>"
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition font-mono resize-y"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-zinc-200 dark:border-zinc-700 py-3 rounded-xl text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-brand-orange text-white py-3 rounded-xl text-xs font-bold hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {loading ? "Menyimpan..." : "Simpan Artikel"}
        </button>
      </div>
    </form>
  );
}

export default function ArticlesPanel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; title: string } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [articlesData, catsData] = await Promise.all([
        getArticles({ status: "all", limit: 100 }),
        getArticleCategories(),
      ]);
      setArticles(articlesData.articles || []);
      setCategories(catsData || []);
    } catch {
      showToast("Gagal memuat data artikel.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredArticles = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSave = async (data: Partial<Article>) => {
    setSaving(true);
    try {
      if (editingArticle) {
        const ok = await updateArticle(editingArticle.id, data);
        if (ok) { showToast("Artikel berhasil diperbarui!"); }
        else { showToast("Gagal memperbarui artikel.", "error"); }
      } else {
        const result = await addArticle(data as Omit<Article, "id" | "created_at" | "updated_at">);
        if (result.success) { showToast("Artikel berhasil ditambahkan!"); }
        else { showToast(result.error || "Gagal menyimpan artikel.", "error"); }
      }
      setShowForm(false);
      setEditingArticle(null);
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await deleteArticle(id);
    if (ok) { showToast("Artikel dihapus."); await loadData(); }
    else { showToast("Gagal menghapus artikel.", "error"); }
    setConfirmDelete(null);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const ok = await addArticleCategory(newCatName.trim());
    if (ok) { showToast(`Kategori "${newCatName}" ditambahkan.`); setNewCatName(""); await loadData(); }
    else { showToast("Gagal menambahkan kategori.", "error"); }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    const ok = await deleteArticleCategory(id);
    if (ok) { showToast(`Kategori "${name}" dihapus.`); await loadData(); }
    else { showToast("Gagal menghapus kategori.", "error"); }
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 animate-slide-in flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold ${
          toast.type === "success"
            ? "bg-emerald-500 text-white"
            : "bg-red-500 text-white"
        }`}>
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-charcoal dark:text-white tracking-tight">Artikel / Blog</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Kelola artikel, tips, dan inspirasi UPVC.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setEditingArticle(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-orange-600 transition shadow-md shadow-brand-orange/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Artikel
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-5">
            {editingArticle ? "Edit Artikel" : "Tambah Artikel Baru"}
          </h3>
          <ArticleForm
            initial={editingArticle || undefined}
            categories={categories}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingArticle(null); }}
            loading={saving}
          />
        </div>
      )}

      {/* Filters */}
      {!showForm && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari artikel..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 transition"
            >
              <option value="all">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Articles Table */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />)}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
              <BookOpen className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">Belum ada artikel</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition group"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                    {article.media_value ? (
                      <img
                        src={
                          article.media_type === "youtube"
                            ? `https://img.youtube.com/vi/${article.media_value}/default.jpg`
                            : article.media_value
                        }
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">{article.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {article.category_name && (
                        <span className="text-xs bg-orange-50 dark:bg-orange-950/30 text-brand-orange font-semibold px-2 py-0.5 rounded-full">
                          {article.category_name}
                        </span>
                      )}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        article.status === "published"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                      }`}>
                        {article.status === "published" ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <a
                      href={`/artikel/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-brand-orange hover:border-brand-orange transition cursor-pointer"
                      title="Lihat di website"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => { setEditingArticle(article); setShowForm(true); }}
                      className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-blue-500 hover:border-blue-400 transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ id: article.id, title: article.title })}
                      className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-400 transition cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category Management */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5">
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-4">Kategori Artikel</h3>
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Nama kategori baru..."
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 transition"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-brand-orange text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  <Tag className="w-3 h-3 text-brand-orange" />
                  {cat.name}
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="text-zinc-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Hapus Artikel?</h3>
            <p className="text-sm text-zinc-500 mb-5">
              Artikel <strong>"{confirmDelete.title}"</strong> akan dihapus permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-zinc-200 dark:border-zinc-700 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
