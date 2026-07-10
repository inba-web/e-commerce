import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const { seller, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/seller/dashboard" },
    { text: "My Products", icon: <InventoryIcon />, path: "/seller/products" },
    { text: "Orders", icon: <ListAltIcon />, path: "/seller/orders" },
    { text: "Transactions", icon: <AccountBalanceWalletIcon />, path: "/seller/transactions" },
    { text: "Profile", icon: <PersonIcon />, path: "/seller/profile" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "PENDING":
        return "warning";
      case "SUSPENDED":
        return "error";
      default:
        return "default";
    }
  };

  const drawerContent = (
    <div>
      <Toolbar className="flex justify-center items-center py-4">
        <Link to="/" style={{ textDecoration: "none" }} className="flex items-center gap-2 group">
          <div className="bg-[#00927c] text-white p-1 rounded-lg flex items-center justify-center shadow-md">
            <StorefrontIcon sx={{ fontSize: 20 }} />
          </div>
          <span className="logo text-white font-black text-xl tracking-wide select-none">
            Inba Mart
          </span>
        </Link>
      </Toolbar>
      <Divider sx={{ borderColor: "#1f2937" }} />
      <List className="px-2 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  setMobileOpen(false);
                  navigate(item.path);
                }}
                sx={{
                  borderRadius: "8px",
                  bgcolor: isActive ? "#00927c" : "transparent",
                  "&:hover": {
                    bgcolor: isActive ? "#007d6a" : "#1f2937",
                  },
                  mb: 0.5,
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: isActive ? "bold" : "medium" }}>
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "white",
          color: "gray.800",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar className="flex justify-between items-center px-6">
          <div className="flex items-center gap-1">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <div className="flex items-center gap-3">
              <Typography variant="subtitle1" noWrap className="font-extrabold text-gray-800 text-lg">
                {seller?.sellerName || "Seller Portal"}
              </Typography>
              {seller && (
                <Chip
                  label={seller.accountStatus}
                  color={getStatusColor(seller.accountStatus)}
                  size="small"
                  className="font-bold text-xs"
                />
              )}
            </div>
          </div>

          <Button
            startIcon={<LogoutIcon />}
            variant="text"
            color="inherit"
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600 text-sm font-semibold capitalize"
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Side Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Temporary Drawer for Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "#111827",
              color: "white",
              borderRight: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Permanent Drawer for Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "#111827",
              color: "white",
              borderRight: "none",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SellerLayout;
