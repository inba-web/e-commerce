import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSeller } from "../context/SellerContext";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";

// Icon imports
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const SellerLogin = () => {
  const navigate = useNavigate();
  const { signinSeller, forgetSellerPassword, resetSellerPassword } = useAuth();
  const { registerSeller } = useSeller();

  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register

  // Login Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register Form
  const [sellerName, setSellerName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gstin, setGstin] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Forgot Password Form
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotOtpSent, setForgotOtpSent] = useState(false);

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
    setForgotMode(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your registered email and password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signinSeller(email, password);
      setSuccess("Welcome back, Vendor!");
      setTimeout(() => {
        navigate("/seller/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to log in. Please review credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestForgotOtp = async () => {
    if (!forgotEmail) {
      setError("Please enter your registered email");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await forgetSellerPassword(forgotEmail);
      setForgotOtpSent(true);
      setSuccess("Verification OTP sent! Check console / email.");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to send reset OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotOtp || !forgotNewPassword) {
      setError("Please fill in all reset details");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await resetSellerPassword(forgotEmail, forgotOtp, forgotNewPassword);
      setSuccess("Password updated successfully! You can now log in.");
      setTimeout(() => {
        setForgotMode(false);
        setForgotOtpSent(false);
        setEmail(forgotEmail);
        setPassword("");
        resetForgotForm();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to reset password. Check OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resetForgotForm = () => {
    setForgotEmail("");
    setForgotOtp("");
    setForgotNewPassword("");
    setForgotOtpSent(false);
    setError("");
    setSuccess("");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !regEmail || !mobile || !gstin || !regPassword) {
      setError("Please fill all vendor primary fields, including password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const sellerData = {
        sellerName,
        email: regEmail,
        password: regPassword,
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
      setPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Onboarding failed. Review GSTIN/Email inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[90vh]">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-gray-150 shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
        
        {/* Left Pane - Brand Pitch (visible on desktop) */}
        <div className="lg:w-[42%] bg-gradient-to-br from-[#00927c] to-[#005f50] p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background overlay graphic */}
          <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-teal-400 rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-teal-300 rounded-full opacity-10 blur-xl"></div>
          
          <div className="space-y-8 z-10">
            {/* Logo */}
            <div className="bg-white px-4 py-2 rounded-xl shadow-inner w-fit">
              <img src="/inbamart-logo.png" alt="Inba Mart" className="h-8 w-auto object-contain" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-black tracking-tight leading-tight">
                Start Selling on Inba Mart
              </h2>
              <p className="text-teal-50 text-sm leading-relaxed font-light">
                Reach millions of active shoppers, enjoy 0% onboarding fee, and receive direct payments weekly.
              </p>
            </div>

            {/* Merchant perks list */}
            <div className="space-y-5 pt-4">
              {[
                "0% Commission Onboarding",
                "Fast Weekly Settlements",
                "Powerful Merchant Analytics",
                "Dedicated Account Support Desk"
              ].map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircleOutlineIcon className="text-teal-300" fontSize="small" />
                  <span className="text-sm font-semibold text-teal-50">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 z-10 border-t border-teal-700/60 mt-8">
            <p className="text-xs text-teal-200">
              Trusted by 10,000+ local sellers and distributors across India.
            </p>
          </div>
        </div>

        {/* Right Pane - Form Interface */}
        <div className="lg:w-[58%] p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                borderBottom: "1px solid #e5e7eb",
                "& .MuiTab-root": { fontWeight: "bold", textTransform: "none", fontSize: "0.95rem" }
              }}
            >
              <Tab label="Vendor Login" />
              <Tab label="Register Store" />
            </Tabs>
          </div>

          {error && <Alert severity="error" className="mb-4 rounded-xl">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4 rounded-xl">{success}</Alert>}

          {forgotMode ? (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <Typography className="font-extrabold text-gray-800 text-lg">Reset Vendor Password</Typography>
                <Typography className="text-xs text-gray-400">Enter your email and verify your identity.</Typography>
              </div>

              <TextField
                label="Registered Email"
                fullWidth
                value={forgotEmail}
                disabled={forgotOtpSent}
                onChange={(e) => setForgotEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon className="text-gray-400" />
                    </InputAdornment>
                  )
                }}
              />

              {forgotOtpSent && (
                <>
                  <TextField
                    label="6-Digit OTP Code"
                    fullWidth
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    helperText="Check console/email for OTP"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckCircleOutlineIcon className="text-gray-400" />
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon className="text-gray-400" />
                        </InputAdornment>
                      )
                    }}
                  />
                </>
              )}

              {!forgotOtpSent ? (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  onClick={handleRequestForgotOtp}
                  sx={{
                    bgcolor: "#00927c",
                    "&:hover": { bgcolor: "#007d6a" },
                    fontWeight: "bold",
                    textTransform: "none",
                    py: 1.2,
                    borderRadius: "10px",
                    boxShadow: "none"
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Request Reset OTP"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    bgcolor: "#00927c",
                    "&:hover": { bgcolor: "#007d6a" },
                    fontWeight: "bold",
                    textTransform: "none",
                    py: 1.2,
                    borderRadius: "10px",
                    boxShadow: "none"
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Save New Password"}
                </Button>
              )}

              <Button
                variant="text"
                fullWidth
                onClick={() => { setForgotMode(false); resetForgotForm(); }}
                sx={{ color: "#00927c", fontWeight: "bold", textTransform: "none", mt: 1 }}
              >
                Back to Login
              </Button>
            </form>
          ) : tab === 0 ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-1">
                <Typography className="font-extrabold text-gray-800 text-lg">Welcome back, Partner</Typography>
                <Typography className="text-xs text-gray-400">Log in to manage your inventory, orders, and settlements.</Typography>
              </div>

              <TextField
                label="Registered Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon className="text-gray-400" />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Store Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon className="text-gray-400" />
                    </InputAdornment>
                  )
                }}
              />

              <div className="flex justify-end">
                <Button
                  variant="text"
                  size="small"
                  onClick={() => { setForgotMode(true); setError(""); setSuccess(""); }}
                  sx={{ color: "#00927c", fontWeight: "bold", textTransform: "none", fontSize: "0.85rem" }}
                >
                  Forgot Password?
                </Button>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  bgcolor: "#00927c",
                  "&:hover": { bgcolor: "#007d6a" },
                  fontWeight: "bold",
                  textTransform: "none",
                  py: 1.3,
                  borderRadius: "10px",
                  boxShadow: "none"
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login Store"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              
              {/* Primary store */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-teal-700">
                  <StorefrontOutlinedIcon fontSize="small" />
                  <Typography className="font-extrabold text-sm uppercase tracking-wider">Primary Store Info</Typography>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="Seller Name"
                    fullWidth
                    size="small"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlinedIcon fontSize="small" className="text-gray-400" />
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    label="Login Email"
                    fullWidth
                    size="small"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon fontSize="small" className="text-gray-400" />
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    label="Mobile Phone"
                    fullWidth
                    size="small"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneOutlinedIcon fontSize="small" className="text-gray-400" />
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    label="GSTIN Number"
                    fullWidth
                    size="small"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessOutlinedIcon fontSize="small" className="text-gray-400" />
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    label="Store Password"
                    type="password"
                    fullWidth
                    size="small"
                    className="sm:col-span-2"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon fontSize="small" className="text-gray-400" />
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
              </div>

              <Divider />

              {/* Bank */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-teal-700">
                  <AccountBalanceOutlinedIcon fontSize="small" />
                  <Typography className="font-extrabold text-sm uppercase tracking-wider">Bank Details (For Payouts)</Typography>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField label="Bank Account Number" fullWidth size="small" value={accNo} onChange={(e) => setAccNo(e.target.value)} />
                  <TextField label="IFSC Code" fullWidth size="small" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
                  <TextField
                    label="Account Holder Name"
                    fullWidth
                    size="small"
                    className="sm:col-span-2"
                    value={holder}
                    onChange={(e) => setHolder(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlinedIcon fontSize="small" className="text-gray-400" />
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
              </div>

              <Divider />

              {/* Business details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-teal-700">
                  <BusinessOutlinedIcon fontSize="small" />
                  <Typography className="font-extrabold text-sm uppercase tracking-wider">Store Business Info</Typography>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField label="Store/Business Name" fullWidth size="small" value={bizName} onChange={(e) => setBizName(e.target.value)} />
                  <TextField label="Business Email" fullWidth size="small" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} />
                  <TextField label="Business Phone" fullWidth size="small" value={bizMobile} onChange={(e) => setBizMobile(e.target.value)} />
                </div>
              </div>

              <Divider />

              {/* Pickup address */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-teal-700">
                  <PinDropOutlinedIcon fontSize="small" />
                  <Typography className="font-extrabold text-sm uppercase tracking-wider">Pickup Address</Typography>
                </div>
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
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#00927c",
                  "&:hover": { bgcolor: "#007d6a" },
                  fontWeight: "bold",
                  textTransform: "none",
                  py: 1.3,
                  borderRadius: "10px",
                  boxShadow: "none",
                  mt: 4
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Application"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
