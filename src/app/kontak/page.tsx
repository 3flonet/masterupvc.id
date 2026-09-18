"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { getSettings, getLocalSettings, WebsiteSettings } from "@/utils/db";
import { MapPin, Phone, Globe } from "lucide-react";

export default function KontakPage() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  const whatsappPhone = settings?.contact_whatsapp 
    ? settings.contact_whatsapp.replace(/[^0-9]/g, "") 
    : "628869619090";
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Halo Admin, saya tertarik dengan produk Anda.")}`;

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <section className="py-12 bg-zinc-900 text-white transition-colors relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#FF6B000a,transparent_35%)]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-widest text-brand-orange uppercase bg-orange-950/50 px-4 py-2 rounded-full border border-orange-500/20">
                Hubungi Kami
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-6 mb-4">
                Kontak Resmi & Peta Workshop
              </h1>
              <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
                Kunjungi pabrik perakitan kami langsung atau konsultasikan rancangan UPVC Anda dengan tim teknis kami secara langsung.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              <div className="flex flex-col justify-between gap-8 bg-zinc-800/20 border border-zinc-800/80 p-8 md:p-10 rounded-3xl">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight mb-8">
                    Informasi Kontak
                  </h2>

                  <div className="space-y-8">
                    {settings?.contact_address && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-zinc-800 rounded-xl text-brand-orange">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">Alamat Produksi</h4>
                          <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                            {settings.contact_address}
                          </p>
                        </div>
                      </div>
                    )}

                    {settings?.contact_website && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-zinc-800 rounded-xl text-brand-orange">
                          <Globe className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">Website Resmi</h4>
                          <a 
                            href={`http://${settings.contact_website.toLowerCase()}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-zinc-400 hover:text-brand-orange text-sm mt-1 transition-colors block uppercase"
                          >
                            {settings.contact_website}
                          </a>
                        </div>
                      </div>
                    )}

                    {settings?.contact_whatsapp && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-zinc-800 rounded-xl text-brand-orange">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">WhatsApp Admin</h4>
                          <a 
                            href={whatsappLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-brand-orange hover:underline text-sm mt-1 transition-colors block"
                          >
                            {settings.contact_whatsapp}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800/80">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full justify-center items-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-brand-orange/10 active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4" /> Chat Konsultasi Cepat (WhatsApp)
                  </a>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-800/80 p-8 md:p-10 rounded-3xl flex flex-col justify-between min-h-[450px]">
                <div className="w-full flex-grow flex flex-col justify-between">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3">Lokasi Strategis Workshop</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Kami melayani pemesanan, survei pengukuran lokasi, perakitan presisi, dan instalasi produk kusen UPVC berkualitas untuk seluruh wilayah Jabodetabek.
                    </p>
                  </div>
                  
                  {settings?.contact_maps_url && settings.contact_maps_url.trim().startsWith("<iframe") ? (
                    <div
                      className="w-full rounded-2xl overflow-hidden border border-zinc-800 flex-grow"
                      style={{ minHeight: 320 }}
                      dangerouslySetInnerHTML={{
                        __html: settings.contact_maps_url.replace(
                          /width="[^"]*"/g, 'width="100%"'
                        ).replace(
                          /height="[^"]*"/g, 'height="320"'
                        )
                      }}
                    />
                  ) : settings?.contact_maps_url ? (
                    <div className="w-full rounded-2xl overflow-hidden border border-zinc-800 flex-grow" style={{ minHeight: 320 }}>
                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.contact_maps_url)}&output=embed`}
                        width="100%"
                        height="320"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-zinc-500 text-sm gap-2 flex-grow min-h-[320px]">
                      <MapPin className="w-8 h-8 text-brand-orange animate-pulse" />
                      <span>Curug, Gn. Sindur, Bogor</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
