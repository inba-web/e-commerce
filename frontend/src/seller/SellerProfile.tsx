import { useAuth } from "../context/AuthContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

const SellerProfile = () => {
  const { seller } = useAuth();

  if (!seller) {
    return (
      <div className="p-8 text-center text-gray-500">
        No vendor profile loaded. Please login.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Vendor Profile</h1>
        <p className="text-gray-500 text-sm">Review your store details, GSTIN settings, and bank details.</p>
      </div>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl">
            <CardContent className="space-y-4">
              <Typography variant="subtitle1" className="font-bold text-teal-800">
                Primary Account Info
              </Typography>
              <Divider />
              <div className="text-sm space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Seller Name:</span>
                  <span className="font-bold text-gray-800">{seller.sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Account Email:</span>
                  <span className="font-semibold text-gray-800">{seller.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Mobile Phone:</span>
                  <span className="font-semibold text-gray-800">{seller.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">GSTIN Number:</span>
                  <span className="font-bold text-teal-700">{seller.GSTIN}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Banking Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl">
            <CardContent className="space-y-4">
              <Typography variant="subtitle1" className="font-bold text-teal-800">
                Payout Bank Details
              </Typography>
              <Divider />
              <div className="text-sm space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Holder Name:</span>
                  <span className="font-semibold text-gray-800">
                    {seller.bankDetails?.accountHolderName || "Not Provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Account Number:</span>
                  <span className="font-mono text-gray-800">
                    {seller.bankDetails?.accountNumber || "Not Provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">IFSC Code:</span>
                  <span className="font-mono text-gray-800">
                    {seller.bankDetails?.ifscCode || "Not Provided"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Business details */}
        <Grid size={{ xs: 12 }}>
          <Card className="border border-gray-150 shadow-sm rounded-xl">
            <CardContent className="space-y-4">
              <Typography variant="subtitle1" className="font-bold text-teal-800">
                Registered Business Details
              </Typography>
              <Divider />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-400 block mb-0.5">Business Name</span>
                  <span className="font-bold text-gray-800">{seller.businessDetails?.businessName || seller.sellerName}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400 block mb-0.5">Business Email</span>
                  <span className="font-semibold text-gray-800">{seller.businessDetails?.businessEmail || seller.email}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400 block mb-0.5">Business Mobile</span>
                  <span className="font-semibold text-gray-800">{seller.businessDetails?.businessMobile || seller.mobile}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400 block mb-0.5">Pickup Address Location</span>
                  <span className="font-semibold text-gray-800">{seller.businessDetails?.businessAddress || "Same as pickup"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SellerProfile;
