import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { customTheme } from "./theme/customeTheme";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { ProductProvider } from "./context/ProductContext";
import { SellerProvider } from "./context/SellerContext";
import { AdminProvider } from "./context/AdminContext";
import { WishlistProvider } from "./context/WishlistContext";

// Customer components & pages
import Navbar from "./customer/components/Navbar";
import Home from "./customer/pages/Home/Home";
import Products from "./customer/pages/Product/Product";
import ProductDetails from "./customer/pages/Product/ProductDetails";
import Cart from "./customer/pages/Cart/Cart";
import Wishlist from "./customer/pages/Wishlist/Wishlist";
import Checkout from "./customer/pages/Checkout/Checkout";
import PaymentSuccess from "./customer/pages/Checkout/PaymentSuccess";
import MyOrders from "./customer/pages/MyOrders/MyOrders";
import Profile from "./customer/pages/Profile/Profile";
import Login from "./customer/pages/Auth/Login";
import Signup from "./customer/pages/Auth/Signup";
import ForgotPassword from "./customer/pages/Auth/ForgotPassword";
import ResetPassword from "./customer/pages/Auth/ResetPassword";
import MobileBottomNav from "./customer/components/MobileBottomNav";
import Footer from "./customer/components/Footer";

// Seller components & pages
import SellerLogin from "./seller/SellerLogin";
import SellerLayout from "./seller/SellerLayout";
import SellerDashboard from "./seller/SellerDashboard";
import SellerProducts from "./seller/SellerProducts";
import SellerOrders from "./seller/SellerOrders";
import SellerTransactions from "./seller/SellerTransactions";
import SellerProfile from "./seller/SellerProfile";

// Admin components & pages
import AdminLayout from "./admin/AdminLayout";
import AdminSellers from "./admin/AdminSellers";
import AdminDeals from "./admin/AdminDeals";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProfile from "./admin/AdminProfile";
import AdminCoupons from "./admin/AdminCoupons";

// Customer Layout Wrapper
const CustomerView = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-between pb-14 md:pb-0 overflow-x-hidden">
    <div className="flex flex-col flex-grow">
      <Navbar />
      <div className="flex-grow">{children}</div>
    </div>
    <MobileBottomNav />
    <Footer />
  </div>
);

// Seller Layout Wrapper
const SellerView = ({ children }: { children: React.ReactNode }) => (
  <SellerLayout>{children}</SellerLayout>
);

// Admin Layout Wrapper
const AdminView = ({ children }: { children: React.ReactNode }) => (
  <AdminLayout>{children}</AdminLayout>
);

// Unlock body scrollbar and scroll to top on navigation/mount
const ScrollReset = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = "unset";
    document.body.style.paddingRight = "0px";
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

const App = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <AuthProvider>
        <SellerProvider>
          <AdminProvider>
            <WishlistProvider>
              <CartProvider>
                <OrderProvider>
                  <ProductProvider>
                  <BrowserRouter>
                    <ScrollReset />
                    <Routes>
                      {/* Customer Routes */}
                      <Route path="/" element={<CustomerView><Home /></CustomerView>} />
                      <Route path="/search" element={<CustomerView><Products /></CustomerView>} />
                      <Route path="/product/:id" element={<CustomerView><ProductDetails /></CustomerView>} />
                      <Route path="/cart" element={<CustomerView><Cart /></CustomerView>} />
                      <Route path="/wishlist" element={<CustomerView><Wishlist /></CustomerView>} />
                      <Route path="/checkout" element={<CustomerView><Checkout /></CustomerView>} />
                      <Route path="/payment-success/:orderId" element={<CustomerView><PaymentSuccess /></CustomerView>} />
                      <Route path="/my-orders" element={<CustomerView><MyOrders /></CustomerView>} />
                      <Route path="/profile" element={<CustomerView><Profile /></CustomerView>} />
                      <Route path="/login" element={<CustomerView><Login /></CustomerView>} />
                      <Route path="/signup" element={<CustomerView><Signup /></CustomerView>} />
                      <Route path="/forgot-password" element={<CustomerView><ForgotPassword /></CustomerView>} />
                      <Route path="/reset-password" element={<CustomerView><ResetPassword /></CustomerView>} />

                      {/* Seller Routes */}
                      <Route path="/seller/login" element={<CustomerView><SellerLogin /></CustomerView>} />
                      <Route path="/seller/dashboard" element={<SellerView><SellerDashboard /></SellerView>} />
                      <Route path="/seller/products" element={<SellerView><SellerProducts /></SellerView>} />
                      <Route path="/seller/orders" element={<SellerView><SellerOrders /></SellerView>} />
                      <Route path="/seller/transactions" element={<SellerView><SellerTransactions /></SellerView>} />
                      <Route path="/seller/profile" element={<SellerView><SellerProfile /></SellerView>} />

                      {/* Admin Routes */}
                      <Route path="/admin/dashboard" element={<AdminView><AdminDashboard /></AdminView>} />
                      <Route path="/admin/sellers" element={<AdminView><AdminSellers /></AdminView>} />
                      <Route path="/admin/deals" element={<AdminView><AdminDeals /></AdminView>} />
                      <Route path="/admin/coupons" element={<AdminView><AdminCoupons /></AdminView>} />
                      <Route path="/admin/profile" element={<AdminView><AdminProfile /></AdminView>} />
                    </Routes>
                  </BrowserRouter>
                </ProductProvider>
              </OrderProvider>
            </CartProvider>
          </WishlistProvider>
          </AdminProvider>
        </SellerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;