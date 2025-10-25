import { Product } from "~/models/Product";

// Old CartItem structure (in-memory backend)
export type LegacyCartItem = {
  product: Product;
  count: number;
};

// New CartItem structure (TypeORM/PostgreSQL backend)
export type CartItem = {
  id: string;              // CartItem UUID
  cartId: string;          // Cart UUID
  productId: string;       // Product reference
  count: number;
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
};

// Enriched CartItem with product data for display
export type EnrichedCartItem = CartItem & {
  product?: Product;
};
