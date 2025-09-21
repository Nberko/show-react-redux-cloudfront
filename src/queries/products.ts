import axios, { AxiosError } from "axios";
import { Product, AvailableProduct } from "~/models/Product";
import { fetchProducts, fetchProductById } from "~/api/products";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";
import API_PATHS from "~/constants/apiPaths";

export function useProducts() {
  return useQuery<Product[], AxiosError>("products", fetchProducts);
}

export function useProduct(id?: string) {
  return useQuery<Product, AxiosError>(
    ["product-detail", { id }],
    async () => {
      if (!id) throw new Error("Product ID is required");
      return await fetchProductById(id);
    },
    { enabled: !!id }
  );
}

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], AxiosError>(
    "available-products",
    async () => {
      const res = await axios.get<AvailableProduct[]>(
        `${API_PATHS.bff}/product/available`
      );
      return res.data;
    }
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct, AxiosError>(
    ["product", { id }],
    async () => {
      const res = await axios.get<AvailableProduct>(
        `${API_PATHS.bff}/product/${id}`
      );
      return res.data;
    },
    { enabled: !!id }
  );
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("available-products", { exact: true }),
    []
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct() {
  return useMutation((values: AvailableProduct) =>
    axios.put<AvailableProduct>(`${API_PATHS.bff}/product`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.bff}/product/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
