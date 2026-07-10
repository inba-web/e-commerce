import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useOrders } from "../../../context/OrderContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const Checkout = () => {
  const { user, fetchProfile } = useAuth();
  const { cart, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  // Address selection
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses?.[0]?._id || ""
  );

  // New Address Form State
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [locality, setLocality] = useState("");
  const [showNewForm, setShowNewForm] = useState(user?.addresses?.length === 0);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-700">No items in your cart to checkout</h2>
        <Button variant="contained" className="mt-4 bg-teal-600" onClick={() => navigate("/")}>
          Go to Shop
        </Button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let shippingAddress: any = null;

      if (showNewForm) {
        if (!name || !mobile || !streetAddress || !city || !state || !pinCode || !locality) {
          setError("Please complete all shipping address fields");
          setLoading(false);
          return;
        }
        shippingAddress = {
          name,
          mobile,
          streetAddress,
          city,
          state,
          pinCode,
          locality,
        };
      } else {
        const addr = user.addresses.find((a: any) => a._id === selectedAddressId);
        if (!addr) {
          setError("Please select a shipping address");
          setLoading(false);
          return;
        }
        shippingAddress = addr;
      }

      const orderData = await createOrder(shippingAddress, paymentMethod);

      if (paymentMethod === "RAZORPAY" && orderData.payment_link_url) {
        // Redirect to Razorpay checkout page
        window.location.href = orderData.payment_link_url;
      } else {
        // COD Success
        clearCart();
        await fetchProfile(); // reload profile to update user's addresses
        const createdOrderId = orderData.orders?.[0]?._id || orderData.paymentOrder?.orders?.[0];
        navigate(`/payment-success/${createdOrderId}?paymentMethod=COD`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-10 pb-16">
      <h1 className="text-2xl lg:text-3xl font-black text-gray-800 mb-8 uppercase tracking-wide">
        Secure Checkout
      </h1>

      {error && <Alert severity="error" className="mb-6">{error}</Alert>}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Form Column */}
        <div className="w-full lg:w-[65%] space-y-6">
          {/* Saved Addresses */}
          {user?.addresses && user.addresses.length > 0 && (
            <Card className="border border-gray-150 shadow-sm">
              <CardContent className="space-y-4">
                <Typography variant="h6" className="font-bold text-gray-700">
                  Select Shipping Address
                </Typography>
                <Divider />
                <RadioGroup
                  value={showNewForm ? "new" : selectedAddressId}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setShowNewForm(true);
                    } else {
                      setShowNewForm(false);
                      setSelectedAddressId(e.target.value);
                    }
                  }}
                  className="space-y-3"
                >
                  {user.addresses.map((addr: any) => (
                    <FormControlLabel
                      key={addr._id}
                      value={addr._id}
                      control={<Radio sx={{ color: "#00927c", "&.Mui-checked": { color: "#00927c" } }} />}
                      label={
                        <div className="text-sm text-gray-700 py-1">
                          <p className="font-bold">{addr.name} — {addr.mobile}</p>
                          <p className="text-gray-500">{addr.streetAddress}, {addr.locality}</p>
                          <p className="text-gray-500">{addr.city}, {addr.state} - {addr.pinCode}</p>
                        </div>
                      }
                      className="border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 items-start w-full"
                    />
                  ))}
                  <FormControlLabel
                    value="new"
                    control={<Radio sx={{ color: "#00927c", "&.Mui-checked": { color: "#00927c" } }} />}
                    label={<span className="font-semibold text-teal-700">Deliver to a new address</span>}
                    className="border border-teal-100 rounded-lg px-3 py-2 hover:bg-teal-50 items-center w-full"
                  />
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* New Address Form */}
          {showNewForm && (
            <Card className="border border-gray-150 shadow-sm">
              <CardContent className="space-y-4">
                <Typography variant="h6" className="font-bold text-gray-700">
                  Add Shipping Address
                </Typography>
                <Divider />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField label="Full Name" fullWidth size="small" value={name} onChange={(e) => setName(e.target.value)} />
                  <TextField label="Mobile Number" fullWidth size="small" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                  <TextField label="Street Address" fullWidth size="small" className="sm:col-span-2" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                  <TextField label="Locality" fullWidth size="small" value={locality} onChange={(e) => setLocality(e.target.value)} />
                  <TextField label="City" fullWidth size="small" value={city} onChange={(e) => setCity(e.target.value)} />
                  <TextField label="State" fullWidth size="small" value={state} onChange={(e) => setState(e.target.value)} />
                  <TextField label="Pin Code" fullWidth size="small" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Options */}
          <Card className="border border-gray-150 shadow-sm">
            <CardContent className="space-y-4">
              <Typography variant="h6" className="font-bold text-gray-700">
                Choose Payment Method
              </Typography>
              <Divider />
              <FormControl>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="space-y-2">
                  <FormControlLabel
                    value="COD"
                    control={<Radio sx={{ color: "#00927c", "&.Mui-checked": { color: "#00927c" } }} />}
                    label={
                      <div className="text-sm">
                        <p className="font-bold text-gray-700">Cash On Delivery (COD)</p>
                        <p className="text-gray-400 text-xs">Pay in cash when products are delivered</p>
                      </div>
                    }
                    className="border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 items-start w-full"
                  />
                  <FormControlLabel
                    value="RAZORPAY"
                    control={<Radio sx={{ color: "#00927c", "&.Mui-checked": { color: "#00927c" } }} />}
                    label={
                      <div className="text-sm">
                        <p className="font-bold text-gray-700">Online Card / UPI (Razorpay)</p>
                        <p className="text-gray-400 text-xs">Pay instantly using cards, UPI, or Netbanking</p>
                      </div>
                    }
                    className="border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 items-start w-full"
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </div>

        {/* Right Summary Column */}
        <div className="w-full lg:w-[35%]">
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wider">Order Summary</h3>
            <Divider />

            <div className="space-y-3">
              {cart.cartItems.map((item: any) => (
                <div key={item._id} className="flex justify-between items-center text-sm">
                  <span className="truncate max-w-[200px] text-gray-600 font-medium">
                    {item.product?.title} (x{item.quantity})
                  </span>
                  <span className="font-bold text-gray-800">₹{item.sellingPrice}</span>
                </div>
              ))}
            </div>

            <Divider />

            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{cart.totalSellingPrice}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Fee</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>

            <Divider />

            <div className="flex justify-between text-base font-extrabold text-gray-800">
              <span>Total Amount</span>
              <span>₹{cart.totalSellingPrice}</span>
            </div>

            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              onClick={handlePlaceOrder}
              sx={{
                bgcolor: "#00927c",
                "&:hover": { bgcolor: "#007d6a" },
                fontWeight: "bold",
                py: 1.5,
                mt: 2,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
