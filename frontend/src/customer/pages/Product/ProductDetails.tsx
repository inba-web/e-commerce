import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../../context/ProductContext";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import StarIcon from "@mui/icons-material/Star";
import Alert from "@mui/material/Alert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import { useWishlist } from "../../../context/WishlistContext";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { fetchProductById, loading } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Advanced Image Zoom States
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const [lastTap, setLastTap] = useState(0);

  // Category variant sizing check
  const requiresSizeSelection = (prod: any) => {
    if (!prod) return false;
    if (prod.category) {
      const categoryId = String(prod.category.categoryId || "").toLowerCase();
      const categoryName = String(prod.category.name || "").toLowerCase();
      const keywords = ["wear", "clothing", "saree", "footwear", "shoes", "apparel", "ethnic", "fashion", "jeans", "shirt", "pant", "kurti"];
      if (keywords.some(kw => categoryId.includes(kw) || categoryName.includes(kw))) {
        return true;
      }
    }
    if (prod.size && prod.size.includes(",")) {
      return true;
    }
    return false;
  };

  const getProductSizes = (prod: any) => {
    if (!prod || !prod.size) return ["S", "M", "L", "XL", "XXL"];
    if (prod.size.includes(",")) {
      return prod.size.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    return ["S", "M", "L", "XL", "XXL"];
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        const data = await fetchProductById(id);
        if (data) {
          setProduct(data);
          setSelectedImage(data.images?.[0] || "");
          
          // Auto select default size if sizes are not required
          const sizeNeeded = requiresSizeSelection(data);
          if (!sizeNeeded) {
            const defaultSize = data.size ? data.size.split(",")[0].trim() : "FREE SIZE";
            setSelectedSize(defaultSize);
          } else {
            setSelectedSize("");
          }
        }
      }
    };
    loadProduct();
  }, [id]);

  // Desktop Hover Zoom handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Mobile Tap & Pinch Zoom handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
      setIsZoomed(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchStartDist !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartDist;
      setZoomScale(Math.max(1, Math.min(3.5, factor * 1.5)));
      setIsZoomed(true);
    } else if (e.touches.length === 1 && (zoomScale > 1 || isZoomed)) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
    }
  };

  const handleTouchEnd = () => {
    setTouchStartDist(null);
  };

  const handleTap = (e: React.TouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      if (zoomScale > 1 || isZoomed) {
        setZoomScale(1);
        setIsZoomed(false);
      } else {
        setZoomScale(2.2);
        setIsZoomed(true);
      }
    } else {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        setZoomPos({ x, y });
      }
    }
    setLastTap(now);
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={60} sx={{ color: "#00927c" }} />
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!token) {
      setError("Please login to purchase items");
      return;
    }
    
    const sizeNeeded = requiresSizeSelection(product);
    let sizeToSend = selectedSize;
    if (!sizeNeeded) {
      sizeToSend = product.size ? product.size.split(",")[0].trim() : "FREE SIZE";
    } else if (!selectedSize) {
      setError("Please select a size");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      await addToCart(product._id, sizeToSend, quantity);
      setSuccess("Product added to cart successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add product to cart");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!token) {
      setError("Please login to purchase items");
      return;
    }
    
    const sizeNeeded = requiresSizeSelection(product);
    let sizeToSend = selectedSize;
    if (!sizeNeeded) {
      sizeToSend = product.size ? product.size.split(",")[0].trim() : "FREE SIZE";
    } else if (!selectedSize) {
      setError("Please select a size");
      return;
    }

    try {
      setActionLoading(true);
      await addToCart(product._id, sizeToSend, quantity);
      navigate("/cart");
    } catch (err: any) {
      setError(err.message || "Checkout failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-10 pb-16">
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      {success && <Alert severity="success" className="mb-4">{success}</Alert>}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Side: Images */}
        <div className="w-full lg:w-[45%] flex flex-col md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible">
            {product.images?.map((img: string, index: number) => (
              <div
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 cursor-pointer ${
                  selectedImage === img ? "border-teal-600 shadow-sm" : "border-gray-200"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover object-top" />
              </div>
            ))}
          </div>

          {/* Main Showcase Image with Hover Zoom on Desktop and Pinch/Tap Zoom on Mobile */}
          <div 
            onMouseEnter={() => { setIsZoomed(true); setZoomScale(2.2); }}
            onMouseLeave={() => { setIsZoomed(false); setZoomScale(1); }}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => { handleTouchStart(e); handleTap(e); }}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-gray-150 order-1 md:order-2 bg-gray-50 flex items-center justify-center relative cursor-zoom-in overflow-hidden touch-none"
          >
            <img 
              src={selectedImage} 
              alt={product.title} 
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-200 ease-out select-none pointer-events-none" 
              style={{
                transform: (isZoomed || zoomScale > 1) ? `scale(${zoomScale > 1 ? zoomScale : 2.2})` : "scale(1)",
                transformOrigin: (isZoomed || zoomScale > 1) ? `${zoomPos.x}% ${zoomPos.y}%` : "center top"
              }}
            />
          </div>
        </div>

        {/* Right Side: Product details */}
        <div className="w-full lg:w-[55%] space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-black text-gray-800 tracking-tight">
              {product.title}
            </h1>
            <p className="text-base text-gray-500 font-medium leading-relaxed">
              {product.description || "Premium quality e-commerce product from verified local seller."}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              4.2 <StarIcon sx={{ fontSize: 12 }} />
            </div>
            <span className="text-xs text-gray-400 font-semibold">145 Ratings & 23 Reviews</span>
          </div>

          <Divider />

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black text-gray-900">₹{product.sellingPrice}</span>
              {product.mrpPrice > product.sellingPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.mrpPrice}</span>
                  <span className="text-xl text-red-500 font-extrabold">
                    {product.discountPercent}% Off
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 font-medium">Inclusive of all taxes</p>
          </div>

          <Divider />

          {/* Size Selector - Show only for size-requiring products */}
          {requiresSizeSelection(product) && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Select Size</h3>
              <div className="flex gap-3 flex-wrap">
                {getProductSizes(product).map((sz: string) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-12 h-12 rounded-lg border font-bold flex items-center justify-center transition-all ${
                      selectedSize === sz
                        ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:border-teal-600"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Quantity</h3>
            <div className="flex items-center border border-gray-300 rounded-lg w-fit bg-white">
              <button
                disabled={quantity <= 1}
                onClick={() => setQuantity(quantity - 1)}
                className="px-3 py-1 text-lg font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-40"
              >
                -
              </button>
              <span className="px-4 py-1 font-semibold text-gray-800">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-lg font-bold text-gray-500 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outlined"
              size="large"
              startIcon={<ShoppingBagIcon />}
              disabled={actionLoading}
              onClick={handleAddToCart}
              sx={{
                flex: 2,
                borderColor: "#00927c",
                color: "#00927c",
                fontWeight: "bold",
                py: 1.5,
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": { borderColor: "#007d6a", bgcolor: "#f2faf8" },
              }}
            >
              Add To Cart
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<FlashOnIcon />}
              disabled={actionLoading}
              onClick={handleBuyNow}
              sx={{
                flex: 2,
                bgcolor: "#00927c",
                "&:hover": { bgcolor: "#007d6a" },
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "8px",
                py: 1.5,
              }}
            >
              Buy Now
            </Button>
            <IconButton
              onClick={() => {
                if (isInWishlist(product._id)) {
                  removeFromWishlist(product._id);
                } else {
                  addToWishlist(product);
                }
              }}
              sx={{
                border: "1px solid",
                borderColor: isInWishlist(product._id) ? "#ef4444" : "#e5e7eb",
                color: isInWishlist(product._id) ? "#ef4444" : "#4b5563",
                bgcolor: isInWishlist(product._id) ? "#fef2f2" : "white",
                "&:hover": {
                  borderColor: "#ef4444",
                  bgcolor: "#fef2f2",
                  color: "#ef4444",
                },
                borderRadius: "8px",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isInWishlist(product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
