"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        setTimeout(() => {
          router.push("/admin/login");
        }, 2500);
      } else {
        setError(data.message || "Gagal mereset password.");
      }
    } catch (err: any) {
      setError("Gagal terhubung ke server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-zinc-100">Token Tidak Ditemukan</h2>
        <p className="text-xs text-zinc-400 mt-2">
          Tautan reset password tidak valid. Silakan ajukan ulang dari halaman lupa password.
        </p>
        <Link
          href="/admin/forgot-password"
          className="inline-block mt-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 rounded-xl transition-colors"
        >
          Minta Tautan Baru
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {emailParam && (
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400">
          Akun: <strong className="text-zinc-200">{emailParam}</strong>
        </div>
      )}

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Password Diperbarui</p>
            <p className="mt-1 text-emerald-400/90">{message}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Gagal</p>
            <p className="mt-1 text-rose-400/90">{error}</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-2">Password Baru</label>
        <input
          type="password"
          required
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Minimal 6 karakter"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-2">Konfirmasi Password Baru</label>
        <input
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Ulangi password baru"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
          </>
        ) : (
          "Simpan Password Baru"
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Buat Password Baru</h1>
          <p className="text-xs text-zinc-400 mt-2">Silakan masukkan password baru untuk akun Admin Anda.</p>
        </div>

        <Suspense fallback={<div className="text-center py-6 text-xs text-zinc-400"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Memuat...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

