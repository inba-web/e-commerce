import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";

const MobileBottomNav: React.FC = () => {
  const { token, role } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart?.cartItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
  const currentPath = location.pathname;

  // Render only on customer-facing paths on mobile (exclude vendor/admin dashboard frames)
  const isExcludedRoute = currentPath.startsWith("/seller") || currentPath.startsWith("/admin");
  if (isExcludedRoute) return null;

  const getNavButtonClass = (path: string) => {
    const isActive = currentPath === path;
    return `flex flex-col items-center justify-center flex-1 py-2 text-xs font-bold transition-all duration-200 ${
      isActive ? "text-[#00927c] scale-105" : "text-gray-400 hover:text-gray-600"
    }`;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-150 shadow-2xl flex items-center justify-around h-14 z-50 px-2 select-none">
      {/* Home */}
      <button onClick={() => navigate("/")} className={getNavButtonClass("/")}>
        <HomeIcon fontSize="medium" />
        <span className="mt-0.5 scale-90">Home</span>
      </button>

      {/* Categories / Search Catalog */}
      <button onClick={() => navigate("/search")} className={getNavButtonClass("/search")}>
        <SearchIcon fontSize="medium" />
        <span className="mt-0.5 scale-90">Explore</span>
      </button>

      {/* Wishlist */}
      {role !== "ROLE_SELLER" && role !== "ROLE_ADMIN" && (
        <button onClick={() => navigate("/wishlist")} className={getNavButtonClass("/wishlist")}>
          <Badge badgeContent={wishlist.length} color="error" sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", height: 16, minWidth: 16 } }}>
            <FavoriteIcon fontSize="medium" />
          </Badge>
          <span className="mt-0.5 scale-90">Wishlist</span>
        </button>
      )}

      {/* Cart */}
      {role !== "ROLE_SELLER" && role !== "ROLE_ADMIN" && (
        <button onClick={() => navigate("/cart")} className={getNavButtonClass("/cart")}>
          <Badge badgeContent={cartCount} color="error" sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", height: 16, minWidth: 16 } }}>
            <ShoppingCartIcon fontSize="medium" />
          </Badge>
          <span className="mt-0.5 scale-90">Cart</span>
        </button>
      )}

      {/* Account Profile */}
      <button
        onClick={() => navigate(token ? "/profile" : "/login")}
        className={getNavButtonClass(token ? "/profile" : "/login")}
      >
        <AccountCircleIcon fontSize="medium" />
        <span className="mt-0.5 scale-90">{token ? "Profile" : "Sign In"}</span>
      </button>
    </div>
  );
};

export default MobileBottomNav;
