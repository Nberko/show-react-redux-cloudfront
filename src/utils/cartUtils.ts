import { CartItem, EnrichedCartItem } from "~/models/CartItem";
import { Product } from "~/models/Product";
import { fetchProductById } from "~/api/products";

/**
 * Fetches multiple products by their IDs
 * @param productIds - Array of product IDs to fetch
 * @returns Map of product IDs to Product objects
 */
export async function fetchProductsByIds(
  productIds: string[]
): Promise<Map<string, Product>> {
  const uniqueIds = [...new Set(productIds)]; // Remove duplicates
  const productsMap = new Map<string, Product>();

  // Fetch all products in parallel
  const results = await Promise.allSettled(
    uniqueIds.map(async (id) => {
      const product = await fetchProductById(id);
      return { id, product };
    })
  );

  // Build map from successful results
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      productsMap.set(result.value.id, result.value.product);
    } else {
      console.error("Failed to fetch product:", result.reason);
    }
  });

  return productsMap;
}

/**
 * Enriches cart items with product data
 * @param cartItems - Array of CartItem objects from the API
 * @returns Array of EnrichedCartItem objects with product data
 */
export async function enrichCartWithProducts(
  cartItems: CartItem[]
): Promise<EnrichedCartItem[]> {
  if (!cartItems || cartItems.length === 0) {
    return [];
  }

  const productIds = cartItems.map((item) => item.productId);
  const productsMap = await fetchProductsByIds(productIds);

  return cartItems.map((item) => ({
    ...item,
    product: productsMap.get(item.productId),
  }));
}
