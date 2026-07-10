import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const { user, token, logout, role } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    setMobileOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const cartCount = cart?.cartItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  const drawer = (
    <div className="w-64 h-full bg-[#00927c] text-white flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center px-4 py-4 border-b border-teal-700">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <div className="bg-white text-[#00927c] p-1.5 rounded-lg flex items-center justify-center">
              <StorefrontIcon sx={{ fontSize: 20 }} />
            </div>
            <span className="logo text-white font-black text-xl tracking-wide select-none">
              Inba Mart
            </span>
          </Link>
          <IconButton onClick={handleDrawerToggle} color="inherit">
            <CloseIcon />
          </IconButton>
        </div>

        <List className="py-4">
          {role !== "ROLE_SELLER" && role !== "ROLE_ADMIN" && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => { setMobileOpen(false); navigate("/seller/login"); }}>
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}><StorefrontIcon /></ListItemIcon>
                <ListItemText primary="Become Seller" />
              </ListItemButton>
            </ListItem>
          )}

          {token && role === "ROLE_CUSTOMER" && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => { setMobileOpen(false); navigate("/my-orders"); }}>
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}><ListAltIcon /></ListItemIcon>
                <ListItemText primary="My Orders" />
              </ListItemButton>
            </ListItem>
          )}

          {token && role === "ROLE_SELLER" && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => { setMobileOpen(false); navigate("/seller/dashboard"); }}>
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Seller Dashboard" />
              </ListItemButton>
            </ListItem>
          )}

          {token && role === "ROLE_ADMIN" && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => { setMobileOpen(false); navigate("/admin/dashboard"); }}>
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </div>

      <div className="p-4 border-t border-teal-700">
        {token ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-teal-100 truncate">Hi, {user?.fullName || "User"}</p>
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              onClick={handleLogout}
              sx={{ borderColor: "white", color: "white", "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" }, fontWeight: "bold" }}
              className="capitalize"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            fullWidth
            onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
            sx={{ bgcolor: "white", color: "#00927c", fontWeight: "bold", "&:hover": { bgcolor: "#f2f2f2" } }}
            className="capitalize shadow-none"
          >
            Login / Register
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "#00927c", color: "white", boxShadow: 2 }}>
        {/* Main Header Row */}
        <Toolbar className="flex justify-between items-center max-w-7xl mx-auto w-full px-4 lg:px-8">
          <div className="flex items-center">
            {/* Hamburger Trigger for Mobile */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="md:hidden mr-2"
            >
              <MenuIcon />
            </IconButton>

            {/* Brand Logo */}
            <Link to="/" style={{ textDecoration: "none" }} className="flex items-center gap-2 group">
              <div className="bg-white text-[#00927c] p-1.5 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <StorefrontIcon sx={{ fontSize: 24 }} />
              </div>
              <span className="logo text-white font-black text-2xl tracking-wide select-none drop-shadow-sm group-hover:opacity-90 transition-opacity">
                Inba Mart
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop Only */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-white rounded-md px-3 py-1 w-[40%] text-gray-700">
            <SearchIcon className="text-gray-400 mr-2" />
            <InputBase
              placeholder="Search for products, brands and more..."
              className="w-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputProps={{ "aria-label": "search" }}
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Become Seller - Desktop Only */}
            {role !== "ROLE_SELLER" && role !== "ROLE_ADMIN" && (
              <Button
                color="inherit"
                startIcon={<StorefrontIcon />}
                onClick={() => navigate("/seller/login")}
                className="hidden md:flex hover:bg-teal-700 capitalize font-medium"
              >
                Become Seller
              </Button>
            )}

            {token ? (
              <div className="flex items-center gap-1 md:gap-2">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <span className="hidden md:inline text-sm font-medium">Hi, {user?.fullName || "User"}</span>
              </div>
            ) : (
              <Button variant="outlined" color="inherit" onClick={() => setAuthOpen(true)} className="hidden md:flex capitalize border-white hover:bg-teal-700">
                Login / Register
              </Button>
            )}

            {role === "ROLE_CUSTOMER" && (
              <IconButton size="large" aria-label="cart items count" color="inherit" onClick={() => navigate("/cart")}>
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
          </div>
        </Toolbar>

        {/* Search Bar - Mobile Only Row */}
        <div className="md:hidden px-4 pb-3 w-full">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-md px-3 py-1.5 w-full text-gray-700">
            <SearchIcon className="text-gray-400 mr-2" />
            <InputBase
              placeholder="Search products..."
              className="w-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputProps={{ "aria-label": "search" }}
            />
          </form>
        </div>
      </AppBar>

      {/* Slide-out Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        className="md:hidden"
      >
        {drawer}
      </Drawer>

      {/* Profile Desktop Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {role === "ROLE_SELLER" && (
          <MenuItem onClick={() => { handleMenuClose(); navigate("/seller/dashboard"); }}>Seller Dashboard</MenuItem>
        )}
        {role === "ROLE_ADMIN" && (
          <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/dashboard"); }}>Admin Dashboard</MenuItem>
        )}
        {role === "ROLE_CUSTOMER" && (
          <MenuItem onClick={() => { handleMenuClose(); navigate("/my-orders"); }}>My Orders</MenuItem>
        )}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
