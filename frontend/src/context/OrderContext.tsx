import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_URL, useAuth } from "./AuthContext";

interface OrderContextType {
  orders: any[];
  currentOrder: any;
  loading: boolean;
  fetchUserOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<any>;
  createOrder: (shippingAddress: any, paymentMethod: string) => Promise<any>;
  cancelOrder: (orderId: string) => Promise<void>;
  verifyPayment: (paymentId: string, paymentLinkId: string) => Promise<any>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchUserOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_URL}/api/orders/user`, { headers });
      // Since usersOrderHistory has find, it returns an array. Let's handle both array and object
      const data = response.data;
      setOrders(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (orderId: string) => {
    if (!token) return null;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_URL}/api/orders/${orderId}`, { headers });
      setCurrentOrder(response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch order detail error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (shippingAddress: any, paymentMethod: string) => {
    if (!token) throw new Error("Please log in to place orders");
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.post(
      `${API_URL}/api/orders?paymentMethod=${paymentMethod}`,
      { shippingAddress },
      { headers }
    );
    return response.data;
  };

  const cancelOrder = async (orderId: string) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    await axios.put(`${API_URL}/api/orders/${orderId}/cancel`, {}, { headers });
    await fetchUserOrders();
  };

  const verifyPayment = async (paymentId: string, paymentLinkId: string) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    // Send data in GET request query params
    const response = await axios.get(`${API_URL}/api/payment/${paymentId}`, {
      headers,
      params: { paymentLinkId }
    });
    return response.data;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        fetchUserOrders,
        fetchOrderById,
        createOrder,
        cancelOrder,
        verifyPayment,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within an OrderProvider");
  return context;
};
