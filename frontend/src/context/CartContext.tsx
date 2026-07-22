import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL, useAuth } from "./AuthContext";

interface CartContextType {
  cart: any;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, size: string, quantity: number) => Promise<void>;
  removeCartItem: (cartItemId: string) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { token, role } = useAuth();

  const fetchCart = async () => {
    if (!token || role !== "ROLE_CUSTOMER") return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_URL}/api/cart`, { headers });
      setCart(response.data);
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && role === "ROLE_CUSTOMER") {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [token, role]);

  const addToCart = async (productId: string, size: string, quantity: number) => {
    if (!token) throw new Error("Please login to add items to cart");
    const headers = { Authorization: `Bearer ${token}` };
    await axios.put(`${API_URL}/api/cart/add`, { productId, size, quantity }, { headers });
    await fetchCart();
  };

  const removeCartItem = async (cartItemId: string) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    await axios.delete(`${API_URL}/api/cart/item/${cartItemId}`, { headers });
    await fetchCart();
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    await axios.put(`${API_URL}/api/cart/item/${cartItemId}`, { quantity }, { headers });
    await fetchCart();
  };

  const applyCoupon = async (couponCode: string) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.post(`${API_URL}/api/cart/coupon/apply`, { couponCode }, { headers });
    setCart(response.data);
  };

  const removeCoupon = async () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.post(`${API_URL}/api/cart/coupon/remove`, {}, { headers });
    setCart(response.data);
  };

  const clearCart = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        removeCartItem,
        updateCartItem,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
