import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem, EnrichedCartItem } from "~/models/CartItem";
import { enrichCartWithProducts } from "~/utils/cartUtils";

/**
 * Hook to fetch and enrich cart items with product data
 * Returns CartItem[] with populated product information
 */
export function useCart() {
  return useQuery<EnrichedCartItem[], AxiosError>("cart", async () => {
    const res = await axios.get<CartItem[]>(`${API_PATHS.cart}/api/profile/cart`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    });

    // Enrich cart items with product data
    return await enrichCartWithProducts(res.data);
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<EnrichedCartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

/**
 * Request body for updating cart
 */
export interface UpdateCartRequest {
  products: Array<{
    productId: string;
    count: number;
  }>;
}

/**
 * Hook to update cart (add/update items)
 * Accepts products array with productId and count
 */
export function useUpsertCart() {
  return useMutation((request: UpdateCartRequest) =>
    axios.put<CartItem[]>(`${API_PATHS.cart}/api/profile/cart`, request, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}

/**
 * Hook to clear entire cart
 */
export function useClearCart() {
  return useMutation(() =>
    axios.delete(`${API_PATHS.cart}/api/profile/cart`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}

/**
 * Hook to checkout and create order
 */
export function useCheckout() {
  return useMutation(() =>
    axios.put(`${API_PATHS.cart}/api/profile/cart/order`, null, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
