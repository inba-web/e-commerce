import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const SellerProfile = () => {
  const { seller, updateSellerProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Editable Form fields
  const [sellerName, setSellerName] = useState(seller?.sellerName || "");
  const [mobile, setMobile] = useState(seller?.mobile || "");
  
  // Banking Form fields
  const [accNo, setAccNo] = useState(seller?.bankDetails?.accountNumber || "");
  const [ifsc, setIfsc] = useState(seller?.bankDetails?.ifscCode || "");
  const [holder, setHolder] = useState(seller?.bankDetails?.accountHolderName || "");

  // Business Form fields
  const [bizName, setBizName] = useState(seller?.businessDetails?.businessName || "");
  const [bizEmail, setBizEmail] = useState(seller?.businessDetails?.businessEmail || "");
  const [bizMobile, setBizMobile] = useState(seller?.businessDetails?.businessMobile || "");
  const [bizAddress, setBizAddress] = useState(seller?.businessDetails?.businessAddress || "");

  if (!seller) {
    return (
      <div className="p-8 text-center text-gray-500">
        No vendor profile loaded. Please login.
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        sellerName,
        mobile,
        bankDetails: {
          accountNumber: accNo,
          ifscCode: ifsc,
          accountHolderName: holder,
        },
        businessDetails: {
          businessName: bizName,
          businessEmail: bizEmail,
          businessMobile: bizMobile,
          businessAddress: bizAddress,
        }
      };
      await updateSellerProfile(payload);
      setSuccess("Profile details updated successfully!");
      setEditMode(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset fields to current context values
    setSellerName(seller.sellerName || "");
    setMobile(seller.mobile || "");
    setAccNo(seller.bankDetails?.accountNumber || "");
    setIfsc(seller.bankDetails?.ifscCode || "");
    setHolder(seller.bankDetails?.accountHolderName || "");
    setBizName(seller.businessDetails?.businessName || "");
    setBizEmail(seller.businessDetails?.businessEmail || "");
    setBizMobile(seller.businessDetails?.businessMobile || "");
    setBizAddress(seller.businessDetails?.businessAddress || "");
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Vendor Profile</h1>
          <p className="text-gray-500 text-sm">Review or update your store settings, payout accounts, and business details.</p>
        </div>
        {!editMode ? (
          <Button
            variant="contained"
            onClick={() => setEditMode(true)}
            sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold", px: 3 }}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{ borderColor: "gray.300", color: "gray.700", fontWeight: "bold" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold" }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <form onSubmit={handleSave} className="space-y-6">
        <Grid container spacing={3}>
          {/* Primary Profile Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card className="border border-gray-150 shadow-sm rounded-xl">
              <CardContent className="space-y-4">
                <Typography variant="subtitle1" className="font-bold text-teal-800">
                  Primary Account Info
                </Typography>
                <Divider />
                
                {editMode ? (
                  <div className="space-y-3 pt-1">
                    <TextField
                      fullWidth
                      size="small"
                      label="Seller Name"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Mobile Phone"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      disabled
                      label="Account Email (Unchangeable)"
                      value={seller.email}
                      helperText="Contact admin to change registration email."
                    />
                  </div>
                ) : (
                  <div className="text-sm space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-400">Seller Name:</span>
                      <span className="font-bold text-gray-800">{seller.sellerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-400">Account Email:</span>
                      <span className="font-semibold text-gray-800">{seller.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-400">Mobile Phone:</span>
                      <span className="font-semibold text-gray-800">{seller.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-400">GSTIN Number:</span>
                      <span className="font-bold text-teal-700">{seller.GSTIN}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Banking Info Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card className="border border-gray-150 shadow-sm rounded-xl">
              <CardContent className="space-y-4">
                <Typography variant="subtitle1" className="font-bold text-teal-800">
                  Payout Bank Details
                </Typography>
                <Divider />

                {editMode ? (
                  <div className="space-y-3 pt-1">
                    <TextField
                      fullWidth
                      size="small"
                      label="Account Holder Name"
                      value={holder}
                      onChange={(e) => setHolder(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Bank Account Number"
                      value={accNo}
                      onChange={(e) => setAccNo(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="IFSC Code"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="text-sm space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-400">Holder Name:</span>
                      <span className="font-semibold text-gray-800">
                        {seller.bankDetails?.accountHolderName || "Not Provided"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-400">Account Number:</span>
                      <span className="font-mono text-gray-800">
                        {seller.bankDetails?.accountNumber || "Not Provided"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-400">IFSC Code:</span>
                      <span className="font-mono text-gray-800">
                        {seller.bankDetails?.ifscCode || "Not Provided"}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Business Details Card */}
          <Grid size={{ xs: 12 }}>
            <Card className="border border-gray-150 shadow-sm rounded-xl">
              <CardContent className="space-y-4">
                <Typography variant="subtitle1" className="font-bold text-teal-800">
                  Registered Business Details
                </Typography>
                <Divider />

                {editMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <TextField
                      label="Business/Store Name"
                      fullWidth
                      size="small"
                      value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                    />
                    <TextField
                      label="Business Contact Email"
                      fullWidth
                      size="small"
                      value={bizEmail}
                      onChange={(e) => setBizEmail(e.target.value)}
                    />
                    <TextField
                      label="Business Contact Phone"
                      fullWidth
                      size="small"
                      value={bizMobile}
                      onChange={(e) => setBizMobile(e.target.value)}
                    />
                    <TextField
                      label="Pickup / Business Address"
                      fullWidth
                      size="small"
                      value={bizAddress}
                      onChange={(e) => setBizAddress(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-400 block mb-0.5">Business Name</span>
                      <span className="font-bold text-gray-800">{seller.businessDetails?.businessName || seller.sellerName}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-400 block mb-0.5">Business Email</span>
                      <span className="font-semibold text-gray-800">{seller.businessDetails?.businessEmail || seller.email}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-400 block mb-0.5">Business Mobile</span>
                      <span className="font-semibold text-gray-800">{seller.businessDetails?.businessMobile || seller.mobile}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-400 block mb-0.5">Pickup Address Location</span>
                      <span className="font-semibold text-gray-800">{seller.businessDetails?.businessAddress || "Same as pickup"}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default SellerProfile;
