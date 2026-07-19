import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const Login: React.FC = () => {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all details");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await signin(email, password);
      setSuccess("Logged in successfully! Redirecting...");
      setTimeout(() => {
        navigate(redirect);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to sign in. Verify the email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl space-y-6">
          <h1 className="text-2xl font-black text-gray-800">Sign-In</h1>

          {error && <Alert severity="error" className="text-xs">{error}</Alert>}
          {success && <Alert severity="success" className="text-xs">{success}</Alert>}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase">Email Address</label>
              <TextField
                fullWidth
                size="small"
                placeholder="name@example.com"
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase">Password</label>
              <TextField
                fullWidth
                size="small"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
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
              {loading ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
            </Button>
          </form>

          <div className="text-xs text-gray-500 font-medium leading-relaxed">
            By continuing, you agree to Inba Mart's{" "}
            <a href="#" className="text-teal-700 hover:underline">Conditions of Use</a> and{" "}
            <a href="#" className="text-teal-700 hover:underline">Privacy Notice</a>.
          </div>
        </div>

        {/* Create Account Divider */}
        <div className="space-y-4 text-center">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase">New to Inba Mart?</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(`/signup?redirect=${encodeURIComponent(redirect)}`)}
            sx={{
              borderColor: "gray.300",
              color: "gray.700",
              bgcolor: "white",
              "&:hover": { bgcolor: "gray.50", borderColor: "gray.400" },
              fontWeight: "bold",
              py: 1,
              textTransform: "none",
              boxShadow: "none"
            }}
          >
            Create your Inba Mart account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
