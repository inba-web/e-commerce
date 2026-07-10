import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { customTheme } from "./theme/customeTheme";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { ProductProvider } from "./context/ProductContext";
import { SellerProvider } from "./context/SellerContext";
import { AdminProvider } from "./context/AdminContext";

// Customer components & pages
import Navbar from "./customer/components/Navbar";
import Home from "./customer/pages/Home/Home";
import Products from "./customer/pages/Product/Product";
import ProductDetails from "./customer/pages/Product/ProductDetails";
import Cart from "./customer/pages/Cart/Cart";
import Checkout from "./customer/pages/Checkout/Checkout";
import PaymentSuccess from "./customer/pages/Checkout/PaymentSuccess";
import MyOrders from "./customer/pages/MyOrders/MyOrders";

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

// Customer Layout Wrapper
const CustomerView = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <div className="flex-grow">{children}</div>
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

const App = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <AuthProvider>
        <SellerProvider>
          <AdminProvider>
            <CartProvider>
              <OrderProvider>
                <ProductProvider>
                  <BrowserRouter>
                    <Routes>
                      {/* Customer Routes */}
                      <Route path="/" element={<CustomerView><Home /></CustomerView>} />
                      <Route path="/search" element={<CustomerView><Products /></CustomerView>} />
                      <Route path="/product/:id" element={<CustomerView><ProductDetails /></CustomerView>} />
                      <Route path="/cart" element={<CustomerView><Cart /></CustomerView>} />
                      <Route path="/checkout" element={<CustomerView><Checkout /></CustomerView>} />
                      <Route path="/payment-success/:orderId" element={<CustomerView><PaymentSuccess /></CustomerView>} />
                      <Route path="/my-orders" element={<CustomerView><MyOrders /></CustomerView>} />

                      {/* Seller Routes */}
                      <Route path="/seller/login" element={<SellerLogin />} />
                      <Route path="/seller/dashboard" element={<SellerView><SellerDashboard /></SellerView>} />
                      <Route path="/seller/products" element={<SellerView><SellerProducts /></SellerView>} />
                      <Route path="/seller/orders" element={<SellerView><SellerOrders /></SellerView>} />
                      <Route path="/seller/transactions" element={<SellerView><SellerTransactions /></SellerView>} />
                      <Route path="/seller/profile" element={<SellerView><SellerProfile /></SellerView>} />

                      {/* Admin Routes */}
                      <Route path="/admin/sellers" element={<AdminView><AdminSellers /></AdminView>} />
                      <Route path="/admin/deals" element={<AdminView><AdminDeals /></AdminView>} />
                      <Route path="/admin/dashboard" element={<AdminView><AdminSellers /></AdminView>} />
                    </Routes>
                  </BrowserRouter>
                </ProductProvider>
              </OrderProvider>
            </CartProvider>
          </AdminProvider>
        </SellerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;