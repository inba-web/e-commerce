import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config/api";

interface SellerContextType {
  sellerProducts: any[];
  sellerOrders: any[];
  transactions: any[];
  report: any;
  loading: boolean;
  registerSeller: (sellerData: any) => Promise<void>;
  fetchSellerProducts: () => Promise<void>;
  createSellerProduct: (productData: any) => Promise<void>;
  updateSellerProduct: (productId: string, productData: any) => Promise<void>;
  deleteSellerProduct: (productId: string) => Promise<void>;
  fetchSellerOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  fetchSellerTransactions: () => Promise<void>;
  fetchSellerReport: () => Promise<void>;
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

export const SellerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const registerSeller = async (sellerData: any) => {
    await axios.post(`${API_URL}/sellers`, sellerData);
  };

  const fetchSellerProducts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/sellers/product`, getHeaders());
      setSellerProducts(response.data || []);
    } catch (error) {
      console.error("Fetch seller products error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSellerProduct = async (productData: any) => {
    if (!token) return;
    await axios.post(`${API_URL}/api/sellers/product`, productData, getHeaders());
    await fetchSellerProducts();
  };

  const updateSellerProduct = async (productId: string, productData: any) => {
    if (!token) return;
    await axios.patch(`${API_URL}/api/sellers/product/${productId}`, productData, getHeaders());
    await fetchSellerProducts();
  };

  const deleteSellerProduct = async (productId: string) => {
    if (!token) return;
    await axios.delete(`${API_URL}/api/sellers/product/${productId}`, getHeaders());
    await fetchSellerProducts();
  };

  const fetchSellerOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/sellers/orders`, getHeaders());
      setSellerOrders(response.data || []);
    } catch (error) {
      console.error("Fetch seller orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!token) return;
    await axios.patch(`${API_URL}/api/sellers/orders/${orderId}/status/${status}`, {}, getHeaders());
    await fetchSellerOrders();
  };

  const fetchSellerTransactions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/transactions/seller`, getHeaders());
      setTransactions(response.data || []);
    } catch (error) {
      console.error("Fetch seller transactions error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerReport = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/sellers/report`, getHeaders());
      setReport(response.data);
    } catch (error) {
      console.error("Fetch seller report error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerContext.Provider
      value={{
        sellerProducts,
        sellerOrders,
        transactions,
        report,
        loading,
        registerSeller,
        fetchSellerProducts,
        createSellerProduct,
        updateSellerProduct,
        deleteSellerProduct,
        fetchSellerOrders,
        updateOrderStatus,
        fetchSellerTransactions,
        fetchSellerReport,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) throw new Error("useSeller must be used within a SellerProvider");
  return context;
};
