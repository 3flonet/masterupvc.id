"use client";

import React, { useState, useEffect } from "react";
import { getProjects, getSettings, getServices, WebsiteSettings } from "@/utils/db";
import { Project, Service } from "@/utils/seedData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import Link from "next/link";
import { 
  MapPin, 
  Calendar, 
  Sparkles, 
  FolderOpen, 
  ArrowRight,
  DoorClosed,
  Grid,
  Layers,
  Utensils,
  ShowerHead,
  Bath
} from "lucide-react";

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case "DoorClosed": return <DoorClosed className="w-4 h-4 text-inherit" />;
    case "Grid": return <Grid className="w-4 h-4 text-inherit" />;
    case "Layers": return <Layers className="w-4 h-4 text-inherit" />;
    case "Utensils": return <Utensils className="w-4 h-4 text-inherit" />;
    case "ShowerHead": return <ShowerHead className="w-4 h-4 text-inherit" />;
    case "Bath": return <Bath className="w-4 h-4 text-inherit" />;
    default: return <Sparkles className="w-4 h-4 text-inherit" />;
  }
};

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [locations, setLocations] = useState<string[]>([]);
  const [activeLocationFilter, setActiveLocationFilter] = useState("Semua");

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, servs, sets] = await Promise.all([
          getProjects(),
          getServices(),
          getSettings()
        ]);
        
        const activeProds = prods.filter(p => p.active === 1);
        setProjects(activeProds);
        setServices(servs);
        setSettings(sets);

        // Extract unique locations for filtering
        const uniqueLocs = Array.from(new Set(activeProds.map(p => {
          if (!p.location) return "";
          const parts = p.location.split(",");
          return parts[parts.length - 1].trim(); // Get city/region
        }).filter(l => l !== "")));
        setLocations(uniqueLocs);

      } catch (err) {
        console.error("Gagal memuat data project:", err);
      } finally {
        setLoading(false);
      }
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

  // Filter projects logic
  const filteredProjects = projects.filter(project => {
    // Service filter
    const matchesService = activeFilter === "Semua" || 
      (project.services_used && project.services_used.includes(activeFilter));

    // Location filter
    const matchesLocation = activeLocationFilter === "Semua" || 
      (project.location && project.location.includes(activeLocationFilter));

    return matchesService && matchesLocation;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors pt-24 pb-20">
        
        {/* Hero Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-brand-charcoal text-white rounded-[2.5rem] overflow-hidden shadow-2xl p-8 md:p-16 relative flex items-center min-h-[350px]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -ml-20 -mb-20" />
            
            <div className="relative z-10 space-y-4 max-w-2xl text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-orange uppercase bg-brand-orange/10 px-4 py-2 rounded-full border border-brand-orange/20">
                <Sparkles className="w-3.5 h-3.5" /> Project Portfolio
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Galeri Hasil Kerja <br />
                <span className="text-brand-orange">Master UPVC</span>
              </h1>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                Telusuri kumpulan dokumentasi proyek pemasangan kusen pintu, jendela, kanopi, dan interior UPVC kami di berbagai wilayah hunian dan komersial.
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Search Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 space-y-4">
          {/* Services filter grid cards */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest">
              <FolderOpen className="w-3.5 h-3.5" /> Pilih Kategori Layanan:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {/* Semua Layanan Card */}
              <button
                onClick={() => setActiveFilter("Semua")}
                className={`relative overflow-hidden rounded-2xl p-4 text-left border transition-all duration-300 cursor-pointer group flex flex-col justify-between h-28 ${
                  activeFilter === "Semua"
                    ? "bg-brand-charcoal text-white border-brand-orange ring-4 ring-brand-orange/10"
                    : "bg-white dark:bg-brand-charcoal text-brand-charcoal dark:text-zinc-200 border-zinc-200/60 dark:border-zinc-800/60 hover:border-brand-orange/40 hover:-translate-y-0.5"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  activeFilter === "Semua" ? "bg-brand-orange text-white" : "bg-orange-50 dark:bg-orange-950/20 text-brand-orange"
                }`}>
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-xs tracking-tight uppercase">Semua Layanan</div>
              </button>

              {/* Individual Service Cards */}
              {services.map(s => {
                const isActive = activeFilter === s.title;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveFilter(s.title)}
                    className={`relative overflow-hidden rounded-2xl p-4 text-left border transition-all duration-300 cursor-pointer group flex flex-col justify-between h-28 ${
                      isActive
                        ? "bg-brand-charcoal text-white border-brand-orange ring-4 ring-brand-orange/10"
                        : "bg-white dark:bg-brand-charcoal text-brand-charcoal dark:text-zinc-200 border-zinc-200/60 dark:border-zinc-800/60 hover:border-brand-orange/40 hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Background image on Hover/Active */}
                    {s.image_url && (
                      <div 
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 pointer-events-none opacity-0 ${
                          isActive ? "opacity-15" : "group-hover:opacity-[0.06]"
                        }`}
                        style={{ backgroundImage: `url(${s.image_url})` }}
                      />
                    )}
                    
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors z-10 ${
                      isActive ? "bg-brand-orange text-white" : "bg-orange-50 dark:bg-orange-950/20 text-brand-orange"
                    }`}>
                      {getServiceIcon(s.icon)}
                    </div>
                    
                    {/* Title */}
                    <div className="font-extrabold text-xs tracking-tight uppercase line-clamp-2 z-10">
                      {s.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location filter row */}
          {locations.length > 0 && (
            <div className="flex flex-wrap gap-2.5 items-center pt-2 border-t border-zinc-200/50 dark:border-zinc-850">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Lokasi Wilayah:
              </span>
              <button
                onClick={() => setActiveLocationFilter("Semua")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeLocationFilter === "Semua"
                    ? "bg-brand-charcoal dark:bg-white dark:text-brand-charcoal text-white"
                    : "bg-white dark:bg-brand-charcoal text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-100"
                }`}
              >
                Semua Lokasi
              </button>
              {locations.map(loc => (
                <button
                  key={loc}
                  onClick={() => setActiveLocationFilter(loc)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeLocationFilter === loc
                      ? "bg-brand-charcoal dark:bg-white dark:text-brand-charcoal text-white"
                      : "bg-white dark:bg-brand-charcoal text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-100"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Portfolio Listing Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-brand-charcoal rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/50">
              <FolderOpen className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white">Tidak Ada Proyek</h3>
              <p className="text-xs text-zinc-400 mt-1">Belum ada project yang cocok dengan penyaringan yang Anda pilih.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/${project.slug}`}
                  className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full"
                >
                  {/* Photo area */}
                  <div className="w-full h-56 bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative border-b border-zinc-100 dark:border-zinc-800">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-400 bg-zinc-50 dark:bg-zinc-950">
                        Tidak Ada Foto Proyek
                      </div>
                    )}
                    
                    {/* Location Badge on Image */}
                    {project.location && (
                      <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-orange" />
                        {project.location.split(",")[0]}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {project.services_used && project.services_used.slice(0, 2).map((srv, idx) => (
                          <span 
                            key={idx}
                            className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/20 text-brand-orange border border-brand-orange/10"
                          >
                            {srv}
                          </span>
                        ))}
                        {project.services_used && project.services_used.length > 2 && (
                          <span className="text-[9px] font-bold text-zinc-400 px-1 py-0.5">+{project.services_used.length - 2} lagi</span>
                        )}
                      </div>

                      <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white group-hover:text-brand-orange transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-brand-orange transition-colors">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {project.project_date ? new Date(project.project_date).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : "-"}
                      </span>
                      <span className="flex items-center gap-1">
                        Detail Proyek
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
