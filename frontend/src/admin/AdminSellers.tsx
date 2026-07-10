import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";

const AdminSellers = () => {
  const { sellers, loading, fetchSellers, updateSellerStatus } = useAdmin();
  const [statusTab, setStatusTab] = useState(0); // 0 = PENDING, 1 = ACTIVE, 2 = SUSPENDED

  const statuses = ["PENDING", "ACTIVE", "SUSPENDED"];

  useEffect(() => {
    fetchSellers(statuses[statusTab]);
  }, [statusTab]);

  const handleTabChange = (_e: any, newValue: number) => {
    setStatusTab(newValue);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateSellerStatus(id, newStatus);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Seller Verification</h1>
        <p className="text-gray-500 text-sm">Approve new vendor registrations or moderate active store access.</p>
      </div>

      {/* Tabs */}
      <Tabs
        value={statusTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        className="border-b"
      >
        <Tab label="Pending Applications" className="font-semibold capitalize" />
        <Tab label="Active Vendors" className="font-semibold capitalize" />
        <Tab label="Suspended Accounts" className="font-semibold capitalize" />
      </Tabs>

      {loading && sellers.length === 0 ? (
        <div className="flex justify-center items-center h-[40vh]">
          <CircularProgress size={50} sx={{ color: "#00927c" }} />
        </div>
      ) : (
        <TableContainer component={Paper} className="border border-gray-200 shadow-none rounded-xl">
          <Table sx={{ minWidth: 650 }}>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Seller / Store Name</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Contact info</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">GSTIN Number</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Bank Payout Info</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase">Pickup Location</TableCell>
                <TableCell className="font-bold text-xs text-gray-400 uppercase text-right">Verification</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="text-gray-400 py-8 text-sm">
                    No vendors in this list.
                  </TableCell>
                </TableRow>
              ) : (
                sellers.map((seller: any) => (
                  <TableRow key={seller._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-bold text-gray-800 text-sm">{seller.sellerName}</TableCell>
                    <TableCell className="text-xs text-gray-600 space-y-0.5">
                      <p>Email: {seller.email}</p>
                      <p>Mob: {seller.mobile}</p>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-bold text-teal-700">{seller.GSTIN}</TableCell>
                    <TableCell className="text-xs text-gray-600 space-y-0.5">
                      <p className="font-semibold text-gray-700">Holder: {seller.bankDetails?.accountHolderName || "N/A"}</p>
                      <p className="font-mono">A/C: {seller.bankDetails?.accountNumber || "N/A"}</p>
                      <p className="font-mono text-gray-400">IFSC: {seller.bankDetails?.ifscCode || "N/A"}</p>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 max-w-[150px] truncate">
                      {seller.businessDetails?.businessAddress || "pickup address"}
                    </TableCell>
                    <TableCell align="right">
                      {statuses[statusTab] === "PENDING" && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckIcon />}
                          onClick={() => handleStatusUpdate(seller._id, "ACTIVE")}
                          sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                        >
                          Approve Store
                        </Button>
                      )}

                      {statuses[statusTab] === "ACTIVE" && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<BlockIcon />}
                          onClick={() => handleStatusUpdate(seller._id, "SUSPENDED")}
                          sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                        >
                          Suspend Store
                        </Button>
                      )}

                      {statuses[statusTab] === "SUSPENDED" && (
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          startIcon={<CheckIcon />}
                          onClick={() => handleStatusUpdate(seller._id, "ACTIVE")}
                          sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                        >
                          Reactivate Store
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default AdminSellers;
