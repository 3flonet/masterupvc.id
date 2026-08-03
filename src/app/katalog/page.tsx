import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import Catalog from "@/components/Catalog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Produk Dinamis UPVC - Master UPVC",
  description: "Temukan koleksi lengkap kusen, pintu, dan jendela UPVC berkualitas tinggi di Master UPVC. Bandingkan spesifikasi, harga, dan pilih warna kustom secara dinamis.",
};

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-brand-charcoal dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Full Catalog Display */}
        <Catalog />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
