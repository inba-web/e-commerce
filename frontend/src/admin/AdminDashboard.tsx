import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const fetchStats = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_URL}/admin/dashboard/stats`, { headers });
      setStats(response.data);
    } catch (error) {
      console.error("Fetch admin stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <CircularProgress size={50} sx={{ color: "#00927c" }} />
      </div>
    );
  }

  // Fallbacks in case stats are not fully loaded or computed
  const revenue = stats?.totalRevenue || 0;
  const ordersCount = stats?.totalOrders || 0;
  const customersCount = stats?.totalCustomers || 0;
  const sellersCount = stats?.totalSellers || 0;
  const salesTrend = stats?.salesTrend || [];
  const categorySales = stats?.categorySales || [];

  const renderTrendChart = () => {
    if (salesTrend.length === 0) return null;
    const width = 600;
    const height = 280;
    const paddingLeft = 60;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    const maxRevenue = Math.max(...salesTrend.map((d: any) => d.revenue), 100);
    const maxVal = Math.ceil(maxRevenue * 1.15);

    // Generate line points
    const points = salesTrend.map((d: any, idx: number) => {
      const x = paddingLeft + (idx * (chartWidth / (salesTrend.length - 1)));
      const y = paddingTop + chartHeight - (d.revenue / maxVal) * chartHeight;
      return { x, y, revenue: d.revenue, count: d.orderCount, label: d.date };
    });

    // Path strings
    const linePath = points.map((p: any, idx: number) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

    return (
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          <defs>
            <linearGradient id="adminGradient" x1="0" y1="0" x2="0" y2="1">
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
          {points.map((p: any, idx: number) => (
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
          <path d={areaPath} fill="url(#adminGradient)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#00927c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points & Interactive Columns */}
          {points.map((p: any, idx: number) => {
            const colWidth = chartWidth / salesTrend.length;
            return (
              <g 
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <rect 
                  x={p.x - colWidth / 2} 
                  y={paddingTop} 
                  width={colWidth} 
                  height={chartHeight} 
                  fill="transparent" 
                />
                
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

                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={hoveredIdx === idx ? 6 : 4} 
                  fill={hoveredIdx === idx ? "#ffffff" : "#00927c"} 
                  stroke="#00927c" 
                  strokeWidth="2.5" 
                />

                {/* Sub Bar for daily order count at the bottom */}
                <rect 
                  x={p.x - 7} 
                  y={paddingTop + chartHeight - (p.count > 0 ? 6 + p.count * 8 : 0)} 
                  width="14" 
                  height={p.count > 0 ? 6 + p.count * 8 : 0} 
                  rx="3" 
                  fill="#3b82f6" 
                  opacity={hoveredIdx === idx ? 0.95 : 0.65} 
                />
              </g>
            );
          })}
        </svg>

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
            <p className="text-teal-700 font-bold">Revenue: ₹{points[hoveredIdx].revenue}</p>
            <p className="text-blue-600 font-bold">Orders Volume: {points[hoveredIdx].count} orders</p>
          </div>
        )}
      </div>
    );
  };

  const renderCategoryBreakdown = () => {
    if (categorySales.length === 0) return null;
    const maxVal = Math.max(...categorySales.map((c: any) => c.value), 100);

    return (
      <div className="space-y-4">
        {categorySales.map((cat: any, idx: number) => {
          const percentage = Math.round((cat.value / maxVal) * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span>{cat.name}</span>
                <span>₹{cat.value}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-teal-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Super Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Real-time overall system performance, sales metrics, and vendor analytics.</p>
      </div>

      {/* KPI Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <Typography className="text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Revenue</Typography>
                <Typography className="text-2xl font-black text-gray-900">₹{revenue}</Typography>
              </div>
              <div className="bg-teal-50 text-teal-600 p-3 rounded-lg">
                <CurrencyRupeeIcon />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <Typography className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Customers</Typography>
                <Typography className="text-2xl font-black text-gray-900">{customersCount}</Typography>
              </div>
              <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                <PeopleIcon />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <Typography className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sellers</Typography>
                <Typography className="text-2xl font-black text-gray-900">{sellersCount}</Typography>
              </div>
              <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
                <StorefrontIcon />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphs Grid */}
      <Grid container spacing={3}>
        {/* Trend Graph */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <Typography variant="h6" className="font-bold text-gray-700">7-Day Sales Trend</Typography>
                <Typography className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Revenue & Volume Analytics</Typography>
              </div>
              <div className="flex gap-4 text-xs font-bold text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#00927c] rounded-full inline-block" /> Sales (₹)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#3b82f6] rounded-full inline-block" /> Orders Count</span>
              </div>
            </div>
            {renderTrendChart()}
          </Card>
        </Grid>

        {/* Category Breakdown & Distribution */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl p-6 h-full space-y-6">
            <div>
              <Typography variant="h6" className="font-bold text-gray-700">Category Sales</Typography>
              <Typography className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Revenue Share distribution</Typography>
            </div>
            <Divider />
            {renderCategoryBreakdown()}
            <div className="pt-2 text-center text-xs text-gray-400 font-medium">
              Real-time platform sales calculated from order distributions.
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
