import { useEffect } from "react";
import { useSeller } from "../context/SellerContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";

const SellerOrders = () => {
  const { sellerOrders, loading, fetchSellerOrders, updateOrderStatus } = useSeller();

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "warning";
      case "PLACED": return "primary";
      case "CONFIRMED": return "secondary";
      case "SHIPPED": return "info";
      case "DELIVERED": return "success";
      case "CANCELLED": return "error";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Customer Orders</h1>
        <p className="text-gray-500 text-sm">Monitor incoming order shipments and manage their delivery cycles.</p>
      </div>

      {loading && sellerOrders.length === 0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <CircularProgress size={50} sx={{ color: "#00927c" }} />
        </div>
      ) : (
        <TableContainer component={Paper} className="border border-gray-200 shadow-none rounded-xl">
          <Table sx={{ minWidth: 650 }}>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Order Details</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Shipping Address</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Total Items / Value</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Date</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Status</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellerOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="text-gray-400 py-8 text-sm">
                    No customer orders received yet.
                  </TableCell>
                </TableRow>
              ) : (
                sellerOrders.map((order: any) => (
                  <TableRow key={order._id} className="hover:bg-gray-50 transition-colors">
                    {/* Items cell */}
                    <TableCell>
                      <div className="space-y-2 max-w-xs">
                        <p className="font-mono text-xs font-bold text-gray-400">ID: {order._id}</p>
                        {order.orderItems?.map((item: any, idx: number) => (
                          <div key={item._id || idx} className="flex items-center gap-2">
                            <img
                              src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600"}
                              className="w-8 h-10 object-cover rounded border"
                              alt=""
                            />
                            <div className="text-xs">
                              <p className="font-semibold text-gray-700 truncate max-w-[150px]">{item.product?.title}</p>
                              <p className="text-gray-400">Qty: {item.quantity} | Size: {item.size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    {/* Shipping Address */}
                    <TableCell className="text-xs text-gray-600">
                      {order.shippingAddress ? (
                        <>
                          <p className="font-bold text-gray-700">{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.streetAddress}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
                          <p className="text-gray-400">Mob: {order.shippingAddress.mobile}</p>
                        </>
                      ) : (
                        "Address details missing"
                      )}
                    </TableCell>

                    {/* Quantity & Value */}
                    <TableCell>
                      <p className="text-sm font-semibold text-gray-700">{order.totalItem} items</p>
                      <p className="text-base font-extrabold text-gray-900">₹{order.totalSellingPrice}</p>
                      <p className="text-[10px] font-bold text-teal-600 uppercase">Paid: {order.paymentStatus}</p>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-xs text-gray-600">
                      {new Date(order.orderDate).toLocaleString()}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={order.orderStatus}
                        color={getStatusColor(order.orderStatus)}
                        size="small"
                        className="font-bold text-xs"
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <FormControl size="small" className="w-36">
                        <Select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          sx={{ fontSize: "12px" }}
                        >
                          <MenuItem value="PENDING" disabled>Pending</MenuItem>
                          <MenuItem value="PLACED">Placed</MenuItem>
                          <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                          <MenuItem value="SHIPPED">Shipped</MenuItem>
                          <MenuItem value="DELIVERED">Delivered</MenuItem>
                          <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default SellerOrders;
