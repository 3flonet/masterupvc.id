"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight,
  Award
} from "lucide-react";
import { getSettings, WebsiteSettings } from "@/utils/db";

const SocialIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  facebook: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
    </svg>
  ),
  tiktok: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  youtube: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  twitter: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
};

type SocialKey = "instagram" | "facebook" | "tiktok" | "youtube" | "twitter";

const SOCIAL_CONFIG: { key: SocialKey; label: string; baseUrl: string }[] = [
  { key: "instagram", label: "Instagram", baseUrl: "https://instagram.com/" },
  { key: "facebook", label: "Facebook", baseUrl: "https://facebook.com/" },
  { key: "tiktok", label: "TikTok", baseUrl: "https://tiktok.com/@" },
  { key: "youtube", label: "YouTube", baseUrl: "https://youtube.com/" },
  { key: "twitter", label: "Twitter / X", baseUrl: "https://x.com/" },
];

function getSocialUrl(baseUrl: string, value: string): string {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return baseUrl + value.replace(/^@/, "");
}

export default function Footer() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const year = new Date().getFullYear();
  const siteName = settings?.seo_title
    ? settings.seo_title.split(" - ")[0]
    : "Master UPVC Indonesia";

  const whatsappPhone = settings?.contact_whatsapp
    ? settings.contact_whatsapp.replace(/[^0-9]/g, "")
    : "628869619090";
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Halo Admin, saya tertarik dengan produk dan konsultasi UPVC.")}`;

  const navLinksMain = [
    { name: "Beranda", href: "/" },
    { name: "Profil Perusahaan", href: "/profil" },
    { name: "Layanan Kami", href: "/#layanan" },
    { name: "Social Wall", href: "/social-wall" },
  ];

  const navLinksProducts = [
    { name: "Katalog Produk", href: "/katalog" },
    { name: "Portofolio Project", href: "/project" },
    { name: "Artikel & Edukasi", href: "/artikel" },
    { name: "Hubungi Kami", href: "/kontak" },
  ];

  // Build active social links
  const activeSocials = SOCIAL_CONFIG.filter(
    (s) => settings && settings[`social_${s.key}` as keyof WebsiteSettings]
  );

  return (
    <footer className="relative bg-zinc-950 text-white overflow-hidden border-t border-zinc-800/80">
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Footer Body */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* ======================================================== */}
          {/* BRAND COLUMN (lg:col-span-5)                              */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            {/* Logo / Brand Heading */}
            <div className="flex items-center gap-3">
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={siteName}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl font-black tracking-wider text-white flex items-center gap-1">
                  MASTER<span className="text-brand-orange">UPVC</span>
                  <span className="w-2 h-2 rounded-full bg-brand-orange ml-0.5 animate-pulse" />
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
              {settings?.seo_description
                ? settings.seo_description.slice(0, 150) + "..."
                : "Produsen & Spesialis terpercaya kusen, pintu, dan jendela UPVC berkualitas tinggi di Indonesia. Tahan cuaca, kedap suara, anti rayap, dan hemat energi."}
            </p>

            {/* Trust Badges Pill Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-300 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                Garansi 10 Tahun
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-300 shadow-sm">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Standar SNI & ISO
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Kedap Suara 95%
              </span>
            </div>

            {/* Social Media Icons Section */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Media Sosial
              </h4>
              <div className="flex flex-wrap items-center gap-2.5">
                {activeSocials.length > 0 ? (
                  activeSocials.map((s) => {
                    const value = (settings as any)[`social_${s.key}`] as string;
                    const url = getSocialUrl(s.baseUrl, value);
                    return (
                      <a
                        key={s.key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        title={s.label}
                        className="group relative w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900/90 border border-zinc-800/90 text-zinc-400 hover:text-white hover:border-brand-orange/60 hover:bg-brand-orange shadow-lg shadow-black/40 hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                      >
                        {SocialIcons[s.key]}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-zinc-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                          {s.label}
                        </span>
                      </a>
                    );
                  })
                ) : (
                  <div className="flex items-center gap-2">
                    {SOCIAL_CONFIG.slice(0, 4).map((s) => (
                      <span
                        key={s.key}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800/80 text-zinc-500 opacity-60"
                      >
                        {SocialIcons[s.key]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-orange via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5 group"
              >
                <Phone className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
                <span>Konsultasi Gratis via WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
            </div>
          </div>


          {/* ======================================================== */}
          {/* NAVIGATION COLUMN (lg:col-span-3)                          */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              Navigasi Utama
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Halaman
                </span>
                <ul className="space-y-2.5">
                  {navLinksMain.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group flex items-center text-sm text-zinc-400 hover:text-brand-orange transition-all duration-200"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-brand-orange opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-2 sm:pt-0 lg:pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Edukasi & Produk
                </span>
                <ul className="space-y-2.5">
                  {navLinksProducts.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group flex items-center text-sm text-zinc-400 hover:text-brand-orange transition-all duration-200"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-brand-orange opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>


          {/* ======================================================== */}
          {/* CONTACT COLUMN (lg:col-span-4)                             */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              Informasi & Kontak
            </h3>

            <div className="space-y-3.5">
              {/* Alamat Workshop */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-start gap-3.5 hover:border-zinc-700 transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-brand-orange flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Alamat Workshop / Kantor
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    {settings?.contact_address ||
                      "Curug, Kec. Gn. Sindur, Kabupaten Bogor, Jawa Barat 15315"}
                  </p>
                </div>
              </div>

              {/* Whatsapp / Telepon */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-3.5 hover:border-zinc-700 transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Layanan WhatsApp & Support
                  </span>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-white hover:text-brand-orange transition-colors"
                  >
                    {settings?.contact_whatsapp || "+62 812-3456-7890"}
                  </a>
                </div>
              </div>

              {/* Website Resmi */}
              {settings?.contact_website && (
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-3.5 hover:border-zinc-700 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Domain Resmi
                    </span>
                    <a
                      href={`https://${settings.contact_website.replace(/^https?:\/\//, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-zinc-200 hover:text-brand-orange transition-colors uppercase"
                    >
                      {settings.contact_website}
                    </a>
                  </div>
                </div>
              )}

              {/* Jam Operasional Badge */}
              <div className="px-3.5 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand-orange" />
                  <span className="text-[11px] font-medium">Jam Operasional:</span>
                </div>
                <span className="text-[11px] font-bold text-zinc-200">
                  Senin - Sabtu (08:00 - 17:00)
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* ======================================================== */}
      {/* BOTTOM COPYRIGHT BAR                                     */}
      {/* ======================================================== */}
      <div className="relative z-10 border-t border-zinc-900 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          
          {/* Left: Copyright */}
          <div className="flex items-center gap-2">
            <span>© {year} <strong className="text-zinc-300 font-bold">{siteName}</strong>. All rights reserved.</span>
          </div>

          {/* Right: Creator & 3FLO Link */}
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <span>Dibuat dengan ❤️ untuk hunian impian Indonesia</span>
            <span className="text-zinc-800">|</span>
            <span className="flex items-center gap-1">
              Developed by{" "}
              <a 
                href="https://3flo.net" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-extrabold text-brand-orange hover:text-amber-400 underline underline-offset-4 decoration-brand-orange/60 hover:decoration-amber-400 transition-colors inline-flex items-center gap-0.5 group ml-1"
              >
                <span>3FLO</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange group-hover:bg-amber-400 inline-block transition-colors self-end mb-0.5"></span>
              </a>
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}
