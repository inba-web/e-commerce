import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const Signup: React.FC = () => {
  const { sendOtp, signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Timer State for OTP resend
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestOtp = async () => {
    if (!fullName || !email || !mobile) {
      setError("Please fill in all details (Name, Email, and Mobile)");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await sendOtp(email, false);
      setOtpSent(true);
      setCountdown(60);
      setSuccess("Verification OTP sent! Check your email inbox or server logs.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !mobile || !otp) {
      setError("Please fill in all details");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await signup(fullName, email, mobile, otp);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate(redirect);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to sign up. Verify the OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Header - Distraction-free */}
      <header className="flex justify-center py-6 border-b border-gray-200 bg-white">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-amber-400 to-yellow-300 text-teal-900 p-2 rounded-xl flex items-center justify-center shadow-md">
            <StorefrontIcon sx={{ fontSize: 24, color: "#00927c" }} />
          </div>
          <span className="logo text-teal-800 font-black text-2xl tracking-wide select-none">
            Inba Mart
          </span>
        </Link>
      </header>

      {/* Main Form Area */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl space-y-6">
            <h1 className="text-2xl font-black text-gray-800">Create Account</h1>

            {error && <Alert severity="error" className="text-xs">{error}</Alert>}
            {success && <Alert severity="success" className="text-xs">{success}</Alert>}

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Your Name</label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="First and last name"
                  value={fullName}
                  disabled={otpSent}
                  onChange={(e) => setFullName(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#00927c" }
                    }
                  }}
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Mobile Number</label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Mobile number"
                  value={mobile}
                  disabled={otpSent}
                  onChange={(e) => setMobile(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#00927c" }
                    }
                  }}
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Email Address</label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Email address"
                  value={email}
                  disabled={otpSent}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#00927c" }
                    }
                  }}
                />
              </div>

              {/* OTP code */}
              {otpSent && (
                <div className="space-y-1 animate-fade-in">
                  <label className="text-xs font-bold text-gray-600 uppercase">6-Digit OTP</label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "#00927c" }
                      }
                    }}
                  />
                  <div className="flex justify-between items-center pt-1 text-xs">
                    {countdown > 0 ? (
                      <span className="text-gray-400 font-medium">Resend OTP in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="text-teal-700 font-bold hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!otpSent ? (
                <Button
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  onClick={handleRequestOtp}
                  sx={{
                    bgcolor: "#00927c",
                    "&:hover": { bgcolor: "#007d6a" },
                    fontWeight: "bold",
                    py: 1,
                    textTransform: "none",
                    boxShadow: "none"
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : "Verify Email"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    bgcolor: "#00927c",
                    "&:hover": { bgcolor: "#007d6a" },
                    fontWeight: "bold",
                    py: 1,
                    textTransform: "none",
                    boxShadow: "none"
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : "Create Account"}
                </Button>
              )}
            </form>

            <hr className="border-gray-200" />

            <div className="text-xs text-gray-700">
              Already have an account?{" "}
              <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-teal-700 font-bold hover:underline">
                Sign in &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Distraction-free */}
      <footer className="border-t border-gray-200 bg-white py-8 text-center text-xs space-y-4">
        <div className="flex justify-center gap-6 text-teal-700 font-bold">
          <a href="#" className="hover:underline">Conditions of Use</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Help</a>
        </div>
        <p className="text-gray-400 font-medium">
          &copy; 2026, Inba Mart or its affiliates. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Signup;
