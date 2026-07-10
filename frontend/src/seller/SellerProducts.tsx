import React, { useEffect, useState } from "react";
import { useSeller } from "../context/SellerContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const SellerProducts = () => {
  const {
    sellerProducts,
    loading,
    fetchSellerProducts,
    createSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
  } = useSeller();

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // single or comma-separated
  const [mrpPrice, setMrpPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState(""); // comma separated sizes
  const [quantity, setQuantity] = useState("");

  // Categories
  const [cat1, setCat1] = useState("");
  const [cat2, setCat2] = useState("");
  const [cat3, setCat3] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setMrpPrice("");
    setSellingPrice("");
    setColor("");
    setSize("S,M,L,XL");
    setQuantity("");
    setCat1("electronics");
    setCat2("mobiles");
    setCat3("smartphones");
    setError("");
    setSuccess("");
    setOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingId(product._id);
    setTitle(product.title);
    setDescription(product.description || "");
    setImageUrl(product.images?.join(",") || "");
    setMrpPrice(product.mrpPrice.toString());
    setSellingPrice(product.sellingPrice.toString());
    setColor(product.color || "");
    setSize(product.size || "S,M,L,XL");
    setQuantity(product.quantity?.toString() || "");
    setCat1("");
    setCat2("");
    setCat3("");
    setError("");
    setSuccess("");
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteSellerProduct(id);
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !mrpPrice || !sellingPrice || !quantity) {
      setError("Please complete all required fields");
      return;
    }

    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title,
        description,
        images: imageUrl.split(",").map((url) => url.trim()).filter(Boolean),
        mrpPrice: parseFloat(mrpPrice),
        sellingPrice: parseFloat(sellingPrice),
        color,
        size,
        quantity: parseInt(quantity),
        category: cat1 || "fashion",
        category2: cat2 || "clothing",
        category3: cat3 || "ethnic-wear",
      };

      if (editingId) {
        await updateSellerProduct(editingId, payload);
        setSuccess("Product updated successfully!");
      } else {
        await createSellerProduct(payload);
        setSuccess("Product added successfully!");
      }

      setTimeout(() => {
        setOpen(false);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to save product details");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Product Inventory</h1>
          <p className="text-gray-500 text-sm">List, update, and manage your products on Inba Mart.</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold" }}
        >
          Add Product
        </Button>
      </div>

      {loading && sellerProducts.length === 0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <CircularProgress size={50} sx={{ color: "#00927c" }} />
        </div>
      ) : (
        <TableContainer component={Paper} className="border border-gray-200 shadow-none rounded-xl">
          <Table sx={{ minWidth: 650 }}>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Product Details</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">MRP</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Selling Price</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Inventory Stock</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Color / Sizes</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase text-right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellerProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="text-gray-400 py-8 text-sm">
                    No products added yet. Click 'Add Product' to start.
                  </TableCell>
                </TableRow>
              ) : (
                sellerProducts.map((product: any) => (
                  <TableRow key={product._id} className="hover:bg-gray-50 transition-colors">
                    {/* Details cell */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-md overflow-hidden border flex-shrink-0 flex items-center justify-center bg-gray-50">
                          <img
                            src={product.images?.[0] || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600"}
                            alt={product.title}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-800 line-clamp-1">{product.title}</p>
                          <p className="text-xs text-gray-400 font-medium">ID: {product._id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-gray-400 line-through">₹{product.mrpPrice}</TableCell>
                    <TableCell className="text-sm font-extrabold text-gray-900">₹{product.sellingPrice}</TableCell>
                    <TableCell className="text-sm font-bold text-gray-700">{product.quantity} units</TableCell>
                    <TableCell className="text-xs text-gray-600 font-semibold">
                      <p>Color: {product.color || "N/A"}</p>
                      <p>Sizes: {product.size || "S, M, L"}</p>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex justify-end gap-1">
                        <IconButton color="primary" onClick={() => handleOpenEdit(product)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(product._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold text-teal-800 text-lg">
          {editingId ? "Update Product Details" : "Create New Product"}
        </DialogTitle>
        <DialogContent dividers className="space-y-4">
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <TextField
              label="Product Title *"
              fullWidth
              size="small"
              className="sm:col-span-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              size="small"
              className="sm:col-span-2"
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              label="Image URLs (comma separated) *"
              fullWidth
              size="small"
              className="sm:col-span-2"
              placeholder="http://example.com/img1.jpg, http://example.com/img2.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <TextField
              label="MRP Price (INR) *"
              type="number"
              fullWidth
              size="small"
              value={mrpPrice}
              onChange={(e) => setMrpPrice(e.target.value)}
            />
            <TextField
              label="Selling Price (INR) *"
              type="number"
              fullWidth
              size="small"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
            <TextField
              label="Product Color"
              fullWidth
              size="small"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <TextField
              label="Available Sizes (comma separated)"
              fullWidth
              size="small"
              placeholder="S,M,L,XL,XXL"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
            <TextField
              label="Quantity Stock *"
              type="number"
              fullWidth
              size="small"
              className="sm:col-span-2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            {!editingId && (
              <>
                <TextField
                  label="Category Level 1 (ID)"
                  fullWidth
                  size="small"
                  placeholder="fashion"
                  value={cat1}
                  onChange={(e) => setCat1(e.target.value)}
                />
                <TextField
                  label="Category Level 2 (ID)"
                  fullWidth
                  size="small"
                  placeholder="clothing"
                  value={cat2}
                  onChange={(e) => setCat2(e.target.value)}
                />
                <TextField
                  label="Category Level 3 (ID)"
                  fullWidth
                  size="small"
                  placeholder="ethnic-wear"
                  value={cat3}
                  onChange={(e) => setCat3(e.target.value)}
                />
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setOpen(false)} color="inherit" className="font-semibold text-gray-500">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={formLoading}
            sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold" }}
          >
            {formLoading ? <CircularProgress size={24} color="inherit" /> : "Save Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SellerProducts;
