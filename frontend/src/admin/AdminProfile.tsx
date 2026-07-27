import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const AdminProfile = () => {
  const { user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [mobile, setMobile] = useState(user?.mobile || "");

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        No admin profile loaded. Please login.
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await updateProfile({ fullName, mobile });
      setSuccess("Profile details updated successfully!");
      setEditMode(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(user.fullName || "");
    setMobile(user.mobile || "");
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Admin Profile</h1>
          <p className="text-gray-500 text-sm">Manage your administrator details and settings.</p>
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
              {loading ? <CircularProgress size={20} color="inherit" /> : "Save"}
            </Button>
          </div>
        )}
      </div>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Card className="border border-gray-150 shadow-sm rounded-xl">
        <CardContent className="space-y-4 p-6">
          <Typography variant="subtitle1" className="font-bold text-teal-800">
            Account Credentials
          </Typography>
          <Divider />

          {editMode ? (
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <TextField
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <TextField
                fullWidth
                label="Mobile Phone"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <TextField
                fullWidth
                disabled
                label="Administrator Email (Cannot be changed)"
                value={user.email}
              />
            </form>
          ) : (
            <div className="text-sm space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-400">Full Name:</span>
                <span className="font-bold text-gray-800">{user.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-400">Email Address:</span>
                <span className="font-semibold text-gray-800">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-400">Mobile Phone:</span>
                <span className="font-semibold text-gray-800">{user.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-400">Role:</span>
                <span className="font-bold text-teal-700">SUPER_ADMIN</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
