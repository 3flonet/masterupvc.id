import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import SocialWall from "@/components/SocialWall";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Social Wall - Master UPVC",
  description: "Ikuti aktivitas, galeri pengerjaan, testimoni pemasangan, dan update workshop Master UPVC secara langsung dari Instagram & TikTok kami.",
};

export default function SocialWallPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Full Social Wall Display */}
        <SocialWall />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
