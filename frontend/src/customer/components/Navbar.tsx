import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, API_URL } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HistoryIcon from "@mui/icons-material/History";
import HelpIcon from "@mui/icons-material/Help";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AuthModal from "./AuthModal";

// Mega menu layout schema
const categoriesData = [
  {
    title: "Women",
    id: "women",
    items: [
      { name: "Sarees", path: "/search?category=women-sarees" },
      { name: "Kurtis", path: "/search?category=women-kurtis" },
      { name: "Lehengas", path: "/search?category=women-lehengas" },
      { name: "Dresses", path: "/search?category=women-dresses" }
    ]
  },
  {
    title: "Men",
    id: "men",
    items: [
      { name: "Shirts", path: "/search?category=men-shirts" },
      { name: "T-Shirts", path: "/search?category=men-tshirts" },
      { name: "Jeans", path: "/search?category=men-jeans" }
    ]
  },
  {
    title: "Electronics",
    id: "electronics",
    items: [
      { name: "Mobiles", path: "/search?category=mobiles" },
      { name: "Accessories", path: "/search?category=accessories" }
    ]
  },
  {
    title: "Home",
    id: "home",
    items: [
      { name: "Furniture", path: "/search?category=furniture" },
      { name: "Kitchen", path: "/search?category=kitchenware" },
      { name: "Decor", path: "/search?category=home-decor" }
    ]
  }
];

const Navbar = () => {
  const { user, token, logout, role } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Live query search recommendation debouncer
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setRecommendations([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const response = await axios.get(`${API_URL}/products/search`, {
          params: { q: searchQuery }
        });
        setRecommendations(response.data?.slice(0, 5) || []);
      } catch (err) {
        console.error("Failed to query recommendations:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem("recentSearches");
    if (history) {
      setRecentSearches(JSON.parse(history));
    }
  }, []);

  // Save query to search history helper
  const saveSearchToHistory = (query: string) => {
    if (!query.trim()) return;
    const cleanQuery = query.trim().toLowerCase();
    const updated = [cleanQuery, ...recentSearches.filter((s) => s !== cleanQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

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
      saveSearchToHistory(searchQuery);
      setSearchFocused(false);
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    saveSearchToHistory(query);
    setSearchFocused(false);
    navigate(`/search?q=${query}`);
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== item);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearAllHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const cartCount = cart?.cartItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  // Mobile menu sidebar content
  const drawer = (
    <div className="w-64 h-full bg-[#00927c] text-white flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center px-4 py-4 border-b border-teal-700">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center">
            <div className="bg-white px-2.5 py-1.5 rounded-lg border border-teal-600 flex items-center justify-center shadow-inner">
              <img src="/inbamart-logo.svg" alt="Inba Mart" className="h-7 w-auto object-contain" />
            </div>
          </Link>
          <IconButton onClick={handleDrawerToggle} color="inherit">
            <CloseIcon />
          </IconButton>
        </div>

        <List className="py-2">
          {/* Main sections */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => { setMobileOpen(false); navigate("/"); }}>
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => { setMobileOpen(false); navigate("/search"); }}>
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}><SearchIcon /></ListItemIcon>
              <ListItemText primary="Browse Products" />
            </ListItemButton>
          </ListItem>

          {/* Role actions for user profiles */}
          {role !== "ROLE_SELLER" && role !== "ROLE_ADMIN" && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { setMobileOpen(false); navigate("/seller/login"); }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}><StorefrontIcon /></ListItemIcon>
                  <ListItemText primary="Become Seller" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={() => { setMobileOpen(false); navigate("/cart"); }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    <Badge badgeContent={cartCount} color="error">
                      <ShoppingCartIcon sx={{ color: "white" }} />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="My Cart" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={() => { setMobileOpen(false); navigate("/wishlist"); }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    <Badge badgeContent={wishlist.length} color="error">
                      <FavoriteBorderIcon sx={{ color: "white" }} />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="My Wishlist" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {token && role === "ROLE_CUSTOMER" && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { setMobileOpen(false); navigate("/profile"); }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}><AccountCircle /></ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { setMobileOpen(false); navigate("/my-orders"); }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}><ListAltIcon /></ListItemIcon>
                  <ListItemText primary="My Orders" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {token && role === "ROLE_SELLER" && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { setMobileOpen(false); navigate("/seller/dashboard"); }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}><DashboardIcon /></ListItemIcon>
                  <ListItemText primary="Vendor Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { setMobileOpen(false); navigate("/seller/products"); }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}><StorefrontIcon /></ListItemIcon>
                  <ListItemText primary="Manage Products" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { setMobileOpen(false); navigate("/seller/orders"); }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}><ListAltIcon /></ListItemIcon>
                  <ListItemText primary="Manage Orders" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {token && role === "ROLE_ADMIN" && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { setMobileOpen(false); navigate("/admin/dashboard"); }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}><DashboardIcon /></ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { setMobileOpen(false); navigate("/admin/sellers"); }}>
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}><StorefrontIcon /></ListItemIcon>
                  <ListItemText primary="Verify Vendors" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          <ListItem disablePadding>
            <ListItemButton onClick={() => { setMobileOpen(false); setSupportOpen(true); }}>
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}><SupportAgentIcon /></ListItemIcon>
              <ListItemText primary="Customer Support" />
            </ListItemButton>
          </ListItem>
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
            onClick={() => { setMobileOpen(false); navigate("/login"); }}
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
      <AppBar position="sticky" sx={{ bgcolor: "#00927c", color: "white", boxShadow: 3, zIndex: 1100 }}>
        {/* Main Header Row */}
        <Toolbar className="flex justify-between items-center max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 gap-4">
          <div className="flex items-center shrink-0">
            {/* Hamburger Trigger - Mobile/Tablet only */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="mr-2 lg:hidden font-bold"
            >
              <MenuIcon />
            </IconButton>

            {/* Brand Logo */}
            <Link to="/" style={{ textDecoration: "none" }} className="flex items-center group">
              <div className="bg-white px-3.5 h-[40px] rounded-xl shadow-md border border-teal-100 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <img src="/inbamart-logo.svg" alt="Inba Mart" className="h-6.5 w-auto object-contain" />
              </div>
            </Link>
          </div>

          {/* Search Bar with Autocomplete Suggestions Dropdown */}
          <div ref={searchContainerRef} className="relative hidden md:block flex-1 max-w-[480px] mx-2">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-lg px-3 w-full h-[40px] text-gray-700 border border-teal-600 focus-within:ring-2 focus-within:ring-teal-400 shadow-sm transition-all">
              <SearchIcon className="text-gray-400 mr-2" />
              <InputBase
                placeholder="Search products, brands and categories..."
                className="w-full text-sm font-medium"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputProps={{ "aria-label": "search" }}
              />
            </form>

            {/* Search Suggestions drop-down */}
            {searchFocused && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-150 overflow-hidden z-50 text-gray-700 animate-fadeIn">
                {searchQuery.trim().length >= 2 ? (
                  <div className="p-3">
                    <span className="text-xs font-bold text-gray-400 uppercase block mb-2">Matching Products</span>
                    {loadingSuggestions ? (
                      <div className="flex items-center gap-2 p-3 text-xs text-gray-400">
                        <CircularProgress size={16} sx={{ color: "#00927c" }} />
                        <span>Searching recommendations...</span>
                      </div>
                    ) : recommendations.length === 0 ? (
                      <div className="p-3 text-xs text-gray-400">
                        No matching products found.
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {recommendations.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => {
                              saveSearchToHistory(item.title);
                              setSearchFocused(false);
                              navigate(`/product/${item._id}`);
                            }}
                            className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-teal-50/50 cursor-pointer transition-colors duration-150"
                          >
                            <img
                              src={item.images?.[0] || "/placeholder.jpg"}
                              alt={item.title}
                              className="w-8 h-8 object-cover rounded-md border border-gray-200"
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="font-bold text-sm text-gray-800 truncate">{item.title}</span>
                              {item.brand && (
                                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{item.brand}</span>
                              )}
                            </div>
                            <span className="text-xs font-black text-teal-700 ml-auto shrink-0">₹{item.sellingPrice}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="p-3 border-b border-gray-100">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase mb-2">
                          <span>Recent Searches</span>
                          <button onClick={clearAllHistory} className="text-teal-600 hover:underline cursor-pointer">Clear All</button>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSuggestionClick(item)}
                              className="flex justify-between items-center px-2.5 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer text-sm font-semibold transition-colors duration-150"
                            >
                              <div className="flex items-center gap-2">
                                <HistoryIcon fontSize="small" className="text-gray-400" />
                                <span>{item}</span>
                              </div>
                              <IconButton size="small" onClick={(e) => removeHistoryItem(e, item)}>
                                <CloseIcon sx={{ fontSize: "0.85rem" }} />
                              </IconButton>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Categories */}
                    <div className="p-3">
                      <span className="text-xs font-bold text-gray-400 uppercase block mb-2">Category Suggestions</span>
                      <div className="grid grid-cols-2 gap-2">
                        {["Kurtis", "T-Shirts", "Mobiles", "Decor", "Sarees", "Jeans"].map((tag, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSuggestionClick(tag)}
                            className="px-2.5 py-2 rounded-lg bg-gray-50 hover:bg-teal-50 hover:text-teal-700 cursor-pointer text-xs font-bold border border-gray-100 transition-colors duration-150"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Desktop Right Hand Nav & User Section */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Nav links on laptop+ screens */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Button color="inherit" onClick={() => navigate("/")} className="capitalize font-bold text-sm hover:bg-teal-700/80 px-3 py-1.5 rounded-lg transition-colors">
                Home
              </Button>

              {/* Categories mega menu trigger */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <Button color="inherit" endIcon={<ArrowDropDownIcon />} className="capitalize font-bold text-sm hover:bg-teal-700/80 px-3 py-1.5 rounded-lg transition-colors">
                  Categories
                </Button>

                {/* Mega menu dropdown */}
                {megaMenuOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[35px] pt-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-150 p-6 w-[550px] text-gray-800 grid grid-cols-4 gap-6 animate-fadeIn">
                      {categoriesData.map((cat) => (
                        <div key={cat.id} className="space-y-3">
                          <h4 className="font-extrabold text-sm text-teal-700 border-b border-teal-50 pb-1 uppercase tracking-wider">{cat.title}</h4>
                          <div className="flex flex-col gap-2">
                            {cat.items.map((item, idx) => (
                              <Link
                                key={idx}
                                to={item.path}
                                onClick={() => setMegaMenuOpen(false)}
                                className="text-xs text-gray-600 hover:text-teal-600 hover:font-bold transition-all duration-150"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button color="inherit" onClick={() => navigate("/search")} className="capitalize font-bold text-sm hover:bg-teal-700/80 px-3 py-1.5 rounded-lg transition-colors">
                Products
              </Button>

              <Button
                color="inherit"
                startIcon={<LocalOfferIcon sx={{ fontSize: "1rem" }} />}
                onClick={() => navigate("/search?discount=30")}
                className="capitalize font-bold text-sm hover:bg-teal-700/80 text-yellow-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                Offers
              </Button>

              <Button color="inherit" onClick={() => setSupportOpen(true)} className="capitalize font-bold text-sm hover:bg-teal-700/80 px-3 py-1.5 rounded-lg transition-colors">
                Support
              </Button>
            </div>

            {/* Become Seller - Desktop Only */}
            {role !== "ROLE_SELLER" && role !== "ROLE_ADMIN" && (
              <Button
                color="inherit"
                startIcon={<StorefrontIcon />}
                onClick={() => navigate("/seller/login")}
                className="hidden md:flex hover:bg-teal-700/80 capitalize font-bold text-sm px-3.5 h-[40px] rounded-lg transition-colors"
              >
                Become Seller
              </Button>
            )}

            {token ? (
              <div className="flex items-center gap-2">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account configuration"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  className="hover:bg-teal-700/80 h-[40px] w-[40px] rounded-lg"
                >
                  <AccountCircle />
                </IconButton>
                <span className="hidden xl:inline text-sm font-extrabold truncate max-w-[100px]">
                  Hi, {user?.fullName?.split(" ")[0] || "User"}
                </span>
              </div>
            ) : (
              <Button variant="outlined" color="inherit" onClick={() => navigate("/login")} className="hidden md:flex capitalize border-white hover:bg-teal-700/80 font-bold text-sm h-[40px] px-4 rounded-lg transition-all">
                Login / Register
              </Button>
            )}

            {role !== "ROLE_SELLER" && role !== "ROLE_ADMIN" && (
              <div className="flex items-center gap-1 sm:gap-2">
                <IconButton size="large" aria-label="wishlist items" color="inherit" onClick={() => navigate("/wishlist")} className="hover:bg-teal-700/80 h-[40px] w-[40px] rounded-lg">
                  <Badge badgeContent={wishlist.length} color="error">
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>
                <IconButton size="large" aria-label="shopping cart items" color="inherit" onClick={() => navigate("/cart")} className="hover:bg-teal-700/80 h-[40px] w-[40px] rounded-lg">
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </div>
            )}
          </div>
        </Toolbar>

        {/* Mobile Search Row - Mobile Only */}
        <div className="md:hidden px-4 pb-3 w-full">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-lg px-3 py-1.5 w-full text-gray-700 border border-teal-600">
            <SearchIcon className="text-gray-400 mr-2" />
            <InputBase
              placeholder="Search products..."
              className="w-full text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputProps={{ "aria-label": "search" }}
            />
          </form>
        </div>
      </AppBar>

      {/* Slide-out Navigation Drawer for Mobile/Tablet */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>

      {/* Role-based Desktop User Profile Menu */}
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
        slotProps={{
          paper: {
            sx: {
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              border: "1px solid #f1f5f9",
              mt: 1.5,
              minWidth: 180,
              "& .MuiMenuItem-root": {
                fontSize: "0.875rem",
                fontWeight: "bold",
                py: 1.2,
                px: 2,
                color: "#334155",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                  color: "#00927c"
                }
              }
            }
          }
        }}
      >
        {role === "ROLE_SELLER" && (
          <>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/seller/dashboard"); }}>
              <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
              Vendor Dashboard
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/seller/products"); }}>
              <ListItemIcon><StorefrontIcon fontSize="small" /></ListItemIcon>
              Manage Products
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/seller/orders"); }}>
              <ListItemIcon><ListAltIcon fontSize="small" /></ListItemIcon>
              Manage Orders
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/seller/transactions"); }}>
              <ListItemIcon><LocalOfferIcon fontSize="small" /></ListItemIcon>
              Manage Earnings
            </MenuItem>
          </>
        )}
        {role === "ROLE_ADMIN" && (
          <>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/dashboard"); }}>
              <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
              Admin Dashboard
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/sellers"); }}>
              <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
              User Management
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/sellers"); }}>
              <ListItemIcon><StorefrontIcon fontSize="small" /></ListItemIcon>
              Vendor Management
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/sellers"); }}>
              <ListItemIcon><HelpIcon fontSize="small" /></ListItemIcon>
              Product Approval
            </MenuItem>
          </>
        )}
        {role === "ROLE_CUSTOMER" && (
          <>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>
              <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/my-orders"); }}>
              <ListItemIcon><ListAltIcon fontSize="small" /></ListItemIcon>
              My Orders
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/wishlist"); }}>
              <ListItemIcon><FavoriteBorderIcon fontSize="small" /></ListItemIcon>
              My Wishlist
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/cart"); }}>
              <ListItemIcon><ShoppingCartIcon fontSize="small" /></ListItemIcon>
              My Cart
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleLogout} sx={{ borderTop: "1px solid #f1f5f9" }}>
          Logout
        </MenuItem>
      </Menu>

      {/* Customer Support Modal */}
      <Dialog
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              p: 1
            }
          }
        }}
      >
        <DialogTitle className="flex justify-between items-center border-b border-gray-100 pb-3">
          <span className="font-black text-gray-800 text-lg flex items-center gap-2">
            <SupportAgentIcon className="text-teal-600" /> Customer Support
          </span>
          <IconButton onClick={() => setSupportOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="pt-4 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Need help with your orders, refunds, or payment disputes? Contact our executive support desk.
          </p>
          <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 space-y-2 text-sm text-teal-800">
            <div>
              <span className="font-bold block">Toll-Free Helpline:</span>
              <a href="tel:18001034567" className="font-extrabold hover:underline">1800-103-4567</a>
            </div>
            <div>
              <span className="font-bold block">Support Email Address:</span>
              <a href="mailto:support@inbamart.com" className="font-extrabold hover:underline">support@inbamart.com</a>
            </div>
            <div>
              <span className="font-bold block">Hours of Operation:</span>
              <span className="font-medium">Monday - Saturday (9:00 AM - 6:00 PM IST)</span>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="border-t border-gray-100 pt-3">
          <Button
            onClick={() => setSupportOpen(false)}
            variant="contained"
            sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, textTransform: "none", fontWeight: "bold", borderRadius: "8px" }}
          >
            Okay, Got It
          </Button>
        </DialogActions>
      </Dialog>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
