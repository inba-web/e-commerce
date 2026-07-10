import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSeller } from "../context/SellerContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

const SellerLogin = () => {
  const navigate = useNavigate();
  const { sendOtp, signin } = useAuth();
  const { registerSeller } = useSeller();

  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register

  // Login Form
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Register Form
  const [sellerName, setSellerName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gstin, setGstin] = useState("");
  const password = "12345678";

  // Bank Info
  const [accNo, setAccNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holder, setHolder] = useState("");

  // Business Info
  const [bizName, setBizName] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [bizMobile, setBizMobile] = useState("");

  // Address Info
  const [street, setStreet] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTabChange = (_e: any, val: number) => {
    setTab(val);
    setError("");
    setSuccess("");
  };

  const handleRequestOtp = async () => {
    if (!email) {
      setError("Please enter your registered email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendOtp(email, true);
      setOtpSent(true);
      setSuccess("OTP sent successfully. Check your email!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Is this email registered as a seller?");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) return;
    setLoading(true);
    setError("");
    try {
      await signin(email, otp);
      setSuccess("Welcome back, Vendor!");
      setTimeout(() => {
        navigate("/seller/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to verify. Verify the OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !regEmail || !mobile || !gstin) {
      setError("Please fill all vendor primary fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const sellerData = {
        sellerName,
        email: regEmail,
        password,
        mobile,
        GSTIN: gstin,
        bankDetails: {
          accountNumber: accNo,
          ifscCode: ifsc,
          accountHolderName: holder,
        },
        businessDetails: {
          businessName: bizName || sellerName,
          businessEmail: bizEmail || regEmail,
          businessMobile: bizMobile || mobile,
          businessAddress: street,
        },
        pickupAddress: {
          name: sellerName,
          mobile,
          streetAddress: street,
          locality,
          city,
          state,
          pinCode: pin,
        },
      };

      await registerSeller(sellerData);
      setSuccess("Onboarding application submitted! Login once approved by Admin.");
      setTab(0);
      setEmail(regEmail);
    } catch (err: any) {
      setError(err.response?.data?.message || "Onboarding failed. Review GSTIN/Email inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center">
          <h1 className="logo text-4xl text-teal-700 font-bold">Inba Mart</h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">Seller Integration Portal</p>
        </div>

        <Card className="border border-gray-150 shadow-md">
          <CardContent className="p-6">
            <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" textColor="primary" indicatorColor="primary">
              <Tab label="Vendor Login" className="font-semibold" />
              <Tab label="Register Store" className="font-semibold" />
            </Tabs>

            {error && <Alert severity="error" className="mt-4">{error}</Alert>}
            {success && <Alert severity="success" className="mt-4">{success}</Alert>}

            {tab === 0 ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 mt-6">
                <TextField
                  label="Registered Email"
                  fullWidth
                  value={email}
                  disabled={otpSent}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {otpSent && (
                  <TextField
                    label="6-Digit OTP"
                    fullWidth
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    helperText="Check console/email for code"
                  />
                )}

                {!otpSent ? (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    onClick={handleRequestOtp}
                    sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold" }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Request Login OTP"}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold" }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Login Store"}
                  </Button>
                )}
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-6 mt-6">
                {/* Primary store */}
                <div className="space-y-3">
                  <Typography className="font-bold text-gray-700 text-sm">Primary Store Info</Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField label="Seller Name" fullWidth size="small" value={sellerName} onChange={(e) => setSellerName(e.target.value)} />
                    <TextField label="Login Email" fullWidth size="small" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                    <TextField label="Mobile Phone" fullWidth size="small" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                    <TextField label="GSTIN Number" fullWidth size="small" value={gstin} onChange={(e) => setGstin(e.target.value)} />
                  </div>
                </div>

                <Divider />

                {/* Bank */}
                <div className="space-y-3">
                  <Typography className="font-bold text-gray-700 text-sm">Bank Details (For Payouts)</Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField label="Bank Account Number" fullWidth size="small" value={accNo} onChange={(e) => setAccNo(e.target.value)} />
                    <TextField label="IFSC Code" fullWidth size="small" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
                    <TextField label="Account Holder Name" fullWidth size="small" className="sm:col-span-2" value={holder} onChange={(e) => setHolder(e.target.value)} />
                  </div>
                </div>

                <Divider />

                {/* Business details */}
                <div className="space-y-3">
                  <Typography className="font-bold text-gray-700 text-sm">Store Business Info</Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField label="Store/Business Name" fullWidth size="small" value={bizName} onChange={(e) => setBizName(e.target.value)} />
                    <TextField label="Business Email" fullWidth size="small" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} />
                    <TextField label="Business Phone" fullWidth size="small" value={bizMobile} onChange={(e) => setBizMobile(e.target.value)} />
                  </div>
                </div>

                <Divider />

                {/* Pickup address */}
                <div className="space-y-3">
                  <Typography className="font-bold text-gray-700 text-sm">Pickup Address</Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField label="Street Address" fullWidth size="small" className="sm:col-span-2" value={street} onChange={(e) => setStreet(e.target.value)} />
                    <TextField label="Locality" fullWidth size="small" value={locality} onChange={(e) => setLocality(e.target.value)} />
                    <TextField label="City" fullWidth size="small" value={city} onChange={(e) => setCity(e.target.value)} />
                    <TextField label="State" fullWidth size="small" value={state} onChange={(e) => setState(e.target.value)} />
                    <TextField label="Pin Code" fullWidth size="small" value={pin} onChange={(e) => setPin(e.target.value)} />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold", mt: 4 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Application"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerLogin;
