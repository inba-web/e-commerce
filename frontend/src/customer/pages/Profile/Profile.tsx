import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";

const Profile: React.FC = () => {
  const { user, updateProfile, addUserAddress, updateUserAddress, deleteUserAddress } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0); // 0 = Profile Details, 1 = Addresses
  
  // Profile form state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Address dialog state
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  // Address form fields
  const [addrName, setAddrName] = useState("");
  const [addrMobile, setAddrMobile] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrLocality, setAddrLocality] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPin, setAddrPin] = useState("");

  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");
    try {
      await updateProfile({ fullName, mobile });
      setProfileSuccess("Profile updated successfully!");
      setProfileEditMode(false);
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Failed to update profile details");
    } finally {
      setProfileLoading(false);
    }
  };

  const openAddAddressDialog = () => {
    setEditingAddressId(null);
    setAddrName("");
    setAddrMobile("");
    setAddrStreet("");
    setAddrLocality("");
    setAddrCity("");
    setAddrState("");
    setAddrPin("");
    setAddressError("");
    setAddressDialogOpen(true);
  };

  const openEditAddressDialog = (address: any) => {
    setEditingAddressId(address._id);
    setAddrName(address.name || "");
    setAddrMobile(address.mobile || "");
    setAddrStreet(address.streetAddress || address.address || "");
    setAddrLocality(address.locality || "");
    setAddrCity(address.city || "");
    setAddrState(address.state || address.statue || "");
    setAddrPin(address.pinCode || address.pincode || "");
    setAddressError("");
    setAddressDialogOpen(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrMobile || !addrStreet || !addrLocality || !addrCity || !addrState || !addrPin) {
      setAddressError("Please fill in all address details");
      return;
    }

    setAddressLoading(true);
    setAddressError("");
    const addressData = {
      name: addrName,
      mobile: addrMobile,
      streetAddress: addrStreet,
      locality: addrLocality,
      city: addrCity,
      state: addrState,
      pinCode: addrPin
    };

    try {
      if (editingAddressId) {
        await updateUserAddress(editingAddressId, addressData);
      } else {
        await addUserAddress(addressData);
      }
      setAddressDialogOpen(false);
    } catch (err: any) {
      setAddressError(err.response?.data?.message || "Failed to save address details");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteUserAddress(addressId);
      } catch (err) {
        console.error("Failed to delete address:", err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="text-2xl lg:text-3xl font-black text-gray-800 mb-8 uppercase tracking-wide">
        Your Account Profile
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-[25%] space-y-2">
          <button
            onClick={() => setActiveTab(0)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 text-left ${
              activeTab === 0
                ? "bg-[#00927c] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <PersonIcon />
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 text-left ${
              activeTab === 1
                ? "bg-[#00927c] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <HomeIcon />
            My Addresses
          </button>
        </div>

        {/* Right Dashboard Area */}
        <div className="w-full md:w-[75%]">
          {activeTab === 0 ? (
            <Card className="border border-gray-200 shadow-sm rounded-xl">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <Typography variant="h6" className="font-extrabold text-gray-800">
                    Personal Information
                  </Typography>
                  {!profileEditMode && (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setProfileEditMode(true)}
                      sx={{ borderColor: "#00927c", color: "#00927c", "&:hover": { bgcolor: "rgba(0, 146, 124, 0.05)" }, fontWeight: "bold" }}
                      size="small"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
                <Divider />

                {profileError && <Alert severity="error">{profileError}</Alert>}
                {profileSuccess && <Alert severity="success">{profileSuccess}</Alert>}

                <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                    <TextField
                      fullWidth
                      size="small"
                      value={fullName}
                      disabled={!profileEditMode}
                      onChange={(e) => setFullName(e.target.value)}
                      variant="outlined"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                    <TextField
                      fullWidth
                      size="small"
                      value={user?.email || ""}
                      disabled
                      variant="outlined"
                      helperText="Email address cannot be changed."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Mobile Number</label>
                    <TextField
                      fullWidth
                      size="small"
                      value={mobile}
                      disabled={!profileEditMode}
                      onChange={(e) => setMobile(e.target.value)}
                      variant="outlined"
                    />
                  </div>

                  {profileEditMode && (
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={profileLoading}
                        sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold" }}
                      >
                        {profileLoading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => {
                          setFullName(user?.fullName || "");
                          setMobile(user?.mobile || "");
                          setProfileEditMode(false);
                        }}
                        sx={{ color: "gray.500", fontWeight: "bold" }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-gray-800 text-lg">Manage Saved Addresses</h3>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openAddAddressDialog}
                  sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold" }}
                >
                  Add Address
                </Button>
              </div>

              {user?.addresses?.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500 space-y-2">
                  <p className="font-bold">No saved addresses found.</p>
                  <p className="text-sm text-gray-400">Add shipping addresses for a faster checkout experience.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user?.addresses?.map((addr: any) => (
                    <Card key={addr._id} className="border border-gray-200 shadow-sm rounded-xl relative hover:shadow-md transition-shadow">
                      <CardContent className="p-5 space-y-3">
                        <div className="space-y-1">
                          <p className="font-bold text-gray-800 text-base">{addr.name}</p>
                          <p className="text-gray-500 text-sm">{addr.streetAddress || addr.address}</p>
                          <p className="text-gray-500 text-sm">{addr.locality}</p>
                          <p className="text-gray-500 text-sm">
                            {addr.city}, {addr.state || addr.statue} - {addr.pinCode || addr.pincode}
                          </p>
                          <p className="text-gray-700 text-sm font-semibold pt-1">Phone: {addr.mobile}</p>
                        </div>

                        <Divider />
                        <div className="flex justify-end gap-2 pt-1">
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                            onClick={() => openEditAddressDialog(addr)}
                            size="small"
                            sx={{ borderColor: "gray.300", color: "gray.600", "&:hover": { bgcolor: "gray.50" }, fontWeight: "bold" }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon sx={{ fontSize: 14 }} />}
                            onClick={() => handleDeleteAddress(addr._id)}
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Address Form Dialog */}
      <Dialog open={addressDialogOpen} onClose={() => setAddressDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-extrabold text-gray-800">
          {editingAddressId ? "Edit Shipping Address" : "Add Shipping Address"}
        </DialogTitle>
        <form onSubmit={handleAddressSubmit}>
          <DialogContent className="space-y-4">
            {addressError && <Alert severity="error">{addressError}</Alert>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Full Name"
                fullWidth
                size="small"
                value={addrName}
                onChange={(e) => setAddrName(e.target.value)}
              />
              <TextField
                label="Mobile Number"
                fullWidth
                size="small"
                value={addrMobile}
                onChange={(e) => setAddrMobile(e.target.value)}
              />
              <TextField
                label="Street Address / House No."
                fullWidth
                size="small"
                className="sm:col-span-2"
                value={addrStreet}
                onChange={(e) => setAddrStreet(e.target.value)}
              />
              <TextField
                label="Locality / Area"
                fullWidth
                size="small"
                value={addrLocality}
                onChange={(e) => setAddrLocality(e.target.value)}
              />
              <TextField
                label="City / Town"
                fullWidth
                size="small"
                value={addrCity}
                onChange={(e) => setAddrCity(e.target.value)}
              />
              <TextField
                label="State"
                fullWidth
                size="small"
                value={addrState}
                onChange={(e) => setAddrState(e.target.value)}
              />
              <TextField
                label="Pin Code"
                fullWidth
                size="small"
                value={addrPin}
                onChange={(e) => setAddrPin(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions className="p-4 bg-gray-50 border-t">
            <Button
              variant="text"
              onClick={() => setAddressDialogOpen(false)}
              sx={{ color: "gray.600", fontWeight: "bold" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={addressLoading}
              sx={{ bgcolor: "#00927c", "&:hover": { bgcolor: "#007d6a" }, fontWeight: "bold" }}
            >
              {addressLoading ? <CircularProgress size={20} color="inherit" /> : "Save Address"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Profile;
