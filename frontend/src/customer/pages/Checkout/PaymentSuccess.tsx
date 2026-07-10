import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useOrders } from "../../../context/OrderContext";
import { useCart } from "../../../context/CartContext";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Divider from "@mui/material/Divider";

const PaymentSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchOrderById, verifyPayment } = useOrders();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const processPayment = async () => {
      const searchParams = new URLSearchParams(location.search);
      const isCod = searchParams.get("paymentMethod") === "COD";
      const paymentId = searchParams.get("razorpay_payment_id") || searchParams.get("payment_id") || "";
      const paymentLinkId = searchParams.get("razorpay_payment_link_id") || searchParams.get("payment_link_id") || "";

      try {
        if (isCod) {
          // COD Flow
          if (orderId) {
            const data = await fetchOrderById(orderId);
            setOrder(data);
          }
          setSuccess(true);
          setLoading(false);
          clearCart();
        } else if (paymentId && paymentLinkId) {
          // Razorpay Verification Flow
          await verifyPayment(paymentId, paymentLinkId);
          if (orderId) {
            const data = await fetchOrderById(orderId);
            setOrder(data);
          }
          setSuccess(true);
          setLoading(false);
          clearCart();
        } else {
          // Fallback if accessed directly
          if (orderId) {
            const data = await fetchOrderById(orderId);
            setOrder(data);
            if (data.paymentStatus === "COMPLETED") {
              setSuccess(true);
            }
          }
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Payment processing error:", err);
        setError("Failed to verify transaction. Please contact support.");
        setLoading(false);
      }
    };

    processPayment();
  }, [orderId, location.search]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <CircularProgress size={60} sx={{ color: "#00927c" }} />
        <p className="text-gray-500 font-semibold text-lg">Verifying your payment, please wait...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      {success ? (
        <div className="bg-white p-8 rounded-xl border border-gray-150 shadow-md space-y-6">
          <div className="text-green-600 flex justify-center">
            <CheckCircleIcon sx={{ fontSize: 72 }} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-800">Order Placed Successfully!</h1>
            <p className="text-sm text-gray-400 font-medium">Thank you for shopping with Inba Mart</p>
          </div>

          <Divider />

          {order && (
            <div className="text-left text-sm text-gray-600 space-y-2 py-2">
              <div className="flex justify-between">
                <span className="font-semibold">Order ID:</span>
                <span className="font-mono text-xs">{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Items:</span>
                <span>{order.totalItem} items</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Paid:</span>
                <span className="font-bold text-gray-800">₹{order.totalSellingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Payment Status:</span>
                <span className="text-green-600 font-bold uppercase text-xs">{order.paymentStatus}</span>
              </div>
            </div>
          )}

          <Divider />

          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="contained"
              onClick={() => navigate("/my-orders")}
              sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold", py: 1 }}
            >
              View My Orders
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{ color: "#00927c", borderColor: "#00927c", "&:hover": { borderColor: "#007d6a", bgcolor: "#f2faf8" }, fontWeight: "bold", py: 1 }}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl border border-gray-150 shadow-md space-y-6">
          <Alert severity="error">{error || "Payment verification failed or timed out."}</Alert>
          <Button variant="contained" className="bg-teal-600" onClick={() => navigate("/")}>
            Go back Home
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
