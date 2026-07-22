import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const AdminCoupons = () => {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create Form State
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [expiry, setExpiry] = useState("");

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchCoupons = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/coupons`, getHeaders());
      setCoupons(res.data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [token]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountPercent) {
      setError("Coupon code and discount percentage are required.");
      return;
    }
    setError("");
    setSuccess("");
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discountPercentage: Number(discountPercent),
        minimumOrderValue: Number(minOrder) || 0,
        expirationDate: expiry ? new Date(expiry) : null
      };
      const res = await axios.post(`${API_URL}/admin/coupons`, payload, getHeaders());
      setSuccess(`Coupon ${res.data.code} created successfully!`);
      setCode("");
      setDiscountPercent("");
      setMinOrder("");
      setExpiry("");
      fetchCoupons();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to create coupon.");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await axios.delete(`${API_URL}/admin/coupons/${id}`, getHeaders());
      setSuccess("Coupon deleted successfully.");
      fetchCoupons();
    } catch (err: any) {
      setError("Failed to delete coupon.");
    }
  };

  const handleToggleValidity = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/admin/coupons/${id}/toggle`, {}, getHeaders());
      fetchCoupons();
    } catch (err: any) {
      setError("Failed to change coupon validity.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Coupon Code Manager</h1>
        <p className="text-gray-500 text-sm">Create and moderate promotional discount coupon codes for the store checkout.</p>
      </div>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Create Coupon Form */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl">
            <CardContent className="space-y-4">
              <Typography variant="subtitle1" className="font-bold text-teal-800">
                New Promotion Code
              </Typography>
              <Divider />
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <TextField
                  fullWidth
                  label="Coupon Code (e.g. SAVE20)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="SAVE20"
                  size="small"
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Discount Percentage (0-100)"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="20"
                  size="small"
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Min Purchase Requirement (₹)"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  placeholder="500"
                  size="small"
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Expiration Date (Optional)"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  size="small"
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: "#00927c",
                    "&:hover": { bgcolor: "#007d6a" },
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  Create Code
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Coupons List */}
        <Grid size={{ xs: 12, md: 8 }}>
          {loading && coupons.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <CircularProgress size={40} sx={{ color: "#00927c" }} />
            </div>
          ) : (
            <TableContainer component={Paper} className="border border-gray-200 shadow-none rounded-xl">
              <Table>
                <TableHead className="bg-gray-50">
                  <TableRow>
                    <TableCell className="font-bold text-xs text-gray-400 uppercase">Promo Code</TableCell>
                    <TableCell className="font-bold text-xs text-gray-400 uppercase text-center">Discount (%)</TableCell>
                    <TableCell className="font-bold text-xs text-gray-400 uppercase text-center">Min Order</TableCell>
                    <TableCell className="font-bold text-xs text-gray-400 uppercase">Expiry Date</TableCell>
                    <TableCell className="font-bold text-xs text-gray-400 uppercase text-center">Active</TableCell>
                    <TableCell className="font-bold text-xs text-gray-400 uppercase text-right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coupons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" className="text-gray-400 py-8 text-sm">
                        No coupon codes created yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    coupons.map((coupon) => (
                      <TableRow key={coupon._id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-extrabold text-teal-700 text-sm">{coupon.code}</TableCell>
                        <TableCell align="center" className="font-bold text-gray-800 text-sm">{coupon.discountPercentage}% OFF</TableCell>
                        <TableCell align="center" className="font-mono text-sm text-gray-600">₹{coupon.minimumOrderValue}</TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : "Never Expires"}
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={coupon.valid}
                            onChange={() => handleToggleValidity(coupon._id)}
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton color="error" onClick={() => handleDeleteCoupon(coupon._id)}>
                            <DeleteIcon size="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

import Divider from "@mui/material/Divider";
export default AdminCoupons;
