import { useEffect, useState } from "react";
import { useOrders } from "../../../context/OrderContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const MyOrders = () => {
  const { orders, loading, fetchUserOrders, cancelOrder, deleteOrderHistory, clearOrderHistory } = useOrders();
  const navigate = useNavigate();

  // Modals state
  const [singleDeleteOpen, setSingleDeleteOpen] = useState(false);
  const [clearAllOpen, setClearAllOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={50} sx={{ color: "#00927c" }} />
      </div>
    );
  }

  const handleDeleteClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setSingleDeleteOpen(true);
  };

  const handleConfirmSingleDelete = async () => {
    if (selectedOrderId) {
      try {
        await deleteOrderHistory(selectedOrderId);
      } catch (err) {
        console.error("Failed to delete order history:", err);
      } finally {
        setSingleDeleteOpen(false);
        setSelectedOrderId(null);
      }
    }
  };

  const handleConfirmClearAll = async () => {
    try {
      await clearOrderHistory();
    } catch (err) {
      console.error("Failed to clear order history:", err);
    } finally {
      setClearAllOpen(false);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 flex flex-col items-center">
        <div className="bg-teal-50 text-[#00927c] p-6 rounded-full w-24 h-24 flex items-center justify-center shadow-inner animate-pulse">
          <ShoppingCartIcon sx={{ fontSize: 48 }} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-800 tracking-wide uppercase">No Orders Found</h2>
          <p className="text-gray-500 max-w-sm text-sm">
            You haven't placed any orders yet, or your order history has been cleared. Let's find something special for you!
          </p>
        </div>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            bgcolor: "#00927c",
            "&:hover": { bgcolor: "#007d6a" },
            fontWeight: "bold",
            px: 4,
            py: 1.25,
            borderRadius: 2
          }}
        >
          Explore Shop
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "PLACED":
        return "primary";
      case "SHIPPED":
        return "info";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const renderTimeline = (currentStatus: string, paymentMethod: string) => {
    if (currentStatus === "CANCELLED") {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl flex flex-col gap-1.5 my-4">
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            ORDER CANCELLED
          </div>
          <p className="text-xs text-red-600 font-medium">
            This order has been cancelled. Refund status:{" "}
            <strong>
              {paymentMethod === "COD"
                ? "Not applicable (COD Order)"
                : "Refund initiated. Settled to the original payment source in 3-5 business days."}
            </strong>
          </p>
        </div>
      );
    }

    const steps = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
    const stepLabels = ["Placed", "Confirmed", "Shipped", "Delivered"];
    
    let activeIndex = steps.indexOf(currentStatus);
    if (activeIndex === -1 && currentStatus === "PENDING") {
      activeIndex = 0;
    }

    return (
      <div className="w-full py-6 px-2 sm:px-6">
        <div className="relative flex justify-between items-center w-full">
          {/* Background line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full" />
          
          {/* Active progress fill */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#00927c] -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
            style={{ 
              width: `${activeIndex >= 0 ? (activeIndex / (steps.length - 1)) * 100 : 0}%` 
            }} 
          />

          {steps.map((step, idx) => {
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div key={step} className="flex flex-col items-center z-10 relative">
                <div 
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted 
                      ? "bg-[#00927c] text-white shadow" 
                      : isActive 
                        ? "bg-white border-2 border-[#00927c] text-[#00927c] ring-4 ring-teal-50" 
                        : "bg-white border border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                
                <span 
                  className={`mt-2 text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${
                    isActive 
                      ? "text-teal-700 font-bold" 
                      : isCompleted 
                        ? "text-gray-700" 
                        : "text-gray-400"
                  }`}
                >
                  {stepLabels[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 mt-10 pb-16 space-y-8">
      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h1 className="text-2xl lg:text-3xl font-black text-gray-800 uppercase tracking-wide">
          My Orders
        </h1>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteSweepIcon />}
          onClick={() => setClearAllOpen(true)}
          sx={{ fontWeight: "bold", textTransform: "none", borderRadius: 2 }}
          size="small"
        >
          Clear History
        </Button>
      </div>

      {/* Orders list */}
      <div className="space-y-6">
        {orders.map((order: any) => (
          <div
            key={order._id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Header info */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-150 relative">
              <div className="flex flex-wrap gap-4 sm:gap-8">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                  <p className="font-mono text-xs text-gray-700">{order._id}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Placed On</p>
                  <p className="text-xs text-gray-700 font-semibold">
                    {new Date(order.orderDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                  <p className="text-xs text-gray-900 font-extrabold">₹{order.totalSellingPrice}</p>
                </div>
              </div>

              {/* Trash icon to delete from view */}
              <IconButton 
                onClick={() => handleDeleteClick(order._id)}
                color="error"
                size="small"
                sx={{
                  color: "gray.400",
                  "&:hover": { color: "#d32f2f", bgcolor: "rgba(211, 47, 47, 0.04)" }
                }}
                title="Delete from history"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>

            {/* Content items */}
            <div className="p-6 space-y-4">
              {order.orderItems?.map((item: any, index: number) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <div key={item._id || index} className="flex gap-4 items-start">
                    <div className="w-16 h-20 rounded-md overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-200">
                      <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600"}
                        alt={product.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold text-gray-800 text-sm truncate max-w-md">
                        {product.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium">Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="text-xs text-gray-500">Seller: {order.seller?.sellerName || "Verified Partner"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">₹{item.sellingPrice}</p>
                    </div>
                  </div>
                );
              })}

              {/* Visual Order Timeline Stepper */}
              {renderTimeline(order.orderStatus, order.paymentMethod || "COD")}

              <Divider className="my-2" />

              {/* Status and Action bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status:</span>
                  <Chip
                    label={order.orderStatus}
                    color={getStatusColor(order.orderStatus)}
                    size="small"
                    className="font-bold text-xs"
                  />
                  <span className="text-xs font-semibold text-gray-400">
                    Payment Method: <strong className="text-gray-600 uppercase">{order.paymentMethod || "COD"}</strong> | Status: <strong className="text-gray-600">{order.paymentStatus}</strong>
                  </span>
                </div>

                {(order.orderStatus === "PENDING" || order.orderStatus === "PLACED") && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => cancelOrder(order._id)}
                    sx={{ fontWeight: "bold", textTransform: "capitalize", borderRadius: 2 }}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Single Order Confirmation Dialog */}
      <Dialog
        open={singleDeleteOpen}
        onClose={() => setSingleDeleteOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" className="font-extrabold text-gray-800">
          Delete from Order History?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description" className="text-sm">
            This will hide this order from your order list. Sellers and administrators will still retain transaction records.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50 border-t">
          <Button onClick={() => setSingleDeleteOpen(false)} sx={{ color: "gray.600", fontWeight: "bold" }}>
            Keep it
          </Button>
          <Button onClick={handleConfirmSingleDelete} color="error" variant="contained" sx={{ fontWeight: "bold" }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog
        open={clearAllOpen}
        onClose={() => setClearAllOpen(false)}
        aria-labelledby="clear-dialog-title"
        aria-describedby="clear-dialog-description"
      >
        <DialogTitle id="clear-dialog-title" className="font-extrabold text-gray-800">
          Clear All Order History?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-dialog-description" className="text-sm">
            Are you sure you want to clear your entire order history? This will hide all orders from your dashboard. This action is irreversible for your view.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50 border-t">
          <Button onClick={() => setClearAllOpen(false)} sx={{ color: "gray.600", fontWeight: "bold" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmClearAll} color="error" variant="contained" sx={{ fontWeight: "bold" }} autoFocus>
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyOrders;
