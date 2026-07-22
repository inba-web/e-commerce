import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_URL, useAuth } from "./AuthContext";

interface AdminContextType {
  sellers: any[];
  deals: any[];
  loading: boolean;
  fetchSellers: (status?: string) => Promise<void>;
  updateSellerStatus: (sellerId: string, status: string, currentTabStatus?: string) => Promise<void>;
  fetchDeals: () => Promise<void>;
  createDeal: (dealData: { discount: string; image: string }) => Promise<void>;
  deleteDeal: (dealId: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sellers, setSellers] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchSellers = async (status?: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const params = status ? { status } : {};
      const response = await axios.get(`${API_URL}/admin/sellers`, {
        ...getHeaders(),
        params,
      });
      setSellers(response.data || []);
    } catch (error) {
      console.error("Fetch sellers error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSellerStatus = async (sellerId: string, status: string, currentTabStatus?: string) => {
    if (!token) return;
    await axios.patch(`${API_URL}/admin/seller/${sellerId}/status/${status}`, {}, getHeaders());
    await fetchSellers(currentTabStatus);
  };

  const fetchDeals = async () => {
    setLoading(true);
    try {
      // deals can be fetched publicly from /admin/deals, but let's pass headers anyway
      const response = await axios.get(`${API_URL}/admin/deals`, getHeaders());
      setDeals(response.data || []);
    } catch (error) {
      console.error("Fetch deals error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createDeal = async (dealData: { discount: string; image: string }) => {
    if (!token) return;
    await axios.post(`${API_URL}/admin/deals`, dealData, getHeaders());
    await fetchDeals();
  };

  const deleteDeal = async (dealId: string) => {
    if (!token) return;
    await axios.delete(`${API_URL}/admin/deals/${dealId}`, getHeaders());
    await fetchDeals();
  };

  return (
    <AdminContext.Provider
      value={{
        sellers,
        deals,
        loading,
        fetchSellers,
        updateSellerStatus,
        fetchDeals,
        createDeal,
        deleteDeal,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
};
