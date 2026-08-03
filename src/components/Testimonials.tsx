"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  photo: string | null;
  comment: string;
  rating: number;
  is_active: number;
  created_at: string;
}

const AUTOPLAY_DELAY = 5000;

const AVATAR_COLORS = [
  ["bg-orange-500", "from-orange-400 to-orange-600"],
  ["bg-amber-500", "from-amber-400 to-amber-600"],
  ["bg-teal-500", "from-teal-400 to-teal-600"],
  ["bg-indigo-500", "from-indigo-400 to-indigo-600"],
  ["bg-rose-500", "from-rose-400 to-rose-600"],
  ["bg-emerald-500", "from-emerald-400 to-emerald-600"],
  ["bg-violet-500", "from-violet-400 to-violet-600"],
  ["bg-cyan-500", "from-cyan-400 to-cyan-600"],
];

function Avatar({ name, photo, size = "lg" }: { name: string; photo: string | null; size?: "sm" | "lg" }) {
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const [, gradient] = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const sizeClass = size === "lg" ? "w-16 h-16 text-xl" : "w-10 h-10 text-sm";

  if (photo) {
    return (
      <img src={photo} alt={name}
        className={`${sizeClass} rounded-full object-cover ring-4 ring-white/20 shrink-0`}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black shrink-0 ring-4 ring-white/20 shadow-lg`}>
      {initials}
    </div>
  );
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "w-6 h-6" : size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star}
          className={`${s} transition-all ${star <= rating ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" : "text-white/20"}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  // Touch/drag support
  const dragStart = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    async function load() {
      try {
        const [tRes, sRes] = await Promise.all([
          fetch("/api/testimonials?active=1"),
          fetch("/api/settings")
        ]);
        const tData = await tRes.json();
        const sData = await sRes.json();
        if (Array.isArray(tData) && tData.length > 0) setTestimonials(tData);
        if (sData?.google_maps_review_url) setGoogleMapsUrl(sData.google_maps_review_url);
      } catch (err) {
        console.error("Gagal memuat testimonial:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const goTo = useCallback((idx: number, dir: "left" | "right" = "right") => {
    if (transitioning || testimonials.length === 0) return;
    setDirection(dir);
    setTransitioning(true);
    setProgress(0);
    startTimeRef.current = 0;
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 400);
  }, [transitioning, testimonials.length]);

  const next = useCallback(() => {
    goTo((current + 1) % testimonials.length, "right");
  }, [current, testimonials.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + testimonials.length) % testimonials.length, "left");
  }, [current, testimonials.length, goTo]);

  // Auto-play with RAF progress
  useEffect(() => {
    if (testimonials.length <= 1 || paused || transitioning) return;

    const tick = (ts: number) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const p = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
      progressRef.current = p;
      setProgress(p);

      if (elapsed >= AUTOPLAY_DELAY) {
        next();
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [current, paused, transitioning, testimonials.length, next]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (!loading && testimonials.length === 0) return null;

  const t = testimonials[current];
  const prevIdx = (current - 1 + testimonials.length) % testimonials.length;
  const nextIdx = (current + 1) % testimonials.length;

  return (
    <section
      id="testimonial"
      className="relative py-28 overflow-hidden bg-[#0d0d14]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.15),transparent)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-brand-orange uppercase bg-brand-orange/10 border border-brand-orange/20 px-4 py-2 rounded-full">
            <Star className="w-3 h-3 fill-brand-orange" />
            Kata Pelanggan Kami
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-6 leading-tight">
            Apa Kata
            <span className="block bg-gradient-to-r from-brand-orange to-amber-400 bg-clip-text text-transparent">
              Pelanggan Kami?
            </span>
          </h2>
        </div>

        {loading ? (
          /* Skeleton */
          <div className="flex justify-center">
            <div className="w-full max-w-2xl h-64 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
          </div>
        ) : (
          <>
            {/* Carousel */}
            <div
              className="relative flex items-center justify-center gap-6"
              onPointerDown={(e) => { dragStart.current = e.clientX; }}
              onPointerUp={(e) => {
                if (dragStart.current === null) return;
                const diff = dragStart.current - e.clientX;
                if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
                dragStart.current = null;
              }}
            >
              {/* Prev ghost card */}
              {testimonials.length > 1 && (
                <div
                  className="hidden lg:block absolute left-0 w-72 cursor-pointer"
                  onClick={prev}
                  style={{ transform: "scale(0.88) translateX(60px)", opacity: 0.35, filter: "blur(1px)", zIndex: 0, transformOrigin: "right center" }}
                >
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar name={testimonials[prevIdx].name} photo={testimonials[prevIdx].photo} size="sm" />
                      <div>
                        <div className="text-white font-bold text-sm">{testimonials[prevIdx].name}</div>
                        <StarRating rating={testimonials[prevIdx].rating} size="sm" />
                      </div>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{testimonials[prevIdx].comment}</p>
                  </div>
                </div>
              )}

              {/* Main featured card */}
              <div
                className="relative w-full max-w-2xl z-10"
                style={{
                  transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1)",
                  opacity: transitioning ? 0 : 1,
                  transform: transitioning
                    ? `translateX(${direction === "right" ? "-40px" : "40px"})`
                    : "translateX(0)",
                }}
              >
                {/* Glow behind card */}
                <div
                  className="absolute inset-0 rounded-3xl blur-2xl opacity-30 transition-all duration-700"
                  style={{ background: "radial-gradient(circle, rgba(249,115,22,0.4) 0%, transparent 70%)", transform: "scale(1.1) translateY(10%)" }}
                />

                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50 overflow-hidden">
                  {/* Inner decorative glow */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent" />
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-orange/10 rounded-full blur-2xl" />

                  {/* Large decorative quote */}
                  <Quote
                    className="absolute top-6 right-8 w-20 h-20 text-white/5 fill-white/5"
                  />

                  {/* Stars */}
                  <StarRating rating={t?.rating ?? 5} size="lg" />

                  {/* Comment */}
                  <blockquote className="mt-6 text-xl md:text-2xl font-medium text-white/90 leading-relaxed relative z-10 min-h-[120px]">
                    &ldquo;{t?.comment}&rdquo;
                  </blockquote>

                  {/* Divider */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar name={t?.name ?? ""} photo={t?.photo ?? null} size="lg" />
                      <div>
                        <div className="text-white font-extrabold text-base">{t?.name}</div>
                        <div className="text-brand-orange/80 text-xs font-semibold tracking-wide mt-0.5">Pelanggan Master UPVC</div>
                      </div>
                    </div>

                    {/* Counter badge */}
                    <div className="text-white/30 text-sm font-mono tabular-nums">
                      <span className="text-white font-bold text-lg">{String(current + 1).padStart(2, "0")}</span>
                      <span className="mx-1">/</span>
                      {String(testimonials.length).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Next ghost card */}
              {testimonials.length > 1 && (
                <div
                  className="hidden lg:block absolute right-0 w-72 cursor-pointer"
                  onClick={next}
                  style={{ transform: "scale(0.88) translateX(-60px)", opacity: 0.35, filter: "blur(1px)", zIndex: 0, transformOrigin: "left center" }}
                >
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar name={testimonials[nextIdx].name} photo={testimonials[nextIdx].photo} size="sm" />
                      <div>
                        <div className="text-white font-bold text-sm">{testimonials[nextIdx].name}</div>
                        <StarRating rating={testimonials[nextIdx].rating} size="sm" />
                      </div>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{testimonials[nextIdx].comment}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="mt-10 flex flex-col items-center gap-6">
              {/* Progress bar */}
              {testimonials.length > 1 && (
                <div className="w-full max-w-2xl h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-orange to-amber-400 rounded-full transition-none"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Dots + Arrows */}
              <div className="flex items-center gap-6">
                {/* Prev arrow */}
                <button
                  onClick={prev}
                  disabled={testimonials.length <= 1}
                  className="group w-12 h-12 flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 hover:bg-brand-orange hover:border-brand-orange text-white/60 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Testimonial sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                </button>

                {/* Dot indicators */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx, idx > current ? "right" : "left")}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        idx === current
                          ? "w-8 h-2.5 bg-brand-orange shadow-lg shadow-brand-orange/40"
                          : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Pergi ke testimonial ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Next arrow */}
                <button
                  onClick={next}
                  disabled={testimonials.length <= 1}
                  className="group w-12 h-12 flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 hover:bg-brand-orange hover:border-brand-orange text-white/60 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Testimonial berikutnya"
                >
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              <p className="text-white/25 text-xs font-medium">Hover untuk berhenti &bull; Geser atau tekan &larr; &rarr; untuk navigasi</p>

              {/* Dynamic Google Maps Review CTA */}
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 mt-2 px-6 py-3.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all duration-300 text-sm font-semibold backdrop-blur-sm"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Lihat Semua Ulasan di Google
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
