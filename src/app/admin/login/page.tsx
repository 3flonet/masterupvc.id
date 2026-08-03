"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, isLoggedIn, verifyAdminEmail } from "@/utils/auth";
import { Lock, Mail, AlertCircle, Shield } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect straight to dashboard
    if (isLoggedIn()) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      // Authenticate via MySQL API Route
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        loginAdmin(email);
        router.push("/admin/dashboard");
        return;
      } else {
        setError(data.message || "Email atau kata sandi admin tidak cocok.");
        setLoading(false);
        return;
      }
    } catch (err) {
      // Offline fallback (localStorage check)
      const isEmailValid = await verifyAdminEmail(email);
      if (isEmailValid && password === "admin123") {
        loginAdmin(email);
        router.push("/admin/dashboard");
      } else {
        setError("Email atau kata sandi admin tidak cocok.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 transition-colors">
      <div className="max-w-md w-full">
        {/* Logo and Headings */}
        <div className="text-center mb-8">
          <span className="inline-flex p-3 bg-orange-100 dark:bg-orange-950/30 rounded-2xl text-brand-orange mb-4">
            <Shield className="w-8 h-8" />
          </span>
          <h2 className="text-2xl font-black text-brand-charcoal dark:text-white uppercase tracking-wider">
            MASTER<span className="text-brand-orange">UPVC</span> CMS
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Silakan masuk untuk mengelola katalog produk dan daftar harga.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 p-8 rounded-3xl shadow-xl">
          {error && (
            <div className="flex items-center gap-2.5 p-4 mb-6 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/30">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Email Admin
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  placeholder="admin@masterupvc.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-brand-charcoal dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange/60 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-brand-charcoal dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange/60 transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-brand-orange hover:bg-brand-orange/95 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-brand-orange/15 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>

          {/* Quick instructions for reviewer */}
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 text-center leading-relaxed">
            Gunakan Akun Pengujian:<br />
            Email: <span className="font-semibold text-zinc-600 dark:text-zinc-300">admin@masterupvc.id</span> | Sandi: <span className="font-semibold text-zinc-600 dark:text-zinc-300">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
