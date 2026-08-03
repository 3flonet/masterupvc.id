"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Heart, Share2, MessageCircle } from "lucide-react";
import { getSettings, WebsiteSettings } from "@/utils/db";

interface SocialPost {
  id: number;
  platform: "instagram" | "tiktok";
  post_url: string;
  image_url: string | null;
  caption: string | null;
  created_at: string;
}

// Inline SVGs for Instagram & TikTok to make them look authentic
const PlatformIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-pink-500">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-cyan-400">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
};

export default function SocialWall() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [postsRes, settingsData] = await Promise.all([
          fetch("/api/social-wall").then(r => r.json()),
          getSettings()
        ]);
        if (Array.isArray(postsRes)) setPosts(postsRes);
        setSettings(settingsData);
      } catch (err) {
        console.error("Gagal mengambil data social wall:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(pid => pid !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }
  };

  useEffect(() => {
    const loadedScripts: HTMLScriptElement[] = [];

    const loadScriptsFromHTML = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      const scripts = Array.from(div.getElementsByTagName("script"));
      scripts.forEach(s => {
        const newScript = document.createElement("script");
        if (s.src) {
          newScript.src = s.src;
          newScript.async = true;
        } else {
          newScript.textContent = s.textContent;
        }
        document.body.appendChild(newScript);
        loadedScripts.push(newScript);
      });
    };

    posts.forEach(post => {
      if (post.post_url && post.post_url.trim().startsWith("<")) {
        loadScriptsFromHTML(post.post_url);
      }
    });

    return () => {
      loadedScripts.forEach(s => s.remove());
    };
  }, [posts]);

  if (loading) {
    return (
      <div className="py-20 bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-zinc-950 text-white transition-colors border-t border-zinc-900 relative overflow-hidden">
      
      {/* Background Graphic Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-orange uppercase bg-brand-orange/10 px-4 py-2 rounded-full border border-brand-orange/20">
            <Sparkles className="w-3.5 h-3.5" /> Live Social Feed
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Social Wall Kami
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Ikuti kreasi pemasangan, update workshop, serta konten menarik terbaru kami secara langsung dari Instagram & TikTok.
          </p>
        </div>

        {/* Masonry Columns Layout */}
        <div className="columns-1 md:columns-2 xl:columns-3 gap-8 [column-fill:_balance]">
          {posts.map((post) => {
            const isLiked = likedPosts.includes(post.id);
            const dateLabel = new Date(post.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric"
            });

            const isEmbedCode = post.post_url && post.post_url.trim().startsWith("<");

            if (isEmbedCode) {
              return (
                <div 
                  key={post.id} 
                  className="break-inside-avoid-column w-full mb-6 overflow-visible flex justify-center [&_blockquote]:!bg-transparent [&_blockquote]:!border-0 [&_blockquote]:!shadow-none"
                  dangerouslySetInnerHTML={{ __html: post.post_url }}
                />
              );
            }

            return (
              <a
                key={post.id}
                href={post.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-inside-avoid-column block bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-zinc-700/80 hover:bg-zinc-900 transition-all duration-300 group hover:shadow-2xl hover:shadow-brand-orange/5 mb-6"
              >
                {/* 1. TOP: Content Image (if present) */}
                {post.image_url && (
                  <div className="relative overflow-hidden w-full bg-zinc-950 aspect-[4/5]">
                    <img
                      src={post.image_url}
                      alt="Social Feed Cover"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                      <span className="text-[10px] font-bold text-zinc-300 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1">
                        Buka Postingan ↗
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. MIDDLE: Caption (or Quote layout if image is missing) */}
                {!post.image_url ? (
                  /* TEXT-ONLY QUOTE CARD */
                  <div className={`p-6 flex flex-col justify-between relative min-h-[160px] ${
                    post.platform === "instagram"
                      ? "bg-gradient-to-tr from-pink-950/20 via-red-950/10 to-transparent"
                      : "bg-gradient-to-br from-zinc-950/40 via-zinc-900/10 to-transparent"
                  }`}>
                    <span className={`text-6xl font-serif leading-none select-none absolute top-4 left-4 opacity-10 ${
                      post.platform === "instagram" ? "text-pink-500" : "text-cyan-400"
                    }`}>
                      “
                    </span>
                    <p className="text-sm font-bold text-zinc-200 leading-relaxed relative z-10 pt-4">
                      {post.caption || "Simak penawaran & inovasi pemasangan UPVC kustom kami."}
                    </p>
                  </div>
                ) : (
                  /* CAPTION FOR IMAGE-BASED CARD */
                  post.caption && (
                    <div className="p-5 pb-3">
                      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-4">
                        {post.caption}
                      </p>
                    </div>
                  )
                )}

                {/* 3. BOTTOM: Author Profile & Platform Source Icon */}
                <div className="px-5 py-4 flex items-center justify-between border-t border-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-zinc-800 overflow-hidden bg-brand-charcoal shrink-0 flex items-center justify-center">
                      {settings?.logo ? (
                        <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] font-black text-brand-orange">UPVC</span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block">Master UPVC</span>
                      <span className="text-[9px] text-zinc-500 block">@masterupvc.id · {dateLabel}</span>
                    </div>
                  </div>

                  {/* Platform Badge */}
                  <div className="w-7 h-7 rounded-xl bg-zinc-950 flex items-center justify-center shadow-inner border border-zinc-800/40 shrink-0">
                    {PlatformIcons[post.platform]}
                  </div>
                </div>

                {/* 4. VERY BOTTOM: Interaction Stats */}
                <div className="px-5 py-3.5 bg-zinc-900/30 border-t border-zinc-900/50 flex items-center justify-between text-zinc-500 text-[10px] font-bold">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => toggleLike(e, post.id)}
                      className={`flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer ${
                        isLiked ? "text-red-500" : ""
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                      <span>{isLiked ? 25 : 24}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.platform === "instagram" ? 3 : 5}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-400 group-hover:text-brand-orange transition-colors">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                </div>

              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
