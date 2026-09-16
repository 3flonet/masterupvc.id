"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, logoutAdmin } from "@/utils/auth";
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory,
  getSettings,
  updateSettings,
  WebsiteSettings,
  Article,
  ArticleCategory,
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getArticleCategories,
  addArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
  getTiers,
  addTier,
  updateTier,
  deleteTier,
  ProductTier,
  getServices,
  addService,
  updateService,
  deleteService,
  getProjects,
  addProject,
  updateProject,
  deleteProject
} from "@/utils/db";
import { Product, ProductVariant, Category, Service, Project } from "@/utils/seedData";
import { 
  LogOut, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  ShieldCheck, CheckCircle, Award, Volume2, Zap, Droplet, SunDim, Wind, 
  Trash,
  Upload,
  FolderOpen,
  Settings,
  Package,
  Layers,
  Save,
  HelpCircle,
  Menu,
  FileText,
  Eye,
  EyeOff,
  Tv,
  Link as LinkIcon,
  ImageIcon,
  MessageSquare,
  Star,
  Sparkles,
  DoorClosed,
  Grid,
  Utensils,
  ShowerHead,
  Bath,
  Users,
  Mail
} from "lucide-react";

import ArticlesPanel from "@/components/ArticlesPanel";
import LeadsPanel from "@/components/LeadsPanel";
import UserManagerPanel from "@/components/UserManagerPanel";

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case "DoorClosed": return <DoorClosed className="w-4 h-4 text-brand-orange" />;
    case "Grid": return <Grid className="w-4 h-4 text-brand-orange" />;
    case "Layers": return <Layers className="w-4 h-4 text-brand-orange" />;
    case "Utensils": return <Utensils className="w-4 h-4 text-brand-orange" />;
    case "ShowerHead": return <ShowerHead className="w-4 h-4 text-brand-orange" />;
    case "Bath": return <Bath className="w-4 h-4 text-brand-orange" />;
    default: return <Sparkles className="w-4 h-4 text-brand-orange" />;
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "articles" | "settings" | "leads" | "social-wall" | "testimonials" | "services" | "project" | "users" | "advantages" | "comparisons">("products");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Advantages States
  const [advantagesList, setAdvantagesList] = useState<any[]>([]);
  const [isAdvantageModalOpen, setIsAdvantageModalOpen] = useState(false);
  const [editingAdvantage, setEditingAdvantage] = useState<any>(null);
  const [advTitle, setAdvTitle] = useState("");
  const [advDesc, setAdvDesc] = useState("");
  const [advIcon, setAdvIcon] = useState("Volume2");
  const [advOrder, setAdvOrder] = useState(1);

  // Comparisons States
  const [comparisonsList, setComparisonsList] = useState<any[]>([]);
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<any>(null);
  const [compFeature, setCompFeature] = useState("");
  const [compUpvcVal, setCompUpvcVal] = useState("");
  const [compWoodVal, setCompWoodVal] = useState("");
  const [compWoodStatus, setCompWoodStatus] = useState("negative");
  const [compAlumVal, setCompAlumVal] = useState("");
  const [compAlumStatus, setCompAlumStatus] = useState("neutral");
  const [compOrder, setCompOrder] = useState(1);

  // Fetch Advantages
  const loadAdvantages = () => {
    fetch("/api/advantages")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAdvantagesList(data); })
      .catch(err => console.error(err));
  };

  // Fetch Comparisons
  const loadComparisons = () => {
    fetch("/api/comparisons")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setComparisonsList(data); })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadAdvantages();
    loadComparisons();
  }, []);


  // Services states
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [sTitle, setSTitle] = useState("");
  const [sSlug, setSSlug] = useState("");
  const [sDescription, setSDescription] = useState("");
  const [sIcon, setSIcon] = useState("Sparkles");
  const [sImageUrl, setSImageUrl] = useState<string | null>(null);
  const [sActive, setSActive] = useState<number>(1);
  const [savingService, setSavingService] = useState(false);

  // Portfolio / Projects states
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [pTitle, setPTitle] = useState("");
  const [pSlug, setPSlug] = useState("");
  const [pClientName, setPClientName] = useState("");
  const [pLocation, setPLocation] = useState("");
  const [pProjectDate, setPProjectDate] = useState("");
  const [pServicesUsed, setPServicesUsed] = useState<string[]>([]);
  const [pDescription, setPDescription] = useState("");
  const [pImages, setPImages] = useState<string[]>([]);
  const [pActive, setPActive] = useState<number>(1);
  const [savingProject, setSavingProject] = useState(false);

  // Products and Categories states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"category" | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [tierFilter, setTierFilter] = useState("Semua");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form Product states
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [tier, setTier] = useState("Hemat");
  const [description, setDescription] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Form Category states
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Tiers states
  const [tiersList, setTiersList] = useState<ProductTier[]>([]);
  const [showTierModal, setShowTierModal] = useState(false);
  const [newTierName, setNewTierName] = useState("");
  const [editingTier, setEditingTier] = useState<ProductTier | null>(null);
  const [editTierName, setEditTierName] = useState("");

  // Settings states
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [favicon, setFavicon] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [contactAddress, setContactAddress] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactDescription, setContactDescription] = useState("");
  const [contactMapsUrl, setContactMapsUrl] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpSenderName, setSmtpSenderName] = useState("Master UPVC Support");
  const [smtpSecure, setSmtpSecure] = useState(0);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialTiktok, setSocialTiktok] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");
  const [aiKnowledge, setAiKnowledge] = useState<{ question: string; answer: string }[]>([]);
  const [schemaJson, setSchemaJson] = useState<any>({});
  const [analyticsScript, setAnalyticsScript] = useState("");
  const [chatbotActive, setChatbotActive] = useState(0);
  const [chatbotName, setChatbotName] = useState("Nadia");
  const [chatbotAvatar, setChatbotAvatar] = useState<string | null>(null);
  const [chatbotInitialGreeting, setChatbotInitialGreeting] = useState("");
  const [chatbotAskNameMessage, setChatbotAskNameMessage] = useState("");
  const [chatbotAskPhoneMessage, setChatbotAskPhoneMessage] = useState("");
  const [chatbotAskEmailMessage, setChatbotAskEmailMessage] = useState("");
  const [chatbotAskReasonMessage, setChatbotAskReasonMessage] = useState("");
  const [chatbotFinalMessage, setChatbotFinalMessage] = useState("");
  const [companyProfilePdf, setCompanyProfilePdf] = useState<string | null>(null);
  const [profileImageHero, setProfileImageHero] = useState<string | null>(null);
  const [profileImageAbout, setProfileImageAbout] = useState<string | null>(null);
  const [profileImageMission, setProfileImageMission] = useState<string | null>(null);
  const [colorImagePutih, setColorImagePutih] = useState<string | null>(null);
  const [colorImageHitam, setColorImageHitam] = useState<string | null>(null);
  const [colorImageCoklat, setColorImageCoklat] = useState<string | null>(null);
  const [colorImageGoldenOak, setColorImageGoldenOak] = useState<string | null>(null);
  const [colorImageOrange, setColorImageOrange] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [socialWallActive, setSocialWallActive] = useState(0);
  const [socialWallEmbedCode, setSocialWallEmbedCode] = useState("");

  // Social Wall states
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [wallPlatform, setWallPlatform] = useState<"instagram" | "tiktok">("instagram");
  const [wallPostUrl, setWallPostUrl] = useState("");
  const [wallImageUrl, setWallImageUrl] = useState<string | null>(null);
  const [wallCaption, setWallCaption] = useState("");
  const [loadingSocial, setLoadingSocial] = useState(false);

  // Testimonials states
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [googleMapsReviewUrl, setGoogleMapsReviewUrl] = useState("");
  const [testimonialsShowForm, setTestimonialsShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [tName, setTName] = useState("");
  const [tPhoto, setTPhoto] = useState<string | null>(null);
  const [tComment, setTComment] = useState("");
  const [tRating, setTRating] = useState(5);
  const [tActive, setTActive] = useState(1);
  const [savingTestimonial, setSavingTestimonial] = useState(false);

  // Toast & Custom Confirm States
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Route security check
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
      loadInitialData();
    }
  }, [router]);

  // Load testimonials when tab switches to testimonials
  useEffect(() => {
    if (activeTab === "testimonials") {
      setLoadingTestimonials(true);
      fetch("/api/testimonials")
        .then(r => r.json())
        .then(rows => { if (Array.isArray(rows)) setTestimonials(rows); })
        .catch(err => console.error("Gagal memuat testimonial:", err))
        .finally(() => setLoadingTestimonials(false));
    }
  }, [activeTab]);

  const loadServices = async () => {
    setLoadingServices(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error("Gagal memuat layanan:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    if (activeTab === "services") {
      loadServices();
    }
  }, [activeTab]);

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const data = await getProjects();
      setProjectsList(data);
    } catch (err) {
      console.error("Gagal memuat project:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (activeTab === "project") {
      loadProjects();
      loadServices(); // Untuk checkboxes di modal
    }
  }, [activeTab]);

  // Load initial categories, products, and settings
  const loadInitialData = async () => {
    const catsData = await getCategories();
    setCategories(catsData);
    if (catsData.length > 0) {
      setCategoryId(catsData[0].id);
    }
    const prodsData = await getProducts();
    setProducts(prodsData);
    setFilteredProducts(prodsData);

    const tiersData = await getTiers();
    setTiersList(tiersData);

    const settingsData = await getSettings();
    if (settingsData) {
      setSeoTitle(settingsData.seo_title);
      setSeoDescription(settingsData.seo_description);
      setSeoKeywords(settingsData.seo_keywords);
      setFavicon(settingsData.favicon || null);
      setLogo(settingsData.logo || null);
      setContactAddress(settingsData.contact_address || "");
      setContactWhatsapp(settingsData.contact_whatsapp || "");
      setContactWebsite(settingsData.contact_website || "");
      setContactEmail(settingsData.contact_email || "");
      setContactDescription(settingsData.contact_description || "");
      setContactMapsUrl(settingsData.contact_maps_url || "");
      setSmtpHost(settingsData.smtp_host || "");
      setSmtpPort(settingsData.smtp_port ? Number(settingsData.smtp_port) : 587);
      setSmtpUser(settingsData.smtp_user || "");
      setSmtpPass(settingsData.smtp_pass || "");
      setSmtpSenderName(settingsData.smtp_sender_name || "Master UPVC Support");
      setSmtpSecure(settingsData.smtp_secure ? 1 : 0);
      setGoogleMapsReviewUrl(settingsData.google_maps_review_url || "");
      setSocialInstagram(settingsData.social_instagram || "");
      setSocialFacebook(settingsData.social_facebook || "");
      setSocialTiktok(settingsData.social_tiktok || "");
      setSocialYoutube(settingsData.social_youtube || "");
      setSocialTwitter(settingsData.social_twitter || "");
      setAiKnowledge(settingsData.ai_knowledge || []);
      setSchemaJson(settingsData.schema_json || {});
      setAnalyticsScript(settingsData.analytics_script || "");
      setChatbotActive(settingsData.chatbot_active !== undefined ? settingsData.chatbot_active : 0);
      setChatbotName(settingsData.chatbot_name || "Nadia");
      setChatbotAvatar(settingsData.chatbot_avatar || null);
      setChatbotInitialGreeting(settingsData.chatbot_initial_greeting || "");
      setChatbotAskNameMessage(settingsData.chatbot_ask_name_message || "");
      setChatbotAskPhoneMessage(settingsData.chatbot_ask_phone_message || "");
      setChatbotAskEmailMessage(settingsData.chatbot_ask_email_message || "");
      setChatbotAskReasonMessage(settingsData.chatbot_ask_reason_message || "");
      setChatbotFinalMessage(settingsData.chatbot_final_message || "");
      setCompanyProfilePdf(settingsData.company_profile_pdf || null);
      setProfileImageHero(settingsData.profile_image_hero || null);
      setProfileImageAbout(settingsData.profile_image_about || null);
      setProfileImageMission(settingsData.profile_image_mission || null);
      setColorImagePutih(settingsData.color_image_putih || null);
      setColorImageHitam(settingsData.color_image_hitam || null);
      setColorImageCoklat(settingsData.color_image_coklat || null);
      setColorImageGoldenOak(settingsData.color_image_golden_oak || null);
      setColorImageOrange(settingsData.color_image_orange || null);
      setSocialWallActive(settingsData.social_wall_active !== undefined ? settingsData.social_wall_active : 0);
      setSocialWallEmbedCode(settingsData.social_wall_embed_code || "");
      await loadSocialPosts();
    }
  };

  const loadSocialPosts = async () => {
    try {
      const res = await fetch("/api/social-wall");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSocialPosts(data);
      }
    } catch (error) {
      console.error("Gagal memuat social wall:", error);
    }
  };

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
    setFilteredProducts(data);
  };

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
    if (data.length > 0 && !data.some(c => c.id === categoryId)) {
      setCategoryId(data[0].id);
    }
  };

  const loadTiers = async () => {
    const data = await getTiers();
    setTiersList(data);
  };

  // Sync Search queries, sorting and filters
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    let result = products;

    if (query !== "") {
      result = result.filter(
        (p) => 
          p.name.toLowerCase().includes(query) || 
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (categoryFilter !== "Semua") {
      result = result.filter((p) => {
        const cat = categories.find(c => c.id === p.category_id);
        return cat && cat.name === categoryFilter;
      });
    }

    // Tier filter
    if (tierFilter !== "Semua") {
      result = result.filter((p) => p.tier === tierFilter);
    }

    // Sort result
    if (sortField === "category") {
      result = [...result].sort((a, b) => {
        const catA = categories.find(c => c.id === a.category_id)?.name || "";
        const catB = categories.find(c => c.id === b.category_id)?.name || "";
        if (catA < catB) return sortDirection === "asc" ? -1 : 1;
        if (catA > catB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredProducts(result);
  }, [searchQuery, products, sortField, sortDirection, categoryFilter, tierFilter, categories]);

  // Logout handler
  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  // Reset form states
  const resetForm = () => {
    setName("");
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    if (tiersList.length > 0) {
      setTier(tiersList[0].name);
    } else {
      setTier("");
    }
    setDescription("");
    setDimensions("");
    setVariants([{ color: "Putih", price: 0, discount_price: null, image_url: null, image_urls: [] }]);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setName(product.name);
    setCategoryId(product.category_id);
    setTier(product.tier);
    setDescription(product.description || "");
    setDimensions(product.dimensions || "");
    setVariants(product.variants && product.variants.length > 0 
      ? product.variants.map(v => ({ 
          ...v, 
          discount_price: v.discount_price !== undefined ? v.discount_price : null,
          image_urls: v.image_urls || (v.image_url ? [v.image_url] : [])
        })) 
      : [{ color: "Putih", price: 0, discount_price: null, image_url: null, image_urls: [] }]
    );
    setShowEditModal(true);
  };

  // Variant Rows helpers
  const addVariantRow = () => {
    setVariants([...variants, { color: "Putih", price: 0, discount_price: null, image_url: null, image_urls: [] }]);
  };

  const removeVariantRow = (index: number) => {
    if (variants.length <= 1) {
      showToast("Harus menyisakan minimal 1 varian warna.", "error");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariantRow = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = variants.map((v, i) => {
      if (i === index) {
        return { ...v, [field]: value };
      }
      return v;
    });
    setVariants(updated);
  };

  // Add Product Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (variants.length === 0) {
      showToast("Harap tambahkan minimal 1 varian warna.", "error");
      return;
    }

    await addProduct({
      name,
      category_id: categoryId,
      tier,
      description,
      dimensions,
      variants,
    });

    setShowAddModal(false);
    resetForm();
    loadProducts();
    showToast("Produk berhasil ditambahkan.", "success");
  };

  // Edit Product Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (variants.length === 0) {
      showToast("Harap tambahkan minimal 1 varian warna.", "error");
      return;
    }

    await updateProduct(selectedProduct.id, {
      name,
      category_id: categoryId,
      tier,
      description,
      dimensions,
      variants,
    });

    setShowEditModal(false);
    setSelectedProduct(null);
    resetForm();
    loadProducts();
    showToast("Perubahan produk berhasil disimpan.", "success");
  };

  // Delete product
  const handleDelete = (id: number) => {
    setConfirmConfig({
      title: "Hapus Produk?",
      message: "Apakah Anda yakin ingin menghapus produk ini beserta seluruh varian warnanya? Tindakan ini tidak dapat dibatalkan.",
      onConfirm: async () => {
        const success = await deleteProduct(id);
        if (success) {
          showToast("Produk berhasil dihapus.", "success");
          loadProducts();
        } else {
          showToast("Gagal menghapus produk.", "error");
        }
        setConfirmConfig(null);
      }
    });
  };

  // Category Actions
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const res = await addCategory(newCategoryName.trim());
    if (res) {
      setNewCategoryName("");
      loadCategories();
    }
  };

  const handleUpdateCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryName.trim()) return;
    const success = await updateCategory(editingCategory.id, editCategoryName.trim());
    if (success) {
      setEditingCategory(null);
      setEditCategoryName("");
      loadCategories();
      loadProducts();
    }
  };

  const handleDeleteCategory = (id: number) => {
    setConfirmConfig({
      title: "Hapus Kategori?",
      message: "PERINGATAN! Menghapus kategori ini juga akan menghapus semua produk di dalamnya secara permanen.",
      onConfirm: async () => {
        const success = await deleteCategory(id);
        if (success) {
          showToast("Kategori dan produk di dalamnya berhasil dihapus.", "success");
          loadCategories();
          loadProducts();
        } else {
          showToast("Gagal menghapus kategori.", "error");
        }
        setConfirmConfig(null);
      }
    });
  };

  // Tier Actions
  const handleAddTierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTierName.trim()) return;
    const res = await addTier(newTierName.trim());
    if (res) {
      setNewTierName("");
      loadTiers();
    }
  };

  const handleUpdateTierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier || !editTierName.trim()) return;
    const success = await updateTier(editingTier.id, editTierName.trim());
    if (success) {
      setEditingTier(null);
      setEditTierName("");
      loadTiers();
      loadProducts();
    }
  };

  const handleDeleteTier = (id: number) => {
    setConfirmConfig({
      title: "Hapus Spesifikasi/Tier?",
      message: "Apakah Anda yakin ingin menghapus spesifikasi/tier ini? Produk yang memiliki tier ini tidak akan otomatis dihapus, namun tidak akan memiliki tier yang valid.",
      onConfirm: async () => {
        const success = await deleteTier(id);
        if (success) {
          showToast("Spesifikasi/tier berhasil dihapus.", "success");
          loadTiers();
          loadProducts();
        } else {
          showToast("Gagal menghapus spesifikasi/tier.", "error");
        }
        setConfirmConfig(null);
      }
    });
  };

  const getCategoryName = (catId: number) => {
    const found = categories.find(c => c.id === catId);
    return found ? found.name : "-";
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getPriceDisplay = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return "-";
    const prices = product.variants.map(v => v.discount_price && v.discount_price > 0 ? v.discount_price : v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    const hasDiscount = product.variants.some(v => v.discount_price && v.discount_price > 0);
    
    if (min === max) {
      return (
        <span className={hasDiscount ? "text-red-500 font-bold" : ""}>
          {formatIDR(min)} {hasDiscount && "(Promo)"}
        </span>
      );
    }
    return (
      <span className={hasDiscount ? "text-red-500 font-bold" : ""}>
        {formatIDR(min)} - {formatIDR(max)} {hasDiscount && "(Promo)"}
      </span>
    );
  };

  // SEO & AI Settings Submit
  
  // Handler Kirim Email Tes
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress || !testEmailAddress.includes("@")) {
      showToast("Masukkan alamat email tujuan tes yang valid.", "error");
      return;
    }
    setSendingTestEmail(true);
    setTestEmailResult(null);
    try {
      const res = await fetch("/api/settings/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_email: testEmailAddress,
          smtp_host: smtpHost,
          smtp_port: smtpPort,
          smtp_user: smtpUser,
          smtp_pass: smtpPass,
          smtp_sender_name: smtpSenderName,
          smtp_secure: smtpSecure
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTestEmailResult({ success: true, message: data.message });
        showToast(data.message, "success");
      } else {
        setTestEmailResult({ success: false, message: data.error || "Gagal mengirim email tes." });
        showToast(data.error || "Gagal mengirim email tes.", "error");
      }
    } catch (err: any) {
      setTestEmailResult({ success: false, message: "Terjadi kesalahan koneksi server." });
      showToast("Terjadi kesalahan koneksi server.", "error");
    } finally {
      setSendingTestEmail(false);
    }
  };

  
  const handleSaveAdvantage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingAdvantage ? "PUT" : "POST";
      const payload = {
        id: editingAdvantage?.id,
        title: advTitle,
        description: advDesc,
        icon: advIcon,
        sort_order: Number(advOrder),
        active: 1
      };
      const res = await fetch("/api/advantages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingAdvantage ? "Keunggulan diperbarui!" : "Keunggulan ditambahkan!");
        setIsAdvantageModalOpen(false);
        setEditingAdvantage(null);
        setAdvTitle(""); setAdvDesc(""); setAdvIcon("Volume2"); setAdvOrder(1);
        loadAdvantages();
      } else {
        toast.error(data.error || "Gagal menyimpan keunggulan");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteAdvantage = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus keunggulan ini?")) return;
    try {
      const res = await fetch(`/api/advantages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Keunggulan berhasil dihapus");
        loadAdvantages();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSaveComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingComp ? "PUT" : "POST";
      const payload = {
        id: editingComp?.id,
        feature_name: compFeature,
        upvc_value: compUpvcVal,
        wood_value: compWoodVal,
        wood_status: compWoodStatus,
        alum_value: compAlumVal,
        alum_status: compAlumStatus,
        sort_order: Number(compOrder)
      };
      const res = await fetch("/api/comparisons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingComp ? "Perbandingan diperbarui!" : "Perbandingan ditambahkan!");
        setIsCompModalOpen(false);
        setEditingComp(null);
        setCompFeature(""); setCompUpvcVal(""); setCompWoodVal(""); setCompAlumVal("");
        loadComparisons();
      } else {
        toast.error(data.error || "Gagal menyimpan perbandingan");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteComparison = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus fitur perbandingan ini?")) return;
    try {
      const res = await fetch(`/api/comparisons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Fitur perbandingan berhasil dihapus");
        loadComparisons();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    const result = await updateSettings({
      seo_title: seoTitle,
      seo_description: seoDescription,
      seo_keywords: seoKeywords,
      favicon,
      logo,
      contact_address: contactAddress,
      contact_whatsapp: contactWhatsapp,
      contact_website: contactWebsite,
      contact_email: contactEmail,
      contact_description: contactDescription,
      contact_maps_url: contactMapsUrl,
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_user: smtpUser,
        smtp_pass: smtpPass,
        smtp_sender_name: smtpSenderName,
        smtp_secure: smtpSecure,
      social_instagram: socialInstagram,
      social_facebook: socialFacebook,
      social_tiktok: socialTiktok,
      social_youtube: socialYoutube,
      social_twitter: socialTwitter,
      ai_knowledge: aiKnowledge,
      schema_json: schemaJson,
      analytics_script: analyticsScript,
      chatbot_active: chatbotActive,
      chatbot_name: chatbotName,
      chatbot_avatar: chatbotAvatar,
      chatbot_initial_greeting: chatbotInitialGreeting,
      chatbot_ask_name_message: chatbotAskNameMessage,
      chatbot_ask_phone_message: chatbotAskPhoneMessage,
      chatbot_ask_email_message: chatbotAskEmailMessage,
      chatbot_ask_reason_message: chatbotAskReasonMessage,
      chatbot_final_message: chatbotFinalMessage,
      company_profile_pdf: companyProfilePdf,
      profile_image_hero: profileImageHero,
      profile_image_about: profileImageAbout,
      profile_image_mission: profileImageMission,
      social_wall_active: socialWallActive,
      social_wall_embed_code: socialWallEmbedCode,
      color_image_putih: colorImagePutih,
      color_image_hitam: colorImageHitam,
      color_image_coklat: colorImageCoklat,
      color_image_golden_oak: colorImageGoldenOak,
      color_image_orange: colorImageOrange,
      google_maps_review_url: googleMapsReviewUrl
    });
    setSavingSettings(false);
    if (result.success) {
      if (result.error) {
        showToast(result.error, "info"); // Offline mode notice
      } else {
        showToast("Pengaturan website (SEO & AI) berhasil disimpan.", "success");
      }
    } else {
      showToast(`Gagal menyimpan pengaturan: ${result.error || "Kesalahan server."}`, "error");
    }
  };

  const handleAddSocialPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallPostUrl) {
      showToast("Post URL wajib diisi.", "error");
      return;
    }
    setLoadingSocial(true);
    try {
      const res = await fetch("/api/social-wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: wallPlatform,
          post_url: wallPostUrl,
          image_url: wallImageUrl,
          caption: wallCaption
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Postingan social wall berhasil ditambahkan.", "success");
        setWallPostUrl("");
        setWallImageUrl(null);
        setWallCaption("");
        await loadSocialPosts();
      } else {
        showToast(`Gagal: ${data.error || "Kesalahan server"}`, "error");
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`, "error");
    } finally {
      setLoadingSocial(false);
    }
  };

  const handleDeleteSocialPost = (id: number) => {
    setConfirmConfig({
      title: "Hapus Postingan?",
      message: "Apakah Anda yakin ingin menghapus postingan ini dari social wall?",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/social-wall?id=${id}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (data.success) {
            showToast("Postingan berhasil dihapus.", "success");
            await loadSocialPosts();
          } else {
            showToast(`Gagal: ${data.error || "Kesalahan server"}`, "error");
          }
        } catch (err: any) {
          showToast(`Error: ${err.message}`, "error");
        } finally {
          setConfirmConfig(null);
        }
      }
    });
  };

  // AI Knowledge items helper
  const addAiKnowledgeRow = () => {
    setAiKnowledge([...aiKnowledge, { question: "", answer: "" }]);
  };

  const removeAiKnowledgeRow = (index: number) => {
    setAiKnowledge(aiKnowledge.filter((_, i) => i !== index));
  };

  const updateAiKnowledgeRow = (index: number, field: "question" | "answer", value: string) => {
    const updated = aiKnowledge.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setAiKnowledge(updated);
  };

  // Services actions
  const handleOpenAddService = () => {
    setEditingService(null);
    setSTitle("");
    setSSlug("");
    setSDescription("");
    setSIcon("Sparkles");
    setSImageUrl(null);
    setSActive(1);
    setShowServiceForm(true);
  };

  const handleOpenEditService = (service: Service) => {
    setEditingService(service);
    setSTitle(service.title);
    setSSlug(service.slug);
    setSDescription(service.description);
    setSIcon(service.icon);
    setSImageUrl(service.image_url);
    setSActive(service.active);
    setShowServiceForm(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle.trim() || !sSlug.trim()) {
      showToast("Nama layanan dan slug wajib diisi.", "error");
      return;
    }
    setSavingService(true);

    const payload = {
      title: sTitle.trim(),
      slug: sSlug.trim(),
      description: sDescription,
      icon: sIcon,
      image_url: sImageUrl,
      active: sActive
    };

    if (editingService) {
      const success = await updateService(editingService.id, payload);
      if (success) {
        showToast("Layanan berhasil diperbarui.", "success");
        setShowServiceForm(false);
        await loadServices();
      } else {
        showToast("Gagal memperbarui layanan.", "error");
      }
    } else {
      const res = await addService(payload);
      if (res && res.id) {
        showToast("Layanan baru berhasil ditambahkan.", "success");
        setShowServiceForm(false);
        await loadServices();
      } else {
        showToast("Gagal menambahkan layanan.", "error");
      }
    }
    setSavingService(false);
  };

  const handleDeleteService = (id: number) => {
    setConfirmConfig({
      title: "Hapus Layanan?",
      message: "Apakah Anda yakin ingin menghapus layanan ini secara permanen?",
      onConfirm: async () => {
        const success = await deleteService(id);
        if (success) {
          showToast("Layanan berhasil dihapus.", "success");
          await loadServices();
        } else {
          showToast("Gagal menghapus layanan.", "error");
        }
        setConfirmConfig(null);
      }
    });
  };

  // Portfolio / Projects actions
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setPTitle("");
    setPSlug("");
    setPClientName("");
    setPLocation("");
    setPProjectDate("");
    setPServicesUsed([]);
    setPDescription("");
    setPImages([]);
    setPActive(1);
    setShowProjectForm(true);
  };

  const handleOpenEditProject = (project: Project) => {
    setEditingProject(project);
    setPTitle(project.title);
    setPSlug(project.slug);
    setPClientName(project.client_name || "");
    setPLocation(project.location || "");
    setPProjectDate(project.project_date || "");
    setPServicesUsed(project.services_used || []);
    setPDescription(project.description || "");
    setPImages(project.images || []);
    setPActive(project.active);
    setShowProjectForm(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim() || !pSlug.trim()) {
      showToast("Judul proyek dan slug wajib diisi.", "error");
      return;
    }
    setSavingProject(true);

    const payload = {
      title: pTitle.trim(),
      slug: pSlug.trim(),
      client_name: pClientName.trim() || null,
      location: pLocation.trim() || null,
      project_date: pProjectDate || null,
      services_used: pServicesUsed,
      description: pDescription,
      images: pImages,
      active: pActive
    };

    if (editingProject) {
      const success = await updateProject(editingProject.id, payload);
      if (success) {
        showToast("Project berhasil diperbarui.", "success");
        setShowProjectForm(false);
        await loadProjects();
      } else {
        showToast("Gagal memperbarui project.", "error");
      }
    } else {
      const res = await addProject(payload);
      if (res && res.id) {
        showToast("Project baru berhasil ditambahkan.", "success");
        setShowProjectForm(false);
        await loadProjects();
      } else {
        showToast("Gagal menambahkan project.", "error");
      }
    }
    setSavingProject(false);
  };

  const handleDeleteProject = (id: number) => {
    setConfirmConfig({
      title: "Hapus Project?",
      message: "Apakah Anda yakin ingin menghapus project ini secara permanen?",
      onConfirm: async () => {
        const success = await deleteProject(id);
        if (success) {
          showToast("Project berhasil dihapus.", "success");
          await loadProjects();
        } else {
          showToast("Gagal menghapus project.", "error");
        }
        setConfirmConfig(null);
      }
    });
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col md:flex-row transition-colors">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-brand-charcoal border-b md:border-b-0 md:border-r border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-between p-6 z-40 shrink-0">
        <div className="space-y-8">
          
          {/* Logo / Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-brand-orange text-white p-2.5 rounded-2xl">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-base font-black tracking-tight text-brand-charcoal dark:text-white uppercase">CMS Admin</h1>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Master UPVC</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveTab("products");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <Package className="w-4 h-4" />
              Katalog Produk
            </button>
            <button
              onClick={() => {
                setActiveTab("services");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "services"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Kelola Layanan
            </button>
            <button
              onClick={() => {
                setActiveTab("advantages");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "advantages"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <Award className="w-4 h-4" />
              Kelola Keunggulan
            </button>
            <button
              onClick={() => {
                setActiveTab("comparisons");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "comparisons"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Kelola Perbandingan
            </button>
            <button
              onClick={() => {
                setActiveTab("project");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "project"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              Kelola Project
            </button>
            <button
              onClick={() => {
                setActiveTab("settings");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <Settings className="w-4 h-4" />
              Pengaturan Aplikasi
            </button>
            <button
              onClick={() => {
                setActiveTab("users");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <Users className="w-4 h-4" />
              Kelola Admin & User
            </button>
            <button
              onClick={() => {
                setActiveTab("articles");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "articles"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              Artikel / Blog
            </button>
            <button
              onClick={() => {
                setActiveTab("leads");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "leads"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Kelola Leads Chatbot
            </button>
            <button
              onClick={() => {
                setActiveTab("social-wall");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "social-wall"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Kelola Social Wall
            </button>
            <button
              onClick={() => {
                setActiveTab("testimonials");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "testimonials"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <Star className="w-4 h-4" />
              Kelola Testimonial
            </button>
          </nav>
        </div>

      </aside>

      {/* Right Container: Header + Scrollable Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Sticky Header Bar */}
        <header className="sticky top-0 bg-white/80 dark:bg-brand-charcoal/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-orange">
              {activeTab === "products" && "Katalog Produk"}
              {activeTab === "services" && "Kelola Layanan"}
              {activeTab === "project" && "Kelola Project"}
              {activeTab === "settings" && "Pengaturan Aplikasi"}
              {activeTab === "advantages" && "Kelola 8 Pilar Keunggulan"}
              {activeTab === "comparisons" && "Kelola Perbandingan Material"}
              {activeTab === "users" && "Kelola User & Admin"}
              {activeTab === "articles" && "Artikel / Blog"}
              {activeTab === "leads" && "Leads Chatbot"}
              {activeTab === "social-wall" && "Social Wall"}
              {activeTab === "testimonials" && "Testimonial"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Login: admin@masterupvc.id
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-zinc-200/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 w-full overflow-y-auto">
        
        {activeTab === "products" && (
          /* =======================================================
             TAB 1: PRODUCT CATALOG MANAGEMENT
             ======================================================= */
          <div>
            {/* Header Title & Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-brand-charcoal dark:text-white tracking-tight">Katalog Produk</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Atur spesifikasi dimensi, kelola kategori dinamis, dan kelola variasi warna beserta harga.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold px-4 py-3 rounded-2xl text-xs transition-all shadow-sm cursor-pointer hover:bg-zinc-100"
                >
                  <FolderOpen className="w-4 h-4 text-brand-orange" />
                  Kelola Kategori
                </button>
                <button
                  onClick={() => setShowTierModal(true)}
                  className="flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold px-4 py-3 rounded-2xl text-xs transition-all shadow-sm cursor-pointer hover:bg-zinc-100"
                >
                  <Layers className="w-4 h-4 text-brand-orange" />
                  Kelola Spesifikasi/Tier
                </button>
                <button
                  onClick={handleOpenAdd}
                  className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-brand-orange/15 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Produk
                </button>
              </div>
            </div>

            {/* Toolbar & Search */}
            <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full mb-4">
                <div className="relative max-w-md w-full">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                    <Search className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama atau deskripsi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-brand-charcoal dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange/60 transition-all text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Urutkan:</label>
                  <select
                    value={sortField && sortDirection ? `${sortField}-${sortDirection}` : ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        setSortField("");
                      } else {
                        const [field, direction] = val.split("-") as [ "category", "asc" | "desc" ];
                        setSortField(field);
                        setSortDirection(direction);
                      }
                    }}
                    className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none text-brand-charcoal dark:text-white font-medium"
                  >
                    <option value="">Default (Tanpa Urutan)</option>
                    <option value="category-asc">Kategori (A-Z)</option>
                    <option value="category-desc">Kategori (Z-A)</option>
                  </select>
                </div>
              </div>

              {/* Toggle pills / tags */}
              <div className="flex flex-wrap items-center justify-between w-full border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4 gap-2 text-sm">
                <div className="flex flex-wrap items-center gap-3">
                  {tiersList.map(t => {
                    const isSelected = tierFilter === t.name;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTierFilter(isSelected ? "Semua" : t.name)}
                        className={`px-4 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-orange-100 text-brand-orange border-brand-orange/40 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900 font-bold"
                            : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        • {t.name}
                      </button>
                    );
                  })}
                  {(categoryFilter !== "Semua" || tierFilter !== "Semua" || searchQuery !== "") && (
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter("Semua");
                        setTierFilter("Semua");
                        setSearchQuery("");
                      }}
                      className="text-xs text-brand-orange hover:underline font-semibold"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
                
                <span className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
                  {filteredProducts.length}+ Item Terfilter
                </span>
              </div>

              {/* Baris 1: Filter Kategori (Dynamic) */}
              <div className="w-full overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-2 min-w-max">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider w-20">Kategori:</span>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter("Semua")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      categoryFilter === "Semua"
                        ? "bg-brand-orange text-white"
                        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/50"
                    }`}
                  >
                    📋 Semua Kategori
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryFilter(cat.name)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        categoryFilter === cat.name
                          ? "bg-brand-orange text-white"
                          : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/50"
                      }`}
                    >
                      {cat.name === "Pintu" ? "🚪" : cat.name === "Jendela" ? "🪟" : "📁"} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-12 text-center shadow-sm">
                <p className="text-zinc-500">Katalog kosong. Silakan tambah produk baru.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id}
                    className="group flex flex-col justify-between bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-5 shadow-sm hover:border-brand-orange/40 hover:shadow-md transition-all duration-300"
                  >
                    <div>
                      {/* Image preview box */}
                      <div className="w-full h-36 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/60 mb-4 overflow-hidden relative flex items-center justify-center">
                        {p.variants && p.variants[0]?.image_url ? (
                          <img 
                            src={p.variants[0].image_url} 
                            alt={p.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">UPVC Produk</span>
                          </div>
                        )}
                        
                        <span className="absolute top-2.5 left-2.5 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/20">
                          {getCategoryName(p.category_id)}
                        </span>
                      </div>

                      {/* Badges row */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/20 text-brand-orange uppercase">
                          {p.tier}
                        </span>
                        {p.dimensions && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">
                            {p.dimensions}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-bold text-brand-charcoal dark:text-white line-clamp-1">
                        {p.name}
                      </h4>

                      {/* Description */}
                      {p.description && (
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 line-clamp-2 min-h-[32px]">
                          {p.description}
                        </p>
                      )}

                      {/* Colors List */}
                      <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
                        <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Warna Tersedia:</span>
                        <div className="flex flex-wrap gap-1">
                          {p.variants && p.variants.map((v, i) => (
                            <span 
                              key={i} 
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900"
                            >
                              {v.color}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                      <div className="text-[9px] text-zinc-400 uppercase tracking-wider">Rentang Harga</div>
                      <div className="text-lg font-black text-brand-charcoal dark:text-white mt-1 line-clamp-1">
                        {getPriceDisplay(p)}
                      </div>

                      <div className="flex gap-2.5 mt-4">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="w-1/2 flex items-center justify-center gap-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-brand-orange/40 hover:text-brand-orange py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-zinc-900"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="w-1/2 flex items-center justify-center gap-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-zinc-900"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "services" && (
          /* =======================================================
             TAB: SERVICES MANAGEMENT
             ======================================================= */
          <div>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-brand-charcoal dark:text-white tracking-tight">Kelola Layanan</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Atur layanan jasa konstruksi & interior UPVC yang ditampilkan secara dinamis di halaman utama.
                </p>
              </div>

              <button
                onClick={handleOpenAddService}
                className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-md shadow-brand-orange/15 cursor-pointer hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                Tambah Layanan Baru
              </button>
            </div>

            {loadingServices ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl">
                <Sparkles className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="font-extrabold text-brand-charcoal dark:text-white">Belum Ada Layanan</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">Klik tombol di atas untuk menambahkan layanan pertama Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div 
                    key={service.id} 
                    className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 group relative"
                  >
                    <div className="space-y-4">
                      {/* Thumbnail Image */}
                      <div className="w-full h-36 rounded-2xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative border border-zinc-100 dark:border-zinc-800">
                        {service.image_url ? (
                          <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400 font-bold bg-zinc-50 dark:bg-zinc-950">
                            Tidak Ada Gambar
                          </div>
                        )}
                        <span className={`absolute top-3 right-3 text-[10px] font-extrabold px-2 py-1 rounded-full ${
                          service.active === 1 
                            ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" 
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                        }`}>
                          {service.active === 1 ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>

                      {/* Title & Icon */}
                      <div className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-brand-orange flex items-center justify-center shrink-0">
                          {getServiceIcon(service.icon)}
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-brand-charcoal dark:text-white line-clamp-1">{service.title}</h3>
                          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 dark:bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-200/40 dark:border-zinc-800">
                            /{service.slug}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex gap-2.5 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                      <button
                        onClick={() => handleOpenEditService(service)}
                        className="w-1/2 flex items-center justify-center gap-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-brand-orange/40 hover:text-brand-orange py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-zinc-900"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="w-1/2 flex items-center justify-center gap-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:text-red-500 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-zinc-900"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "project" && (
          /* =======================================================
             TAB: PROJECT MANAGEMENT
             ======================================================= */
          <div>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-brand-charcoal dark:text-white tracking-tight">Kelola Project</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Kelola galeri dokumentasi proyek hasil pemasangan UPVC yang selesai dikerjakan secara dinamis.
                </p>
              </div>

              <button
                onClick={handleOpenAddProject}
                className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-md shadow-brand-orange/15 cursor-pointer hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                Tambah Project Baru
              </button>
            </div>

            {loadingProjects ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : projectsList.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl">
                <FolderOpen className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <h3 className="font-bold text-zinc-650 dark:text-white">Tidak ada data project</h3>
                <p className="text-xs text-zinc-400 mt-1">Gunakan tombol di atas untuk menambahkan project pertama Anda.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-900/30">
                        <th className="px-6 py-4">Foto / Judul</th>
                        <th className="px-6 py-4">Klien & Lokasi</th>
                        <th className="px-6 py-4">Tanggal</th>
                        <th className="px-6 py-4">Layanan Terpasang</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
                      {projectsList.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-12 rounded-xl overflow-hidden bg-zinc-150 shrink-0 border border-zinc-200/50 dark:border-zinc-800">
                                {p.images && p.images.length > 0 ? (
                                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-400">No Image</div>
                                )}
                              </div>
                              <div>
                                <div className="font-extrabold text-brand-charcoal dark:text-white line-clamp-1">{p.title}</div>
                                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">/{p.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-brand-charcoal dark:text-white">{p.client_name || "-"}</div>
                            <div className="text-[10px] text-zinc-400 mt-0.5">{p.location || "-"}</div>
                          </td>
                          <td className="px-6 py-4 font-medium text-zinc-500">
                            {p.project_date ? new Date(p.project_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {p.services_used && p.services_used.map((srv: string, idx: number) => (
                                <span key={idx} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300">
                                  {srv}
                                </span>
                              ))}
                              {(!p.services_used || p.services_used.length === 0) && <span className="text-[10px] text-zinc-400">-</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              p.active === 1
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                                : "bg-red-50 text-red-500 dark:bg-red-950/20"
                            }`}>
                              {p.active === 1 ? "Aktif" : "Nonaktif"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEditProject(p)}
                                className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand-orange/40 hover:text-brand-orange transition-colors cursor-pointer bg-white dark:bg-zinc-900"
                                title="Ubah Detail"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(p.id)}
                                className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition-colors cursor-pointer bg-white dark:bg-zinc-900"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        
        {/* TAB 10: KELOLA KEUNGGULAN (ADVANTAGES) */}
        {activeTab === "advantages" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-brand-charcoal p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div>
                <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white">
                  Daftar Pilar Keunggulan Material
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Atur poin keunggulan UPVC yang ditampilkan pada Landing Page.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingAdvantage(null);
                  setAdvTitle(""); setAdvDesc(""); setAdvIcon("Volume2"); setAdvOrder(advantagesList.length + 1);
                  setIsAdvantageModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-lg shadow-orange-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Keunggulan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantagesList.map((item) => (
                <div key={item.id} className="bg-white dark:bg-brand-charcoal p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-2xl text-brand-orange font-bold">
                      {item.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingAdvantage(item);
                          setAdvTitle(item.title);
                          setAdvDesc(item.description);
                          setAdvIcon(item.icon);
                          setAdvOrder(item.sort_order);
                          setIsAdvantageModalOpen(true);
                        }}
                        className="p-2 text-zinc-500 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAdvantage(item.id)}
                        className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-brand-charcoal dark:text-white text-base mb-2">{item.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{item.description}</p>
                  <div className="text-[10px] text-zinc-400 font-mono">Urutan: #{item.sort_order}</div>
                </div>
              ))}
            </div>

            {/* ADVANTAGES MODAL */}
            {isAdvantageModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-brand-charcoal p-6 md:p-8 rounded-3xl max-w-lg w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white">
                      {editingAdvantage ? "Edit Keunggulan" : "Tambah Keunggulan Baru"}
                    </h3>
                    <button onClick={() => setIsAdvantageModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveAdvantage} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Judul Keunggulan</label>
                      <input
                        type="text"
                        required
                        value={advTitle}
                        onChange={(e) => setAdvTitle(e.target.value)}
                        placeholder="Contoh: Kedap Suara"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Deskripsi Singkat</label>
                      <textarea
                        rows={3}
                        value={advDesc}
                        onChange={(e) => setAdvDesc(e.target.value)}
                        placeholder="Deskripsi keunggulan..."
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Ikon (Lucide Name)</label>
                        <select
                          value={advIcon}
                          onChange={(e) => setAdvIcon(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-orange"
                        >
                          <option value="Volume2">Volume2 (Kedap Suara)</option>
                          <option value="Zap">Zap (Hemat Energi)</option>
                          <option value="Droplet">Droplet (Tahan Air)</option>
                          <option value="SunDim">SunDim (Tahan Cuaca)</option>
                          <option value="Wind">Wind (Tahan Polusi)</option>
                          <option value="Sparkles">Sparkles (Perawatan Mudah)</option>
                          <option value="ShieldAlert">ShieldAlert (Anti Rayap)</option>
                          <option value="ShieldCheck">ShieldCheck (Anti Debu)</option>
                          <option value="Star">Star</option>
                          <option value="Award">Award</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Urutan Tampil</label>
                        <input
                          type="number"
                          value={advOrder}
                          onChange={(e) => setAdvOrder(Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-orange"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <button type="button" onClick={() => setIsAdvantageModalOpen(false)} className="px-5 py-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        Batal
                      </button>
                      <button type="submit" className="px-6 py-2.5 rounded-xl bg-brand-orange text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20">
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}


        {/* TAB 11: KELOLA PERBANDINGAN MATERIAL (COMPARISONS) */}
        {activeTab === "comparisons" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-brand-charcoal p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div>
                <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white">
                  Fitur Perbandingan Material
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Atur perbandingan performa antara UPVC, Kayu Tradisional, dan Aluminium Biasa.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingComp(null);
                  setCompFeature(""); setCompUpvcVal(""); setCompWoodVal(""); setCompAlumVal("");
                  setCompWoodStatus("negative"); setCompAlumStatus("neutral"); setCompOrder(comparisonsList.length + 1);
                  setIsCompModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-lg shadow-orange-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Perbandingan</span>
              </button>
            </div>

            <div className="bg-white dark:bg-brand-charcoal rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-500 uppercase">
                  <tr>
                    <th className="p-4">Fitur Perbandingan</th>
                    <th className="p-4 text-emerald-600">UPVC Premium</th>
                    <th className="p-4">Kayu Tradisional</th>
                    <th className="p-4">Aluminium Biasa</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {comparisonsList.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                      <td className="p-4 font-bold text-brand-charcoal dark:text-white">{item.feature_name}</td>
                      <td className="p-4 text-emerald-600 font-bold">✓ {item.upvc_value}</td>
                      <td className={`p-4 ${item.wood_status === 'negative' ? 'text-red-500 font-semibold' : 'text-zinc-500'}`}>
                        {item.wood_status === 'negative' ? '✕ ' : '• '}{item.wood_value}
                      </td>
                      <td className={`p-4 ${item.alum_status === 'negative' ? 'text-red-500 font-semibold' : 'text-zinc-500'}`}>
                        {item.alum_status === 'negative' ? '✕ ' : '• '}{item.alum_value}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingComp(item);
                              setCompFeature(item.feature_name);
                              setCompUpvcVal(item.upvc_value);
                              setCompWoodVal(item.wood_value);
                              setCompWoodStatus(item.wood_status || "negative");
                              setCompAlumVal(item.alum_value);
                              setCompAlumStatus(item.alum_status || "neutral");
                              setCompOrder(item.sort_order || 1);
                              setIsCompModalOpen(true);
                            }}
                            className="p-1.5 text-zinc-500 hover:text-brand-orange hover:bg-orange-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteComparison(item.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* COMPARISONS MODAL */}
            {isCompModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-brand-charcoal p-6 md:p-8 rounded-3xl max-w-xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white">
                      {editingComp ? "Edit Perbandingan" : "Tambah Perbandingan Baru"}
                    </h3>
                    <button onClick={() => setIsCompModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveComparison} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Nama Fitur Perbandingan</label>
                      <input
                        type="text"
                        required
                        value={compFeature}
                        onChange={(e) => setCompFeature(e.target.value)}
                        placeholder="Contoh: Ketahanan Rayap & Hama"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-emerald-600 mb-1">Performa UPVC Premium</label>
                      <input
                        type="text"
                        required
                        value={compUpvcVal}
                        onChange={(e) => setCompUpvcVal(e.target.value)}
                        placeholder="Contoh: 100% Anti Rayap"
                        className="w-full px-4 py-3 rounded-xl border border-emerald-500/30 dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Kayu Tradisional</label>
                        <input
                          type="text"
                          value={compWoodVal}
                          onChange={(e) => setCompWoodVal(e.target.value)}
                          placeholder="Contoh: Sangat Rentan Keropos"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-orange"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Status Kayu</label>
                        <select
                          value={compWoodStatus}
                          onChange={(e) => setCompWoodStatus(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 text-brand-charcoal dark:text-white"
                        >
                          <option value="negative">Negatif (Warna Merah ✕)</option>
                          <option value="neutral">Netral (Warna Abu-abu •)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Aluminium Biasa</label>
                        <input
                          type="text"
                          value={compAlumVal}
                          onChange={(e) => setCompAlumVal(e.target.value)}
                          placeholder="Contoh: Tahan Rayap"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 text-brand-charcoal dark:text-white focus:outline-none focus:border-brand-orange"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Status Aluminium</label>
                        <select
                          value={compAlumStatus}
                          onChange={(e) => setCompAlumStatus(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 text-brand-charcoal dark:text-white"
                        >
                          <option value="neutral">Netral (Warna Abu-abu •)</option>
                          <option value="negative">Negatif (Warna Merah ✕)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <button type="button" onClick={() => setIsCompModalOpen(false)} className="px-5 py-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        Batal
                      </button>
                      <button type="submit" className="px-6 py-2.5 rounded-xl bg-brand-orange text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20">
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

{activeTab === "settings" && (
          /* =======================================================
             TAB 2: WEBSITE SETTINGS (SEO & AI CONFIGURATION)
             ======================================================= */
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-black text-brand-charcoal dark:text-white tracking-tight">Pengaturan Aplikasi</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Konfigurasikan logo, favicon, informasi kontak, metadata SEO, serta basis pengetahuan AI dari satu panel kontrol.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              
              {/* Meta SEO Section */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-extrabold flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-brand-orange">🔍</span> Meta SEO (Google & Bing)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Judul Website (SEO Title)</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Master UPVC Indonesia - Jendela & Pintu UPVC Premium"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Deskripsi SEO (Meta Description)</label>
                    <textarea
                      placeholder="Penjelasan singkat mengenai keunggulan bisnis UPVC Anda..."
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Kata Kunci SEO (Keywords)</label>
                    <input
                      type="text"
                      placeholder="master upvc, pintu upvc, jendela upvc..."
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Branding Assets Section */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-extrabold flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-brand-orange">🎨</span> Branding Visual (Logo & Favicon)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo uploader */}
                  <div className="p-4 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl bg-zinc-50/30 dark:bg-zinc-900/10 space-y-4">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Logo Perusahaan</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                        {logo ? (
                          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-bold">No Logo</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setLogo(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <button
                            type="button"
                            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-100"
                          >
                            <Upload className="w-3.5 h-3.5 text-brand-orange" />
                            Pilih Logo
                          </button>
                        </div>
                        {logo && (
                          <button
                            type="button"
                            onClick={() => setLogo(null)}
                            className="text-[10px] text-red-500 font-bold hover:underline"
                          >
                            Reset Logo ke Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Favicon uploader */}
                  <div className="p-4 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl bg-zinc-50/30 dark:bg-zinc-900/10 space-y-4">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Favicon Browser</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                        {favicon ? (
                          <img src={favicon} alt="Favicon" className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-bold">No Icon</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFavicon(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <button
                            type="button"
                            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-100"
                          >
                            <Upload className="w-3.5 h-3.5 text-brand-orange" />
                            Pilih Favicon
                          </button>
                        </div>
                        {favicon && (
                          <button
                            type="button"
                            onClick={() => setFavicon(null)}
                            className="text-[10px] text-red-500 font-bold hover:underline"
                          >
                            Reset Favicon
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Profile PDF Document Section */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-extrabold flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-brand-orange">📁</span> Company Profile PDF
                </h3>

                <div className="space-y-4">
                  <div className="p-4 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl bg-zinc-50/30 dark:bg-zinc-900/10 space-y-4">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">File PDF Company Profile</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                        {companyProfilePdf ? (
                          <div className="text-center p-2">
                            <span className="text-red-500 font-extrabold text-xs block">PDF</span>
                            <span className="text-[9px] text-zinc-400 font-bold block truncate max-w-[50px]">Uploaded</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-bold">No File</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="relative">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 8 * 1024 * 1024) {
                                  alert("Ukuran file maksimal adalah 8MB.");
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setCompanyProfilePdf(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <button
                            type="button"
                            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-100"
                          >
                            <Upload className="w-3.5 h-3.5 text-brand-orange" />
                            Pilih File PDF
                          </button>
                        </div>
                        {companyProfilePdf && (
                          <div className="flex items-center gap-2">
                            <a
                              href={companyProfilePdf}
                              download="Company_Profile_Master_UPVC.pdf"
                              className="text-[10px] text-brand-orange font-bold hover:underline"
                            >
                              Download/Pratinjau File
                            </a>
                            <span className="text-zinc-300 dark:text-zinc-700">|</span>
                            <button
                              type="button"
                              onClick={() => setCompanyProfilePdf(null)}
                              className="text-[10px] text-red-500 font-bold hover:underline"
                            >
                              Hapus File
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Profile Dynamic Images Gallery Section */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-extrabold flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-brand-orange">🖼️</span> Foto Halaman Profil Perusahaan
                </h3>
                <p className="text-xs text-zinc-400">Unggah foto kustom untuk menghiasi halaman profil secara dinamis. Format gambar (PNG/JPG/WEBP) maksimal 2MB per file.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {[
                    { label: "Foto Utama Profil (Hero)", value: profileImageHero, setter: setProfileImageHero },
                    { label: "Foto Tentang Kami (About)", value: profileImageAbout, setter: setProfileImageAbout },
                    { label: "Foto Visi & Misi (Factory)", value: profileImageMission, setter: setProfileImageMission }
                  ].map(({ label, value, setter }) => (
                    <div key={label} className="p-4 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl bg-zinc-50/30 dark:bg-zinc-900/10 space-y-4">
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</label>
                      <div className="flex flex-col gap-4 items-center">
                        <div className="w-full h-32 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                          {value ? (
                            <img src={value} alt={label} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-zinc-400 font-bold">No Image</span>
                          )}
                        </div>
                        <div className="w-full space-y-2">
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 2 * 1024 * 1024) {
                                    alert("Ukuran file maksimal adalah 2MB.");
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setter(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <button
                              type="button"
                              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-100"
                            >
                              <Upload className="w-3.5 h-3.5 text-brand-orange" />
                              Pilih Foto
                            </button>
                          </div>
                          {value && (
                            <button
                              type="button"
                              onClick={() => setter(null)}
                              className="w-full text-center text-[10px] text-red-500 font-bold hover:underline"
                            >
                              Reset Foto
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Variations Showcase Images Section */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-extrabold flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-brand-orange">🎨</span> Foto Variasi Warna Profil UPVC
                </h3>
                <p className="text-xs text-zinc-400">Unggah foto profil fisik atau sampel produk untuk masing-masing variasi warna yang ditampilkan di beranda. Format gambar (PNG/JPG/WEBP) maksimal 2MB.</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  {[
                    { label: "Putih", value: colorImagePutih, setter: setColorImagePutih },
                    { label: "Hitam", value: colorImageHitam, setter: setColorImageHitam },
                    { label: "Coklat", value: colorImageCoklat, setter: setColorImageCoklat },
                    { label: "Serat Kayu", value: colorImageGoldenOak, setter: setColorImageGoldenOak }
                  ].map(({ label, value, setter }) => (
                    <div key={label} className="p-4 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl bg-zinc-50/30 dark:bg-zinc-900/10 space-y-4">
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider text-center">{label}</label>
                      <div className="flex flex-col gap-4 items-center">
                        <div className="w-full h-24 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                          {value ? (
                            <img src={value} alt={label} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-zinc-400 font-bold">No Image</span>
                          )}
                        </div>
                        <div className="w-full space-y-2">
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 2 * 1024 * 1024) {
                                    alert("Ukuran file maksimal adalah 2MB.");
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setter(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <button
                              type="button"
                              className="w-full px-2 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer hover:bg-zinc-100"
                            >
                              <Upload className="w-3 h-3 text-brand-orange" />
                              Pilih Foto
                            </button>
                          </div>
                          {value && (
                            <button
                              type="button"
                              onClick={() => setter(null)}
                              className="w-full text-center text-[9px] text-red-500 font-bold hover:underline"
                            >
                              Reset Foto
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-extrabold flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-brand-orange">📞</span> Informasi Kontak & Lokasi
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">No. WhatsApp Pemesanan</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: +62 812-3456-7890"
                        value={contactWhatsapp}
                        onChange={(e) => setContactWhatsapp(e.target.value)}
                        className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Bisnis</label>
                      <input
                        type="email"
                        required
                        placeholder="Contoh: info@masterupvc.id"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Website Resmi</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: WWW.MASTERUPVC.ID"
                        value={contactWebsite}
                        onChange={(e) => setContactWebsite(e.target.value)}
                        className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Google Maps Embed/Label Lokasi</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Curug, Gn. Sindur, Bogor"
                        value={contactMapsUrl}
                        onChange={(e) => setContactMapsUrl(e.target.value)}
                        className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Alamat Lengkap Workshop</label>
                    <textarea
                      required
                      placeholder="Masukkan alamat fisik produksi..."
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[60px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      🗺️ Link Ulasan Google Maps
                    </label>
                    <input
                      type="url"
                      placeholder="https://g.page/r/..."
                      value={googleMapsReviewUrl}
                      onChange={(e) => setGoogleMapsReviewUrl(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                    />
                    <p className="text-[11px] text-zinc-400 mt-1.5">Link ini akan tampil sebagai tombol &ldquo;Lihat Semua Ulasan di Google&rdquo; di bawah section Testimoni beranda. Kosongkan untuk menyembunyikan tombol.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Deskripsi CTA Hubungi Kami</label>
                    <textarea
                      required
                      placeholder="Teks ajakan di atas alamat..."
                      value={contactDescription}
                      onChange={(e) => setContactDescription(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <span className="text-brand-orange">📱</span> Media Sosial
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Isi URL lengkap atau username. Kosongkan jika tidak digunakan.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Instagram", placeholder: "@masterupvc atau https://instagram.com/...", value: socialInstagram, setter: setSocialInstagram, emoji: "📸" },
                    { label: "Facebook", placeholder: "masterupvc atau https://facebook.com/...", value: socialFacebook, setter: setSocialFacebook, emoji: "👥" },
                    { label: "TikTok", placeholder: "@masterupvc atau https://tiktok.com/...", value: socialTiktok, setter: setSocialTiktok, emoji: "🎵" },
                    { label: "YouTube", placeholder: "@masterupvc atau https://youtube.com/...", value: socialYoutube, setter: setSocialYoutube, emoji: "▶️" },
                    { label: "Twitter / X", placeholder: "@masterupvc atau https://x.com/...", value: socialTwitter, setter: setSocialTwitter, emoji: "✖️" },
                  ].map(({ label, placeholder, value, setter, emoji }) => (
                    <div key={label}>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        {emoji} {label}
                      </label>
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics Script Section */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <span className="text-brand-orange">📊</span> Skrip Integrasi / Analitik
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Masukkan tag skrip pelacakan (seperti Google Analytics, GMSAnalytics, dll) untuk dimasukkan ke dalam head secara dinamis.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Kode Skrip (HTML/Script Tag)</label>
                  <textarea
                    placeholder="Contoh: <script data-host='...' src='...'></script>"
                    value={analyticsScript}
                    onChange={(e) => setAnalyticsScript(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[120px] font-mono"
                  />
                </div>
              </div>

              {/* Chatbot Settings Section */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold flex items-center gap-2">
                      <span className="text-brand-orange">💬</span> Asisten Virtual / Chatbot WhatsApp
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Konfigurasikan asisten penjualan otomatis bergaya WhatsApp untuk menangkap leads calon pelanggan.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={chatbotActive === 1}
                      onChange={(e) => setChatbotActive(e.target.checked ? 1 : 0)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-brand-orange"></div>
                    <span className="ml-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">{chatbotActive === 1 ? "Aktif" : "Nonaktif"}</span>
                  </label>
                </div>

                {chatbotActive === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Bot Name */}
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nama Asisten (Bot Name)</label>
                        <input
                          type="text"
                          required={chatbotActive === 1}
                          placeholder="Contoh: Nadia"
                          value={chatbotName}
                          onChange={(e) => setChatbotName(e.target.value)}
                          className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                        />
                      </div>

                      {/* Bot Avatar */}
                      <div className="p-4 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl bg-zinc-50/30 dark:bg-zinc-900/10 space-y-4">
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Foto Profil Asisten (Avatar)</label>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                            {chatbotAvatar ? (
                              <img src={chatbotAvatar} alt="Bot Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-zinc-400 font-bold uppercase">{chatbotName[0]}</span>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setChatbotAvatar(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <button
                                type="button"
                                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-100"
                              >
                                <Upload className="w-3.5 h-3.5 text-brand-orange" />
                                Pilih Foto
                              </button>
                            </div>
                            {chatbotAvatar && (
                              <button
                                type="button"
                                onClick={() => setChatbotAvatar(null)}
                                className="text-[10px] text-red-500 font-bold hover:underline block"
                              >
                                Reset Foto ke Default
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scripts Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Pesan Sapaan Awal (Greeting)</label>
                        <textarea
                          required={chatbotActive === 1}
                          placeholder="Pesan sapaan selamat datang dari bot..."
                          value={chatbotInitialGreeting}
                          onChange={(e) => setChatbotInitialGreeting(e.target.value)}
                          className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[60px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Pertanyaan 1: Menanyakan Nama</label>
                          <textarea
                            required={chatbotActive === 1}
                            placeholder="Teks bot meminta nama user..."
                            value={chatbotAskNameMessage}
                            onChange={(e) => setChatbotAskNameMessage(e.target.value)}
                            className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[60px]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Pertanyaan 2: Menanyakan Nomor WhatsApp</label>
                          <textarea
                            required={chatbotActive === 1}
                            placeholder="Teks bot meminta nomor WA user..."
                            value={chatbotAskPhoneMessage}
                            onChange={(e) => setChatbotAskPhoneMessage(e.target.value)}
                            className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[60px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Pertanyaan 3: Menanyakan Email</label>
                          <textarea
                            required={chatbotActive === 1}
                            placeholder="Teks bot meminta alamat email..."
                            value={chatbotAskEmailMessage}
                            onChange={(e) => setChatbotAskEmailMessage(e.target.value)}
                            className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[60px]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Pertanyaan 4: Menanyakan Kebutuhan (Reason)</label>
                          <textarea
                            required={chatbotActive === 1}
                            placeholder="Teks bot meminta detail kebutuhan/proyek..."
                            value={chatbotAskReasonMessage}
                            onChange={(e) => setChatbotAskReasonMessage(e.target.value)}
                            className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[60px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Pesan Akhir / Penutup (Final Redirect Message)</label>
                        <textarea
                          required={chatbotActive === 1}
                          placeholder="Pesan penutup sebelum dialihkan ke WA admin..."
                          value={chatbotFinalMessage}
                          onChange={(e) => setChatbotFinalMessage(e.target.value)}
                          className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Search Optimization (LLM Knowledge Base Q&A) */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <span className="text-brand-orange">🤖</span> AI Knowledge Base (Optimasi LLM Search)
                  </h3>
                  <button
                    type="button"
                    onClick={addAiKnowledgeRow}
                    className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Tanya Jawab
                  </button>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Mesin pencari berbasis AI (seperti Perplexity, ChatGPT Search, atau Gemini) menyukai data Q&A terstruktur saat mengindeks situs web.
                  Masukkan tanya-jawab penting mengenai produk Anda agar AI dapat merekomendasikan bisnis Anda dengan akurat.
                </p>

                <div className="space-y-4">
                  {aiKnowledge.map((item, i) => (
                    <div key={i} className="p-4 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-500 font-mono">Pertanyaan #{i + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeAiKnowledgeRow(i)}
                          className="text-xs text-red-500 hover:underline flex items-center gap-0.5"
                        >
                          <Trash className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Pertanyaan (misal: Apakah produk Master UPVC anti rayap?)"
                        value={item.question}
                        onChange={(e) => updateAiKnowledgeRow(i, "question", e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none"
                      />
                      <textarea
                        placeholder="Jawaban (misal: Ya, produk kami 100% anti rayap karena menggunakan bahan plastik keras UPVC...)"
                        value={item.answer}
                        onChange={(e) => updateAiKnowledgeRow(i, "answer", e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs focus:outline-none min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Schema JSON-LD LocalBusiness Config */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-extrabold flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-brand-orange">🏢</span> Skema Bisnis Lokal (Schema.org JSON-LD)
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nama Badan Usaha</label>
                      <input
                        type="text"
                        value={schemaJson.name || ""}
                        onChange={(e) => setSchemaJson({ ...schemaJson, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Telepon Hubungi</label>
                      <input
                        type="text"
                        value={schemaJson.telephone || ""}
                        onChange={(e) => setSchemaJson({ ...schemaJson, telephone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Perusahaan</label>
                      <input
                        type="text"
                        value={schemaJson.email || ""}
                        onChange={(e) => setSchemaJson({ ...schemaJson, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">URL Profil Website</label>
                      <input
                        type="text"
                        value={schemaJson.url || ""}
                        onChange={(e) => setSchemaJson({ ...schemaJson, url: e.target.value })}
                        className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Deskripsi Ringkasan AI</label>
                    <textarea
                      value={schemaJson.description || ""}
                      onChange={(e) => setSchemaJson({ ...schemaJson, description: e.target.value })}
                      placeholder="Deskripsi untuk skema JSON-LD..."
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              
                
              
              
              {/* Mail Transfer Agent (SMTP) & Test Email Section */}
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold mb-2">
                      <Mail className="w-3.5 h-3.5" /> Mail Transfer Agent (SMTP)
                    </div>
                    <h3 className="text-xl font-black text-brand-charcoal dark:text-white tracking-tight">
                      Pengaturan Server Email SMTP
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Server pengiriman otomatis link Lupa Password, email notifikasi lead, dan konfirmasi pesan.
                    </p>
                  </div>

                  {/* Server Connection Status Badge */}
                  <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-2xl shrink-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${smtpHost && smtpUser ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
                      {`Status: ${smtpHost && smtpUser ? "Terkonfigurasi" : "Belum Diisi"}`}
                    </span>
                  </div>
                </div>

                {/* SMTP Credentials Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      SMTP Host <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. smtp.gmail.com atau mail.domainanda.com"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      SMTP Port <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="587 atau 465"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      SMTP Username / Email <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="admin@domainanda.com"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      SMTP Password / App Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      Nama Pengirim (Sender Name)
                    </label>
                    <input
                      type="text"
                      placeholder="Master UPVC Official"
                      value={smtpSenderName}
                      onChange={(e) => setSmtpSenderName(e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange font-medium"
                    />
                  </div>

                  <div className="flex items-center pt-2">
                    <div className="w-full bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-3.5 flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="smtpSecure"
                        checked={smtpSecure === 1}
                        onChange={(e) => setSmtpSecure(e.target.checked ? 1 : 0)}
                        className="w-4 h-4 rounded text-brand-orange focus:ring-brand-orange accent-brand-orange cursor-pointer"
                      />
                      <label htmlFor="smtpSecure" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                        Gunakan SSL Port 465 (TLS: Port 587)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Sub-Card: TEST EMAIL FEATURE */}
                <div className="bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent border border-brand-orange/20 rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold text-sm">
                        🧪
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-brand-charcoal dark:text-white">
                          Uji Pengiriman Email (Test Email)
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Kirim email percobaan instan untuk memverifikasi sambungan server SMTP Anda.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        placeholder="Masukkan alamat email penerima (e.g. nama@gmail.com)"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                        className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-orange font-medium"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendTestEmail}
                      disabled={sendingTestEmail}
                      className="bg-zinc-900 dark:bg-white hover:bg-black dark:hover:bg-zinc-100 text-white dark:text-black font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shrink-0"
                    >
                      {sendingTestEmail ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Mengirim Email Tes...
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" /> Kirim Email Tes
                        </>
                      )}
                    </button>
                  </div>

                  {/* Inline Test Email Feedback Message */}
                  {testEmailResult && (
                    <div className={`p-4 rounded-xl text-xs font-bold flex items-start gap-2.5 ${
                      testEmailResult.success 
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400" 
                        : "bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400"
                    }`}>
                      <span className="text-base leading-none">{`${testEmailResult.success ? "✅" : "❌"}`}</span>
                      <div className="flex-1 font-semibold">{testEmailResult.message}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Responsive Save Configuration Button */}
              <div className="w-full flex items-center justify-center sm:justify-end pt-6 pb-8 border-t border-zinc-200/60 dark:border-zinc-800">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-brand-orange via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-brand-orange/25 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 cursor-pointer text-center"
                >
                  {savingSettings ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4.5 h-4.5 flex-shrink-0" />
                      <span className="whitespace-normal sm:whitespace-nowrap">Simpan Seluruh Konfigurasi Aplikasi</span>
                    </>
                  )}
                </button>
              </div>


            </form>
          </div>
        )}

        {activeTab === "articles" && (
          <ArticlesPanel />
        )}

        {activeTab === "leads" && (
          <LeadsPanel />
        )}

        {activeTab === "users" && (
          <UserManagerPanel />
        )}

        {activeTab === "testimonials" && (
          /* =======================================================
             TAB 6: TESTIMONIAL MANAGEMENT
             ======================================================= */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-brand-charcoal dark:text-white tracking-tight">Kelola Testimonial</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Tambah, edit, dan kelola testimoni pelanggan yang ditampilkan di beranda.</p>
              </div>
              <button
                onClick={() => {
                  setTestimonialsShowForm(true);
                  setEditingTestimonial(null);
                  setTName(""); setTPhoto(null); setTComment(""); setTRating(5); setTActive(1);
                }}
                className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-brand-orange/15 cursor-pointer shrink-0"
              >
                <Plus className="w-5 h-5" />
                Tambah Testimonial
              </button>
            </div>

            {/* Add / Edit Form */}
            {testimonialsShowForm && (
              <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-extrabold flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-brand-orange">⭐</span>
                  {editingTestimonial ? "Edit Testimonial" : "Tambah Testimonial Baru"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nama */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nama Pelanggan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={tName}
                      onChange={(e) => setTName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Rating Bintang</label>
                    <div className="flex items-center gap-1 pt-1">
                      {[1,2,3,4,5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setTRating(star)}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-7 h-7 ${star <= tRating ? "text-amber-400 fill-amber-400" : "text-zinc-300 dark:text-zinc-600"}`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-zinc-500">{tRating}/5</span>
                    </div>
                  </div>

                  {/* Komentar */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Komentar / Testimoni</label>
                    <textarea
                      rows={4}
                      placeholder="Tulis komentar pelanggan di sini..."
                      value={tComment}
                      onChange={(e) => setTComment(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none resize-none"
                    />
                  </div>

                  {/* Foto Avatar */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Foto Profil (Opsional)</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden shrink-0">
                        {tPhoto ? (
                          <img src={tPhoto} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-bold text-center px-1">No Photo</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 2 * 1024 * 1024) { alert("Maks 2MB."); return; }
                                const reader = new FileReader();
                                reader.onloadend = () => setTPhoto(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <button type="button" className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-100">
                            <Upload className="w-3 h-3 text-brand-orange" /> Pilih Foto
                          </button>
                        </div>
                        {tPhoto && (
                          <button type="button" onClick={() => setTPhoto(null)} className="w-full text-center text-[10px] text-red-500 font-bold hover:underline">Hapus Foto</button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Aktif */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Status Tampil di Beranda</label>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setTActive(tActive === 1 ? 0 : 1)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          tActive === 1 ? "bg-brand-orange" : "bg-zinc-300 dark:bg-zinc-700"
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          tActive === 1 ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        {tActive === 1 ? "Ditampilkan" : "Disembunyikan"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!tName || !tComment) { showToast("Nama dan komentar wajib diisi.", "error"); return; }
                      setSavingTestimonial(true);
                      try {
                        const method = editingTestimonial ? "PUT" : "POST";
                        const body = editingTestimonial
                          ? { id: editingTestimonial.id, name: tName, photo: tPhoto, comment: tComment, rating: tRating, is_active: tActive }
                          : { name: tName, photo: tPhoto, comment: tComment, rating: tRating, is_active: tActive };
                        const res = await fetch("/api/testimonials", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                        const data = await res.json();
                        if (data.success) {
                          showToast(editingTestimonial ? "Testimonial diperbarui." : "Testimonial ditambahkan.", "success");
                          setTestimonialsShowForm(false); setEditingTestimonial(null);
                          const rows = await fetch("/api/testimonials").then(r => r.json());
                          if (Array.isArray(rows)) setTestimonials(rows);
                        } else { showToast(`Gagal: ${data.error}`, "error"); }
                      } catch (err: any) { showToast(`Error: ${err.message}`, "error"); }
                      finally { setSavingTestimonial(false); }
                    }}
                    disabled={savingTestimonial}
                    className="flex-1 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-brand-orange/15 disabled:opacity-60"
                  >
                    {savingTestimonial ? "Menyimpan..." : editingTestimonial ? "Simpan Perubahan" : "Tambah Testimonial"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTestimonialsShowForm(false); setEditingTestimonial(null); }}
                    className="px-6 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* Testimonials List */}
            <div className="space-y-3">
              {loadingTestimonials ? (
                <div className="py-12 text-center text-zinc-400 text-sm">Memuat...</div>
              ) : testimonials.length === 0 ? (
                <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-12 text-center shadow-sm">
                  <div className="text-4xl mb-4">⭐</div>
                  <p className="text-zinc-500 font-semibold">Belum ada testimonial. Tambahkan yang pertama!</p>
                </div>
              ) : (
                testimonials.map((t) => (
                  <div key={t.id} className="flex items-start gap-4 p-5 bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-sm hover:border-brand-orange/30 transition-all">
                    {/* Avatar */}
                    {t.photo ? (
                      <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-white font-extrabold text-base shrink-0">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-brand-charcoal dark:text-white">{t.name}</span>
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= t.rating ? "text-amber-400 fill-amber-400" : "text-zinc-300 dark:text-zinc-600"}`} />)}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                        }`}>
                          {t.is_active ? "Aktif" : "Tersembunyi"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{t.comment}</p>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTestimonial(t);
                          setTName(t.name); setTPhoto(t.photo || null); setTComment(t.comment);
                          setTRating(t.rating); setTActive(t.is_active);
                          setTestimonialsShowForm(true);
                        }}
                        className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 hover:border-brand-orange/40 hover:text-brand-orange px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-zinc-900"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmConfig({
                          title: "Hapus Testimonial?",
                          message: `Apakah Anda yakin ingin menghapus testimonial dari "${t.name}"?`,
                          onConfirm: async () => {
                            try {
                              const res = await fetch(`/api/testimonials?id=${t.id}`, { method: "DELETE" });
                              const data = await res.json();
                              if (data.success) {
                                showToast("Testimonial dihapus.", "success");
                                const rows = await fetch("/api/testimonials").then(r => r.json());
                                if (Array.isArray(rows)) setTestimonials(rows);
                              } else { showToast(`Gagal: ${data.error}`, "error"); }
                            } catch (err: any) { showToast(`Error: ${err.message}`, "error"); }
                            finally { setConfirmConfig(null); }
                          }
                        })}
                        className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-zinc-900"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "social-wall" && (
          /* =======================================================
             TAB 5: SOCIAL WALL MANAGEMENT (Instagram & TikTok)
             ======================================================= */
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-black uppercase text-brand-charcoal dark:text-white">Kelola Social Media Wall</h2>
              <p className="text-xs text-zinc-400 mt-1">Tambahkan postingan Instagram atau TikTok pilihan Anda untuk ditampilkan secara estetik di halaman utama.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Add form */}
              <div className="lg:col-span-5 bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm h-fit">
                <h3 className="text-sm font-extrabold pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4 flex items-center gap-2">
                  <span className="text-brand-orange">➕</span> Tambah Postingan Baru
                </h3>
                <form onSubmit={handleAddSocialPost} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Platform</label>
                    <select
                      value={wallPlatform}
                      onChange={(e) => setWallPlatform(e.target.value as "instagram" | "tiktok")}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                    >
                      <option value="instagram">Instagram (Reel/Post)</option>
                      <option value="tiktok">TikTok (Video)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">URL Postingan Asli</label>
                    <input
                      type="text"
                      required
                      placeholder={wallPlatform === "instagram" ? "Contoh: https://www.instagram.com/p/..." : "Contoh: https://www.tiktok.com/@..."}
                      value={wallPostUrl}
                      onChange={(e) => setWallPostUrl(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Caption Singkat (Opsional)</label>
                    <textarea
                      placeholder="Masukkan kutipan caption..."
                      value={wallCaption}
                      onChange={(e) => setWallCaption(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[60px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Gambar Thumbnail / Cover</label>
                    <div className="space-y-3">
                      <div className="w-full h-44 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center overflow-hidden">
                        {wallImageUrl ? (
                          <img src={wallImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-zinc-400 font-bold">Pratinjau Gambar</span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                alert("Ukuran file maksimal adalah 2MB.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setWallImageUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button
                          type="button"
                          className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-100"
                        >
                          <Upload className="w-3.5 h-3.5 text-brand-orange" />
                          Pilih/Unggah Gambar Cover
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingSocial}
                    className="w-full bg-brand-orange hover:bg-brand-orange/95 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-brand-orange/15 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loadingSocial ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Tambah ke Social Wall
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Grid list */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-sm font-extrabold pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                  <span className="text-brand-orange">📋</span> Postingan Aktif ({socialPosts.length})
                </h3>

                {socialPosts.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6">
                    <p className="text-sm text-zinc-400">Belum ada postingan social wall. Silakan tambahkan postingan baru di sebelah kiri.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {socialPosts.map((post) => (
                      <div key={post.id} className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group">
                        <div>
                          <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800">
                            {post.image_url ? (
                              <img src={post.image_url} alt="Cover" className="w-full h-full object-cover" />
                            ) : post.post_url && post.post_url.trim().startsWith("<") ? (
                              <div className="w-full h-full bg-gradient-to-br from-brand-charcoal to-zinc-950 flex flex-col items-center justify-center gap-1.5 p-4">
                                <span className="text-2xl animate-pulse">🧱</span>
                                <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase">NATIVE EMBED CODE</span>
                              </div>
                            ) : (
                              <div className={`w-full h-full flex flex-col items-center justify-center gap-1.5 p-4 ${
                                post.platform === "instagram"
                                  ? "bg-gradient-to-tr from-pink-600/20 via-red-500/10 to-transparent"
                                  : "bg-gradient-to-br from-zinc-800/40 via-zinc-900 to-transparent"
                              }`}>
                                <span className="text-xl opacity-60">
                                  {post.platform === "instagram" ? "📸" : "🎵"}
                                </span>
                                <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase">FALLBACK CARD</span>
                              </div>
                            )}
                            <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-white shadow-sm flex items-center gap-1 ${
                              post.platform === "instagram" ? "bg-pink-600" : "bg-black"
                            }`}>
                              {post.platform === "instagram" ? "📸 Instagram" : "🎵 TikTok"}
                            </span>
                          </div>
                          <div className="p-4 space-y-1.5">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed italic">
                              "{post.caption || "No caption"}"
                            </p>
                            <a
                              href={post.post_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-brand-orange hover:underline truncate block"
                            >
                              Buka Link Kiriman Asal ↗
                            </a>
                          </div>
                        </div>

                        <div className="px-4 pb-4">
                          <button
                            type="button"
                            onClick={() => handleDeleteSocialPost(post.id)}
                            className="w-full py-2 border border-red-200 hover:bg-red-50 text-red-500 text-xs font-bold rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
                          >
                            <Trash className="w-3.5 h-3.5" />
                            Hapus Postingan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* =======================================================
         MODALS (ADD / EDIT / CATEGORIES)
         ======================================================= */}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-slide-up my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-lg">Tambah Produk & Varian Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ivy Doors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Kategori</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tier / Spesifikasi</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  >
                    {tiersList.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Dimensi</label>
                  <input
                    type="text"
                    placeholder="Contoh: 70CM X 200CM"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Deskripsi Produk</label>
                <textarea
                  placeholder="Keterangan material produk..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[60px]"
                />
              </div>

              {/* Dynamic Variants Editor */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Varian Warna, Harga & Gambar</h4>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Varian Warna
                  </button>
                </div>

                <div className="space-y-4">
                  {variants.map((v, i) => (
                    <div key={i} className="p-4 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3">
                      <div className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-4">
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Warna</label>
                          <input
                            type="text"
                            required
                            placeholder="Putih / Hitam / Golden Oak"
                            value={v.color}
                            onChange={(e) => updateVariantRow(i, "color", e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Harga Normal (Rp)</label>
                          <input
                            type="number"
                            required
                            placeholder="Harga Rp"
                            value={v.price || ""}
                            onChange={(e) => updateVariantRow(i, "price", parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Harga Diskon (Rp, Opsional)</label>
                          <input
                            type="number"
                            placeholder="Diskon Rp"
                            value={v.discount_price || ""}
                            onChange={(e) => updateVariantRow(i, "discount_price", e.target.value ? parseFloat(e.target.value) : null)}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeVariantRow(i)}
                            className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-2.5 rounded-xl border border-transparent hover:border-red-200 cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Image Input for variant */}
                      <div className="space-y-2 mt-2">
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase">Gambar Varian (Bisa Unggah Banyak)</label>
                        <div className="flex flex-wrap gap-2 items-center">
                          {/* Render current images */}
                          {(() => {
                            const imgUrls = v.image_urls || (v.image_url ? [v.image_url] : []);
                            return imgUrls.map((url, imgIdx) => (
                              <div key={imgIdx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 flex-shrink-0 group/img">
                                <img src={url} alt="Variant" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newUrls = imgUrls.filter((_, idx) => idx !== imgIdx);
                                    updateVariantRow(i, "image_urls", newUrls);
                                    updateVariantRow(i, "image_url", newUrls.length > 0 ? newUrls[0] : null);
                                  }}
                                  className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer text-xs font-bold"
                                  title="Hapus Gambar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ));
                          })()}

                          {/* Upload button */}
                          <div className="relative w-14 h-14 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center cursor-pointer hover:border-brand-orange hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex-shrink-0">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                files.forEach((file) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const currentUrls = v.image_urls || (v.image_url ? [v.image_url] : []);
                                    const nextUrls = [...currentUrls, reader.result as string];
                                    updateVariantRow(i, "image_urls", nextUrls);
                                    updateVariantRow(i, "image_url", nextUrls[0]);
                                  };
                                  reader.readAsDataURL(file);
                                });
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="w-4 h-4 text-zinc-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 border border-zinc-200 dark:border-zinc-800 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-brand-orange text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-brand-orange/15 cursor-pointer"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-slide-up my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-lg">Edit Produk & Varian</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ivy Doors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Kategori</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tier / Spesifikasi</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  >
                    {tiersList.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Dimensi</label>
                  <input
                    type="text"
                    placeholder="Contoh: 70CM X 200CM"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Deskripsi Produk</label>
                <textarea
                  placeholder="Keterangan material produk..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[60px]"
                />
              </div>

              {/* Dynamic Variants Editor */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Varian Warna, Harga & Gambar</h4>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Varian Warna
                  </button>
                </div>

                <div className="space-y-4">
                  {variants.map((v, i) => (
                    <div key={i} className="p-4 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3">
                      <div className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-4">
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Warna</label>
                          <input
                            type="text"
                            required
                            placeholder="Putih / Hitam / Golden Oak"
                            value={v.color}
                            onChange={(e) => updateVariantRow(i, "color", e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Harga Normal (Rp)</label>
                          <input
                            type="number"
                            required
                            placeholder="Harga Rp"
                            value={v.price || ""}
                            onChange={(e) => updateVariantRow(i, "price", parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Harga Diskon (Rp, Opsional)</label>
                          <input
                            type="number"
                            placeholder="Diskon Rp"
                            value={v.discount_price || ""}
                            onChange={(e) => updateVariantRow(i, "discount_price", e.target.value ? parseFloat(e.target.value) : null)}
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeVariantRow(i)}
                            className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-2.5 rounded-xl border border-transparent hover:border-red-200 cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Image Input for variant */}
                      <div className="space-y-2 mt-2">
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase">Gambar Varian (Bisa Unggah Banyak)</label>
                        <div className="flex flex-wrap gap-2 items-center">
                          {/* Render current images */}
                          {(() => {
                            const imgUrls = v.image_urls || (v.image_url ? [v.image_url] : []);
                            return imgUrls.map((url, imgIdx) => (
                              <div key={imgIdx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 flex-shrink-0 group/img">
                                <img src={url} alt="Variant" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newUrls = imgUrls.filter((_, idx) => idx !== imgIdx);
                                    updateVariantRow(i, "image_urls", newUrls);
                                    updateVariantRow(i, "image_url", newUrls.length > 0 ? newUrls[0] : null);
                                  }}
                                  className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer text-xs font-bold"
                                  title="Hapus Gambar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ));
                          })()}

                          {/* Upload button */}
                          <div className="relative w-14 h-14 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center cursor-pointer hover:border-brand-orange hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex-shrink-0">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                files.forEach((file) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const currentUrls = v.image_urls || (v.image_url ? [v.image_url] : []);
                                    const nextUrls = [...currentUrls, reader.result as string];
                                    updateVariantRow(i, "image_urls", nextUrls);
                                    updateVariantRow(i, "image_url", nextUrls[0]);
                                  };
                                  reader.readAsDataURL(file);
                                });
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="w-4 h-4 text-zinc-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 border border-zinc-200 dark:border-zinc-800 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-brand-orange text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-brand-orange/15 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Form Modal (Add / Edit Service) */}
      {showServiceForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-lg">
                {editingService ? "Edit Layanan" : "Tambah Layanan Baru"}
              </h3>
              <button 
                onClick={() => setShowServiceForm(false)} 
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Image Uploader */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Gambar Representatif</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden shrink-0">
                    {sImageUrl ? (
                      <img src={sImageUrl} alt="Pratinjau Layanan" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-zinc-400 font-bold">No Image</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              showToast("Ukuran file maksimal adalah 2MB.", "error");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setSImageUrl(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button
                        type="button"
                        className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-100"
                      >
                        <Upload className="w-3.5 h-3.5 text-brand-orange" />
                        Pilih Gambar (Base64)
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400">Rekomendasi rasio 16:9, maksimal 2MB.</p>
                    {sImageUrl && (
                      <button
                        type="button"
                        onClick={() => setSImageUrl(null)}
                        className="text-[10px] text-red-500 font-bold hover:underline block"
                      >
                        Hapus Gambar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nama Layanan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pintu UPVC"
                    value={sTitle}
                    onChange={(e) => {
                      setSTitle(e.target.value);
                      if (!editingService) {
                        setSSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">URL Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="pintu-upvc"
                    value={sSlug}
                    onChange={(e) => setSSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Icon & Active */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Ikon Representatif</label>
                  <select
                    value={sIcon}
                    onChange={(e) => setSIcon(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  >
                    <option value="DoorClosed">DoorClosed (Pintu)</option>
                    <option value="Grid">Grid (Jendela)</option>
                    <option value="Layers">Layers (Plafon/Kanopi)</option>
                    <option value="Utensils">Utensils (Kitchen Set)</option>
                    <option value="ShowerHead">ShowerHead (Shower Box)</option>
                    <option value="Bath">Bath (Bath Tub)</option>
                    <option value="Sparkles">Sparkles (Default)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Status Publikasi</label>
                  <select
                    value={sActive}
                    onChange={(e) => setSActive(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  >
                    <option value={1}>Aktif (Tampil di Website)</option>
                    <option value={0}>Nonaktif (Sembunyikan)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Deskripsi Layanan</label>
                <textarea
                  required
                  placeholder="Jelaskan secara mendalam mengenai detail layanan, bahan, serta kelebihannya..."
                  value={sDescription}
                  onChange={(e) => setSDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none min-h-[120px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                <button
                  type="button"
                  onClick={() => setShowServiceForm(false)}
                  className="w-1/2 border border-zinc-200 dark:border-zinc-800 py-3 rounded-2xl text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingService}
                  className="w-1/2 bg-brand-orange hover:bg-brand-orange/95 disabled:bg-zinc-400 text-white py-3 rounded-2xl text-xs font-black shadow-md shadow-brand-orange/15 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {savingService ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : editingService ? (
                    "Simpan Perubahan"
                  ) : (
                    "Tambah Layanan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-lg">Kelola Kategori Produk</h3>
              <button 
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                }} 
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Category Edit Form */}
              {editingCategory ? (
                <form onSubmit={handleUpdateCategorySubmit} className="space-y-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <h4 className="text-xs font-extrabold text-brand-orange uppercase">Edit Kategori</h4>
                  <input
                    type="text"
                    required
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button 
                      type="button" 
                      onClick={() => setEditingCategory(null)}
                      className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg hover:bg-zinc-100"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="px-3 py-1.5 text-xs bg-brand-orange text-white rounded-lg hover:bg-brand-orange/95 font-bold"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              ) : (
                /* Category Add Form */
                <form onSubmit={handleAddCategorySubmit} className="space-y-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <h4 className="text-xs font-extrabold text-zinc-500 uppercase">Tambah Kategori Baru</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Aksesoris"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none"
                    />
                    <button 
                      type="submit" 
                      className="bg-brand-orange text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-orange/95 cursor-pointer shadow-md shadow-brand-orange/10"
                    >
                      Tambah
                    </button>
                  </div>
                </form>
              )}

              {/* Categories list */}
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Daftar Kategori Terdaftar</h4>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/10">
                  {categories.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-500">Tidak ada kategori.</div>
                  ) : (
                    categories.map((cat) => (
                      <div key={cat.id} className="flex justify-between items-center p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                        <span className="text-sm font-bold text-brand-charcoal dark:text-white flex items-center gap-2">
                          {cat.name === "Pintu" ? "🚪" : cat.name === "Jendela" ? "🪟" : "📁"} {cat.name}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(cat);
                              setEditCategoryName(cat.name);
                            }}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-brand-orange rounded-lg transition-colors cursor-pointer"
                            title="Edit nama"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-500 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Hapus kategori"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {showTierModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-lg">Kelola Spesifikasi / Tier</h3>
              <button 
                onClick={() => {
                  setShowTierModal(false);
                  setEditingTier(null);
                }} 
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Tier Edit Form */}
              {editingTier ? (
                <form onSubmit={handleUpdateTierSubmit} className="space-y-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <h4 className="text-xs font-extrabold text-brand-orange uppercase">Edit Spesifikasi/Tier</h4>
                  <input
                    type="text"
                    required
                    value={editTierName}
                    onChange={(e) => setEditTierName(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button 
                      type="button" 
                      onClick={() => setEditingTier(null)}
                      className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg hover:bg-zinc-100"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="px-3 py-1.5 text-xs bg-brand-orange text-white rounded-lg hover:bg-brand-orange/95 font-bold"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              ) : (
                /* Tier Add Form */
                <form onSubmit={handleAddTierSubmit} className="space-y-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <h4 className="text-xs font-extrabold text-zinc-500 uppercase">Tambah Spesifikasi/Tier Baru</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Super Premium"
                      value={newTierName}
                      onChange={(e) => setNewTierName(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none"
                    />
                    <button 
                      type="submit" 
                      className="bg-brand-orange text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-orange/95 cursor-pointer shadow-md shadow-brand-orange/10"
                    >
                      Tambah
                    </button>
                  </div>
                </form>
              )}

              {/* Tiers list */}
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Daftar Spesifikasi/Tier Terdaftar</h4>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/10">
                  {tiersList.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-500">Tidak ada spesifikasi/tier.</div>
                  ) : (
                    tiersList.map((t) => (
                      <div key={t.id} className="flex justify-between items-center p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                        <span className="text-sm font-bold text-brand-charcoal dark:text-white flex items-center gap-2">
                          🏷️ {t.name}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTier(t);
                              setEditTierName(t.name);
                            }}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-brand-orange rounded-lg transition-colors cursor-pointer"
                            title="Edit nama"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTier(t.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-500 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Hapus spesifikasi/tier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-xl text-brand-charcoal dark:text-white">
                {editingProject ? "Ubah Project" : "Tambah Project Baru"}
              </h3>
              <button 
                onClick={() => setShowProjectForm(false)} 
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-8 space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Judul Proyek</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pintu & Jendela Villa Sentul"
                    value={pTitle}
                    onChange={(e) => {
                      setPTitle(e.target.value);
                      if (!editingProject) {
                        setPSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Slug URL (Otomatis)</label>
                  <input
                    type="text"
                    required
                    placeholder="pintu-jendela-villa-sentul"
                    value={pSlug}
                    onChange={(e) => setPSlug(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nama Klien</label>
                  <input
                    type="text"
                    placeholder="Contoh: Bpk. Budi"
                    value={pClientName}
                    onChange={(e) => setPClientName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Lokasi Proyek</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sentul, Bogor"
                    value={pLocation}
                    onChange={(e) => setPLocation(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tanggal Selesai Proyek</label>
                  <input
                    type="date"
                    value={pProjectDate}
                    onChange={(e) => setPProjectDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Status Publikasi</label>
                  <select
                    value={pActive}
                    onChange={(e) => setPActive(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none font-bold"
                  >
                    <option value={1}>Aktif (Tampilkan di Publik)</option>
                    <option value={0}>Nonaktif (Sembunyikan)</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes for Services Used */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Layanan Yang Digunakan</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-zinc-50 dark:bg-zinc-900/50 p-4.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
                  {services.map((srv) => {
                    const isChecked = pServicesUsed.includes(srv.title);
                    return (
                      <label key={srv.id} className="flex items-center gap-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPServicesUsed([...pServicesUsed, srv.title]);
                            } else {
                              setPServicesUsed(pServicesUsed.filter(item => item !== srv.title));
                            }
                          }}
                          className="rounded border-zinc-300 text-brand-orange focus:ring-brand-orange/20"
                        />
                        {srv.title}
                      </label>
                    );
                  })}
                  {services.length === 0 && (
                    <span className="text-xs text-zinc-400 italic">Belum ada layanan aktif. Buat layanan terlebih dahulu.</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Deskripsi Detail Proyek</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ceritakan tentang proses pengerjaan, spesifikasi material yang digunakan, atau kebutuhan khusus klien..."
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none resize-none"
                />
              </div>

              {/* Multi-Image Base64 Uploader */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Foto Dokumentasi Proyek (Bisa Banyak Gambar)</label>
                
                {/* Image thumbnails grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
                  {pImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200/50 dark:border-zinc-850 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPImages(pImages.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                  
                  {/* File Upload Box */}
                  <label className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-brand-orange rounded-xl cursor-pointer transition-colors bg-zinc-50 dark:bg-zinc-900/50">
                    <Plus className="w-5 h-5 text-zinc-400" />
                    <span className="text-[9px] font-bold text-zinc-400 mt-1 uppercase">Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === "string") {
                              setPImages(prev => [...prev, reader.result as string]);
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 justify-end">
                <button
                  type="button"
                  onClick={() => setShowProjectForm(false)}
                  className="px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="px-6 py-3 bg-brand-orange text-white rounded-2xl text-xs font-black hover:bg-brand-orange/95 cursor-pointer shadow-md shadow-brand-orange/15 hover:scale-102 transition-transform disabled:opacity-50"
                >
                  {savingProject ? "Menyimpan..." : "Simpan Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in flex items-center gap-3 px-5 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-md">
          <span className={`w-2.5 h-2.5 rounded-full ${
            toast.type === "success" ? "bg-emerald-500 animate-pulse" :
            toast.type === "error" ? "bg-red-500" : "bg-blue-500"
          }`} />
          <span className="text-xs font-bold text-brand-charcoal dark:text-zinc-200">
            {toast.message}
          </span>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmConfig && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5 animate-slide-up">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl">
                <Trash className="w-5 h-5" />
              </span>
              <h3 className="font-extrabold text-lg">{confirmConfig.title}</h3>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              {confirmConfig.message}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmConfig(null)}
                className="w-1/2 border border-zinc-200 dark:border-zinc-800 py-3 rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmConfig.onConfirm}
                className="w-1/2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      </div> {/* Right Container end */}
    </div>
  );
}
