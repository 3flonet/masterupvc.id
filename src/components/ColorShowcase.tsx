"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { getSettings } from "@/utils/db";

interface ProductColor {
  id: string;
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
  description: string;
}

export default function ColorShowcase() {
  const colors: ProductColor[] = [
    {
      id: "putih",
      name: "Putih",
      hex: "#FFFFFF",
      bgClass: "bg-white border-zinc-300",
      textClass: "text-zinc-700",
      description: "Klasik, bersih, dan minimalis. Sempurna untuk estetika modern cerah.",
    },
    {
      id: "hitam",
      name: "Hitam",
      hex: "#1E1E24",
      bgClass: "bg-zinc-900 border-zinc-700",
      textClass: "text-zinc-300",
      description: "Gagah, industrial, dan kontemporer. Memberikan aksen berani pada fasad.",
    },
    {
      id: "coklat",
      name: "Coklat",
      hex: "#4A3B32",
      bgClass: "bg-[#4A3B32] border-[#5E4D43]",
      textClass: "text-[#E6DCD5]",
      description: "Hangat dan natural. Memberikan nuansa elegan alami yang abadi.",
    },
    {
      id: "golden-oak",
      name: "Serat Kayu Golden Oak",
      hex: "#C68B59",
      bgClass: "bg-[#C68B59] border-[#D19B6D]",
      textClass: "text-[#FAF6F0]",
      description: "Kombinasi kemewahan kayu jati alami dengan daya tahan tinggi UPVC.",
    },
  ];

  const [selectedColor, setSelectedColor] = useState<ProductColor>(colors[0]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadSettings();
  }, []);

  const getColorImage = (colorId: string) => {
    if (!settings) return null;
    if (colorId === "putih") return settings.color_image_putih;
    if (colorId === "hitam") return settings.color_image_hitam;
    if (colorId === "coklat") return settings.color_image_coklat;
    if (colorId === "golden-oak") return settings.color_image_golden_oak;
    if (colorId === "orange") return settings.color_image_orange;
    return null;
  };

  return (
    <section id="warna" className="py-24 bg-zinc-50 dark:bg-zinc-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/50 px-3 py-1.5 rounded-full">
            Estetika Premium
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-charcoal dark:text-white mt-4">
            Variasi Warna Profil UPVC
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-lg">
            Pilih dari varian warna eksklusif kami untuk melengkapi gaya arsitektur dan interior bangunan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Preview Canvas */}
          {getColorImage(selectedColor.id) ? (
            <div className="relative flex justify-center items-center min-h-[400px]">
              <img 
                src={getColorImage(selectedColor.id)} 
                alt={`Profil warna ${selectedColor.name}`} 
                className="w-full max-w-full max-h-[480px] object-contain transition-all duration-500 drop-shadow-xl" 
              />
            </div>
          ) : (
            /* Fallback: Interactive Preview Canvas */
            <div className="relative flex justify-center items-center p-8 md:p-12 rounded-3xl bg-zinc-100/30 dark:bg-zinc-900/30 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl overflow-hidden min-h-[400px]">
              {/* Visual Glassmorphism Glow */}
              <div 
                className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-25 transition-all duration-700"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <div 
                className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-25 transition-all duration-700"
                style={{ backgroundColor: selectedColor.hex }}
              />
              {/* Interactive Vector Door/Window Component */}
              <div className="relative z-10 w-full max-w-[280px] aspect-[3/4] flex flex-col justify-between p-4 border-[12px] rounded-xl shadow-2xl transition-all duration-500 bg-zinc-100/10 backdrop-blur-sm"
                style={{ borderColor: selectedColor.hex }}
              >
                {/* Glass Panes */}
                <div className="w-full h-[45%] border-4 border-dashed rounded flex items-center justify-center bg-sky-200/20 dark:bg-sky-500/10"
                  style={{ borderColor: selectedColor.hex }}
                >
                  <div className="w-8 h-8 rounded-full border border-sky-400/30 rotate-45 flex items-center justify-center">
                    <div className="w-4 h-[1px] bg-sky-400/40" />
                  </div>
                </div>
                <div className="w-full h-[45%] border-4 border-dashed rounded flex items-center justify-center bg-sky-200/20 dark:bg-sky-500/10"
                  style={{ borderColor: selectedColor.hex }}
                >
                  {/* Door handle / aksen */}
                  <div className="absolute right-2 top-[50%] -translate-y-1/2 w-3.5 h-10 rounded-md shadow-md bg-zinc-400 dark:bg-zinc-600 border border-zinc-300 dark:border-zinc-700" />
                </div>
              </div>
            </div>
          )}

          {/* Color Details & Toggles */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-brand-charcoal dark:text-white mb-6">
              Pilih Warna Profil
            </h3>
            
            {/* Toggles */}
            <div className="flex flex-wrap gap-4 mb-8">
              {colors.map((color) => {
                const isSelected = selectedColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${color.bgClass} ${
                      isSelected 
                        ? "border-brand-orange scale-105 shadow-lg shadow-brand-orange/25" 
                        : "border-transparent"
                    }`}
                    title={color.name}
                    aria-label={`Pilih warna ${color.name}`}
                  >
                    {isSelected && (
                      <Check 
                        className={`w-5 h-5 ${
                          color.id === "putih" ? "text-zinc-800" : "text-white"
                        }`} 
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Color Info Panel */}
            <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <span 
                  className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-600"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <h4 className="text-xl font-bold text-brand-charcoal dark:text-white">
                  {selectedColor.name}
                </h4>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {selectedColor.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
