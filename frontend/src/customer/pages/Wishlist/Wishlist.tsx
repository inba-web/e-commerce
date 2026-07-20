import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { token } = useAuth();

  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success"
  });

  const handleCloseSnackbar = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleMoveToCart = async (productId: string) => {
    if (!token) {
      setNotification({
        open: true,
        message: "Please login to purchase items",
        severity: "error"
      });
      return;
    }
    try {
      // Defaulting to "M" size for quick wishlist cart additions
      await addToCart(productId, "M", 1);
      removeFromWishlist(productId);
      setNotification({
        open: true,
        message: "Item moved to cart successfully!",
        severity: "success"
      });
    } catch (err: any) {
      setNotification({
        open: true,
        message: err.message || "Failed to add item to cart",
        severity: "error"
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-10 pb-16 min-h-[60vh]">
      <div className="flex items-baseline gap-3 mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">My Wishlist</h1>
        <span className="text-gray-400 font-bold text-lg">({wishlist.length} {wishlist.length === 1 ? "item" : "items"})</span>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-2xl shadow-sm text-center px-4 max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 animate-pulse">
            <FavoriteBorderIcon sx={{ fontSize: 40 }} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-gray-800">Your Wishlist is Empty</h2>
            <p className="text-gray-500 max-w-md">
              Tap the heart icon on any product page or list to save your favorite items here for easy access.
            </p>
          </div>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "#00927c",
              "&:hover": { bgcolor: "#007d6a" },
              fontWeight: "bold",
              textTransform: "none",
              px: 4,
              py: 1.2,
              borderRadius: "8px",
              boxShadow: "none"
            }}
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="group flex flex-col bg-white border border-gray-150 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 relative h-full"
            >
              {/* Delete Icon Overlay */}
              <div className="absolute top-2 right-2 z-10">
                <IconButton
                  onClick={() => {
                    removeFromWishlist(item._id);
                    setNotification({
                      open: true,
                      message: "Removed item from wishlist",
                      severity: "success"
                    });
                  }}
                  sx={{
                    bgcolor: "white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    "&:hover": { bgcolor: "#fee2e2", color: "#ef4444" },
                    color: "gray.600"
                  }}
                  size="small"
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </div>

              {/* Product Image */}
              <div
                onClick={() => navigate(`/product/${item._id}`)}
                className="relative w-full aspect-[3/4] bg-gray-50 cursor-pointer overflow-hidden flex items-center justify-center border-b border-gray-100"
              >
                <img
                  src={item.images?.[0] || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600"}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                />
                {item.discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                    {item.discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {item.color || "Premium Item"}
                  </p>
                  <h3
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="text-sm font-semibold text-gray-800 truncate cursor-pointer hover:text-teal-600"
                  >
                    {item.title}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <div className="bg-green-600 text-white text-[10px] font-bold px-1 rounded flex items-center gap-0.5">
                      4.2 <StarIcon sx={{ fontSize: 9 }} />
                    </div>
                    <span className="text-[10px] text-gray-400">(45)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-sm font-black text-gray-900">₹{item.sellingPrice}</span>
                    {item.mrpPrice > item.sellingPrice && (
                      <>
                        <span className="text-xs text-gray-400 line-through">₹{item.mrpPrice}</span>
                        <span className="text-[10px] text-red-500 font-bold">({item.discountPercent}% OFF)</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Move to Cart Action Button */}
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  onClick={() => handleMoveToCart(item._id)}
                  startIcon={<ShoppingCartOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderColor: "#00927c",
                    color: "#00927c",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    borderRadius: "6px",
                    py: 0.8,
                    "&:hover": { borderColor: "#007d6a", bgcolor: "#f2faf8" }
                  }}
                >
                  Move to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Snackbar notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity} variant="filled" sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Wishlist;
