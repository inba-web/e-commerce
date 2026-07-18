import { useEffect, useState } from "react";
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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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
      case "CONFIRMED": return "secondary";
      case "SHIPPED": return "info";
      case "DELIVERED": return "success";
      case "CANCELLED": return "error";
      default: return "default";
    }
  };

  // Helper to group orders by day for the last 7 days
  const getAnalyticsData = () => {
    const data: { label: string; sales: number; count: number }[] = [];
    const now = new Date();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      data.push({
        label: dateStr,
        sales: 0,
        count: 0
      });
    }

    // Populate data from sellerOrders
    if (sellerOrders && Array.isArray(sellerOrders)) {
      sellerOrders.forEach((order: any) => {
        const orderDateStr = new Date(order.orderDate).toLocaleDateString(undefined, { month: "short", day: "numeric" });
        const dayData = data.find(item => item.label === orderDateStr);
        if (dayData) {
          dayData.sales += order.totalSellingPrice;
          dayData.count += 1;
        }
      });
    }

    return data;
  };

  const renderAnalyticsChart = () => {
    const chartData = getAnalyticsData();
    const width = 600;
    const height = 280;
    const paddingLeft = 60;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    const maxSales = Math.max(...chartData.map(d => d.sales), 100);
    const maxVal = Math.ceil(maxSales * 1.15);

    // Generate line points
    const points = chartData.map((d, idx) => {
      const x = paddingLeft + (idx * (chartWidth / (chartData.length - 1)));
      const y = paddingTop + chartHeight - (d.sales / maxVal) * chartHeight;
      return { x, y, sales: d.sales, count: d.count, label: d.label };
    });

    // Create path strings
    const linePath = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

    return (
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00927c" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#00927c" stopOpacity="0.0"/>
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight - ratio * chartHeight;
            const labelVal = Math.round(ratio * maxVal);
            return (
              <g key={idx}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="#f1f5f9" 
                  strokeWidth="1" 
                />
                <text 
                  x={paddingLeft - 10} 
                  y={y + 4} 
                  textAnchor="end" 
                  fontSize="10" 
                  fill="#94a3b8" 
                  className="font-mono font-semibold"
                >
                  ₹{labelVal}
                </text>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {points.map((p, idx) => (
            <text 
              key={idx} 
              x={p.x} 
              y={paddingTop + chartHeight + 20} 
              textAnchor="middle" 
              fontSize="10" 
              fill="#64748b" 
              className="font-semibold"
            >
              {p.label}
            </text>
          ))}

          {/* Fill Area */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#00927c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactivity Overlay Columns */}
          {points.map((p, idx) => {
            const colWidth = chartWidth / chartData.length;
            return (
              <g 
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Transparent bar for easy hover targeting */}
                <rect 
                  x={p.x - colWidth / 2} 
                  y={paddingTop} 
                  width={colWidth} 
                  height={chartHeight} 
                  fill="transparent" 
                />
                
                {/* Hover line marker */}
                {hoveredIdx === idx && (
                  <line 
                    x1={p.x} 
                    y1={paddingTop} 
                    x2={p.x} 
                    y2={paddingTop + chartHeight} 
                    stroke="#cbd5e1" 
                    strokeWidth="1" 
                    strokeDasharray="2 2"
                  />
                )}

                {/* Data point circle */}
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={hoveredIdx === idx ? 6 : 4} 
                  fill={hoveredIdx === idx ? "#ffffff" : "#00927c"} 
                  stroke="#00927c" 
                  strokeWidth="2.5" 
                />

                {/* Sub Bar for Orders Volume at the bottom */}
                <rect 
                  x={p.x - 7} 
                  y={paddingTop + chartHeight - (p.count > 0 ? 6 + p.count * 6 : 0)} 
                  width="14" 
                  height={p.count > 0 ? 6 + p.count * 6 : 0} 
                  rx="3" 
                  fill="#3b82f6" 
                  opacity={hoveredIdx === idx ? 0.95 : 0.65} 
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip UI Overlay */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div 
            className="absolute bg-white/95 border border-slate-200 shadow-xl rounded-xl p-3 text-xs pointer-events-none transition-all duration-200 z-20 space-y-1"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
              top: `${(points[hoveredIdx].y / height) * 100 - 30}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <p className="font-extrabold text-gray-800 border-b pb-1 mb-1">{points[hoveredIdx].label}</p>
            <p className="text-teal-700 font-bold">Revenue: ₹{points[hoveredIdx].sales}</p>
            <p className="text-blue-600 font-bold">Orders Volume: {points[hoveredIdx].count} orders</p>
          </div>
        )}
      </div>
    );
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

      {/* Analytics Chart Widget */}
      <Card className="border border-gray-150 shadow-sm rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <Typography variant="h6" className="font-bold text-gray-700">7-Day Sales Trend</Typography>
            <Typography className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Revenue & Volume Analytics</Typography>
          </div>
          <div className="flex gap-4 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#00927c] rounded-full inline-block" /> Sales (₹)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#3b82f6] rounded-full inline-block" /> Orders Count</span>
          </div>
        </div>
        
        {/* Render SVG Chart */}
        {renderAnalyticsChart()}
      </Card>

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
