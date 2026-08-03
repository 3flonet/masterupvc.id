"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSettings, WebsiteSettings } from "@/utils/db";
import { Menu, X, PhoneCall, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const handleCartClick = () => {
    if (pathname === "/katalog") {
      window.dispatchEvent(new Event("open_cart"));
    } else {
      window.location.href = "/katalog?cart=open";
    }
  };

  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  useEffect(() => {
    function updateCount() {
      const savedCart = localStorage.getItem("masterupvc_cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            const totalQty = parsed.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(totalQty);
            return;
          }
        } catch (e) {}
      }
      setCartCount(0);
    }

    updateCount();
    window.addEventListener("cart_updated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("cart_updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const layananEl = document.getElementById("layanan");
      if (!layananEl) return;

      const rect = layananEl.getBoundingClientRect();
      if (rect.top <= 200 && rect.bottom >= 300) {
        setActiveSection("layanan");
      } else {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const checkActive = (href: string) => {
    if (pathname === "/") {
      if (href === "/#layanan") {
        return activeSection === "layanan";
      } else if (href === "/") {
        return activeSection !== "layanan";
      }
    }
    return pathname === href;
  };

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Layanan", href: "/#layanan" },
    { name: "Katalog", href: "/katalog" },
    { name: "Project", href: "/project" },
    { name: "Profil", href: "/profil" },
    { name: "Social Wall", href: "/social-wall" },
    { name: "Artikel", href: "/artikel" },
    { name: "Hubungi Kami", href: "/kontak" },
  ];

  const whatsappPhone = settings?.contact_whatsapp 
    ? settings.contact_whatsapp.replace(/[^0-9]/g, "") 
    : "6281234567890";

  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Halo Admin, saya tertarik dengan produk Anda.")}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-brand-charcoal/70 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              {settings?.logo ? (
                <img src={settings.logo} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-black tracking-wider text-brand-charcoal dark:text-white flex items-center">
                  MASTER<span className="text-brand-orange">UPVC</span>
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = checkActive(link.href);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors duration-200 ${
                    isActive
                      ? "font-bold text-brand-orange"
                      : "font-medium text-brand-charcoal/80 dark:text-zinc-300 hover:text-brand-orange dark:hover:text-brand-orange"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* CTA & Cart Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={handleCartClick}
              className="relative p-2 text-brand-charcoal dark:text-white hover:text-brand-orange transition-colors cursor-pointer"
              title="Buka Keranjang Belanja"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-brand-charcoal animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-brand-orange/20 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              Hubungi WA
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center md:hidden">
            {/* Cart Icon Mobile */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-brand-charcoal dark:text-white hover:text-brand-orange transition-colors cursor-pointer mr-2"
              title="Buka Keranjang Belanja"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-brand-charcoal animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-brand-charcoal dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-brand-charcoal border-b border-zinc-200 dark:border-zinc-800 animate-slide-up">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = checkActive(link.href);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base transition-colors ${
                    isActive
                      ? "font-extrabold text-brand-orange bg-zinc-50 dark:bg-zinc-800/40"
                      : "font-medium text-brand-charcoal dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-brand-orange dark:hover:text-brand-orange"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <div className="pt-4 pb-2 px-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-brand-orange text-white px-4 py-3 rounded-full text-base font-semibold shadow-lg shadow-brand-orange/20"
              >
                <PhoneCall className="w-5 h-5" />
                Hubungi WA
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
