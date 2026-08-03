import { supabase } from "./supabaseClient";
import { staticProducts, staticCategories, Product, Category, Service, staticServices, Project, staticProjects } from "./seedData";

const PRODUCTS_LOCAL_KEY = "masterupvc_products";
const CATEGORIES_LOCAL_KEY = "masterupvc_categories";
const TIERS_LOCAL_KEY = "masterupvc_tiers";
const SETTINGS_LOCAL_KEY = "masterupvc_settings";
const SERVICES_LOCAL_KEY = "masterupvc_services";
const PROJECTS_LOCAL_KEY = "masterupvc_projects";

export interface ProductTier {
  id: number;
  name: string;
}

const staticTiers: ProductTier[] = [
  { id: 1, name: "Hemat" },
  { id: 2, name: "Premium" },
  { id: 3, name: "Standar" }
];

export interface WebsiteSettings {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  favicon: string | null;
  logo: string | null;
  contact_address: string;
  contact_whatsapp: string;
  contact_website: string;
  contact_email: string;
  contact_description: string;
  contact_maps_url: string;
  social_instagram: string;
  social_facebook: string;
  social_tiktok: string;
  social_youtube: string;
  social_twitter: string;
  ai_knowledge: { question: string; answer: string }[];
  schema_json: any;
  analytics_script?: string;
  chatbot_active?: number;
  chatbot_name?: string;
  chatbot_avatar?: string | null;
  chatbot_initial_greeting?: string;
  chatbot_ask_name_message?: string;
  chatbot_ask_phone_message?: string;
  chatbot_ask_email_message?: string;
  chatbot_ask_reason_message?: string;
  chatbot_final_message?: string;
  company_profile_pdf?: string | null;
  profile_image_hero?: string | null;
  profile_image_about?: string | null;
  profile_image_mission?: string | null;
  social_wall_active?: number;
  social_wall_embed_code?: string | null;
  color_image_putih?: string | null;
  color_image_hitam?: string | null;
  color_image_coklat?: string | null;
  color_image_golden_oak?: string | null;
  color_image_orange?: string | null;
  google_maps_review_url?: string | null;
}

// PRODUCTS LOCAL STORAGE
function getLocalProducts(): Product[] {
  if (typeof window === "undefined") return staticProducts;
  const local = localStorage.getItem(PRODUCTS_LOCAL_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0].variants) && typeof parsed[0].category_id === "number") {
        return parsed;
      }
    } catch {
      // fallback to reset
    }
  }
  localStorage.setItem(PRODUCTS_LOCAL_KEY, JSON.stringify(staticProducts));
  return staticProducts;
}

function saveLocalProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRODUCTS_LOCAL_KEY, JSON.stringify(products));
}

// CATEGORIES LOCAL STORAGE
export function getLocalCategories(): Category[] {
  if (typeof window === "undefined") return staticCategories;
  const local = localStorage.getItem(CATEGORIES_LOCAL_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return staticCategories;
    }
  }
  localStorage.setItem(CATEGORIES_LOCAL_KEY, JSON.stringify(staticCategories));
  return staticCategories;
}

function saveLocalCategories(cats: Category[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CATEGORIES_LOCAL_KEY, JSON.stringify(cats));
}

// TIERS LOCAL STORAGE
export function getLocalTiers(): ProductTier[] {
  if (typeof window === "undefined") return staticTiers;
  const local = localStorage.getItem(TIERS_LOCAL_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return staticTiers;
    }
  }
  localStorage.setItem(TIERS_LOCAL_KEY, JSON.stringify(staticTiers));
  return staticTiers;
}

function saveLocalTiers(tiers: ProductTier[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TIERS_LOCAL_KEY, JSON.stringify(tiers));
}

// SETTINGS LOCAL STORAGE
export function getLocalSettings(): WebsiteSettings {
  const defaultSettings: WebsiteSettings = {
    seo_title: "Master UPVC Indonesia - Jendela & Pintu UPVC Premium",
    seo_description: "Produsen terpercaya kusen, pintu, dan jendela UPVC berkualitas tinggi di Indonesia. Tahan cuaca, kedap suara, anti rayap, dan bergaransi resmi.",
    seo_keywords: "master upvc, pintu upvc, jendela upvc, kusen upvc, upvc premium, master upvc indonesia",
    favicon: null,
    logo: null,
    contact_address: "Curug, Kec. Gn. Sindur, Kabupaten Bogor, Jawa Barat 15315",
    contact_whatsapp: "+62 812-3456-7890",
    contact_website: "WWW.MASTERUPVC.ID",
    contact_email: "info@masterupvc.id",
    contact_description: "Kunjungi pabrik produksi kami atau diskusikan kebutuhan ukuran, varian warna, dan penawaran khusus langsung dengan tim teknis kami.",
    contact_maps_url: "Curug, Gn. Sindur, Bogor",
    social_instagram: "",
    social_facebook: "",
    social_tiktok: "",
    social_youtube: "",
    social_twitter: "",
    ai_knowledge: [
      {
        question: "Apa keunggulan utama bahan UPVC dibanding aluminium atau kayu?",
        answer: "Bahan UPVC kami memiliki 8 pilar keunggulan: ramah lingkungan, tahan api, kedap suara hingga 40dB, anti bocor air, hemat energi (insulasi termal), tahan cuaca ekstrim, anti rayap, dan dilengkapi penguncian ganda (multipoint lock) untuk keamanan maksimal."
      },
      {
        question: "Apakah pintu dan jendela Master UPVC bergaransi?",
        answer: "Ya, kami memberikan garansi resmi profil UPVC selama 10 tahun untuk menjamin kekuatan struktural dan warna agar tidak memudar atau retak."
      },
      {
        question: "Di mana lokasi workshop dan cakupan layanan Master UPVC?",
        answer: "Workshop utama kami berlokasi di Jakarta dengan jangkauan pengiriman dan instalasi ke seluruh kota besar di wilayah Indonesia."
      }
    ],
    schema_json: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Master UPVC Indonesia",
      telephone: "+62-812-3456-7890",
      email: "info@masterupvc.id",
      url: "https://masterupvc.id"
    },
    analytics_script: "",
    chatbot_active: 0,
    chatbot_name: "Nadia",
    chatbot_avatar: null,
    chatbot_initial_greeting: "Halo! Saya Nadia, asisten virtual Master UPVC. Ada yang bisa saya bantu hari ini? 😊",
    chatbot_ask_name_message: "Boleh tahu siapa nama Anda?",
    chatbot_ask_phone_message: "Boleh minta nomor WhatsApp Anda yang aktif? (Contoh: 08123456789)",
    chatbot_ask_email_message: "Bisa infokan juga alamat email Anda?",
    chatbot_ask_reason_message: "Terima kasih! Silakan ceritakan apa yang ingin Anda konsultasikan atau tanyakan mengenai pintu & jendela UPVC?",
    company_profile_pdf: null,
    profile_image_hero: null,
    profile_image_about: null,
    profile_image_mission: null,
    social_wall_active: 0,
    social_wall_embed_code: null,
    color_image_putih: null,
    color_image_hitam: null,
    color_image_coklat: null,
    color_image_golden_oak: null,
    color_image_orange: null
  };

  if (typeof window === "undefined") return defaultSettings;
  const local = localStorage.getItem(SETTINGS_LOCAL_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return defaultSettings;
    }
  }
  localStorage.setItem(SETTINGS_LOCAL_KEY, JSON.stringify(defaultSettings));
  return defaultSettings;
}

// CATEGORIES ACTIONS
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        saveLocalCategories(data);
        return data;
      }
    }
  } catch (err) {
    // MySQL failed or offline, try Supabase fallback
    if (supabase) {
      try {
        const { data } = await supabase.from("categories").select("*").order("id", { ascending: true });
        if (data) {
          saveLocalCategories(data);
          return data;
        }
      } catch {}
    }
  }
  return getLocalCategories();
}

export async function addCategory(name: string): Promise<Category | null> {
  const newId = Date.now();
  const newCat: Category = { id: newId, name };

  if (typeof window !== "undefined") {
    const list = getLocalCategories();
    const updated = [...list, newCat];
    saveLocalCategories(updated);
  }

  try {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        if (typeof window !== "undefined") {
          const list = getLocalCategories();
          const synced = list.map(item => item.id === newId ? { ...item, id: data.id } : item);
          saveLocalCategories(synced);
        }
        return data;
      }
    }
  } catch (err) {
    // API offline, try Supabase fallback
    if (supabase) {
      try {
        const { data } = await supabase.from("categories").insert([{ name }]).select();
        if (data && data[0]) {
          const list = getLocalCategories();
          const synced = list.map(item => item.id === newId ? { ...item, id: data[0].id } : item);
          saveLocalCategories(synced);
          return { id: data[0].id, name };
        }
      } catch {}
    }
  }
  return newCat;
}

export async function updateCategory(id: number, name: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    const list = getLocalCategories();
    const updated = list.map(item => item.id === id ? { id, name } : item);
    saveLocalCategories(updated);
  }

  try {
    const res = await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name })
    });
    if (res.ok) return true;
  } catch (err) {
    if (supabase) {
      try {
        const { error } = await supabase.from("categories").update({ name }).eq("id", id);
        if (!error) return true;
      } catch {}
    }
  }
  return true;
}

export async function deleteCategory(id: number): Promise<boolean> {
  if (typeof window !== "undefined") {
    const list = getLocalCategories();
    const updated = list.filter(item => item.id !== id);
    saveLocalCategories(updated);

    const prodList = getLocalProducts();
    const filteredProd = prodList.filter(p => p.category_id !== id);
    saveLocalProducts(filteredProd);
  }

  try {
    const res = await fetch(`/api/categories?id=${id}`, {
      method: "DELETE"
    });
    if (res.ok) return true;
  } catch (err) {
    if (supabase) {
      try {
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (!error) return true;
      } catch {}
    }
  }
  return true;
}

// TIERS ACTIONS
export async function getTiers(): Promise<ProductTier[]> {
  try {
    const res = await fetch("/api/tiers");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        saveLocalTiers(data);
        return data;
      }
    }
  } catch (err) {
    // offline / fail fallback
  }
  return getLocalTiers();
}

export async function addTier(name: string): Promise<ProductTier | null> {
  const newId = Date.now();
  const newTier: ProductTier = { id: newId, name };

  if (typeof window !== "undefined") {
    const list = getLocalTiers();
    const updated = [...list, newTier];
    saveLocalTiers(updated);
  }

  try {
    const res = await fetch("/api/tiers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        if (typeof window !== "undefined") {
          const list = getLocalTiers();
          const synced = list.map(item => item.id === newId ? { ...item, id: data.id } : item);
          saveLocalTiers(synced);
        }
        return data;
      }
    }
  } catch (err) {
    // offline fallback
  }
  return newTier;
}

export async function updateTier(id: number, name: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    const list = getLocalTiers();
    const updated = list.map(item => item.id === id ? { id, name } : item);
    saveLocalTiers(updated);
  }

  try {
    const res = await fetch("/api/tiers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name })
    });
    if (res.ok) return true;
  } catch (err) {
    // offline fallback
  }
  return true;
}

export async function deleteTier(id: number): Promise<boolean> {
  if (typeof window !== "undefined") {
    const list = getLocalTiers();
    const updated = list.filter(item => item.id !== id);
    saveLocalTiers(updated);
  }

  try {
    const res = await fetch(`/api/tiers?id=${id}`, {
      method: "DELETE"
    });
    if (res.ok) return true;
  } catch (err) {
    // offline fallback
  }
  return true;
}

// PRODUCTS ACTIONS
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        saveLocalProducts(data);
        return data;
      }
    }
  } catch (err) {
    if (supabase) {
      try {
        const { data } = await supabase.from("products").select("*").order("id", { ascending: true });
        if (data) {
          const mapped = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category_id: Number(item.category_id),
            tier: item.tier,
            description: item.description || "",
            dimensions: item.dimensions || "",
            variants: Array.isArray(item.variants) ? item.variants : [],
          }));
          saveLocalProducts(mapped);
          return mapped;
        }
      } catch {}
    }
  }
  return getLocalProducts();
}

export async function addProduct(product: Omit<Product, "id">): Promise<Product> {
  const newId = Date.now();
  const newProduct: Product = { ...product, id: newId };

  if (typeof window !== "undefined") {
    const list = getLocalProducts();
    const updated = [...list, newProduct];
    saveLocalProducts(updated);
  }

  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        if (typeof window !== "undefined") {
          const list = getLocalProducts();
          const synced = list.map(item => item.id === newId ? { ...item, id: data.id } : item);
          saveLocalProducts(synced);
        }
        return data;
      }
    }
  } catch (err) {
    if (supabase) {
      try {
        const { data } = await supabase.from("products").insert([{
          name: product.name,
          category_id: product.category_id,
          tier: product.tier,
          description: product.description,
          dimensions: product.dimensions,
          variants: product.variants
        }]).select();
        if (data && data[0]) {
          const list = getLocalProducts();
          const synced = list.map(item => item.id === newId ? { ...item, id: data[0].id } : item);
          saveLocalProducts(synced);
          return { ...product, id: data[0].id };
        }
      } catch {}
    }
  }

  return newProduct;
}

export async function updateProduct(id: number, productData: Omit<Product, "id">): Promise<boolean> {
  if (typeof window !== "undefined") {
    const list = getLocalProducts();
    const updated = list.map(item => item.id === id ? { ...productData, id } : item);
    saveLocalProducts(updated);
  }

  try {
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...productData })
    });
    if (res.ok) return true;
  } catch (err) {
    if (supabase) {
      try {
        const { error } = await supabase.from("products").update({
          name: productData.name,
          category_id: productData.category_id,
          tier: productData.tier,
          description: productData.description,
          dimensions: productData.dimensions,
          variants: productData.variants
        }).eq("id", id);
        if (!error) return true;
      } catch {}
    }
  }

  return true;
}

export async function deleteProduct(id: number): Promise<boolean> {
  if (typeof window !== "undefined") {
    const list = getLocalProducts();
    const updated = list.filter(item => item.id !== id);
    saveLocalProducts(updated);
  }

  try {
    const res = await fetch(`/api/products?id=${id}`, {
      method: "DELETE"
    });
    if (res.ok) return true;
  } catch (err) {
    if (supabase) {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (!error) return true;
      } catch {}
    }
  }

  return true;
}

// SETTINGS ACTIONS
export async function getSettings(): Promise<WebsiteSettings> {
  try {
    const res = await fetch("/api/settings");
    if (res.ok) {
      const data = await res.json();
      if (data && data.seo_title) {
        if (typeof window !== "undefined") {
          localStorage.setItem(SETTINGS_LOCAL_KEY, JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (err) {
    // fallback
  }
  return getLocalSettings();
}

export async function updateSettings(settings: WebsiteSettings): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    localStorage.setItem(SETTINGS_LOCAL_KEY, JSON.stringify(settings));
  }
  try {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      return { success: true };
    }
    const errData = await res.json();
    return { success: false, error: errData.error || "Gagal menyimpan ke database server." };
  } catch (err: any) {
    return { success: true, error: "Mode Offline: Disimpan di penyimpanan lokal browser Anda." };
  }
}

// ==========================================
// ARTICLES
// ==========================================

export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  media_type: "image_url" | "image_upload" | "youtube";
  media_value: string | null;
  category_id: number | null;
  category_name?: string;
  category_slug?: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getArticleCategories(): Promise<ArticleCategory[]> {
  try {
    const res = await fetch("/api/article-categories");
    if (res.ok) {
      const data = await res.json();
      return data.categories || [];
    }
  } catch {}
  return [];
}

export async function addArticleCategory(name: string): Promise<boolean> {
  try {
    const res = await fetch("/api/article-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return res.ok;
  } catch { return false; }
}

export async function updateArticleCategory(id: number, name: string): Promise<boolean> {
  try {
    const res = await fetch("/api/article-categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name }),
    });
    return res.ok;
  } catch { return false; }
}

export async function deleteArticleCategory(id: number): Promise<boolean> {
  try {
    const res = await fetch("/api/article-categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return res.ok;
  } catch { return false; }
}

export async function getArticles(params?: {
  category?: string;
  status?: string;
  limit?: number;
  page?: number;
}): Promise<{ articles: Article[]; pagination: any }> {
  try {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.status) qs.set("status", params.status);
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.page) qs.set("page", String(params.page));
    const res = await fetch(`/api/articles?${qs.toString()}`);
    if (res.ok) return await res.json();
  } catch {}
  return { articles: [], pagination: { total: 0, page: 1, limit: 9, totalPages: 0 } };
}

export async function addArticle(data: Omit<Article, "id" | "created_at" | "updated_at">): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) return { success: true, slug: json.slug };
    return { success: false, error: json.error };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateArticle(id: number, data: Partial<Article>): Promise<boolean> {
  try {
    const res = await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch { return false; }
}

export async function deleteArticle(id: number): Promise<boolean> {
  try {
    const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    return res.ok;
  } catch { return false; }
}

// SERVICES LOCAL STORAGE
export function getLocalServices(): Service[] {
  if (typeof window === "undefined") return staticServices;
  const local = localStorage.getItem(SERVICES_LOCAL_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return staticServices;
    }
  }
  localStorage.setItem(SERVICES_LOCAL_KEY, JSON.stringify(staticServices));
  return staticServices;
}

function saveLocalServices(services: Service[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SERVICES_LOCAL_KEY, JSON.stringify(services));
}

// SERVICES ACTIONS
export async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch("/api/services");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        saveLocalServices(data);
        return data;
      }
    }
  } catch (err) {
    // offline/fail fallback
  }
  return getLocalServices();
}

export async function addService(service: Omit<Service, "id">): Promise<Service> {
  const newId = Date.now();
  const newService: Service = { ...service, id: newId };

  if (typeof window !== "undefined") {
    const list = getLocalServices();
    const updated = [...list, newService];
    saveLocalServices(updated);
  }

  try {
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        if (typeof window !== "undefined") {
          const list = getLocalServices();
          const synced = list.map(item => item.id === newId ? { ...item, id: data.id } : item);
          saveLocalServices(synced);
        }
        return data;
      }
    }
  } catch (err) {
    // offline fallback
  }
  return newService;
}

export async function updateService(id: number, serviceData: Omit<Service, "id">): Promise<boolean> {
  if (typeof window !== "undefined") {
    const list = getLocalServices();
    const updated = list.map(item => item.id === id ? { ...serviceData, id } : item);
    saveLocalServices(updated);
  }

  try {
    const res = await fetch("/api/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...serviceData })
    });
    if (res.ok) return true;
  } catch (err) {
    // offline fallback
  }
  return true;
}

export async function deleteService(id: number): Promise<boolean> {
  if (typeof window !== "undefined") {
    const list = getLocalServices();
    const updated = list.filter(item => item.id !== id);
    saveLocalServices(updated);
  }

  try {
    const res = await fetch(`/api/services?id=${id}`, {
      method: "DELETE"
    });
    if (res.ok) return true;
  } catch (err) {
    // offline fallback
  }
  return true;
}

// PROJECTS LOCAL STORAGE
export function getLocalProjects(): Project[] {
  if (typeof window === "undefined") return staticProjects;
  const local = localStorage.getItem(PROJECTS_LOCAL_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return staticProjects;
    }
  }
  localStorage.setItem(PROJECTS_LOCAL_KEY, JSON.stringify(staticProjects));
  return staticProjects;
}

function saveLocalProjects(projects: Project[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECTS_LOCAL_KEY, JSON.stringify(projects));
}

// PROJECTS ACTIONS
export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch("/api/projects");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        saveLocalProjects(data);
        return data;
      }
    }
  } catch (err) {
    // offline fallback
  }
  return getLocalProjects();
}

export async function addProject(project: Omit<Project, "id">): Promise<Project> {
  const newId = Date.now();
  const newProject: Project = { ...project, id: newId };

  if (typeof window !== "undefined") {
    const list = getLocalProjects();
    const updated = [...list, newProject];
    saveLocalProjects(updated);
  }

  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        if (typeof window !== "undefined") {
          const list = getLocalProjects();
          const synced = list.map(item => item.id === newId ? { ...item, id: data.id } : item);
          saveLocalProjects(synced);
        }
        return data;
      }
    }
  } catch (err) {
    // offline fallback
  }
  return newProject;
}

export async function updateProject(id: number, projectData: Omit<Project, "id">): Promise<boolean> {
  if (typeof window !== "undefined") {
    const list = getLocalProjects();
    const updated = list.map(item => item.id === id ? { ...projectData, id } : item);
    saveLocalProjects(updated);
  }

  try {
    const res = await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...projectData })
    });
    if (res.ok) return true;
  } catch (err) {
    // offline fallback
  }
  return true;
}

export async function deleteProject(id: number): Promise<boolean> {
  if (typeof window !== "undefined") {
    const list = getLocalProjects();
    const updated = list.filter(item => item.id !== id);
    saveLocalProjects(updated);
  }

  try {
    const res = await fetch(`/api/projects?id=${id}`, {
      method: "DELETE"
    });
    if (res.ok) return true;
  } catch (err) {
    // offline fallback
  }
  return true;
}
