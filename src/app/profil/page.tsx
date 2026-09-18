"use client";

import React, { useState, useEffect } from "react";
import { getSettings, getLocalSettings, WebsiteSettings } from "@/utils/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { 
  Download, 
  CheckCircle, 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  Layers, 
  Activity, 
  Flame, 
  VolumeX, 
  Droplet, 
  Wind, 
  Hammer,
  ChevronRight
} from "lucide-react";

export default function ProfilPage() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getSettings();
      setSettings(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const defaultHeroImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
  const defaultAboutImg = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80";
  const defaultMissionImg = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors pt-24 pb-20">
      
      {/* Hero Section - Grid Asymmetric */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative bg-brand-charcoal text-white rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[500px] flex items-center">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='40' cy='40' r='1.2'/%3E%3Ccircle cx='70' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '40px' 
               }} 
          />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 md:p-16 items-center relative z-10 w-full">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-orange uppercase bg-brand-orange/10 px-4 py-2 rounded-full border border-brand-orange/20">
                <Sparkles className="w-3.5 h-3.5" /> Company Profile
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Master UPVC <br className="hidden md:inline" />
                <span className="text-brand-orange">Best Production</span> in Town
              </h1>
              <p className="text-zinc-300 text-sm md:text-base max-w-xl leading-relaxed">
                Solusi bangunan berbahan UPVC terbaik dan terpercaya di Indonesia. Kami menghadirkan inovasi kusen, pintu, dan jendela premium berstandar internasional yang tahan lama, aman, dan indah.
              </p>

              {settings?.company_profile_pdf && (
                <div className="pt-4">
                  <a
                    href={settings.company_profile_pdf}
                    download="Company_Profile_Master_UPVC.pdf"
                    className="inline-flex items-center gap-2.5 bg-brand-orange hover:bg-brand-orange/95 text-white font-black px-8 py-4 rounded-2xl text-sm transition-all shadow-lg shadow-brand-orange/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4.5 h-4.5" />
                    Unduh PDF Company Profile
                  </a>
                </div>
              )}
            </div>

            {/* Right Dynamic Image */}
            <div className="lg:col-span-5 relative w-full h-80 md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img 
                src={settings?.profile_image_hero || defaultHeroImg} 
                alt="Master UPVC Premium Residence" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                <span className="text-[10px] uppercase tracking-widest text-brand-orange font-bold block">Desain Modern</span>
                <span className="text-xs font-black text-white">Profil Jendela & Pintu Minimalis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Company - Left Text, Right Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Info */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-brand-orange uppercase">About Company</span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-charcoal dark:text-white mt-2 leading-tight">
              Kombinasi Sempurna Antara Ketahanan & Keindahan
            </h2>
          </div>
          
          <div className="space-y-6 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            <p className="font-semibold text-brand-charcoal dark:text-zinc-200">
              MASTER UPVC adalah perusahaan aplikator yang memproduksi kusen UPVC, Pintu UPVC dan Jendela UPVC. Kami memiliki tenaga kerja yang profesional sehingga menghasilkan pelayanan yang berkualitas, estetis dan fungsional.
            </p>
            <p>
              UPVC adalah <span className="italic font-bold">Unplasticized Poly Vinyl Chloride</span> yang 85% bahannya merupakan PVC ditambah 15% komposisi terdiri dari stabilisers, modifier, filler, color pigment, dan titanium dioxide. Komposisi ini membuat UPVC menjadi bahan yang kokoh dan kuat dalam kondisi dan cuaca apa pun.
            </p>
            <p>
              UPVC pertama kali ditemukan di Jerman pada tahun 1960 dan terus berkembang di Eropa sebagai salah satu material favorit utama untuk renovasi rumah tinggal maupun gedung perkantoran mewah.
            </p>
          </div>

          <div className="p-6 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl bg-white dark:bg-brand-charcoal shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-brand-orange shrink-0 mt-1">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-brand-charcoal dark:text-white">Presisi Pabrik Mandiri</h4>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                Setiap produk dirakit presisi menggunakan mesin modern dengan kendali mutu berlapis untuk memastikan kerapatan maksimum.
              </p>
            </div>
          </div>
        </div>

        {/* Right Dynamic About Image */}
        <div className="lg:col-span-5 relative w-full h-96 rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200/20 dark:border-zinc-800/60 group">
          <img 
            src={settings?.profile_image_about || defaultAboutImg} 
            alt="UPVC Doors Installation" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </section>

      {/* Why Master UPVC - Premium Cards */}
      <section className="bg-zinc-100/40 dark:bg-zinc-900/10 py-24 border-y border-zinc-200/40 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold tracking-widest text-brand-orange uppercase">Mengapa Kami</span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-charcoal dark:text-white leading-tight">
              5 Pilar Komitmen Master UPVC
            </h2>
            <p className="text-zinc-500 text-sm max-w-xl mx-auto">
              Kami memadukan keprofesionalan perakitan mandiri dengan pelayanan tulus untuk kepuasan proyek Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              { 
                num: "01", 
                title: "Kualitas Produk", 
                desc: "Perakitan mandiri di workshop kami menjamin kualitas kontrol ketat mulai dari perakitan hingga checklist instalasi." 
              },
              { 
                num: "02", 
                title: "Fast Respon", 
                desc: "Respons instan untuk administrasi, penawaran harga, estimasi jadwal produksi hingga pemasangan selesai." 
              },
              { 
                num: "03", 
                title: "Harga Kompetitif", 
                desc: "Harga transparan dan terjangkau untuk menunjang kebutuhan estetika hunian modern bernilai tinggi." 
              },
              { 
                num: "04", 
                title: "Custom Color", 
                desc: "Inovasi pilihan warna melimpah mulai dari Hitam, Putih, Coklat, Serat Kayu, hingga warna kustom khusus." 
              },
              { 
                num: "05", 
                title: "Our Service", 
                desc: "Pelayanan personal yang ramah, profesional, dan jaminan purna jual yang responsif kapan saja." 
              }
            ].map((pillar) => (
              <div key={pillar.num} className="p-6 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl bg-white dark:bg-brand-charcoal hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <span className="block text-3xl font-black text-zinc-300 dark:text-zinc-800 group-hover:text-brand-orange transition-colors">
                    {pillar.num}
                  </span>
                  <h4 className="text-sm font-black text-brand-charcoal dark:text-white tracking-wide">{pillar.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision, Mission & Workshop - Left Image, Right Text */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Dynamic Image */}
        <div className="lg:col-span-5 relative w-full h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200/20 dark:border-zinc-800/60 group">
          <img 
            src={settings?.profile_image_mission || defaultMissionImg} 
            alt="Master UPVC Welding and Cutting Factory" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-[10px] uppercase tracking-widest text-brand-orange font-bold block">Workshop Pabrikasi</span>
            <span className="text-xs font-black text-white">Mesin Press & Las Profesional</span>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-brand-orange uppercase">Visi & Misi</span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-charcoal dark:text-white mt-2 leading-tight">
              Membangun Masa Depan Berkelanjutan
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-sm font-black text-brand-charcoal dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-brand-orange">🎯</span> Misi Kami:
              </h3>
              <div className="space-y-3.5">
                {[
                  "Memberikan solusi dan produk terbaik untuk bangunan berbahan UPVC sesuai kebutuhan customer.",
                  "Meningkatkan kualitas SDM & kesejahteraan karyawan secara profesional.",
                  "Memberikan keuntungan yang berkesinambungan bagi pemegang saham.",
                  "Melakukan pengembangan bisnis yang ramah lingkungan dan berkelanjutan."
                ].map((misi, idx) => (
                  <div key={idx} className="flex gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{misi}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Passion", desc: "Semangat berkarya" },
                { title: "Integrity", desc: "Komitmen kejujuran" },
                { title: "Customer", desc: "Prioritas pelanggan" },
                { title: "Collaborative", desc: "Kerja sama solid" }
              ].map((value) => (
                <div key={value.title} className="p-4 border border-zinc-200/30 dark:border-zinc-800/40 rounded-2xl bg-white dark:bg-brand-charcoal/50">
                  <span className="block text-xs font-black text-brand-orange">{value.title}</span>
                  <span className="text-[10px] text-zinc-500 mt-1 block leading-tight">{value.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Benefits of UPVC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-extrabold tracking-widest text-brand-orange uppercase">Main Benefits</span>
          <h2 className="text-3xl md:text-4xl font-black text-brand-charcoal dark:text-white leading-tight">
            Keunggulan Utama Material UPVC
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto">
            UPVC dirancang secara ilmiah untuk memberikan keandalan maksimal jangka panjang melampaui kelemahan material konvensional.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Weather Resistant", icon: Wind, desc: "Tahan segala cuaca ekstrem & radiasi UV" },
            { title: "Noise Insulation", icon: VolumeX, desc: "Kedap suara meredam bising hingga 40 dB" },
            { title: "Dust Resistant", icon: ShieldCheck, desc: "Desain presisi rapat menahan debu masuk" },
            { title: "Rainwater Insulation", icon: Droplet, desc: "Sistem drainase khusus anti bocor air" },
            { title: "Anti Termite", icon: Compass, desc: "100% bebas dari ancaman rayap & lapuk" },
            { title: "Low Maintenance", icon: Hammer, desc: "Mudah dibersihkan, tanpa perlu cat ulang" },
            { title: "Energy Efficient", icon: Activity, desc: "Insulasi termal yang baik, menghemat AC" },
            { title: "Fire Retardant", icon: Flame, desc: "Tahan api, tidak merambatkan nyala api" }
          ].map((item) => (
            <div key={item.title} className="p-6 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl bg-white dark:bg-brand-charcoal flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-brand-orange">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-black text-brand-charcoal dark:text-white uppercase tracking-wider">{item.title}</h4>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Colors & Profile Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-brand-charcoal text-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold tracking-widest text-brand-orange uppercase">Custom Color & Type</span>
              <h2 className="text-3xl font-black leading-tight">
                Pilihan Varian Profil & Warna Kustom
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Kami menyediakan variasi profil premium dalam berbagai warna mewah untuk menyelaraskan dengan arsitektur rumah modern Anda.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Pintu & Jendela Sliding", type: "Geser Praktis" },
                  { name: "Pintu & Jendela Swing", type: "Engsel Klasik" },
                  { name: "Pintu/Jendela Lipat", type: "Bukaan Maksimal" },
                  { name: "Jendela Jungkit", type: "Sirkulasi Aman" }
                ].map((t) => (
                  <div key={t.name} className="flex items-center gap-2 text-xs text-zinc-300">
                    <ChevronRight className="w-4 h-4 text-brand-orange" />
                    <div>
                      <span className="font-extrabold block text-white">{t.name}</span>
                      <span className="text-[10px] text-zinc-500">{t.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors list */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-[2rem] p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  name: "BLACK VIBES", 
                  color: "bg-zinc-950", 
                  border: "border-zinc-800", 
                  desc: "Elegan, modern, dan minimalis", 
                  customImg: settings?.color_image_hitam,
                  defaultImg: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=300&q=80"
                },
                { 
                  name: "PURE WHITE", 
                  color: "bg-white", 
                  border: "border-zinc-200", 
                  desc: "Bersih, luas, dan klasik", 
                  customImg: settings?.color_image_putih,
                  defaultImg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80"
                },
                { 
                  name: "DEEP BROWN", 
                  color: "bg-amber-900", 
                  border: "border-amber-950", 
                  desc: "Hangat, alami, dan estetik", 
                  customImg: settings?.color_image_coklat,
                  defaultImg: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=300&q=80"
                },
                { 
                  name: "WOOD TEXTURE", 
                  color: "bg-amber-600", 
                  border: "border-amber-700", 
                  desc: "Golden Oak & Dark Oak", 
                  customImg: settings?.color_image_golden_oak,
                  defaultImg: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=300&q=80"
                }
              ].map((c) => {
                const displayImg = c.customImg || c.defaultImg;
                return (
                  <div key={c.name} className="flex gap-4 p-4 bg-zinc-950/40 border border-zinc-850/30 rounded-2xl items-center group/color">
                    <div className="w-14 h-14 rounded-full border border-white/20 overflow-hidden shrink-0 shadow-lg relative bg-zinc-900">
                      <img src={displayImg} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/color:scale-110" />
                      <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border border-zinc-900 shadow-inner ${c.color}`} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-black tracking-wide block text-white">{c.name}</span>
                      <p className="text-[9px] text-zinc-400 leading-normal">{c.desc}</p>
                    </div>
                  </div>
                );
              })}
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
