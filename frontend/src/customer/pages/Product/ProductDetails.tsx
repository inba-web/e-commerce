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

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { fetchProductById, loading } = useProducts();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        const data = await fetchProductById(id);
        if (data) {
          setProduct(data);
          setSelectedImage(data.images?.[0] || "");
        }
      }
    };
    loadProduct();
  }, [id]);

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
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      await addToCart(product._id, selectedSize, quantity);
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
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    try {
      setActionLoading(true);
      await addToCart(product._id, selectedSize, quantity);
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

          {/* Main Showcase Image */}
          <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-gray-150 order-1 md:order-2 bg-gray-50 flex items-center justify-center">
            <img src={selectedImage} alt={product.title} className="w-full h-full object-cover object-top" />
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

          {/* Size Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Select Size</h3>
            <div className="flex gap-3">
              {["S", "M", "L", "XL", "XXL"].map((sz) => (
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
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="outlined"
              size="large"
              startIcon={<ShoppingBagIcon />}
              disabled={actionLoading}
              onClick={handleAddToCart}
              sx={{
                flex: 1,
                borderColor: "#00927c",
                color: "#00927c",
                fontWeight: "bold",
                py: 1.5,
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
                flex: 1,
                bgcolor: "#00927c",
                "&:hover": { bgcolor: "#007d6a" },
                fontWeight: "bold",
                py: 1.5,
              }}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
