import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !mobile || !password) {
      setError("Please fill in all details");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await signup(fullName, email, mobile, password);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate(redirect);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to sign up. Review input details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 md:py-20">
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
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#00927c" }
                  }
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase">Password</label>
              <TextField
                fullWidth
                size="small"
                type={showPassword ? "text" : "password"}
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                slotProps={{
                  input: {
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
    </div>
  );
};

export default Signup;
