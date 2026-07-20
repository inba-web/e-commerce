import React, { createContext, useContext, useState, useEffect } from "react";

export interface ProductItem {
  _id: string;
  title: string;
  description?: string;
  images: string[];
  mrpPrice: number;
  sellingPrice: number;
  discountPercent: number;
  brand?: string;
  color?: string;
}

interface WishlistContextType {
  wishlist: ProductItem[];
  addToWishlist: (product: ProductItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<ProductItem[]>([]);

  // Load wishlist from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("inbamart_wishlist");
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading wishlist from localStorage:", e);
    }
  }, []);

  // Sync wishlist to local storage on changes
  const saveWishlist = (newWishlist: ProductItem[]) => {
    setWishlist(newWishlist);
    try {
      localStorage.setItem("inbamart_wishlist", JSON.stringify(newWishlist));
    } catch (e) {
      console.error("Error writing wishlist to localStorage:", e);
    }
  };

  const addToWishlist = (product: ProductItem) => {
    if (!product || !product._id) return;
    const exists = wishlist.some((item) => item._id === product._id);
    if (!exists) {
      const updated = [...wishlist, product];
      saveWishlist(updated);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const updated = wishlist.filter((item) => item._id !== productId);
    saveWishlist(updated);
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
