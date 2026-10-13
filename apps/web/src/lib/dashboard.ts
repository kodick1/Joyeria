import { demoProducts } from "@/lib/products";

export function getDashboard() {
  return {
    totalProducts: demoProducts.length,
    lowStockProducts: demoProducts.filter((product) => product.stock <= product.lowStockThreshold).length,
    activeUsers: 28,
    recentProducts: demoProducts.slice(0, 5)
  };
}
