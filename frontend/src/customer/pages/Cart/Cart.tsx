import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Cart = () => {
  const { cart, loading, removeCartItem, updateCartItem, applyCoupon, removeCoupon } = useCart();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  if (loading && !cart) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={50} sx={{ color: "#00927c" }} />
      </div>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-700">Your Cart is Empty</h2>
        <p className="text-gray-500">Explore our premium collection and add items to your cart!</p>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold" }}
        >
          Shop Now
        </Button>
      </div>
    );
  }

  const handleDecreaseQuantity = (item: any) => {
    if (item.quantity > 1) {
      updateCartItem(item._id, item.quantity - 1);
    }
  };

  const handleIncreaseQuantity = (item: any) => {
    updateCartItem(item._id, item.quantity + 1);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError("");
    setCouponSuccess("");
    try {
      await applyCoupon(couponInput.trim().toUpperCase());
      setCouponSuccess(`Coupon Applied Successfully!`);
      setCouponInput("");
    } catch (err: any) {
      setCouponError(err.response?.data?.error || err.message || "Failed to apply coupon");
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponError("");
    setCouponSuccess("");
    try {
      await removeCoupon();
      setCouponSuccess("Coupon removed successfully.");
    } catch (err: any) {
      setCouponError("Failed to remove coupon");
    }
  };

  // Calculations
  const totalMrp = cart.totalMrpPrice || 0;
  const couponDiscount = cart.couponPrice || 0;
  const finalPayable = cart.totalSellingPrice || 0;
  
  // rawSellingPrice represents selling price of items before coupon deduction
  const rawSellingPrice = cart.couponCode ? finalPayable + couponDiscount : finalPayable;
  const productDiscount = totalMrp - rawSellingPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-10 pb-16">
      <h1 className="text-2xl lg:text-3xl font-black text-gray-800 mb-8 uppercase tracking-wide">
        Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="w-full lg:w-[65%] space-y-4">
          {cart.cartItems.map((item: any) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-gray-150 shadow-sm"
              >
                {/* Image */}
                <div className="w-24 h-28 rounded-md overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600"}
                    alt={product.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1 w-full text-center sm:text-left">
                  <h3 className="font-semibold text-gray-800 truncate text-base max-w-sm">
                    {product.title}
                  </h3>
                  <p className="text-xs font-bold text-gray-400">Size: {item.size}</p>
                  <p className="text-xs text-gray-500">Seller: {product.seller?.sellerName || "Verified Partner"}</p>

                  {/* Quantity Actions */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                    <IconButton size="small" onClick={() => handleDecreaseQuantity(item)} className="border border-gray-300">
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <span className="font-bold text-sm text-gray-800">{item.quantity}</span>
                    <IconButton size="small" onClick={() => handleIncreaseQuantity(item)} className="border border-gray-300">
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>

                {/* Pricing & Remove */}
                <div className="text-center sm:text-right space-y-2 w-full sm:w-auto">
                  <div className="space-y-0.5">
                    <p className="text-lg font-extrabold text-gray-900">₹{item.sellingPrice}</p>
                    {item.mrpPrice > item.sellingPrice && (
                      <p className="text-xs text-gray-400 line-through">₹{item.mrpPrice}</p>
                    )}
                  </div>
                  <IconButton color="error" onClick={() => removeCartItem(item._id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary sidebar */}
        <div className="w-full lg:w-[35%] space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wider">Price Details</h3>
            <Divider />

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Price ({cart.cartItems.length} items)</span>
                <span>₹{totalMrp}</span>
              </div>
              {productDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Product Discount</span>
                  <span>- ₹{productDiscount}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-teal-600 font-bold">
                  <span>Coupon ({cart.couponCode})</span>
                  <span>- ₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
            </div>

            <Divider />

            <div className="flex justify-between text-base font-extrabold text-gray-800">
              <span>Total Payable</span>
              <span>₹{finalPayable}</span>
            </div>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate("/checkout")}
              sx={{
                bgcolor: "#00927c",
                "&:hover": { bgcolor: "#007d6a" },
                fontWeight: "bold",
                py: 1.5,
                mt: 2,
              }}
            >
              Proceed To Checkout
            </Button>
          </div>

          {/* Coupon Code Application Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wider">Coupons & Offers</h3>
            <Divider />

            {couponError && <Alert severity="error" className="text-xs py-1">{couponError}</Alert>}
            {couponSuccess && <Alert severity="success" className="text-xs py-1" onClose={() => setCouponSuccess("")}>{couponSuccess}</Alert>}

            {cart.couponCode ? (
              <div className="flex items-center justify-between bg-teal-50 border border-teal-200 p-3 rounded-lg">
                <div>
                  <p className="text-xs font-bold text-teal-700 uppercase">Active Code</p>
                  <p className="text-base font-black text-teal-900">{cart.couponCode}</p>
                </div>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleRemoveCoupon}
                  sx={{ textTransform: "none", fontWeight: "bold" }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <TextField
                  size="small"
                  label="Promo Code"
                  placeholder="SAVE10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!couponInput.trim()}
                  sx={{
                    bgcolor: "#00927c",
                    "&:hover": { bgcolor: "#007d6a" },
                    fontWeight: "bold",
                    textTransform: "none"
                  }}
                >
                  Apply
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
