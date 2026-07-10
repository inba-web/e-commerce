import { useEffect } from "react";
import { useSeller } from "../context/SellerContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

const SellerTransactions = () => {
  const { transactions, loading, fetchSellerTransactions } = useSeller();

  useEffect(() => {
    fetchSellerTransactions();
  }, []);

  if (loading && transactions.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <CircularProgress size={50} sx={{ color: "#00927c" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Transaction Log</h1>
        <p className="text-gray-500 text-sm">Completed transaction listings, payout logs, and earnings details.</p>
      </div>

      <TableContainer component={Paper} className="border border-gray-200 shadow-none rounded-xl">
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-bold text-xs text-gray-400 uppercase">Transaction ID</TableCell>
              <TableCell className="font-bold text-xs text-gray-400 uppercase">Order ID</TableCell>
              <TableCell className="font-bold text-xs text-gray-400 uppercase">Customer ID</TableCell>
              <TableCell className="font-bold text-xs text-gray-400 uppercase">Amount Received</TableCell>
              <TableCell className="font-bold text-xs text-gray-400 uppercase">Status</TableCell>
              <TableCell className="font-bold text-xs text-gray-400 uppercase">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" className="text-gray-400 py-8 text-sm">
                  No payouts or transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx: any) => (
                <TableRow key={tx._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-gray-700">{tx._id}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">{tx.order?._id || tx.order}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">{tx.customer || "Customer"}</TableCell>
                  <TableCell className="text-sm font-extrabold text-gray-900">
                    ₹{tx.order?.totalSellingPrice || "N/A"}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-green-600 uppercase">
                    COMPLETED
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(tx.createdAt || Date.now()).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SellerTransactions;
