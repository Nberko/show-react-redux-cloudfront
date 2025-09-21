import { Product } from "~/models/Product";

const API = import.meta.env.VITE_API_BASE;

export async function fetchProducts(): Promise<Product[]> {
  const r = await fetch(`${API}/products`);
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`Failed to load products (${r.status}): ${text}`);
  }
  return r.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const r = await fetch(`${API}/products/${encodeURIComponent(id)}`);
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`Failed to load product (${r.status}): ${text}`);
  }
  return r.json();
}
