import { useEffect } from "react";
import { useSeller } from "../context/SellerContext";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InsightsIcon from "@mui/icons-material/Insights";
import Chip from "@mui/material/Chip";

const SellerDashboard = () => {
  const { report, sellerOrders, loading, fetchSellerReport, fetchSellerOrders } = useSeller();

  useEffect(() => {
    fetchSellerReport();
    fetchSellerOrders();
  }, []);

  if (loading && !report) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <CircularProgress size={50} sx={{ color: "#00927c" }} />
      </div>
    );
  }

  // Dashboard Stats
  const revenue = report?.totalEarnings || 0;
  const ordersCount = report?.totalOrders || 0;
  const itemsSold = report?.totalSales || 0;

  // Status Chip helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "warning";
      case "PLACED": return "primary";
      case "SHIPPED": return "info";
      case "DELIVERED": return "success";
      case "CANCELLED": return "error";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Real-time statistics and summary of your store performance.</p>
      </div>

      {/* Widget Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <Typography className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</Typography>
                <Typography className="text-2xl font-black text-gray-900">₹{revenue}</Typography>
              </div>
              <div className="bg-teal-50 text-teal-600 p-3 rounded-lg">
                <CurrencyRupeeIcon />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <Typography className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</Typography>
                <Typography className="text-2xl font-black text-gray-900">{ordersCount}</Typography>
              </div>
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                <ShoppingBagIcon />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <Typography className="text-xs font-bold text-gray-400 uppercase tracking-wider">Products Sold</Typography>
                <Typography className="text-2xl font-black text-gray-900">{itemsSold}</Typography>
              </div>
              <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                <InsightsIcon />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders table */}
      <div className="space-y-3 pt-4">
        <Typography variant="h6" className="font-bold text-gray-700">Recent Customer Orders</Typography>
        <TableContainer component={Paper} className="border border-gray-200 shadow-none rounded-xl">
          <Table sx={{ minWidth: 650 }}>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Order ID</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Order Date</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Items count</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Order Value</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Payment</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellerOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="text-gray-400 py-8 text-sm">
                    No orders received yet.
                  </TableCell>
                </TableRow>
              ) : (
                sellerOrders.slice(0, 5).map((order: any) => (
                  <TableRow key={order._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-mono text-xs font-semibold text-gray-700">{order._id}</TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-gray-800">{order.totalItem}</TableCell>
                    <TableCell className="text-sm font-extrabold text-gray-950">₹{order.totalSellingPrice}</TableCell>
                    <TableCell className="text-xs font-bold text-gray-500 uppercase">{order.paymentStatus}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.orderStatus}
                        color={getStatusColor(order.orderStatus)}
                        size="small"
                        className="font-bold text-xs"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default SellerDashboard;
