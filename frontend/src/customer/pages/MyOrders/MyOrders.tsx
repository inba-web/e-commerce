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
