import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_URL } from "./AuthContext";

interface ProductFilters {
  category?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  size?: string;
  sort?: string;
  pageNumber?: number;
}

interface ProductContextType {
  products: any[];
  product: any;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  fetchProducts: (filters: ProductFilters) => Promise<void>;
  fetchProductById: (productId: string) => Promise<any>;
  searchProducts: (query: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (filters: ProductFilters) => {
    setLoading(true);
    try {
      // Build clean query params object
      const params: any = {};
      if (filters.category) params.category = filters.category;
      if (filters.color) params.color = filters.color;
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      if (filters.minDiscount !== undefined) params.minDiscount = filters.minDiscount;
      if (filters.size) params.size = filters.size;
      if (filters.sort) params.sort = filters.sort;
      if (filters.pageNumber !== undefined) params.pageNumber = filters.pageNumber;

      const response = await axios.get(`${API_URL}/products`, { params });
      const { content, totalPages: pages, totalElement: elements } = response.data;
      setProducts(content || []);
      setTotalPages(pages || 0);
      setTotalElements(elements || 0);
    } catch (error) {
      console.error("Fetch products error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (productId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      setProduct(response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch product by ID error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/search`, {
        params: { q: query }
      });
      setProducts(response.data || []);
      setTotalPages(1);
      setTotalElements(response.data?.length || 0);
    } catch (error) {
      console.error("Search products error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        product,
        totalPages,
        totalElements,
        loading,
        fetchProducts,
        fetchProductById,
        searchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within a ProductProvider");
  return context;
};
