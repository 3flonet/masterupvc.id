"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  ShieldCheck, 
  Key, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Lock, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  X,
  Sparkles,
  RefreshCw,
  Shield
} from "lucide-react";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export default function UserManagerPanel() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal Add / Edit State
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);

  // Change Password Modal for specific admin
  const [passModalAdmin, setPassModalAdmin] = useState<AdminUser | null>(null);
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [savingPassModal, setSavingPassModal] = useState(false);

  // Change Password Form for Current Logged in User
  const [currentOldPass, setCurrentOldPass] = useState("");
  const [currentNewPass, setCurrentNewPass] = useState("");
  const [currentConfirmPass, setCurrentConfirmPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changingCurrentPass, setChangingCurrentPass] = useState(false);

  const showNotification = (msg: string, type: "success" | "error" = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin-users");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAdmins(data);
        } else if (data && Array.isArray(data.data)) {
          setAdmins(data.data);
        } else {
          setAdmins([]);
        }
      } else {
        setAdmins([]);
        showNotification("Gagal memuat data admin.", "error");
      }
    } catch (e: any) {
      setAdmins([]);
      showNotification("Terjadi kesalahan koneksi.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setFormData({ name: "", email: "", password: "" });
    setShowModal(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingAdmin(user);
    setFormData({ name: user.name || "", email: user.email, password: "" });
    setShowModal(true);
  };

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      showNotification("Email wajib diisi.", "error");
      return;
    }
    if (!editingAdmin && !formData.password) {
      showNotification("Password wajib diisi untuk admin baru.", "error");
      return;
    }

    setSaving(true);
    try {
      const url = "/api/admin-users";
      const method = editingAdmin ? "PUT" : "POST";
      const payload = editingAdmin 
        ? { id: editingAdmin.id, name: formData.name, email: formData.email, password: formData.password || undefined }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        showNotification(editingAdmin ? "Data admin berhasil diperbarui!" : "Admin baru berhasil ditambahkan!");
        setShowModal(false);
        fetchAdmins();
      } else {
        showNotification(data.error || "Gagal menyimpan admin.", "error");
      }
    } catch (err: any) {
      showNotification("Terjadi kesalahan server.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    const minId = Array.isArray(admins) && admins.length > 0 ? Math.min(...admins.map(a => a.id)) : 1;
    if (id === 1 || id === minId) {
      showNotification("Akun Super Admin Utama tidak dapat dihapus demi keamanan sistem.", "error");
      return;
    }
    if ((Array.isArray(admins) ? admins.length : 0) <= 1) {
      showNotification("Tidak bisa menghapus satu-satunya admin aktif.", "error");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin menghapus akun admin ini?")) return;

    try {
      const res = await fetch(`/api/admin-users?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showNotification("Admin berhasil dihapus.");
        fetchAdmins();
      } else {
        showNotification(data.error || "Gagal menghapus admin.", "error");
      }
    } catch (err) {
      showNotification("Terjadi kesalahan server.", "error");
    }
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passModalAdmin || !newAdminPassword) return;
    if (newAdminPassword.length < 6) {
      showNotification("Password minimal 6 karakter.", "error");
      return;
    }

    setSavingPassModal(true);
    try {
      const res = await fetch("/api/admin-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: passModalAdmin.id, password: newAdminPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Password untuk ${passModalAdmin.email} berhasil diubah!`);
        setPassModalAdmin(null);
        setNewAdminPassword("");
      } else {
        showNotification(data.error || "Gagal mengupdate password.", "error");
      }
    } catch (err) {
      showNotification("Terjadi kesalahan server.", "error");
    } finally {
      setSavingPassModal(false);
    }
  };

  const handleChangeCurrentPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOldPass || !currentNewPass || !currentConfirmPass) {
      showNotification("Harap isi semua kolom password.", "error");
      return;
    }
    if (currentNewPass !== currentConfirmPass) {
      showNotification("Konfirmasi password baru tidak cocok.", "error");
      return;
    }
    if (currentNewPass.length < 6) {
      showNotification("Password baru minimal 6 karakter.", "error");
      return;
    }

    setChangingCurrentPass(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: currentOldPass, newPassword: currentNewPass })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Password Anda berhasil diperbarui!");
        setCurrentOldPass("");
        setCurrentNewPass("");
        setCurrentConfirmPass("");
      } else {
        showNotification(data.error || "Gagal memperbarui password.", "error");
      }
    } catch (err) {
      showNotification("Terjadi kesalahan jaringan.", "error");
    } finally {
      setChangingCurrentPass(false);
    }
  };

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-zinc-200" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score, label: "Lemah", color: "bg-rose-500" };
    if (score <= 4) return { score, label: "Sedang", color: "bg-amber-500" };
    return { score, label: "Sangat Kuat", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(currentNewPass);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 ${
          toast.type === "success" 
            ? "bg-emerald-500/90 text-white border-emerald-400" 
            : "bg-rose-500/90 text-white border-rose-400"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-charcoal via-zinc-900 to-black text-white p-8 rounded-3xl border border-zinc-800 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-bold mb-3">
              <Shield className="w-3.5 h-3.5" /> Security & Access Management
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Kelola Administrator & Pengguna
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Atur daftar pengelola aplikasi, perbarui hak akses email admin, dan tingkatkan keamanan akun secara terpusat.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange/90 hover:to-amber-500/90 text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-brand-orange/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Admin Baru
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-brand-charcoal p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-brand-orange flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Admin Aktif</p>
            <h3 className="text-2xl font-black text-brand-charcoal dark:text-white mt-0.5">{admins.length} Pengguna</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-charcoal p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Enkripsi Keamanan</p>
            <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white mt-0.5">Bcrypt Hashing</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-charcoal p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Level Akses</p>
            <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white mt-0.5">Full Super Admin</h3>
          </div>
        </div>
      </div>

      {/* Main Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Admin Users List (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-brand-charcoal rounded-3xl border border-zinc-200/60 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-orange" /> Daftar Akun Admin
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Pengguna yang memiliki hak akses penuh ke dashboard ini</p>
              </div>
              <button 
                onClick={fetchAdmins}
                className="p-2 text-zinc-400 hover:text-brand-orange transition-colors cursor-pointer rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900"
                title="Refresh Daftar Admin"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-zinc-400 text-sm flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                Memuat akun admin...
              </div>
            ) : admins.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-sm">
                Belum ada data admin terdaftar.
              </div>
            ) : (
              <div className="space-y-4">
                {(Array.isArray(admins) ? admins : []).map((user, idx) => {
                  const initial = (user.name || user.email || "A").charAt(0).toUpperCase();
                  const minAdminId = admins.length > 0 ? Math.min(...admins.map(a => a.id)) : 1;
                  const isPrimary = user.id === 1 || user.id === minAdminId || idx === 0;

                  return (
                    <div 
                      key={user.id} 
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-brand-orange/30 hover:shadow-md transition-all duration-200 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-brand-orange/20 shrink-0">
                          {initial}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-sm text-brand-charcoal dark:text-white">
                              {user.name || "Administrator"}
                            </h4>
                            {isPrimary && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Admin Utama (Protected)
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Aktif
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-zinc-400" /> {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200/50 dark:border-zinc-800 justify-end">
                        <button
                          onClick={() => setPassModalAdmin(user)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200/50 dark:border-amber-800/50 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" /> Password
                        </button>
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        
                        {isPrimary ? (
                          <button
                            disabled
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 opacity-60 cursor-not-allowed flex items-center gap-1.5"
                            title="Akun Super Admin Utama tidak dapat dihapus demi keamanan"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-500" /> Protected
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteAdmin(user.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200/50 dark:border-rose-800/50 transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Hapus Admin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Change Current Logged In Admin Password */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-brand-charcoal rounded-3xl border border-zinc-200/60 dark:border-zinc-800 p-6 shadow-sm space-y-5">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-extrabold text-brand-charcoal dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-orange" /> Ganti Password Saya
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Perbarui kata sandi akun yang sedang aktif</p>
            </div>

            <form onSubmit={handleChangeCurrentPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Password Lama</label>
                <div className="relative">
                  <input
                    type={showOldPass ? "text" : "password"}
                    required
                    placeholder="Masukkan password lama"
                    value={currentOldPass}
                    onChange={(e) => setCurrentOldPass(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Password Baru</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    placeholder="Minimal 6 karakter"
                    value={currentNewPass}
                    onChange={(e) => setCurrentNewPass(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {currentNewPass && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500">
                      <span>Kekuatan Password:</span>
                      <span className={strength.score <= 2 ? "text-rose-500" : strength.score <= 4 ? "text-amber-500" : "text-emerald-500"}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${strength.color}`} 
                        style={{ width: `${(strength.score / 5) * 100}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Konfirmasi Password Baru</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    required
                    placeholder="Ulangi password baru"
                    value={currentConfirmPass}
                    onChange={(e) => setCurrentConfirmPass(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={changingCurrentPass}
                className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-brand-orange/20 cursor-pointer disabled:opacity-60 mt-2"
              >
                {changingCurrentPass ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Update Password Saya
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal: Tambah / Edit Admin */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-brand-charcoal rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-orange" />
                {editingAdmin ? "Edit Data Admin" : "Tambah Admin Baru"}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Ahmad Rizki"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Admin</label>
                <input
                  type="email"
                  required
                  placeholder="admin@masterupvc.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  {editingAdmin ? "Password Baru (Kosongkan jika tidak diubah)" : "Password"}
                </label>
                <input
                  type="password"
                  required={!editingAdmin}
                  placeholder={editingAdmin ? "••••••••" : "Minimal 6 karakter"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-orange hover:bg-brand-orange/95 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Simpan Admin"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change Specific Admin Password */}
      {passModalAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-brand-charcoal rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-500" /> Reset Password Admin
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Untuk akun: {passModalAdmin.email}</p>
              </div>
              <button 
                onClick={() => setPassModalAdmin(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangeAdminPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Password Baru Untuk Akun Ini</label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password baru"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setPassModalAdmin(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingPassModal}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {savingPassModal ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
