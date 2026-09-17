"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AdvantagesGrid from "@/components/AdvantagesGrid";
import ColorShowcase from "@/components/ColorShowcase";
import {
  getSettings,
  WebsiteSettings,
  Article,
  getServices } from "@/utils/db";
import { Service } from "@/utils/seedData";
import { 
  ArrowRight,
  MapPin,
  Globe,
  Phone,
  Shield,
  HelpCircle,
  ChevronDown,
  Calendar,
  BookOpen,
  Sparkles,
  DoorClosed,
  Grid,
  Layers,
  Utensils,
  ShowerHead,
  Bath,
  ShieldCheck,
  Factory,
  Ruler,
  Palette,
  Lock,
  Headphones
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import Testimonials from "@/components/Testimonials";

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case "DoorClosed": return <DoorClosed className="w-6 h-6" />;
    case "Grid": return <Grid className="w-6 h-6" />;
    case "Layers": return <Layers className="w-6 h-6" />;
    case "Utensils": return <Utensils className="w-6 h-6" />;
    case "ShowerHead": return <ShowerHead className="w-6 h-6" />;
    case "Bath": return <Bath className="w-6 h-6" />;
    default: return <Sparkles className="w-6 h-6" />;
  }
};

function getYoutubeThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}



export default function Home() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [workflowSteps, setWorkflowSteps] = useState<any[]>([
    { id: 1, step_number: "Step 01", icon: "💬", title: "Konsultasi", desc: "Diskusikan model, ukuran kusen, jendela/pintu, dan pilihan warna kustom sesuai kebutuhan ruang Anda." },
    { id: 2, step_number: "Step 02", icon: "📋", title: "Penawaran Harga", desc: "Dapatkan rincian estimasi biaya transparan, opsi material terbaik, dan proposal penawaran harga resmi." },
    { id: 3, step_number: "Step 03", icon: "👷", title: "Proses Pemasangan", desc: "Survei pengukuran fisik presisi ke lokasi proyek Anda, diikuti perakitan fabrikasi dan instalasi oleh tim ahli." },
    { id: 4, step_number: "Step 04", icon: "🛡️", title: "Finish & Garansi", desc: "Serah terima pekerjaan dengan jaminan kerapian maksimal, garansi ketahanan produk, dan kepuasan pelanggan." }
  ]);
  const [whyUsItems, setWhyUsItems] = useState<any[]>([
    { id: 1, title: "Garansi Resmi 10 Tahun", description: "Jaminan penuh bahwa profil UPVC kami tidak akan retak, melengkung, maupun memudar warnanya akibat paparan cuaca ekstrim tropis.", icon: "ShieldCheck" },
    { id: 2, title: "Pabrikasi Langsung", description: "Diproduksi langsung di workshop utama kami, menjamin biaya efisien tanpa perantara serta kontrol kualitas berlapis yang ketat.", icon: "Factory" },
    { id: 3, title: "Presisi Milimeter & Rapih", description: "Pemasangan presisi tinggi oleh tim pemasang profesional tersertifikasi untuk menjamin peredaman suara dan anti-bocor air yang sempurna.", icon: "Ruler" },
    { id: 4, title: "Custom Desain Bebas", description: "Sesuaikan bentuk, ukuran, tipe bukaan (ayun, geser, lipat) serta aksen warna profil dengan gaya arsitektur rumah impian Anda.", icon: "Palette" },
    { id: 5, title: "Multipoint Lock System", description: "Dilengkapi dengan sistem penguncian ganda di beberapa titik untuk memberikan tingkat keamanan ekstra bagi seluruh anggota keluarga.", icon: "Lock" },
    { id: 6, title: "Gratis Konsultasi & Survei", description: "Dapatkan layanan konsultasi estimasi biaya serta survei pengukuran fisik ke lokasi proyek Anda secara cuma-cuma (wilayah Jabodetabek).", icon: "Headphones" }
  ]);
  const [comparisons, setComparisons] = useState<any[]>([
    { id: 1, feature_name: "Ketahanan Rayap & Hama", upvc_value: "100% Anti Rayap", wood_value: "Sangat Rentan Keropos", alum_value: "Tahan Rayap", upvc_status: "positive", wood_status: "negative", alum_status: "neutral" },
    { id: 2, feature_name: "Kedap Suara (Kebisingan)", upvc_value: "Sangat Redam (Hingga 40dB)", wood_value: "Sedang", alum_value: "Bising (Transmisi Getar)", upvc_status: "positive", wood_status: "neutral", alum_status: "negative" },
    { id: 3, feature_name: "Ketahanan Api (Safety)", upvc_value: "Mencegah Penyebaran Api", wood_value: "Sangat Mudah Terbakar", alum_value: "Memuai / Melengkung", upvc_status: "positive", wood_status: "negative", alum_status: "neutral" },
    { id: 4, feature_name: "Terhadap Cuaca & Korosi", upvc_value: "Bebas Karat & Garansi 10 Tahun", wood_value: "Lapuk, Muai & Menyusut", alum_value: "Korosi / Karat Putih", upvc_status: "positive", wood_status: "negative", alum_status: "negative" }
  ]);

  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings();
      setSettings(data);
      if (data) {
        // Dynamically update document head
        document.title = data.seo_title || "Master UPVC Indonesia";
        
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement("meta");
          metaDesc.setAttribute("name", "description");
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", data.seo_description || "");

        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement("meta");
          metaKeywords.setAttribute("name", "keywords");
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute("content", data.seo_keywords || "");

        // Inject favicon dynamically
        let favLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (!favLink) {
          favLink = document.createElement("link");
          favLink.rel = "icon";
          document.head.appendChild(favLink);
        }
        favLink.href = data.favicon || "/favicon.ico";

        // Inject JSON-LD Schema
        let ldScript = document.getElementById("jsonld-schema") as HTMLScriptElement;
        if (!ldScript) {
          ldScript = document.createElement("script");
          ldScript.id = "jsonld-schema";
          ldScript.type = "application/ld+json";
          document.head.appendChild(ldScript);
        }
        ldScript.text = JSON.stringify(data.schema_json || {});
      }
    }
    loadSettings();
    fetch("/api/products")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) {
          const featuredOnly = data.filter((p: any) => p.is_featured === 1);
          setFeaturedProducts(featuredOnly);
        } })
      .catch(err => console.error(err));

    fetch("/api/workflow-steps")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setWorkflowSteps(data.filter((s: any) => s.is_active !== 0)); })
      .catch(err => console.error("Error loading workflow-steps:", err));

    fetch("/api/why-us")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setWhyUsItems(data.filter((i: any) => i.active !== 0)); })
      .catch(err => console.error("Error loading why-us:", err));

    fetch("/api/comparisons")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setComparisons(data); })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch("/api/articles?status=published&limit=3")
      .then((r) => r.json())
      .then((d) => setLatestArticles(d.articles || []))
      .catch(() => {});

    fetch("/api/social-wall")
      .then((r) => r.json())
      .then((d) => setSocialPosts(d || []))
      .catch(() => {});

    getServices()
      .then((data) => setServices(data.filter(s => s.active === 1)))
      .catch(() => {});
  }, []);

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const whatsappPhone = settings?.contact_whatsapp 
    ? settings.contact_whatsapp.replace(/[^0-9]/g, "") 
    : "6281234567890";

  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Halo Admin, saya tertarik dengan produk Anda.")}`;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden bg-gradient-to-br from-white via-zinc-100 to-orange-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-orange-950/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
              <Shield className="w-3.5 h-3.5" />
              Best Production in Town
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-brand-charcoal dark:text-white leading-[1.1] mb-8 animate-slide-up">
              Transformasi Estetika & Ketahanan Bersama{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">
                {settings?.seo_title ? settings.seo_title.split(" - ")[0] : "Master UPVC"}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
              {settings?.seo_description || "Pintu dan Jendela premium dengan bahan UPVC berkualitas tinggi yang tahan cuaca ekstrem, kedap suara, anti rayap, dan dirancang presisi untuk hunian modern Anda."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/katalog"
                className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-brand-orange/20 transition-all duration-200 hover:scale-105 active:scale-95 text-base w-full sm:w-auto justify-center"
              >
                Lihat Katalog
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/profil"
                className="flex items-center justify-center font-bold px-8 py-4 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors text-base w-full sm:w-auto"
              >
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="tentang" className="py-24 bg-white dark:bg-zinc-950 transition-colors border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/50 px-3 py-1.5 rounded-full">
                Tentang Kami
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-charcoal dark:text-white mt-4 mb-6">
                Komitmen Kami Terhadap Kualitas dan Kepuasan Anda
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                Kami adalah produsen dan penyedia solusi profil UPVC (Unplasticized Polyvinyl Chloride) terbaik. Kami hadir untuk membantu Anda mentransformasi katalog statis menjadi solusi hunian dinamis yang presisi dan mewah.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Setiap profil kami diproses menggunakan teknologi termodern untuk memastikan ketahanan luar biasa terhadap sinar matahari, air hujan, rayap, dan korosi perkotaan. Sempurna untuk pintu panel kombinasi jalusi maupun jendela sliding modern.
              </p>
            </div>
            
            <div className="relative p-8 rounded-3xl bg-zinc-50 dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg flex flex-col justify-center min-h-[300px]">
              <div className="absolute top-6 left-6 text-zinc-300 dark:text-zinc-700 text-7xl font-black select-none pointer-events-none">
                UPVC
              </div>
              <blockquote className="relative z-10 text-lg italic text-brand-charcoal/80 dark:text-zinc-300 mb-6 leading-relaxed">
                &ldquo;Kami memadukan kekuatan material masa depan dengan desain arsitektur masa kini untuk menciptakan kenyamanan hunian tanpa batas.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <div className="font-bold text-brand-charcoal dark:text-white">Master UPVC Team</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Pakar UPVC Pintu & Jendela</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdvantagesGrid />

      {/* Material Comparison Section */}
      <section className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/50 px-3 py-1.5 rounded-full">
              Perbandingan Material
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-charcoal dark:text-white mt-4">
              Mengapa Anda Harus Beralih ke UPVC?
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-sm sm:text-base">
              Perbandingan performa, daya tahan, dan investasi jangka panjang antara profil UPVC dengan Kayu Tradisional dan Aluminium biasa.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl bg-zinc-50/20 dark:bg-zinc-900/10 backdrop-blur-sm">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="bg-zinc-100/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="p-6 text-sm font-extrabold text-brand-charcoal dark:text-white">Fitur Perbandingan</th>
                  <th className="p-6 text-sm font-extrabold text-brand-orange bg-brand-orange/5 dark:bg-brand-orange/10">UPVC Premium</th>
                  <th className="p-6 text-sm font-extrabold text-zinc-500">Kayu Tradisional</th>
                  <th className="p-6 text-sm font-extrabold text-zinc-500">Aluminium Biasa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {comparisons.map((row: any) => (
                  <tr key={row.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                    <td className="p-6 text-sm font-bold text-brand-charcoal dark:text-white">
                      {row.feature_name}
                    </td>
                    <td className="p-6 text-sm font-extrabold text-emerald-500 bg-brand-orange/5 dark:bg-brand-orange/10">
                      ✓ {row.upvc_value}
                    </td>
                    <td className={"p-6 text-sm " + (row.wood_status === 'negative' ? 'text-red-500' : 'text-zinc-600 dark:text-zinc-400')}>
                      {(row.wood_status === 'negative' ? '✕ ' : '• ') + row.wood_value}
                    </td>
                    <td className={"p-6 text-sm " + (row.alum_status === 'negative' ? 'text-red-500' : 'text-zinc-600 dark:text-zinc-400')}>
                      {(row.alum_status === 'negative' ? '✕ ' : '• ') + row.alum_value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="layanan" className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/50 px-3 py-1.5 rounded-full">
              Layanan Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-charcoal dark:text-white mt-4">
              Solusi Konstruksi & Aset UPVC Premium
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-sm sm:text-base">
              Dari kebutuhan kusen pintu jendela minimalis hingga kustomisasi plafon dan kitchen set berdaya tahan tinggi, kami siap mewujudkan hunian impian Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const whatsappPhone = settings?.contact_whatsapp 
                ? settings.contact_whatsapp.replace(/[^0-9]/g, "") 
                : "6281234567890";
              const waLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Halo Admin Master UPVC, saya tertarik dengan layanan *${service.title}* dan ingin berkonsultasi mengenai estimasi harga/desain.`)}`;

              return (
                <a
                  key={service.id}
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-md hover:border-brand-orange/40 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[360px] group cursor-pointer"
                >
                  {service.image_url && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-[0.03] group-hover:opacity-10 dark:group-hover:opacity-15 transition-opacity duration-500 z-0" 
                      style={{ backgroundImage: `url(${service.image_url})` }}
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-start">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 text-brand-orange flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white group-hover:rotate-12 transition-all duration-300">
                      {getServiceIcon(service.icon)}
                    </div>

                    <div className="mt-6 space-y-3">
                      <h3 className="text-xl font-extrabold text-brand-charcoal dark:text-white group-hover:text-brand-orange transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-4">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 group-hover:text-brand-orange uppercase tracking-wider transition-colors flex items-center gap-1.5">
                      Konsultasi Layanan
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <ColorShowcase />

      {/* Why Master UPVC Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/50 px-3 py-1.5 rounded-full">
              Mengapa Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-charcoal dark:text-white mt-4">
              Mengapa Harus Master UPVC?
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-sm sm:text-base">
              Mutu tinggi, presisi sempurna, dan layanan menyeluruh yang membedakan kami dari pabrikan profil biasa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUsItems.map((item: any) => (
              <div key={item.id} className="p-8 rounded-3xl bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-brand-orange mb-6 font-bold group-hover:scale-110 transition-transform">
                  {item.icon === "Factory" && <Factory className="w-6 h-6 text-brand-orange" />}
                  {item.icon === "Ruler" && <Ruler className="w-6 h-6 text-brand-orange" />}
                  {item.icon === "Palette" && <Palette className="w-6 h-6 text-brand-orange" />}
                  {item.icon === "Lock" && <Lock className="w-6 h-6 text-brand-orange" />}
                  {item.icon === "Headphones" && <Headphones className="w-6 h-6 text-brand-orange" />}
                  {(item.icon === "ShieldCheck" || !["Factory","Ruler","Palette","Lock","Headphones"].includes(item.icon)) && <ShieldCheck className="w-6 h-6 text-brand-orange" />}
                </div>
                <h3 className="text-lg font-bold text-brand-charcoal dark:text-white mb-3">{item.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Catalog Digital CTA Section */}
      <section id="katalog" className="py-24 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/50 px-4 py-2 rounded-full border border-orange-200 dark:border-orange-900/30">
              <Sparkles className="w-3.5 h-3.5" /> Katalog Digital
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-brand-charcoal dark:text-white leading-tight">
              {settings?.catalog_title || "Pilihan Kusen, Jendela & Pintu UPVC Premium"}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              {settings?.catalog_description || "Jelajahi berbagai tipe produk UPVC terbaik kami mulai dari tipe sliding, folding, swing, hingga kaca mati dengan varian warna serat kayu jati, hitam, putih, dan abu-abu."}
            </p>
          </div>

          {/* Featured Products Dynamic Grid */}
          {featuredProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.slice(0, 8).map((product: any, idx: number) => {
                const variants = product.variants || [];
                const firstVar = variants[0] || {};
                const currentPrice = firstVar.price || 0;
                const originalPrice = firstVar.original_price || firstVar.normal_price || 0;
                const hasDiscount = originalPrice > currentPrice;
                const discountPercent = hasDiscount
                  ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                  : 0;

                return (
                  <Link
                    key={product.id || idx}
                    href="/katalog"
                    className="group bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-brand-orange/50 hover:shadow-xl hover:shadow-brand-orange/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image / Graphic Container */}
                      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100/40 dark:from-zinc-800 dark:to-zinc-900/80 relative flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-3">
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center text-brand-orange mb-1 group-hover:scale-110 transition-transform">
                              {product.category_name?.toLowerCase().includes("pintu") ? (
                                <DoorClosed className="w-7 h-7" />
                              ) : (
                                <Grid className="w-7 h-7" />
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Master UPVC</span>
                          </div>
                        )}

                        {/* Discount Badge */}
                        {hasDiscount && (
                          <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md px-2.5 py-1 rounded-full">
                            Hemat {discountPercent}%
                          </span>
                        )}

                        {/* Tier Badge */}
                        {product.tier && (
                          <span className="absolute top-2.5 right-2.5 text-[10px] font-black uppercase tracking-wider bg-amber-500/90 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-sm">
                            {product.tier}
                          </span>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-4 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span className="font-semibold text-brand-orange">
                            {product.category_name || "UPVC Premium"}
                          </span>
                          {product.dimensions && (
                            <span className="font-mono text-[10px]">
                              {product.dimensions}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-brand-charcoal dark:text-white leading-snug group-hover:text-brand-orange transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                    </div>

                    {/* Footer Price */}
                    <div className="p-4 pt-0 mt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-end justify-between pt-3">
                      <div>
                        {hasDiscount && (
                          <span className="text-[10px] text-zinc-400 line-through block">
                            Rp {originalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                        {currentPrice > 0 ? (
                          <>
                            <span className="text-[10px] text-zinc-400 block">Mulai dari</span>
                            <span className="font-extrabold text-brand-charcoal dark:text-white text-sm">
                              Rp {currentPrice.toLocaleString("id-ID")}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium text-zinc-400 italic text-xs">Konsultasi Harga</span>
                        )}
                      </div>
                      <span className="text-brand-orange font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Detail <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center">
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-lg shadow-brand-orange/15 hover:shadow-brand-orange/25 transform hover:-translate-y-0.5"
            >
              Lihat Katalog Lengkap ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic AI FAQ Section (LLM-Friendly) */}
      {settings && settings.ai_knowledge && settings.ai_knowledge.length > 0 && (
        <section className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/50 px-3 py-1.5 rounded-full">
                Tanya Jawab
              </span>
              <h2 className="text-3xl font-extrabold text-brand-charcoal dark:text-white mt-4">
                Informasi & Spesifikasi Terstruktur
              </h2>
              <p className="text-zinc-500 mt-2 text-sm">
                Informasi penting seputar bahan UPVC dan layanan kami.
              </p>
            </div>

            <div className="space-y-4">
              {settings.ai_knowledge.map((item, idx) => {
                const isOpen = faqOpenIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl overflow-hidden bg-zinc-50/30 dark:bg-zinc-900/10 transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-brand-charcoal dark:text-white focus:outline-none"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-brand-orange flex-shrink-0" />
                        {item.question}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* Artikel Terbaru Section */}
      {latestArticles.length > 0 && (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-semibold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/50 px-3 py-1.5 rounded-full">
                  Blog &amp; Artikel
                </span>
                <h2 className="text-3xl font-extrabold text-brand-charcoal dark:text-white mt-4">
                  Tips &amp; Inspirasi UPVC Terbaru
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm max-w-xl">
                  Panduan, tips, dan inspirasi desain terkini seputar material UPVC untuk hunian modern Anda.
                </p>
              </div>
              <Link
                href="/artikel"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-brand-orange text-brand-orange text-sm font-bold hover:bg-brand-orange hover:text-white transition-all"
              >
                Lihat Semua Artikel <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestArticles.map((article) => {
                const thumb =
                  article.media_type === "youtube" && article.media_value
                    ? getYoutubeThumbnail(article.media_value)
                    : article.media_value || null;
                const date = article.published_at || article.created_at || null;
                return (
                  <Link
                    key={article.id}
                    href={`/artikel/${article.slug}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-700/60 bg-white dark:bg-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative h-48 bg-zinc-100 dark:bg-zinc-700 overflow-hidden">
                      {thumb ? (
                        <img src={thumb} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                        </div>
                      )}
                      {article.media_type === "youtube" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        </div>
                      )}
                      {article.category_name && (
                        <span className="absolute top-3 left-3 bg-brand-orange/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {article.category_name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 group-hover:text-brand-orange transition-colors leading-snug mb-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-700 mt-auto">
                        {date && (
                          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(date).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})}</span>
                          </div>
                        )}
                        <span className="text-brand-orange text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Baca <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Alur Pemesanan & Pemasangan */}
      <section className="py-24 bg-white dark:bg-zinc-950 text-brand-charcoal dark:text-white border-t border-zinc-100 dark:border-zinc-900 transition-colors relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/50 px-4 py-2 rounded-full border border-orange-200 dark:border-orange-900/30">
              Bagaimana Kami Bekerja
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Alur Pemesanan & Pemasangan
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl mx-auto">
              Prosedur profesional dari tahap awal diskusi hingga serah terima garansi produk.
            </p>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 relative mb-16">
            {/* Background connecting line on desktop */}
            {workflowSteps.length > 1 && (
              <div className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-[1px] border-t border-dashed border-brand-orange/30 z-0 pointer-events-none" />
            )}

            {workflowSteps.map((item: any, idx: number) => (
              <div key={item.id || idx} className="relative group flex-1 z-10">
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 p-8 rounded-3xl relative hover:border-brand-orange/40 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-brand-orange/10 dark:bg-brand-orange/5 border border-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange text-2xl font-bold mb-6 relative z-10">
                      {item.icon || "💬"}
                    </div>
                    <span className="absolute top-6 right-6 text-xs font-black tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full uppercase">
                      {item.step_number || `Step 0${idx + 1}`}
                    </span>
                    <h3 className="text-lg font-black tracking-tight mb-2 text-brand-charcoal dark:text-white">{item.title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                      {item.desc || item.description}
                    </p>
                  </div>
                </div>
                {/* Arrow Connector between steps */}
                {idx < workflowSteps.length - 1 && (
                  <div className="hidden lg:flex absolute top-[52px] -right-7 w-6 h-6 rounded-full bg-white dark:bg-zinc-950 border border-brand-orange/20 items-center justify-center text-[10px] text-brand-orange font-bold tracking-tighter hover:border-brand-orange transition-all duration-300 z-20 animate-slide-right-loop">
                    »
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Core Values Bar */}
          <div className="bg-brand-orange text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-around gap-6 shadow-xl shadow-brand-orange/10">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">💵</span>
              <div>
                <h4 className="font-extrabold text-sm uppercase tracking-wider">Bahan Berkualitas</h4>
                <p className="text-[10px] text-white/80">UPVC Standar Internasional</p>
              </div>
            </div>
            <div className="h-px md:h-10 w-full md:w-px bg-white/20" />
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">✨</span>
              <div>
                <h4 className="font-extrabold text-sm uppercase tracking-wider">Hasil Rapi</h4>
                <p className="text-[10px] text-white/80">Instalasi Presisi Tinggi</p>
              </div>
            </div>
            <div className="h-px md:h-10 w-full md:w-px bg-white/20" />
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">⏰</span>
              <div>
                <h4 className="font-extrabold text-sm uppercase tracking-wider">Tahan Lama</h4>
                <p className="text-[10px] text-white/80">Perlindungan Anti Keropos</p>
              </div>
            </div>
            <div className="h-px md:h-10 w-full md:w-px bg-white/20" />
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">👍</span>
              <div>
                <h4 className="font-extrabold text-sm uppercase tracking-wider">Kepuasan Utama</h4>
                <p className="text-[10px] text-white/80">Komitmen Layanan Terbaik</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Contact Section CTA (Strict 2-Column Layout) */}
      <section id="kontak" className="py-24 bg-zinc-900 text-white transition-colors relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#FF6B000a,transparent_35%)]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side text, bullet points, and CTA button */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-orange uppercase bg-orange-950/50 px-4 py-2 rounded-full border border-orange-500/20">
                💬 Hubungi Kami
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Konsultasikan Proyek UPVC Anda Bersama Kami
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                Dapatkan estimasi biaya pengerjaan kusen, pintu, & jendela UPVC secara gratis serta survei pengukuran fisik presisi langsung ke lokasi proyek Anda.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                  <span className="text-brand-orange text-lg">✓</span> Survei & Pengukuran Fisik Gratis
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                  <span className="text-brand-orange text-lg">✓</span> Rincian Penawaran Harga Transparan
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                  <span className="text-brand-orange text-lg">✓</span> Pilihan Varian Warna & Aksesori Lengkap
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                  <span className="text-brand-orange text-lg">✓</span> Konsultasi Teknis & Gambar Proyek
                </div>
              </div>
              <div className="pt-4">
                <Link
                  href="/kontak"
                  className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-lg shadow-brand-orange/15 hover:shadow-brand-orange/25 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Hubungi Kami & Peta Lokasi Lengkap ↗
                </Link>
              </div>
            </div>

            {/* Right side: Embed Maps & Alamat */}
            <div className="lg:col-span-5 space-y-4">
              {/* Google Maps Iframe */}
              {settings?.contact_maps_url && settings.contact_maps_url.trim().startsWith("<iframe") ? (
                <div
                  className="w-full rounded-2xl overflow-hidden border border-zinc-700"
                  style={{ minHeight: 300 }}
                  dangerouslySetInnerHTML={{
                    __html: settings.contact_maps_url.replace(
                      /width="[^"]*"/g, 'width="100%"'
                    ).replace(
                      /height="[^"]*"/g, 'height="300"'
                    )
                  }}
                />
              ) : settings?.contact_maps_url ? (
                <div className="w-full rounded-2xl overflow-hidden border border-zinc-700" style={{ minHeight: 300 }}>
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.contact_maps_url)}&output=embed`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[16/10] rounded-2xl bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center text-zinc-500 text-sm gap-2">
                  <MapPin className="w-8 h-8 text-brand-orange animate-pulse" />
                  <span>Curug, Gn. Sindur, Bogor</span>
                </div>
              )}

              {/* Address below map */}
              {settings?.contact_address && (
                <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/50 p-4 rounded-2xl text-left">
                  <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-white">Alamat Workshop Produksi:</h4>
                    <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                      {settings.contact_address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Social Feed CTA Section (Dynamic Bento Grid Layout) */}
      <section className="py-24 bg-zinc-950 text-white border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {(() => {
            const instagramPost = socialPosts.find(p => p.platform === 'instagram');
            const tiktokPost = socialPosts.find(p => p.platform === 'tiktok');

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Bento Card 1: Text & Main Action */}
                <div className="lg:col-span-6 bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-950/60 border border-indigo-500/10 p-8 md:p-10 rounded-3xl flex flex-col justify-between shadow-2xl relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/50 px-4 py-2 rounded-full border border-indigo-500/20">
                      <Sparkles className="w-3.5 h-3.5" /> Live Social Feed
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
                      Dokumentasi & Aktivitas Harian Kami
                    </h2>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Lihat galeri pengerjaan UPVC, video dokumentasi instalasi proyek pintu & jendela, serta keseruan aktivitas workshop kami yang diperbarui secara langsung dari Instagram & TikTok.
                    </p>
                  </div>
                    <Link
                      href="/social-wall"
                      className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-950 font-extrabold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-xl shadow-white/5 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      Kunjungi Live Social Wall ↗
                    </Link>
                  </div>
                    {/* Bento Card 2: Instagram Mockup (Clickable & Dynamic) */}
                <a
                  href={settings?.social_instagram || "https://www.instagram.com/masterupvc.id"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lg:col-span-3 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden group text-left transition-all hover:border-zinc-700 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-[7px] font-black text-white">UPVC</div>
                    </div>
                    <h4 className="text-[9px] font-black text-white">masterupvc.id</h4>
                  </div>
                  
                  {instagramPost && instagramPost.image_url ? (
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/50">
                      <img src={instagramPost.image_url} alt="Instagram Post" className="w-full h-full object-cover transition-all group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="w-full aspect-square rounded-lg bg-zinc-800 flex items-center justify-center text-2xl relative overflow-hidden">
                      🚪
                      <div className="absolute bottom-1.5 left-1.5 text-[8px] bg-black/60 px-1.5 py-0.5 rounded text-white/95">Pintu Swing</div>
                    </div>
                  )}

                  <div className="mt-3 flex flex-col gap-1">
                    <p className="text-[9px] text-zinc-400 font-medium truncate leading-relaxed">
                      {instagramPost ? instagramPost.caption : "Lihat pengerjaan proyek kami di Instagram"}
                    </p>
                    <div className="flex justify-between text-[8px] text-zinc-500 pt-1 border-t border-zinc-800/80">
                      <span>❤️ 142 Likes</span>
                      <span className="text-indigo-400 font-bold">Instagram</span>
                    </div>
                  </div>
                </a>

                {/* Bento Card 3: TikTok Mockup (Clickable & Dynamic) */}
                <a
                  href={settings?.social_tiktok || "https://www.tiktok.com/@masterupvc"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lg:col-span-3 bg-black border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden group text-left transition-all hover:border-zinc-700 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] text-teal-400">🎵</div>
                    <h4 className="text-[9px] font-black text-white">masterupvc</h4>
                  </div>

                  {tiktokPost && tiktokPost.image_url ? (
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 relative">
                      <img src={tiktokPost.image_url} alt="TikTok Post" className="w-full h-full object-cover transition-all group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <span className="text-white text-xs bg-black/60 w-8 h-8 rounded-full flex items-center justify-center">▶</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-square rounded-lg bg-zinc-900 flex items-center justify-center text-xl relative overflow-hidden">
                      🛠️
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                        <span className="text-white text-xs bg-white/20 px-2.5 py-1.5 rounded-full">▶</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex flex-col gap-1">
                    <p className="text-[9px] text-zinc-400 font-medium truncate leading-relaxed">
                      {tiktokPost ? tiktokPost.caption : "Tonton video seru kami di TikTok"}
                    </p>
                    <div className="flex justify-between text-[8px] text-zinc-500 pt-1 border-t border-zinc-800/80">
                      <span>💬 89 Comments</span>
                      <span className="text-rose-400 font-bold">TikTok</span>
                    </div>
                  </div>
                </a>
              </div>
            );
          })()}
        </div>
      </section>
      <Footer />
      <Chatbot />
    </div>
  );
}
