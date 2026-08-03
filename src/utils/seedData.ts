export interface Category {
  id: number;
  name: string;
}

export interface ProductVariant {
  color: string;
  price: number;
  discount_price?: number | null;
  image_url: string | null;
  image_urls?: string[] | null;
}

export interface Product {
  id: number;
  name: string;
  category_id: number;
  tier: string;
  description: string;
  dimensions: string;
  variants: ProductVariant[];
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string | null;
  active: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  client_name: string | null;
  location: string | null;
  project_date: string | null;
  services_used: string[] | null;
  description: string | null;
  images: string[] | null;
  active: number;
}

export const staticProjects: Project[] = [
  {
    id: 1,
    title: "Pintu & Jendela Villa Sentul",
    slug: "pintu-jendela-villa-sentul",
    client_name: "Bpk. Budi",
    location: "Sentul, Bogor",
    project_date: "2026-05-15",
    services_used: ["Pintu UPVC", "Jendela UPVC"],
    description: "Pemasangan pintu kombinasi kaca tempered dan jendela sliding di villa Sentul. Menghasilkan pencahayaan alami yang indah serta peredaman suara luar biasa terhadap kebisingan hutan tropis sekitar.",
    images: ["/images/projects/villa-sentul.png", "/images/projects/villa-sentul-2.png"],
    active: 1
  },
  {
    id: 2,
    title: "Kitchen Set & Shower Box Apartemen Sudirman",
    slug: "kitchen-set-shower-box-apartemen-sudirman",
    client_name: "Ibu Linda",
    location: "Jakarta Pusat",
    project_date: "2026-06-20",
    services_used: ["Kitchen Set UPVC", "Shower Box"],
    description: "Desain kitchen set modern minimalis berbahan UPVC dengan finishing putih glossy yang anti rayap dan anti lembab 100%. Dilengkapi pemasangan shower box kaca tempered minimalis di kamar mandi utama.",
    images: ["/images/projects/apt-sudirman.png", "/images/projects/apt-sudirman-2.png"],
    active: 1
  },
  {
    id: 3,
    title: "Kanopi & Plafon Rumah Kebayoran",
    slug: "kanopi-plafon-rumah-kebayoran",
    client_name: "Bpk. Roni",
    location: "Kebayoran Baru, Jakarta Selatan",
    project_date: "2026-07-10",
    services_used: ["Plafon & Kanopi UPVC"],
    description: "Pemasangan kanopi louvers UPVC premium di area patio luar rumah Kebayoran Baru, dipadukan dengan plafon UPVC bermotif serat kayu alami yang tahan cuaca panas ekstrim dan anti bocor air hujan.",
    images: ["/images/projects/rumah-kebayoran.png"],
    active: 1
  }
];

export const staticServices: Service[] = [
  {
    id: 1,
    title: "Pintu UPVC",
    slug: "pintu-upvc",
    description: "Pintu premium dengan material UPVC kokoh, dilengkapi double-lock system dan tahan cuaca.",
    icon: "DoorClosed",
    image_url: "/images/services/pintu-upvc.png",
    active: 1
  },
  {
    id: 2,
    title: "Jendela UPVC",
    slug: "jendela-upvc",
    description: "Jendela swing, sliding, dan jungkit UPVC kedap suara hingga 40dB dengan desain modern.",
    icon: "Grid",
    image_url: "/images/services/jendela-upvc.png",
    active: 1
  },
  {
    id: 3,
    title: "Plafon & Kanopi UPVC",
    slug: "plafon-kanopi-upvc",
    description: "Solusi kanopi & plafon UPVC anti bocor, tahan panas matahari ekstrem, dan berestetika tinggi.",
    icon: "Layers",
    image_url: "/images/services/plafon-kanopi-upvc.png",
    active: 1
  },
  {
    id: 4,
    title: "Kitchen Set UPVC",
    slug: "kitchen-set-upvc",
    description: "Kitchen set kustom berbahan UPVC premium yang anti air, anti lembab, dan anti rayap 100%.",
    icon: "Utensils",
    image_url: "/images/services/kitchen-set-upvc.png",
    active: 1
  },
  {
    id: 5,
    title: "Shower Box",
    slug: "shower-box",
    description: "Pemasangan shower box kaca tempered dengan kusen UPVC minimalis tahan karat untuk kamar mandi mewah.",
    icon: "ShowerHead",
    image_url: "/images/services/shower-box.png",
    active: 1
  }
];

export const staticCategories: Category[] = [
  { id: 1, name: "Pintu" },
  { id: 2, name: "Jendela" }
];

export const staticProducts: Product[] = [
  // Pintu Hemat (70cm x 200cm) - category_id: 1
  {
    id: 1,
    name: "Ivy Doors",
    category_id: 1,
    tier: "Hemat",
    description: "Pintu UPVC hemat",
    dimensions: "70CM X 200CM",
    variants: [
      { color: "Putih", price: 3480000.00, image_url: null },
      { color: "Hitam", price: 3900500.00, image_url: null }
    ]
  },
  {
    id: 2,
    name: "Hedge Doors",
    category_id: 1,
    tier: "Hemat",
    description: "Pintu UPVC hemat",
    dimensions: "70CM X 200CM",
    variants: [
      { color: "Putih", price: 3753750.00, image_url: null },
      { color: "Hitam", price: 4196250.00, image_url: null }
    ]
  },
  {
    id: 3,
    name: "Mewdaw Doors",
    category_id: 1,
    tier: "Hemat",
    description: "Pintu UPVC hemat",
    dimensions: "70CM X 200CM",
    variants: [
      { color: "Putih", price: 3136000.00, image_url: null },
      { color: "Hitam", price: 3489500.00, image_url: null }
    ]
  },
  {
    id: 4,
    name: "Laura Hill",
    category_id: 1,
    tier: "Hemat",
    description: "Pintu UPVC hemat",
    dimensions: "70CM X 200CM",
    variants: [
      { color: "Putih", price: 3474500.00, image_url: null },
      { color: "Hitam", price: 3889000.00, image_url: null }
    ]
  },
  {
    id: 5,
    name: "Pine Doors",
    category_id: 1,
    tier: "Hemat",
    description: "Pintu UPVC hemat",
    dimensions: "70CM X 200CM",
    variants: [
      { color: "Putih", price: 3276400.00, image_url: null },
      { color: "Hitam", price: 3783500.00, image_url: null }
    ]
  },
  {
    id: 6,
    name: "River Doors",
    category_id: 1,
    tier: "Hemat",
    description: "Pintu UPVC hemat",
    dimensions: "70CM X 200CM",
    variants: [
      { color: "Putih", price: 3347000.00, image_url: null },
      { color: "Hitam", price: 3787500.00, image_url: null }
    ]
  },
  {
    id: 7,
    name: "Seaglass Doors",
    category_id: 1,
    tier: "Hemat",
    description: "Pintu UPVC hemat",
    dimensions: "70CM X 200CM",
    variants: [
      { color: "Putih", price: 3259000.00, image_url: null },
      { color: "Hitam", price: 3653500.00, image_url: null }
    ]
  },
  {
    id: 8,
    name: "Seaside Doors",
    category_id: 1,
    tier: "Hemat",
    description: "Pintu UPVC hemat",
    dimensions: "70CM X 200CM",
    variants: [
      { color: "Putih", price: 3589500.00, image_url: null },
      { color: "Hitam", price: 4008500.00, image_url: null }
    ]
  },
  {
    id: 9,
    name: "Holly Doors",
    category_id: 1,
    tier: "Hemat",
    description: "Pintu UPVC hemat",
    dimensions: "70CM X 200CM",
    variants: [
      { color: "Putih", price: 3291000.00, image_url: null },
      { color: "Hitam", price: 3704500.00, image_url: null }
    ]
  },

  // Pintu Premium (80cm x 210cm) - category_id: 1
  {
    id: 10,
    name: "Ivy Doors",
    category_id: 1,
    tier: "Premium",
    description: "Pintu UPVC premium",
    dimensions: "80CM X 210CM",
    variants: [
      { color: "Putih", price: 4789000.00, image_url: null },
      { color: "Hitam", price: 5515666.67, image_url: null },
      { color: "Coklat", price: 5515666.67, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6722333.33, image_url: null }
    ]
  },
  {
    id: 11,
    name: "Hedge Doors",
    category_id: 1,
    tier: "Premium",
    description: "Pintu UPVC premium",
    dimensions: "80CM X 210CM",
    variants: [
      { color: "Putih", price: 4813000.00, image_url: null },
      { color: "Hitam", price: 5542333.33, image_url: null },
      { color: "Coklat", price: 5542333.33, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6791666.67, image_url: null }
    ]
  },
  {
    id: 12,
    name: "Mewdaw Doors",
    category_id: 1,
    tier: "Premium",
    description: "Pintu UPVC premium",
    dimensions: "80CM X 210CM",
    variants: [
      { color: "Putih", price: 4404000.00, image_url: null },
      { color: "Hitam", price: 5037000.00, image_url: null },
      { color: "Coklat", price: 5037000.00, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6150000.00, image_url: null }
    ]
  },
  {
    id: 13,
    name: "Laura Hill",
    category_id: 1,
    tier: "Premium",
    description: "Pintu UPVC premium",
    dimensions: "80CM X 210CM",
    variants: [
      { color: "Putih", price: 4807000.00, image_url: null },
      { color: "Hitam", price: 5536333.33, image_url: null },
      { color: "Coklat", price: 5536333.33, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6771666.67, image_url: null }
    ]
  },
  {
    id: 14,
    name: "Pine Doors",
    category_id: 1,
    tier: "Premium",
    description: "Pintu UPVC premium",
    dimensions: "80CM X 210CM",
    variants: [
      { color: "Putih", price: 4492600.00, image_url: null },
      { color: "Hitam", price: 5360333.33, image_url: null },
      { color: "Coklat", price: 5360333.33, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6619666.67, image_url: null }
    ]
  },
  {
    id: 15,
    name: "River Doors",
    category_id: 1,
    tier: "Premium",
    description: "Pintu UPVC premium",
    dimensions: "80CM X 210CM",
    variants: [
      { color: "Putih", price: 4642000.00, image_url: null },
      { color: "Hitam", price: 5419000.00, image_url: null },
      { color: "Coklat", price: 5419000.00, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6721000.00, image_url: null }
    ]
  },
  {
    id: 16,
    name: "Seaglass Doors",
    category_id: 1,
    tier: "Premium",
    description: "Pintu UPVC premium",
    dimensions: "80CM X 210CM",
    variants: [
      { color: "Putih", price: 4536000.00, image_url: null },
      { color: "Hitam", price: 5213000.00, image_url: null },
      { color: "Coklat", price: 5213000.00, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6414000.00, image_url: null }
    ]
  },
  {
    id: 17,
    name: "Seaside Doors",
    category_id: 1,
    tier: "Premium",
    description: "Pintu UPVC premium",
    dimensions: "80CM X 210CM",
    variants: [
      { color: "Putih", price: 4924000.00, image_url: null },
      { color: "Hitam", price: 5652166.67, image_url: null },
      { color: "Coklat", price: 5652166.67, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6860333.33, image_url: null }
    ]
  },
  {
    id: 18,
    name: "Holly Doors",
    category_id: 1,
    tier: "Premium",
    description: "Pintu UPVC premium",
    dimensions: "80CM X 210CM",
    variants: [
      { color: "Putih", price: 4524000.00, image_url: null },
      { color: "Hitam", price: 5203666.67, image_url: null },
      { color: "Coklat", price: 5203666.67, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6363333.33, image_url: null }
    ]
  },

  // Jendela Standar (100cm x 120cm) - category_id: 2
  {
    id: 19,
    name: "Double Sliding",
    category_id: 2,
    tier: "Standar",
    description: "Jendela UPVC",
    dimensions: "100CM X 120CM",
    variants: [
      { color: "Putih", price: 4486000.00, image_url: null },
      { color: "Hitam", price: 5142000.00, image_url: null },
      { color: "Coklat", price: 5142000.00, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6308000.00, image_url: null }
    ]
  },
  {
    id: 20,
    name: "Double Swing",
    category_id: 2,
    tier: "Standar",
    description: "Jendela UPVC",
    dimensions: "100CM X 120CM",
    variants: [
      { color: "Putih", price: 4534000.00, image_url: null },
      { color: "Hitam", price: 5208000.00, image_url: null },
      { color: "Coklat", price: 5208000.00, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6422000.00, image_url: null }
    ]
  },
  {
    id: 21,
    name: "Swing+Fixed",
    category_id: 2,
    tier: "Standar",
    description: "Jendela UPVC",
    dimensions: "100CM X 120CM",
    variants: [
      { color: "Putih", price: 3434000.00, image_url: null },
      { color: "Hitam", price: 3928000.00, image_url: null },
      { color: "Coklat", price: 3928000.00, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 4802000.00, image_url: null }
    ]
  },
  {
    id: 22,
    name: "Double Jungkit",
    category_id: 2,
    tier: "Standar",
    description: "Jendela UPVC",
    dimensions: "100CM X 120CM",
    variants: [
      { color: "Putih", price: 4374000.00, image_url: null },
      { color: "Hitam", price: 5038000.00, image_url: null },
      { color: "Coklat", price: 5038000.00, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 6252000.00, image_url: null }
    ]
  },
  {
    id: 23,
    name: "Jungkit+Fixed",
    category_id: 2,
    tier: "Standar",
    description: "Jendela UPVC",
    dimensions: "100CM X 120CM",
    variants: [
      { color: "Putih", price: 3354000.00, image_url: null },
      { color: "Hitam", price: 3843000.00, image_url: null },
      { color: "Coklat", price: 3843000.00, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 4717000.00, image_url: null }
    ]
  },
  {
    id: 24,
    name: "Single Swing",
    category_id: 2,
    tier: "Standar",
    description: "Jendela UPVC",
    dimensions: "100CM X 120CM",
    variants: [
      { color: "Putih", price: 2459000.00, image_url: null },
      { color: "Hitam", price: 2826000.00, image_url: null },
      { color: "Coklat", price: 2826000.00, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 3523000.00, image_url: null }
    ]
  },
  {
    id: 25,
    name: "Double Fixed",
    category_id: 2,
    tier: "Standar",
    description: "Jendela UPVC",
    dimensions: "100CM X 120CM",
    variants: [
      { color: "Putih", price: 2390000.00, image_url: null },
      { color: "Hitam", price: 2604000.00, image_url: null },
      { color: "Coklat", price: 2604000.00, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 3138000.00, image_url: null }
    ]
  },
  {
    id: 26,
    name: "Single Jungkit",
    category_id: 2,
    tier: "Standar",
    description: "Jendela UPVC",
    dimensions: "100CM X 120CM",
    variants: [
      { color: "Putih", price: 2379000.00, image_url: null },
      { color: "Hitam", price: 2741000.00, image_url: null },
      { color: "Coklat", price: 2741000.00, image_url: null },
      { color: "Serat Kayu Golden Oak", price: 3438000.00, image_url: null }
    ]
  }
];
