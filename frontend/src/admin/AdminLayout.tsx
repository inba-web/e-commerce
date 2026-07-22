import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
import IconButton from "@mui/material/IconButton";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PercentIcon from "@mui/icons-material/Percent";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const drawerWidth = 240;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
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
    { text: "Dashboard Overview", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Verify Sellers", icon: <SupervisorAccountIcon />, path: "/admin/sellers" },
    { text: "Deal Banners", icon: <PercentIcon />, path: "/admin/deals" },
    { text: "Coupon Codes", icon: <LocalOfferIcon />, path: "/admin/coupons" },
    { text: "My Profile", icon: <AccountCircleIcon />, path: "/admin/profile" },
  ];

  const drawerContent = (
    <div>
      <Toolbar className="flex justify-center items-center py-4">
        <Link to="/" style={{ textDecoration: "none" }} className="flex items-center justify-center bg-white px-3 py-1.5 rounded-lg border border-slate-700 shadow-inner">
          <img src="/inbamart-logo.png" alt="Inba Mart" className="h-6 w-auto object-contain" />
        </Link>
      </Toolbar>
      <Divider sx={{ borderColor: "#334155" }} />
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
                    bgcolor: isActive ? "#007d6a" : "#334155",
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
          left: { sm: `${drawerWidth}px` },
          right: 0,
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
            <Typography variant="subtitle1" noWrap className="font-extrabold text-gray-800 text-lg">
              Admin Management Portal
            </Typography>
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
        aria-label="admin drawers"
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
              bgcolor: "#1e293b",
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
              bgcolor: "#1e293b",
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

export default AdminLayout;
