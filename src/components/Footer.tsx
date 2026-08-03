"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getSettings, WebsiteSettings } from "@/utils/db";
import { MapPin, Phone, Globe } from "lucide-react";

// Social media SVG icons (inline, no external deps)
const SocialIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
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
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Halo Admin, saya tertarik dengan produk Anda.")}`;

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Layanan", href: "/#layanan" },
    { name: "Katalog Produk", href: "/katalog" },
    { name: "Project", href: "/project" },
    { name: "Profil", href: "/profil" },
    { name: "Social Wall", href: "/social-wall" },
    { name: "Artikel & Blog", href: "/artikel" },
    { name: "Hubungi Kami", href: "/kontak" },
  ];

  // Build active social links
  const activeSocials = SOCIAL_CONFIG.filter(
    (s) => settings && settings[`social_${s.key}` as keyof WebsiteSettings]
  );

  return (
    <footer className="bg-zinc-900 text-white">
      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="space-y-4">
            <span className="text-2xl font-black tracking-wider text-white">
              MASTER<span className="text-brand-orange">UPVC</span>
            </span>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              {settings?.seo_description
                ? settings.seo_description.slice(0, 120) + "..."
                : "Spesialis pintu & jendela UPVC berkualitas premium untuk hunian modern di wilayah Jabodetabek."}
            </p>

            {/* Social Media Icons */}
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-3 pt-1">
                {activeSocials.map((s) => {
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
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-brand-orange text-zinc-400 hover:text-white transition-all duration-200 hover:scale-110"
                    >
                      {SocialIcons[s.key]}
                    </a>
                  );
                })}
              </div>
            )}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Hubungi via WhatsApp
            </a>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 mb-5">
              Navigasi
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-brand-orange transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 mb-5">
              Kontak
            </h3>
            <ul className="space-y-4">
              {settings?.contact_address && (
                <li className="flex items-start gap-3 text-sm text-zinc-400">
                  <MapPin className="w-4 h-4 mt-0.5 text-brand-orange flex-shrink-0" />
                  <span>{settings.contact_address}</span>
                </li>
              )}
              {settings?.contact_whatsapp && (
                <li className="flex items-start gap-3 text-sm text-zinc-400">
                  <Phone className="w-4 h-4 mt-0.5 text-brand-orange flex-shrink-0" />
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-orange transition-colors"
                  >
                    {settings.contact_whatsapp}
                  </a>
                </li>
              )}
              {settings?.contact_website && (
                <li className="flex items-start gap-3 text-sm text-zinc-400">
                  <Globe className="w-4 h-4 mt-0.5 text-brand-orange flex-shrink-0" />
                  <a
                    href={`https://${settings.contact_website.replace(/^https?:\/\//, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-orange transition-colors uppercase"
                  >
                    {settings.contact_website}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col items-center gap-3 text-xs text-zinc-500">
          {settings?.logo && (
            <img
              src={settings.logo}
              alt="Logo"
              className="h-8 w-auto object-contain opacity-80"
            />
          )}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>© {year} {siteName}. All rights reserved.</span>
            <span className="hidden sm:block text-zinc-700">|</span>
            <span>Dibuat dengan ❤️ untuk hunian impian Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
