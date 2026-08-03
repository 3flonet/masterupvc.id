"use client";

import React from "react";
import { 
  Volume2, 
  Zap, 
  Droplet, 
  SunDim, 
  ShieldAlert, 
  Sparkles, 
  ShieldCheck, 
  Wind 
} from "lucide-react";

interface AdvantageItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function AdvantagesGrid() {
  const advantages: AdvantageItem[] = [
    {
      title: "Kedap Suara",
      description: "Sistem double-sealing meredam kebisingan luar hingga 40dB, menciptakan ketenangan maksimal.",
      icon: <Volume2 className="w-8 h-8 text-brand-orange" />,
    },
    {
      title: "Hemat Energi",
      description: "Konduktivitas termal yang rendah menjaga suhu ruangan tetap stabil dan menghemat penggunaan AC.",
      icon: <Zap className="w-8 h-8 text-brand-orange" />,
    },
    {
      title: "Tahan Air & Hujan",
      description: "Profil dirancang khusus dengan saluran pembuangan air terintegrasi, bebas bocor saat hujan deras.",
      icon: <Droplet className="w-8 h-8 text-brand-orange" />,
    },
    {
      title: "Tahan Cuaca Ekstrem",
      description: "Formula anti-UV berkualitas tinggi mencegah keretakan, kelapukan, dan perubahan warna akibat sinar matahari.",
      icon: <SunDim className="w-8 h-8 text-brand-orange" />,
    },
    {
      title: "Tahan Polusi",
      description: "Material solid yang kebal terhadap korosi asam akibat hujan asam dan udara perkotaan yang pekat.",
      icon: <Wind className="w-8 h-8 text-brand-orange" />,
    },
    {
      title: "Perawatan Mudah",
      description: "Permukaan halus yang tidak memerlukan pengecatan ulang. Cukup dibersihkan dengan kain basah.",
      icon: <Sparkles className="w-8 h-8 text-brand-orange" />,
    },
    {
      title: "Anti Rayap",
      description: "100% bebas dari ancaman rayap dan serangga perusak kayu lainnya sepanjang masa.",
      icon: <ShieldAlert className="w-8 h-8 text-brand-orange" />,
    },
    {
      title: "Anti Debu",
      description: "Kerapatan presisi tinggi mencegah partikel debu halus menyelinap masuk ke dalam rumah.",
      icon: <ShieldCheck className="w-8 h-8 text-brand-orange" />,
    },
  ];

  return (
    <section id="keunggulan" className="py-24 bg-white dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-semibold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/50 px-3 py-1.5 rounded-full">
            Kenapa UPVC?
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-charcoal dark:text-white mt-4">
            8 Pilar Keunggulan Material Master UPVC
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-lg">
            Investasi jangka panjang terbaik untuk kenyamanan, keamanan, dan keindahan hunian keluarga Anda.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv, idx) => (
            <div 
              key={idx}
              className="group relative p-8 rounded-3xl bg-zinc-50 dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 hover:border-brand-orange/40 dark:hover:border-brand-orange/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-300" />
              
              {/* Icon Container */}
              <div className="inline-flex p-4 bg-orange-50 dark:bg-orange-950/30 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {adv.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-brand-charcoal dark:text-white mb-3">
                {adv.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {adv.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
