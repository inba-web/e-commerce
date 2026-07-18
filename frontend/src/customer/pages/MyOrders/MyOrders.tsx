import { useEffect } from "react";
import { useOrders } from "../../../context/OrderContext";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

const MyOrders = () => {
  const { orders, loading, fetchUserOrders, cancelOrder } = useOrders();

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

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-700">No Orders Found</h2>
        <p className="text-gray-500">You haven't placed any orders yet. Go shop now!</p>
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

  const renderTimeline = (currentStatus: string) => {
    if (currentStatus === "CANCELLED") {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-bold my-4">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          This order has been CANCELLED and will not be processed.
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
    <div className="max-w-4xl mx-auto px-4 lg:px-8 mt-10 pb-16">
      <h1 className="text-2xl lg:text-3xl font-black text-gray-800 mb-8 uppercase tracking-wide">
        My Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <div
            key={order._id}
            className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden"
          >
            {/* Header info */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-150">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-gray-400">ORDER ID</p>
                <p className="font-mono text-xs text-gray-700">{order._id}</p>
              </div>
              <div className="flex gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-400">PLACED ON</p>
                  <p className="text-xs text-gray-700 font-semibold">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-0.5 text-right sm:text-left">
                  <p className="text-xs font-bold text-gray-400">TOTAL</p>
                  <p className="text-xs text-gray-900 font-extrabold">₹{order.totalSellingPrice}</p>
                </div>
              </div>
            </div>

            {/* Content items */}
            <div className="p-6 space-y-4">
              {order.orderItems?.map((item: any, index: number) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <div key={item._id || index} className="flex gap-4 items-start">
                    <div className="w-16 h-20 rounded-md overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center border">
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
              {renderTimeline(order.orderStatus)}

              <Divider className="my-2" />

              {/* Status and Action bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500">STATUS:</span>
                  <Chip
                    label={order.orderStatus}
                    color={getStatusColor(order.orderStatus)}
                    size="small"
                    className="font-bold text-xs"
                  />
                  <span className="text-xs font-semibold text-gray-400">
                    Payment: <strong className="text-gray-600">{order.paymentStatus}</strong>
                  </span>
                </div>

                {(order.orderStatus === "PENDING" || order.orderStatus === "PLACED") && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => cancelOrder(order._id)}
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
