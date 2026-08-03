"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Trash2, Check, Phone, Eye, Archive } from "lucide-react";

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: string;
  created_at: string;
}

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/contact-submissions");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/contact-submissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        showToast("Status lead berhasil diperbarui.", "success");
        fetchLeads();
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (err) {
      showToast("Gagal memperbarui status.", "error");
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus lead ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/contact-submissions?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showToast("Lead berhasil dihapus.", "success");
        fetchLeads();
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(null);
        }
      }
    } catch (err) {
      showToast("Gagal menghapus lead.", "error");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 uppercase tracking-wider">Baru</span>;
      case "contacted":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30 uppercase tracking-wider">Dihubungi</span>;
      case "archive":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/30 uppercase tracking-wider">Arsip</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-zinc-100 text-zinc-500 uppercase tracking-wider">{status}</span>;
    }
  };

  const getCleanedPhone = (phoneStr: string) => {
    return phoneStr.replace(/[^0-9]/g, "");
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold shadow-lg transition-all animate-slide-up ${
          toast.type === "success" 
            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200" 
            : "bg-red-600 text-white shadow-red-600/10"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-brand-charcoal dark:text-white tracking-tight">Kelola Leads Chatbot</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Tinjau data prospek masuk dari WhatsApp Chatbot, hubungi kembali pelanggan, dan perbarui status tindak lanjut.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leads Table */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm overflow-hidden">
          <h3 className="text-sm font-extrabold text-zinc-400 uppercase tracking-wider mb-4">Daftar Prospek Masuk</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <MessageSquare className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-800 mb-3" />
              <p className="text-sm font-semibold">Belum ada leads masuk dari chatbot.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-extrabold uppercase tracking-wider">
                    <th className="pb-3 pr-2">Tanggal</th>
                    <th className="pb-3 pr-2">Nama</th>
                    <th className="pb-3 pr-2">WhatsApp</th>
                    <th className="pb-3 pr-2">Status</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
                  {leads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 cursor-pointer ${
                        selectedLead && selectedLead.id === lead.id ? "bg-zinc-50 dark:bg-zinc-900/20" : ""
                      }`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="py-3.5 pr-2 text-zinc-500 font-medium">
                        {new Date(lead.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="py-3.5 pr-2 font-bold text-zinc-900 dark:text-white">{lead.name}</td>
                      <td className="py-3.5 pr-2 font-medium text-zinc-500">{lead.phone}</td>
                      <td className="py-3.5 pr-2">{getStatusBadge(lead.status)}</td>
                      <td className="py-3.5 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
                          title="Detail Lead"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg transition-colors"
                          title="Hapus Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Detail Panel */}
        <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm h-fit">
          <h3 className="text-sm font-extrabold text-zinc-400 uppercase tracking-wider mb-5">Rincian Prospek</h3>
          
          {selectedLead ? (
            <div className="space-y-5">
              
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Nama Lengkap</span>
                <p className="text-lg font-black text-brand-charcoal dark:text-white mt-0.5">{selectedLead.name}</p>
              </div>

              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Kontak</span>
                <div className="space-y-1.5 mt-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedLead.phone}</span>
                  </div>
                  {selectedLead.email && (
                    <div className="text-xs text-zinc-500 font-medium">
                      📧 {selectedLead.email}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Isi Konsultasi/Pesan</span>
                <div className="mt-1.5 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {selectedLead.message}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Ubah Status Tindak Lanjut</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, "new")}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${
                      selectedLead.status === "new"
                        ? "bg-red-500 text-white border-red-500"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50"
                    }`}
                  >
                    Baru
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, "contacted")}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${
                      selectedLead.status === "contacted"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50"
                    }`}
                  >
                    Dihubungi
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, "archive")}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${
                      selectedLead.status === "archive"
                        ? "bg-zinc-500 text-white border-zinc-500"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50"
                    }`}
                  >
                    Arsip
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                <a
                  href={`https://wa.me/${getCleanedPhone(selectedLead.phone)}?text=${encodeURIComponent(
                    `Halo ${selectedLead.name}, terima kasih telah menghubungi Master UPVC. Menindaklanjuti konsultasi Anda mengenai:\n\n"${selectedLead.message}"`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  Hubungi WA
                </a>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-zinc-400 border-2 border-dashed border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
              <p className="text-xs">Pilih salah satu prospek dari tabel untuk melihat rincian.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
