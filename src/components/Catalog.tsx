"use client";

import React, { useState, useEffect } from "react";
import { getProducts, getCategories, getSettings, WebsiteSettings, getTiers, ProductTier } from "@/utils/db";
import { Product, ProductVariant, Category } from "@/utils/seedData";
import { Search, SlidersHorizontal, ShoppingCart, Info, RotateCcw, Trash2, Plus, Minus, X, MessageSquare, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tiersList, setTiersList] = useState<ProductTier[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [colorFilter, setColorFilter] = useState("Semua");
  const [tierFilter, setTierFilter] = useState("Semua");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Image preview states
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [previewColor, setPreviewColor] = useState<string>("");
  const [previewImageIndex, setPreviewImageIndex] = useState<number>(0);

  useEffect(() => {
    setPreviewImageIndex(0);
  }, [previewProduct, previewColor]);

  // Selected variant state per product ID
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>({});

  // Cart states
  interface CartItem {
    product: Product;
    variant: ProductVariant;
    quantity: number;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCartToast, setShowCartToast] = useState<string | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("masterupvc_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {}
    }
    
    // Auto-open cart if query param matches
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("cart") === "open") {
        setIsCartOpen(true);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener("open_cart", handleOpenCart);
    return () => window.removeEventListener("open_cart", handleOpenCart);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cart_drawer_toggle", { detail: { isOpen: isCartOpen } }));
  }, [isCartOpen]);

  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("masterupvc_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const addToCart = (product: Product, variant: ProductVariant) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.variant.color === variant.color
    );

    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({ product, variant, quantity: 1 });
    }

    saveCartToStorage(newCart);
    setShowCartToast(`"${product.name} (${variant.color})" ditambahkan ke keranjang.`);
    setTimeout(() => setShowCartToast(null), 3000);
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    saveCartToStorage(newCart);
  };

  const updateCartQuantity = (index: number, delta: number) => {
    const newCart = cart.map((item, i) => {
      if (i === index) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    saveCartToStorage(newCart);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.variant.discount_price && item.variant.discount_price > 0
        ? item.variant.discount_price
        : item.variant.price;
      return total + price * item.quantity;
    }, 0);
  };

  const generateCartWhatsAppLink = () => {
    const whatsappPhone = settings?.contact_whatsapp 
      ? settings.contact_whatsapp.replace(/[^0-9]/g, "") 
      : "6281234567890";

    let message = "Halo Admin Master UPVC, saya ingin memesan produk-produk berikut:\n\n";

    cart.forEach((item, index) => {
      const isDiscount = item.variant.discount_price && item.variant.discount_price > 0;
      const unitPrice = isDiscount ? item.variant.discount_price! : item.variant.price;
      const subtotal = unitPrice * item.quantity;
      const promoLabel = isDiscount ? " (Promo)" : "";

      message += `${index + 1}. *${item.product.name}* (${item.variant.color})\n`;
      message += `   - Koleksi: ${item.product.tier}\n`;
      message += `   - Jumlah: ${item.quantity} unit\n`;
      message += `   - Harga: ${formatIDR(unitPrice)} / unit${promoLabel}\n`;
      message += `   - Subtotal: ${formatIDR(subtotal)}\n\n`;
    });

    message += `*Total Estimasi Harga:* ${formatIDR(getCartTotal())}\n\n`;
    message += "Mohon informasi mengenai ketersediaan stok dan jadwal survei lokasi. Terima kasih.";

    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const catsData = await getCategories();
      setCategories(catsData);
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
      const tiersData = await getTiers();
      setTiersList(tiersData);
      const settingsData = await getSettings();
      setSettings(settingsData);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewProduct(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter application logic
  useEffect(() => {
    let result = products;

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => 
          p.name.toLowerCase().includes(q) || 
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (categoryFilter !== "Semua") {
      result = result.filter((p) => {
        const cat = categories.find(c => c.id === p.category_id);
        return cat && cat.name === categoryFilter;
      });
    }

    // Color filter
    if (colorFilter !== "Semua") {
      result = result.filter((p) => 
        p.variants && p.variants.some(v => v.color.toLowerCase().includes(colorFilter.toLowerCase()))
      );
    }

    // Tier filter
    if (tierFilter !== "Semua") {
      result = result.filter((p) => p.tier === tierFilter);
    }

    setFilteredProducts(result);

    // Smart default: If a specific color filter is selected, automatically set all filtered products' active color to that color.
    if (colorFilter !== "Semua") {
      const newSelected: Record<number, string> = {};
      result.forEach(p => {
        const matchingVariant = p.variants.find(v => v.color.toLowerCase().includes(colorFilter.toLowerCase()));
        if (matchingVariant) {
          newSelected[p.id] = matchingVariant.color;
        }
      });
      setSelectedColors(prev => ({ ...prev, ...newSelected }));
    }
  }, [searchQuery, categoryFilter, colorFilter, tierFilter, products, categories]);

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("Semua");
    setColorFilter("Semua");
    setTierFilter("Semua");
  };

  // Format currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Get active variant for a product
  const getActiveVariant = (product: Product): ProductVariant | null => {
    if (!product.variants || product.variants.length === 0) return null;
    const selectedColor = selectedColors[product.id];
    if (selectedColor) {
      const found = product.variants.find(v => v.color === selectedColor);
      if (found) return found;
    }
    return product.variants[0]; // Fallback to first variant
  };

  // WhatsApp Link generator
  const getWhatsAppLink = (product: Product, variant: ProductVariant) => {
    const isDiscount = variant.discount_price && variant.discount_price > 0;
    const priceToUse = isDiscount ? variant.discount_price! : variant.price;
    const formattedPrice = formatIDR(priceToUse);
    const whatsappPhone = settings?.contact_whatsapp 
      ? settings.contact_whatsapp.replace(/[^0-9]/g, "") 
      : "6281234567890";
    const promoText = isDiscount ? " (Promo/Diskon)" : "";
    const message = `Saya tertarik dengan produk *${product.name}* Warna *${variant.color}* Koleksi *${product.tier}* dengan harga *${formattedPrice}*${promoText}`;
    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
  };

  const getCategoryName = (catId: number) => {
    const found = categories.find(c => c.id === catId);
    return found ? found.name : "-";
  };

  // Unique attribute lists for filtering options
  const colors = ["Semua", "Putih", "Hitam", "Coklat", "Serat Kayu Golden Oak"];
  const tiers = ["Semua", ...tiersList.map(t => t.name)];

  // Helper to render color bubble indicator
  const getColorSwatchColor = (colorName: string) => {
    const c = colorName.toLowerCase();
    if (c.includes("putih")) return "bg-white border-zinc-300";
    if (c.includes("hitam")) return "bg-zinc-950 border-zinc-950";
    if (c.includes("coklat")) return "bg-amber-900 border-amber-950";
    if (c.includes("golden oak") || c.includes("kayu")) return "bg-amber-600 border-amber-700";
    return "bg-zinc-400 border-zinc-500";
  };

  return (
    <section id="katalog" className="py-24 bg-zinc-50 dark:bg-zinc-900/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/50 px-3 py-1.5 rounded-full">
            Katalog Digital
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-charcoal dark:text-white mt-4">
            Cari & Sesuaikan Produk Anda
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-lg">
            Pilih produk, lalu sesuaikan varian warna langsung di kartu produk untuk melihat harga dan memesan secara instan.
          </p>
        </div>

        {/* Toolbar & Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Cari nama pintu atau jendela..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-brand-charcoal text-brand-charcoal dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange/60 transition-all text-sm shadow-sm"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center justify-center gap-2 lg:hidden w-full md:w-auto px-5 py-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-brand-charcoal text-zinc-700 dark:text-zinc-300 text-sm font-semibold cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 px-5 py-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-brand-charcoal text-zinc-700 dark:text-zinc-300 hover:text-brand-orange dark:hover:text-brand-orange transition-colors text-sm font-semibold w-full md:w-auto cursor-pointer"
              title="Reset Semua Filter"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filter Layout - Desktop */}
          <aside className="hidden lg:block space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm sticky top-28">
              <h3 className="text-lg font-bold text-brand-charcoal dark:text-white mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-brand-orange" />
                Filter Katalog
              </h3>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Kategori
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setCategoryFilter("Semua")}
                    className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      categoryFilter === "Semua"
                        ? "bg-brand-orange text-white font-semibold"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.name)}
                      className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        categoryFilter === cat.name
                          ? "bg-brand-orange text-white font-semibold"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Warna Profil
                </label>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setColorFilter(color)}
                      className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        colorFilter === color
                          ? "bg-brand-orange text-white font-semibold"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier Filter */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Koleksi / Spesifikasi
                </label>
                <div className="space-y-2">
                  {tiers.map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setTierFilter(tier)}
                      className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        tierFilter === tier
                          ? "bg-brand-orange text-white font-semibold"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Drawer Filters - Mobile view */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-sm flex justify-end">
              <div className="w-80 bg-white dark:bg-brand-charcoal h-full p-6 shadow-xl flex flex-col justify-between overflow-y-auto animate-fade-in">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Filter Kategori</h3>
                    <button onClick={() => setShowMobileFilters(false)} className="text-zinc-500 font-bold">Tutup</button>
                  </div>
                  
                  {/* Mobile Filters items */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Kategori</h4>
                      <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-sm"
                      >
                        <option value="Semua">Semua Kategori</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Warna</h4>
                      <select 
                        value={colorFilter}
                        onChange={(e) => setColorFilter(e.target.value)}
                        className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900"
                      >
                        {colors.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase mb-2">Tingkatan</h4>
                      <select 
                        value={tierFilter}
                        onChange={(e) => setTierFilter(e.target.value)}
                        className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900"
                      >
                        {tiers.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-brand-orange text-white p-3.5 rounded-full font-bold shadow-lg cursor-pointer"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          )}

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
                <span className="mt-4 text-zinc-500">Memuat katalog produk...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[350px] bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 text-center shadow-sm">
                <Info className="w-12 h-12 text-zinc-400 mb-4" />
                <h4 className="text-lg font-bold text-brand-charcoal dark:text-white">Tidak Ada Produk Cocok</h4>
                <p className="text-zinc-500 text-sm mt-2 max-w-sm">
                  Coba ubah kombinasi filter atau hapus kata pencarian untuk melihat produk lainnya.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 bg-brand-orange text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div>
                <div className="text-sm text-zinc-500 mb-4">
                  Menampilkan {filteredProducts.length} produk pilihan
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const activeVariant = getActiveVariant(product);
                    if (!activeVariant) return null;

                    return (
                      <div
                        key={product.id}
                        className="group flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-zinc-200/50 dark:border-zinc-800/50 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300"
                      >
                        <div>
                          {/* Image preview box */}
                          <div 
                            onClick={() => {
                              setPreviewProduct(product);
                              setPreviewColor(activeVariant.color);
                            }}
                            className="w-full h-48 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 mb-4 overflow-hidden relative flex items-center justify-center cursor-zoom-in group/img-container"
                          >
                            {activeVariant.discount_price && activeVariant.discount_price > 0 && (
                              <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-red-500 text-white rounded-lg shadow-md shadow-red-500/10">
                                SALE
                              </span>
                            )}
                            {activeVariant.image_url ? (
                              <img 
                                src={activeVariant.image_url} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <div className="text-brand-orange font-black text-xl mb-1">MASTER UPVC</div>
                                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Variasi {activeVariant.color}</div>
                              </div>
                            )}

                            {/* Hover overlay with ZoomIn icon */}
                            <div className="absolute inset-0 bg-black/30 dark:bg-black/50 opacity-0 group-hover/img-container:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                              <span className="p-3 bg-white/90 dark:bg-zinc-900/90 text-brand-orange rounded-full shadow-lg transform scale-90 group-hover/img-container:scale-100 transition-all duration-300">
                                <ZoomIn className="w-5 h-5" />
                              </span>
                            </div>
                            
                            {/* Spec Tier Badge */}
                            <span className="absolute top-3 right-3 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-white dark:bg-brand-charcoal text-brand-orange border border-zinc-200/30 shadow-sm z-10">
                              {product.tier}
                            </span>
                          </div>

                          {/* Tags */}
                          <div className="flex gap-2 mb-3">
                            <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {getCategoryName(product.category_id)}
                            </span>
                            {product.dimensions && (
                              <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">
                                {product.dimensions}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="text-lg font-bold text-brand-charcoal dark:text-white group-hover:text-brand-orange transition-colors">
                            {product.name}
                          </h4>

                          {/* Description */}
                          {product.description && (
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 line-clamp-2">
                              {product.description}
                            </p>
                          )}

                          {/* Color Swatch Selector */}
                          <div className="mt-4">
                            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                              Pilih Warna: <span className="text-zinc-700 dark:text-zinc-300 font-extrabold">{activeVariant.color}</span>
                            </span>
                            <div className="flex flex-wrap gap-2.5">
                              {product.variants && product.variants.map((v) => {
                                const isActive = activeVariant.color === v.color;
                                const isBlack = v.color.toLowerCase().includes("hitam");
                                return (
                                  <button
                                    key={v.color}
                                    type="button"
                                    onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: v.color }))}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                                      isActive 
                                        ? "ring-2 ring-brand-orange/60 ring-offset-2 dark:ring-offset-brand-charcoal border-transparent" 
                                        : "hover:scale-105 border-zinc-200 dark:border-zinc-800"
                                    } ${getColorSwatchColor(v.color)}`}
                                    title={v.color}
                                  >
                                    {isActive && (
                                      <span className={`w-1.5 h-1.5 rounded-full ${isBlack ? "bg-white" : "bg-brand-charcoal"}`} />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Estimasi Harga ({activeVariant.color})</div>
                            <div className="mt-1">
                              {activeVariant.discount_price && activeVariant.discount_price > 0 ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-zinc-400 line-through">
                                      {formatIDR(activeVariant.price)}
                                    </span>
                                    <span className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-red-200/50 dark:border-red-900/30 animate-pulse">
                                      -{Math.round(((activeVariant.price - activeVariant.discount_price) / activeVariant.price) * 100)}% OFF
                                    </span>
                                  </div>
                                  <div className="text-2xl font-black text-red-600 dark:text-red-400 tracking-tight">
                                    {formatIDR(activeVariant.discount_price)}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-2xl font-black text-brand-charcoal dark:text-white">
                                  {formatIDR(activeVariant.price)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button
                          onClick={() => addToCart(product, activeVariant)}
                          className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md shadow-brand-orange/10 group-hover:scale-[1.02] cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          + Keranjang
                        </button>
                      </div>
                    );
                  })}

                </div>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Custom Design Section Below Catalog Grid */}
      <section className="mt-16 bg-gradient-to-br from-orange-50/40 to-orange-100/5 dark:from-brand-charcoal/60 dark:to-zinc-900/40 border border-orange-200/20 dark:border-zinc-800/60 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-4 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-brand-orange uppercase bg-orange-100 dark:bg-orange-950/40 px-3 py-1.5 rounded-full border border-orange-200/20 dark:border-orange-900/30">
            📐 Solusi Kustom Proyek
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-brand-charcoal dark:text-white leading-tight">
            Punya Kebutuhan Ukuran & Desain Khusus?
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Jika Anda memiliki rancangan ukuran pintu/jendela sendiri atau membutuhkan model custom khusus yang tidak ada di katalog, tim ahli kami siap mendesain, memvisualisasikan, dan memproduksi profil UPVC presisi sesuai dengan rancangan spesifik proyek Anda.
          </p>
        </div>
        <div className="flex-shrink-0 w-full md:w-auto">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open_chatbot", { detail: { reason: "Halo Nadia, saya ingin berkonsultasi mengenai custom desain dan ukuran pintu/jendela UPVC." } }))}
            className="w-full md:w-auto bg-brand-orange hover:bg-brand-orange/95 active:scale-95 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-orange/15"
          >
            <MessageSquare className="w-5 h-5" />
            Mulai Konsultasi Gratis
          </button>
        </div>
      </section>


      {/* Cart Toast Notification */}
      {showCartToast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in flex items-center gap-3 px-5 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-brand-charcoal dark:text-zinc-200">
            {showCartToast}
          </span>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-xs font-extrabold text-brand-orange hover:underline ml-2 cursor-pointer"
          >
            Lihat
          </button>
        </div>
      )}

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="bg-white dark:bg-brand-charcoal w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-left border-l border-zinc-200/50 dark:border-zinc-800/50">
            {/* Cart Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-brand-orange" />
                <h3 className="font-extrabold text-lg">Keranjang Belanja</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                  <ShoppingCart className="w-12 h-12 text-zinc-300 mb-3" />
                  <p className="text-sm font-semibold">Keranjang Anda masih kosong.</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      document.getElementById("katalog")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-4 bg-brand-orange text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-brand-orange/90 cursor-pointer"
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                cart.map((item, i) => {
                  const isDiscount = item.variant.discount_price && item.variant.discount_price > 0;
                  const unitPrice = isDiscount ? item.variant.discount_price! : item.variant.price;
                  const subtotal = unitPrice * item.quantity;

                  return (
                    <div 
                      key={i} 
                      className="flex gap-4 p-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 relative group"
                    >
                      {/* Image preview */}
                      <div className="w-16 h-16 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {item.variant.image_url ? (
                          <img src={item.variant.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[8px] font-black text-brand-orange text-center">UPVC</span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-black text-brand-charcoal dark:text-white line-clamp-1 pr-4">{item.product.name}</h4>
                          <button
                            onClick={() => removeFromCart(i)}
                            className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase flex flex-wrap gap-x-2">
                          <span>Warna: {item.variant.color}</span>
                          <span>•</span>
                          <span>Tipe: {item.product.tier}</span>
                        </div>
                        
                        {/* Price & Quantity controls */}
                        <div className="flex justify-between items-center pt-2">
                          <div className="text-xs font-black text-brand-orange">
                            {formatIDR(subtotal)}
                          </div>
                          
                          {/* Quantity selector */}
                          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                            <button
                              onClick={() => updateCartQuantity(i, -1)}
                              className="px-2 py-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-bold text-brand-charcoal dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(i, 1)}
                              className="px-2 py-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Estimasi</span>
                  <span className="text-xl font-black text-brand-charcoal dark:text-white">
                    {formatIDR(getCartTotal())}
                  </span>
                </div>
                
                <a
                  href={generateCartWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-brand-orange/10 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Kirim Pesanan ke WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Product Image Lightbox Modal */}
      {previewProduct && (() => {
        const selectedVariant = previewProduct.variants.find(v => v.color === previewColor) || previewProduct.variants[0];
        const isDiscount = selectedVariant.discount_price && selectedVariant.discount_price > 0;
        const activePrice = isDiscount ? selectedVariant.discount_price! : selectedVariant.price;

        return (
          <div 
            onClick={() => setPreviewProduct(null)} 
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fade-in"
          >
            {/* Close Button on Screen */}
            <button 
              onClick={() => setPreviewProduct(null)} 
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-brand-orange bg-zinc-900/60 hover:bg-zinc-800/80 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer z-50 border border-white/10"
              title="Tutup (Esc)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Box */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative bg-white dark:bg-brand-charcoal rounded-3xl overflow-hidden max-w-5xl w-full max-h-[92vh] md:max-h-[85vh] shadow-2xl flex flex-col md:flex-row border border-zinc-200/50 dark:border-zinc-800/60 animate-scale-in"
            >
              {/* Left Side: Product Image Display */}
              {(() => {
                const imgUrls = selectedVariant.image_urls && selectedVariant.image_urls.length > 0
                  ? selectedVariant.image_urls
                  : (selectedVariant.image_url ? [selectedVariant.image_url] : []);
                const currentImg = imgUrls[previewImageIndex];

                return (
                  <div className="md:w-1/2 bg-zinc-950 dark:bg-zinc-900 flex items-center justify-center p-6 relative min-h-[300px] md:min-h-[480px]">
                    {selectedVariant.discount_price && selectedVariant.discount_price > 0 && (
                      <span className="absolute top-4 left-4 z-10 px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-red-500 text-white rounded-xl shadow-md">
                        PROMO SALE
                      </span>
                    )}
                    
                    {currentImg ? (
                      <img 
                        src={currentImg} 
                        alt={`${previewProduct.name} - ${selectedVariant.color} - Gambar ${previewImageIndex + 1}`} 
                        className="w-full h-full object-contain max-h-[40vh] md:max-h-[70vh] rounded-2xl select-none"
                      />
                    ) : (
                      <div className="text-center p-8 bg-zinc-900/40 rounded-3xl border border-zinc-800 w-full h-full flex flex-col justify-center items-center">
                        <div className="text-brand-orange font-black text-3xl mb-2 tracking-wider">MASTER UPVC</div>
                        <div className="text-sm text-zinc-400 uppercase tracking-widest font-bold">Variasi {selectedVariant.color}</div>
                        <div className="text-xs text-zinc-500 mt-4 max-w-xs">Gambar produk resmi dalam proses unggah. Silakan pesan dan minta foto langsung ke admin.</div>
                      </div>
                    )}
                    
                    {/* Navigation Arrows for Slider */}
                    {imgUrls.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setPreviewImageIndex((prev) => (prev === 0 ? imgUrls.length - 1 : prev - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 hover:scale-105 active:scale-95 p-2.5 rounded-full backdrop-blur-sm transition-all z-10 cursor-pointer border border-white/10"
                          title="Sebelumnya"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewImageIndex((prev) => (prev === imgUrls.length - 1 ? 0 : prev + 1))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 hover:scale-105 active:scale-95 p-2.5 rounded-full backdrop-blur-sm transition-all z-10 cursor-pointer border border-white/10"
                          title="Selanjutnya"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Dot Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/45 px-3 py-1.5 rounded-full backdrop-blur-[2px]">
                          {imgUrls.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              type="button"
                              onClick={() => setPreviewImageIndex(dotIdx)}
                              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                previewImageIndex === dotIdx ? "bg-brand-orange w-4" : "bg-white/60 hover:bg-white"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Spec Tier Badge */}
                    <span className="absolute top-4 right-4 text-xs font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-xl bg-brand-charcoal text-brand-orange border border-zinc-700/50 shadow-md">
                      Koleksi {previewProduct.tier}
                    </span>

                    {/* Dimensions badge inside image */}
                    {previewProduct.dimensions && (
                      <span className="absolute bottom-4 left-4 text-xs font-bold font-mono tracking-wide px-3 py-1.5 rounded-lg bg-black/60 text-white backdrop-blur-sm border border-white/10 z-10">
                        Dimensi: {previewProduct.dimensions}
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* Right Side: Product Details & CTA */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-full bg-white dark:bg-brand-charcoal">
                <div>
                  <div className="flex gap-2.5 items-center">
                    <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-950/40 text-brand-orange border border-orange-200/20">
                      {getCategoryName(previewProduct.category_id)}
                    </span>
                    {previewProduct.dimensions && (
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">
                        {previewProduct.dimensions}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-brand-charcoal dark:text-white mt-4 tracking-tight">
                    {previewProduct.name}
                  </h3>

                  {previewProduct.description && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">
                      {previewProduct.description}
                    </p>
                  )}

                  {/* Swatch Selector inside modal */}
                  <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/60">
                    <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                      Pilihan Warna: <span className="text-brand-orange font-extrabold">{previewColor}</span>
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {previewProduct.variants && previewProduct.variants.map((v) => {
                        const isActive = previewColor === v.color;
                        const isBlack = v.color.toLowerCase().includes("hitam");
                        return (
                          <button
                            key={v.color}
                            type="button"
                            onClick={() => setPreviewColor(v.color)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                              isActive 
                                ? "ring-2 ring-brand-orange ring-offset-2 dark:ring-offset-brand-charcoal border-transparent scale-110" 
                                : "hover:scale-105 border-zinc-200 dark:border-zinc-800"
                            } ${getColorSwatchColor(v.color)}`}
                            title={v.color}
                          >
                            {isActive && (
                              <span className={`w-2 h-2 rounded-full ${isBlack ? "bg-white" : "bg-brand-charcoal"}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price info */}
                  <div className="mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60">
                    <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Estimasi Harga Varian ({selectedVariant.color})</div>
                    <div className="mt-2 flex flex-wrap items-baseline gap-2">
                      {isDiscount ? (
                        <>
                          <div className="text-3xl font-black text-red-600 dark:text-red-400 tracking-tight">
                            {formatIDR(selectedVariant.discount_price!)}
                          </div>
                          <span className="text-sm font-bold text-zinc-400 line-through">
                            {formatIDR(selectedVariant.price)}
                          </span>
                          <span className="text-xs font-extrabold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md border border-red-200/50">
                            -{Math.round(((selectedVariant.price - selectedVariant.discount_price!) / selectedVariant.price) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <div className="text-3xl font-black text-brand-charcoal dark:text-white tracking-tight">
                          {formatIDR(selectedVariant.price)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      addToCart(previewProduct, selectedVariant);
                      setPreviewProduct(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-brand-charcoal dark:text-white font-bold py-4 px-6 rounded-2xl text-sm transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Tambah ke Keranjang
                  </button>
                  <a
                    href={getWhatsAppLink(previewProduct, selectedVariant)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold py-4 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-brand-orange/10 cursor-pointer text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Pesan via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
