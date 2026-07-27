import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const ResetPassword: React.FC = () => {
  const { resetCustomerPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve JWT reset token and email from router state
  const token = location.state?.token || "";
  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect back to forgot-password if accessed directly without verification state
  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  // Password complexity checklists
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordStrong = Object.values(rules).every(Boolean);
  const passwordsMatch = password && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Authorization token missing. Please repeat OTP verification.");
      return;
    }
    if (!isPasswordStrong) {
      setError("Please ensure the password satisfies all safety requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await resetCustomerPassword(token, password);
      setSuccess("Your password has been changed successfully! Redirecting to Sign-In...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const RuleIndicator = ({ fulfilled, text }: { fulfilled: boolean; text: string }) => (
    <div className="flex items-center gap-1.5 text-xs">
      {fulfilled ? (
        <CheckCircleIcon sx={{ fontSize: "0.95rem", color: "#10b981" }} />
      ) : (
        <CancelIcon sx={{ fontSize: "0.95rem", color: "#ef4444" }} />
      )}
      <span className={fulfilled ? "text-emerald-700 font-semibold" : "text-gray-500"}>{text}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center px-4 py-12 md:py-20 bg-gray-50 min-h-[70vh]">
      <div className="w-full max-w-[420px] space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-gray-800">Set New Password</h1>
            {email && <p className="text-xs text-gray-400">Resetting credentials for <strong>{email}</strong></p>}
          </div>

          {error && <Alert severity="error" className="text-xs rounded-xl">{error}</Alert>}
          {success && <Alert severity="success" className="text-xs rounded-xl">{success}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase">New Password</label>
              <TextField
                fullWidth
                size="small"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ fontSize: "1.1rem" }}
                        >
                          {showPassword ? "🙈" : "👀"}
                        </IconButton>
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase">Confirm New Password</label>
              <TextField
                fullWidth
                size="small"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" className="text-gray-400" />
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

            {/* Real-time Validation Rules checklist */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Safety requirements:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <RuleIndicator fulfilled={rules.length} text="8+ characters" />
                <RuleIndicator fulfilled={rules.upper} text="Uppercase letter" />
                <RuleIndicator fulfilled={rules.lower} text="Lowercase letter" />
                <RuleIndicator fulfilled={rules.number} text="Number digit" />
                <RuleIndicator fulfilled={rules.special} text="Special symbol" />
                <RuleIndicator fulfilled={!!passwordsMatch} text="Passwords match" />
              </div>
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !isPasswordStrong || !passwordsMatch}
              sx={{
                bgcolor: "#00927c",
                "&:hover": { bgcolor: "#007d6a" },
                fontWeight: "bold",
                py: 1.2,
                borderRadius: "10px",
                textTransform: "none",
                boxShadow: "none",
                mt: 1,
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
