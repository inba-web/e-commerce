import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../context/AuthContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const { sendOtp, signup, signin } = useAuth();
  const [tab, setTab] = useState(0); // 0 = Sign In, 1 = Sign Up

  // Sign In State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Sign Up State
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [signupOtp, setSignupOtp] = useState("");
  const [signupOtpSent, setSignupOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTabChange = (_e: any, newValue: number) => {
    setTab(newValue);
    setError("");
    setSuccess("");
  };

  const handleRequestLoginOtp = async () => {
    if (!loginEmail) {
      setError("Please enter email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendOtp(loginEmail, true);
      setOtpSent(true);
      setSuccess("OTP sent successfully. Check your email (or server log)!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Account may not exist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSignupOtp = async () => {
    if (!signupEmail || !fullName || !mobile) {
      setError("Please fill all details");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendOtp(signupEmail, false);
      setSignupOtpSent(true);
      setSuccess("OTP sent successfully. Check your email (or server log)!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginOtp) return;
    setLoading(true);
    setError("");
    try {
      await signin(loginEmail, loginOtp);
      setSuccess("Welcome back!");
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Verify the OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupOtp || !fullName || !mobile) return;
    setLoading(true);
    setError("");
    try {
      await signup(fullName, signupEmail, mobile, signupOtp);
      setSuccess("Registration successful! Welcome.");
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to sign up. Verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLoginEmail("");
    setLoginOtp("");
    setOtpSent(false);
    setFullName("");
    setSignupEmail("");
    setMobile("");
    setSignupOtp("");
    setSignupOtpSent(false);
    setError("");
    setSuccess("");
  };

  return (
    <Dialog open={open} onClose={() => { onClose(); resetForm(); }} maxWidth="xs" fullWidth>
      <DialogTitle className="text-center font-bold text-teal-800">
        Welcome to Inba Mart
      </DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" textColor="primary" indicatorColor="primary">
          <Tab label="Login" className="font-semibold" />
          <Tab label="Register" className="font-semibold" />
        </Tabs>

        {error && <Alert severity="error" className="mt-3">{error}</Alert>}
        {success && <Alert severity="success" className="mt-3">{success}</Alert>}

        {tab === 0 ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
            <TextField
              label="Email Address"
              fullWidth
              value={loginEmail}
              disabled={otpSent}
              onChange={(e) => setLoginEmail(e.target.value)}
              variant="outlined"
            />
            {otpSent && (
              <TextField
                label="6-Digit OTP Code"
                fullWidth
                value={loginOtp}
                onChange={(e) => setLoginOtp(e.target.value)}
                variant="outlined"
                helperText="Enter the verification code"
              />
            )}
            {!otpSent ? (
              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                onClick={handleRequestLoginOtp}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Request OTP"}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>
            )}
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-4 mt-4">
            <TextField
              label="Full Name"
              fullWidth
              value={fullName}
              disabled={signupOtpSent}
              onChange={(e) => setFullName(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Email Address"
              fullWidth
              value={signupEmail}
              disabled={signupOtpSent}
              onChange={(e) => setSignupEmail(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Mobile Number"
              fullWidth
              value={mobile}
              disabled={signupOtpSent}
              onChange={(e) => setMobile(e.target.value)}
              variant="outlined"
            />
            {signupOtpSent && (
              <TextField
                label="6-Digit OTP Code"
                fullWidth
                value={signupOtp}
                onChange={(e) => setSignupOtp(e.target.value)}
                variant="outlined"
              />
            )}
            {!signupOtpSent ? (
              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                onClick={handleRequestSignupOtp}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Request OTP"}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
              </Button>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
