import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const API_URL = "http://localhost:5000";

type UserRole = "ROLE_CUSTOMER" | "ROLE_SELLER" | "ROLE_ADMIN" | null;

interface AuthContextType {
  token: string | null;
  user: any;
  seller: any;
  role: UserRole;
  loading: boolean;
  sendOtp: (email: string, isLogin: boolean) => Promise<void>;
  signup: (fullName: string, email: string, mobile: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<any>;
  signinSeller: (email: string, password: string) => Promise<any>;
  forgetSellerPassword: (email: string) => Promise<void>;
  resetSellerPassword: (email: string, otp: string, newPass: string) => Promise<void>;
  logout: () => void;
  fetchProfile: (jwtToken?: string) => Promise<void>;
  updateProfile: (profileData: { fullName?: string, mobile?: string }) => Promise<void>;
  updateSellerProfile: (profileData: any) => Promise<void>;
  addUserAddress: (addressData: any) => Promise<void>;
  updateUserAddress: (addressId: string, addressData: any) => Promise<void>;
  deleteUserAddress: (addressId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwt"));
  const [user, setUser] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [role, setRole] = useState<UserRole>((localStorage.getItem("role") as UserRole) || null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (jwtToken?: string) => {
    const currentToken = jwtToken || token;
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${currentToken}` };
      const currentRole = role || localStorage.getItem("role");

      if (currentRole === "ROLE_SELLER") {
        const response = await axios.get(`${API_URL}/sellers/profile`, { headers });
        setSeller(response.data);
        setUser(null);
      } else if (currentRole === "ROLE_ADMIN") {
        // Admin profile can fall back to standard user profile if needed, or seller check
        const response = await axios.get(`${API_URL}/api/users/profile`, { headers });
        setUser(response.data);
        setSeller(null);
      } else {
        const response = await axios.get(`${API_URL}/api/users/profile`, { headers });
        setUser(response.data);
        setSeller(null);
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      // Clean up token if invalid
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, [token, role]);

  const sendOtp = async (email: string, isLogin: boolean) => {
    const emailPayload = isLogin ? `signin_${email}` : email;
    await axios.post(`${API_URL}/auth/sent/login-signup-otp`, { email: emailPayload });
  };

  const signup = async (fullName: string, email: string, mobile: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      fullName,
      email,
      mobile,
      password,
    });
    const { jwt, role: userRole } = response.data;
    if (jwt) {
      localStorage.setItem("jwt", jwt);
      localStorage.setItem("role", userRole || "ROLE_CUSTOMER");
      setToken(jwt);
      setRole(userRole || "ROLE_CUSTOMER");
    }
  };

  const signin = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/signin`, { email, password });
    const { jwt, role: userRole } = response.data;
    if (jwt) {
      localStorage.setItem("jwt", jwt);
      localStorage.setItem("role", userRole);
      setToken(jwt);
      setRole(userRole);
      await fetchProfile(jwt);
    }
    return response.data;
  };

  const signinSeller = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/sellers/login`, { email, password });
    const { jwt, role: userRole } = response.data;
    if (jwt) {
      localStorage.setItem("jwt", jwt);
      localStorage.setItem("role", userRole);
      setToken(jwt);
      setRole(userRole);
      await fetchProfile(jwt);
    }
    return response.data;
  };

  const forgetSellerPassword = async (email: string) => {
    await axios.post(`${API_URL}/sellers/forget-password`, { email });
  };

  const resetSellerPassword = async (email: string, otp: string, newPass: string) => {
    await axios.post(`${API_URL}/sellers/reset-password`, { email, otp, password: newPass });
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
    setSeller(null);
    setRole(null);
  };

  const updateProfile = async (profileData: { fullName?: string, mobile?: string }) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.put(`${API_URL}/api/users/profile`, profileData, { headers });
    setUser(response.data);
  };

  const updateSellerProfile = async (profileData: any) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.patch(`${API_URL}/sellers`, profileData, { headers });
    setSeller(response.data);
  };

  const addUserAddress = async (addressData: any) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.post(`${API_URL}/api/users/addresses`, addressData, { headers });
    setUser(response.data);
  };

  const updateUserAddress = async (addressId: string, addressData: any) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.put(`${API_URL}/api/users/addresses/${addressId}`, addressData, { headers });
    setUser(response.data);
  };

  const deleteUserAddress = async (addressId: string) => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.delete(`${API_URL}/api/users/addresses/${addressId}`, { headers });
    setUser(response.data);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        seller,
        role,
        loading,
        sendOtp,
        signup,
        signin,
        signinSeller,
        forgetSellerPassword,
        resetSellerPassword,
        logout,
        fetchProfile,
        updateProfile,
        updateSellerProfile,
        addUserAddress,
        updateUserAddress,
        deleteUserAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
