"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjects, getSettings, WebsiteSettings } from "@/utils/db";
import { Project } from "@/utils/seedData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { MapPin, Calendar, User, ArrowLeft, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [projs, sets] = await Promise.all([
          getProjects(),
          getSettings()
        ]);
        
        const activeProjs = projs.filter(p => p.active === 1);
        setAllProjects(activeProjs);
        const found = activeProjs.find(p => p.slug === slug);
        if (found) {
          setProject(found);
        }
        setSettings(sets);
      } catch (err) {
        console.error("Gagal memuat detail proyek:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-20 bg-zinc-50 dark:bg-zinc-950">
          <h2 className="text-2xl font-black text-brand-charcoal dark:text-white">Proyek Tidak Ditemukan</h2>
          <p className="text-zinc-500 text-sm mt-2">Halaman project yang Anda cari mungkin telah dinonaktifkan atau dihapus.</p>
          <Link
            href="/project"
            className="mt-6 inline-flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Project
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const whatsappPhone = settings?.contact_whatsapp 
    ? settings.contact_whatsapp.replace(/[^0-9]/g, "") 
    : "6281234567890";
  const waLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Halo Admin Master UPVC, saya tertarik dengan proyek *${project.title}* (${project.location}) dan ingin berkonsultasi mengenai estimasi harga/desain yang mirip.`)}`;

  const images = project.images || [];

  const handleNextImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((activeImageIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
  };

  const scrollCarouselLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollCarouselRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  const relatedProjects = allProjects.filter(p => p.slug !== slug);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors pt-32 pb-20">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <div className="mb-10">
            <Link
              href="/project"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-bold text-zinc-650 dark:text-zinc-300 bg-white dark:bg-brand-charcoal hover:border-brand-orange hover:text-brand-orange hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Project
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Gallery Slider Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative w-full aspect-video rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden shadow-md group">
                {images.length > 0 ? (
                  <img
                    src={images[activeImageIndex]}
                    alt={`${project.title} - Foto ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-sm bg-zinc-50 dark:bg-zinc-950">
                    Tidak Ada Foto Proyek
                  </div>
                )}

                {/* Navigation Chevrons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-brand-orange transition-colors cursor-pointer opacity-0 group-hover:opacity-100 duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-brand-orange transition-colors cursor-pointer opacity-0 group-hover:opacity-100 duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail navigation row */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-24 h-16 rounded-xl border overflow-hidden shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? "border-brand-orange ring-2 ring-brand-orange/20"
                          : "border-zinc-200/60 dark:border-zinc-850 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Project Information Column */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Project Card Info */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-brand-charcoal dark:text-white leading-tight">
                    {project.title}
                  </h1>
                </div>

                {/* Sidebar details grid */}
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                  {project.client_name && (
                    <div className="flex items-center gap-4 py-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-brand-orange flex items-center justify-center shrink-0">
                        <User className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nama Klien</div>
                        <div className="font-extrabold text-brand-charcoal dark:text-white">{project.client_name}</div>
                      </div>
                    </div>
                  )}

                  {project.location && (
                    <div className="flex items-center gap-4 py-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-brand-orange flex items-center justify-center shrink-0">
                        <MapPin className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lokasi Proyek</div>
                        <div className="font-extrabold text-brand-charcoal dark:text-white">{project.location}</div>
                      </div>
                    </div>
                  )}

                  {project.project_date && (
                    <div className="flex items-center gap-4 py-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-brand-orange flex items-center justify-center shrink-0">
                        <Calendar className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tanggal Selesai</div>
                        <div className="font-extrabold text-brand-charcoal dark:text-white">
                          {new Date(project.project_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Services badge area */}
                {project.services_used && project.services_used.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Layanan Terpasang:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.services_used.map((srv, idx) => (
                        <span 
                          key={idx}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-brand-orange border border-brand-orange/10"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action WA Button */}
                <div className="pt-4">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-black py-4 rounded-2xl text-sm transition-all shadow-lg shadow-brand-orange/15 cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    <Phone className="w-4.5 h-4.5" />
                    Tanyakan Proyek Ini
                  </a>
                </div>
              </div>

              {/* Project Description */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-4 text-left">
                <h3 className="font-extrabold text-brand-charcoal dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3">Deskripsi Proyek</h3>
                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

            </div>

          </div>

          {/* Related Projects Carousel Section */}
          {relatedProjects.length > 0 && (
            <div className="mt-16 pt-12 border-t border-zinc-200/60 dark:border-zinc-800/60 text-left space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brand-orange">
                    Rekomendasi Proyek
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-brand-charcoal dark:text-white tracking-tight mt-1">
                    Project Terkait Lainnya
                  </h2>
                </div>
                {/* Arrow navigation buttons */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={scrollCarouselLeft}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 hover:border-brand-orange hover:text-brand-orange transition-all cursor-pointer bg-white dark:bg-brand-charcoal hover:shadow-md"
                    title="Slide Kiri"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={scrollCarouselRight}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 hover:border-brand-orange hover:text-brand-orange transition-all cursor-pointer bg-white dark:bg-brand-charcoal hover:shadow-md"
                    title="Slide Kanan"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Carousel wrapper */}
              <div 
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-1"
              >
                {relatedProjects.map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/project/${proj.slug}`}
                    className="w-[280px] sm:w-[320px] shrink-0 bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                  >
                    {/* Image area */}
                    <div className="w-full h-44 bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative">
                      {proj.images && proj.images.length > 0 ? (
                        <img
                          src={proj.images[0]}
                          alt={proj.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Tidak ada gambar</div>
                      )}
                      {proj.location && (
                        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-brand-orange" />
                          {proj.location.split(",")[0]}
                        </span>
                      )}
                    </div>
                    {/* Content area */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap gap-1">
                          {proj.services_used && proj.services_used.slice(0, 2).map((srv, idx) => (
                            <span 
                              key={idx}
                              className="text-[8px] font-black px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950/20 text-brand-orange border border-brand-orange/10"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                        <h4 className="text-sm font-extrabold text-brand-charcoal dark:text-white line-clamp-2 group-hover:text-brand-orange transition-colors">
                          {proj.title}
                        </h4>
                      </div>
                      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-[9px] font-bold text-zinc-450 dark:text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        {proj.project_date ? new Date(proj.project_date).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : "-"}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
