import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PinIcon from "@mui/icons-material/Pin";

const ForgotPassword: React.FC = () => {
  const { forgetCustomerPassword, verifyCustomerResetOtp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await forgetCustomerPassword(email);
      setOtpSent(true);
      setSuccess("Reset OTP sent successfully to your email. Check your inbox.");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to send reset OTP. Verify your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await verifyCustomerResetOtp(email, otp);
      setSuccess("OTP verified successfully! Redirecting...");
      setTimeout(() => {
        navigate("/reset-password", { state: { token: data.resetToken, email } });
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Invalid OTP. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 md:py-20 bg-gray-50 min-h-[70vh]">
      <div className="w-full max-w-[420px] space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-gray-800">Forgot Password</h1>
            <p className="text-xs text-gray-500">
              {!otpSent
                ? "Enter your registered email address to receive a secure recovery OTP code."
                : "Enter the 6-digit security code sent to your email inbox."}
            </p>
          </div>

          {error && <Alert severity="error" className="text-xs rounded-xl">{error}</Alert>}
          {success && <Alert severity="success" className="text-xs rounded-xl">{success}</Alert>}

          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Email Address</label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon fontSize="small" className="text-gray-400" />
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#00927c" }
                    }
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: "#00927c",
                  "&:hover": { bgcolor: "#007d6a" },
                  fontWeight: "bold",
                  py: 1.2,
                  borderRadius: "10px",
                  textTransform: "none",
                  boxShadow: "none"
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Verification OTP</label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PinIcon fontSize="small" className="text-gray-400" />
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#00927c" }
                    }
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: "#00927c",
                  "&:hover": { bgcolor: "#007d6a" },
                  fontWeight: "bold",
                  py: 1.2,
                  borderRadius: "10px",
                  textTransform: "none",
                  boxShadow: "none"
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Verify Code"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="text-xs font-bold text-teal-700 hover:underline hover:text-teal-800 bg-transparent border-none cursor-pointer"
                >
                  Resend OTP Code
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs font-bold text-gray-500 hover:underline">
              Back to Sign-In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
