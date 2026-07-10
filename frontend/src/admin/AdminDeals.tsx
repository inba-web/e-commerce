import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";

const AdminDeals = () => {
  const { deals, loading, fetchDeals, createDeal, deleteDeal } = useAdmin();

  // Create Form State
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discount || !image) {
      setError("Please fill all details");
      return;
    }
    setFormLoading(true);
    setError("");
    setSuccess("");
    try {
      await createDeal({ discount, image });
      setSuccess("Deal banner created successfully!");
      setDiscount("");
      setImage("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError("Failed to create deal banner. Check inputs.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await deleteDeal(id);
      } catch (err) {
        alert("Failed to delete deal");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Deal Banners</h1>
        <p className="text-gray-500 text-sm">Add or delete custom discount carousel slides for the customer homepage.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Creation Form */}
        <div className="w-full md:w-[35%]">
          <Card className="border border-gray-150 shadow-sm rounded-xl">
            <CardContent className="space-y-4">
              <Typography variant="subtitle1" className="font-bold text-teal-800">
                Create Promo Banner
              </Typography>
              <Divider />

              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <TextField
                  label="Discount Text"
                  placeholder="e.g. Flat 50% OFF, Buy 1 Get 1"
                  fullWidth
                  size="small"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
                <TextField
                  label="Banner Image URL"
                  placeholder="http://example.com/banner.jpg"
                  fullWidth
                  size="small"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  disabled={formLoading}
                  sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold" }}
                >
                  {formLoading ? <CircularProgress size={24} color="inherit" /> : "Create Deal Banner"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: List of deals */}
        <div className="w-full md:w-[65%]">
          {loading && deals.length === 0 ? (
            <div className="flex justify-center items-center h-[30vh]">
              <CircularProgress size={40} sx={{ color: "#00927c" }} />
            </div>
          ) : (
            <TableContainer component={Paper} className="border border-gray-200 shadow-none rounded-xl">
              <Table>
                <TableHead className="bg-gray-50">
                  <TableRow>
                    <TableCell className="font-bold text-xs text-gray-400 uppercase">Banner Image</TableCell>
                    <TableCell className="font-bold text-xs text-gray-400 uppercase">Offer Discount</TableCell>
                    <TableCell className="font-bold text-xs text-gray-400 uppercase text-right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" className="text-gray-400 py-8 text-sm">
                        No promotional deal banners created yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    deals.map((deal: any, index: number) => (
                      <TableRow key={deal._id || index} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="w-28 h-16 rounded overflow-hidden bg-gray-50 border">
                            <img src={deal.image} className="w-full h-full object-cover" alt="" />
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-gray-800 text-sm">{deal.discount}</TableCell>
                        <TableCell align="right">
                          <IconButton color="error" onClick={() => handleDelete(deal._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDeals;
