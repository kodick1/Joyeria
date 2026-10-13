export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  collection: string;
  metal: string;
  gemstone: string;
  caratWeight: number | null;
  weightGrams: number;
  size: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  hasCertificate: boolean;
  images: { url: string; alt: string }[];
};

export type ProductPage = {
  items: Product[];
  pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean };
};

const designs = [
  {
    title: "Aurora",
    category: "anillos",
    metal: "oro_18k",
    gemstone: "diamante",
    collection: "Eternidad",
    price: 2850000,
    stock: 3,
    image: 1,
    featured: true,
    isNew: true
  },
  {
    title: "Luz de Luna",
    category: "collares",
    metal: "oro_18k",
    gemstone: "perla",
    collection: "Luna",
    price: 1680000,
    stock: 7,
    image: 2,
    featured: true,
    isNew: false
  },
  {
    title: "Nácar",
    category: "aretes",
    metal: "oro_14k",
    gemstone: "perla",
    collection: "Clásicos",
    price: 920000,
    stock: 0,
    image: 4,
    featured: false,
    isNew: true
  },
  {
    title: "Brisa Dorada",
    category: "pulseras",
    metal: "oro_rosa",
    gemstone: "circon",
    collection: "Esencia",
    price: 1140000,
    stock: 2,
    image: 3,
    featured: true,
    isNew: false
  },
  {
    title: "Celeste",
    category: "dijes",
    metal: "plata_925",
    gemstone: "zafiro",
    collection: "Luna",
    price: 680000,
    stock: 12,
    image: 1,
    featured: false,
    isNew: true
  },
  {
    title: "Alba",
    category: "anillos",
    metal: "oro_blanco",
    gemstone: "diamante",
    collection: "Novias",
    price: 3450000,
    stock: 4,
    image: 3,
    featured: true,
    isNew: false
  },
  {
    title: "Serena",
    category: "collares",
    metal: "platino",
    gemstone: "esmeralda",
    collection: "Eternidad",
    price: 4250000,
    stock: 1,
    image: 2,
    featured: false,
    isNew: false
  },
  {
    title: "Dalia",
    category: "aretes",
    metal: "oro_18k",
    gemstone: "rubi",
    collection: "Clásicos",
    price: 1380000,
    stock: 8,
    image: 4,
    featured: true,
    isNew: true
  },
  {
    title: "Sol",
    category: "relojes",
    metal: "oro_rosa",
    gemstone: "ninguna",
    collection: "Esencia",
    price: 3850000,
    stock: 3,
    image: 2,
    featured: false,
    isNew: false
  },
  {
    title: "Eterna",
    category: "sets",
    metal: "oro_18k",
    gemstone: "diamante",
    collection: "Novias",
    price: 5680000,
    stock: 2,
    image: 3,
    featured: true,
    isNew: false
  },
  {
    title: "Jardín Secreto",
    category: "pulseras",
    metal: "plata_925",
    gemstone: "esmeralda",
    collection: "Esencia",
    price: 760000,
    stock: 14,
    image: 1,
    featured: false,
    isNew: true
  },
  {
    title: "Destello",
    category: "anillos",
    metal: "oro_14k",
    gemstone: "circon",
    collection: "Clásicos",
    price: 890000,
    stock: 5,
    image: 3,
    featured: false,
    isNew: false
  },
  {
    title: "Mar de Calma",
    category: "collares",
    metal: "oro_blanco",
    gemstone: "zafiro",
    collection: "Luna",
    price: 1920000,
    stock: 6,
    image: 2,
    featured: true,
    isNew: true
  },
  {
    title: "Flor de Nácar",
    category: "aretes",
    metal: "oro_rosa",
    gemstone: "perla",
    collection: "Eternidad",
    price: 1020000,
    stock: 0,
    image: 4,
    featured: false,
    isNew: false
  },
  {
    title: "Vínculo",
    category: "pulseras",
    metal: "platino",
    gemstone: "diamante",
    collection: "Novias",
    price: 3120000,
    stock: 2,
    image: 1,
    featured: true,
    isNew: false
  },
  {
    title: "Pequeño Universo",
    category: "dijes",
    metal: "oro_18k",
    gemstone: "zafiro",
    collection: "Luna",
    price: 820000,
    stock: 9,
    image: 3,
    featured: false,
    isNew: true
  }
] as const;

export const demoProducts: Product[] = designs.map((design, index) => {
  const noun: Record<string, string> = {
    anillos: "Anillo",
    collares: "Collar",
    pulseras: "Pulsera",
    aretes: "Aretes",
    dijes: "Dije",
    relojes: "Reloj",
    sets: "Set"
  };
  const name = `${noun[design.category]} ${design.title}`;
  const metalName = design.metal.replace("_", " ");
  return {
    id: `demo-${String(index + 1).padStart(3, "0")}`,
    sku: `AUR-${design.category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(4, "0")}`,
    slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
    name,
    description: `${name}, elaborada en ${metalName} y piedras seleccionadas con un diseño contemporáneo y acabados cuidadosamente pulidos. Una pieza pensada para acompañarte en tus momentos más especiales.`,
    shortDescription: `Diseño delicado en ${metalName}.`,
    category: design.category,
    collection: design.collection,
    metal: design.metal,
    gemstone: design.gemstone,
    caratWeight: design.gemstone === "diamante" ? 0.25 : null,
    weightGrams: 2.4 + (index % 5) * 0.6,
    size:
      design.category === "anillos" ? "6" : ["collares", "pulseras"].includes(design.category) ? "45 cm" : "",
    price: design.price,
    compareAtPrice: index % 4 === 0 ? Math.round(design.price * 1.15) : null,
    stock: design.stock,
    lowStockThreshold: 3,
    isActive: true,
    isFeatured: design.featured,
    isNew: design.isNew,
    hasCertificate: design.gemstone === "diamante" || design.gemstone === "esmeralda",
    images: [{ url: `/seed/joyeria-${design.image}.svg`, alt: `${name} en ${metalName}` }]
  };
});

export function filterProducts(search = "", source: Product[] = demoProducts): Product[] {
  const params = new URLSearchParams(search);
  const normalizedSearch = params.get("search")?.toLocaleLowerCase("es");
  const normalizedSize = params.get("size")?.toLocaleLowerCase("es");
  const products = source
    .filter((product) => product.isActive)
    .filter((product) => !params.has("category") || product.category === params.get("category"))
    .filter((product) => !params.has("metal") || product.metal === params.get("metal"))
    .filter((product) => !params.has("gemstone") || product.gemstone === params.get("gemstone"))
    .filter((product) => !normalizedSize || product.size.toLocaleLowerCase("es").includes(normalizedSize))
    .filter(
      (product) =>
        !params.has("inStock") || (params.get("inStock") === "true" ? product.stock > 0 : product.stock === 0)
    )
    .filter((product) => !params.has("minPrice") || product.price >= Number(params.get("minPrice")))
    .filter((product) => !params.has("maxPrice") || product.price <= Number(params.get("maxPrice")))
    .filter(
      (product) =>
        !normalizedSearch ||
        `${product.name} ${product.sku} ${product.description}`
          .toLocaleLowerCase("es")
          .includes(normalizedSearch)
    );

  const order = params.get("order");
  if (order === "price_asc") products.sort((left, right) => left.price - right.price);
  else if (order === "price_desc") products.sort((left, right) => right.price - left.price);
  else if (order === "featured")
    products.sort((left, right) => Number(right.isFeatured) - Number(left.isFeatured));
  else products.sort((left, right) => Number(right.isNew) - Number(left.isNew));

  return products;
}

export async function getProducts(search = ""): Promise<ProductPage> {
  const params = new URLSearchParams(search);
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 12));
  const products = filterProducts(search);
  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  return {
    items: products.slice((page - 1) * limit, page * limit),
    pagination: { page, limit, total, totalPages, hasNext: page < totalPages }
  };
}

export async function getAdminProducts(search = ""): Promise<ProductPage> {
  const params = new URLSearchParams(search);
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 12));
  return {
    items: demoProducts.slice((page - 1) * limit, page * limit),
    pagination: {
      page,
      limit,
      total: demoProducts.length,
      totalPages: Math.ceil(demoProducts.length / limit),
      hasNext: page * limit < demoProducts.length
    }
  };
}

export function getProductBySlug(slug: string) {
  return demoProducts.find((product) => product.slug === slug) ?? null;
}

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(Number(price));
}
