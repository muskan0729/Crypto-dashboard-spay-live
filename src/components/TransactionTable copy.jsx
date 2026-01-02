import React, { useState } from "react";
import CryptoAmount from "./CryptoAmounts";

export default function TransactionTable({
  transactions,
  rowsPerPageOptions = [10, 50, 100, 150],
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTransactions = transactions.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="relative space-y-6">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-red-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between w-full gap-4">
        {/* Heading */}
        <h2 className="text-sm font-medium text-[#ffd700]">
          Recent Transactions
        </h2>

        {/* Select Dropdown */}
        <select className="bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-gray-700 outline-none focus:ring-1 focus:ring-yellow-500 transition">
          <option value="Success">Success</option>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Refund">Refunded</option>
          <option value="Initiated">Initiated</option>
          <option value="Failed">Failed</option>
          <option value="Reversed">Reversed</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Transactions */}
      <div className="relative space-y-4">
        {currentTransactions.map((tx) => (
          <div
            key={tx.txn}
            className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-4 transition hover:bg-white/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-[#ffd700]">
              {/* SQ & Type */}
              <div className="space-y-1">
                <div>
                  SQ: <span className="text-white">{tx.sq}</span>
                </div>
                <div>
                  Type: <span className="text-white">{tx.type}</span>
                </div>
              </div>

              {/* Amount & TXN */}
              <div className="space-y-1">
                <div>
                  Amount:{" "}
                  <span className="text-white font-medium">
                    <CryptoAmount amount={tx.amount} symbol="₹" />
                  </span>
                </div>
                <div>
                  TXN: <span title={tx.txn} className="cursor-pointer text-white">{tx.trimmedTxn}</span>
                </div>
              </div>

              {/* Name & Date */}
              <div className="space-y-1">
                <div>
                  Name: <span className="text-white">{tx.name}</span>
                </div>
                <div>
                  Date/Time: <span className="text-white">{tx.datetime}</span>
                </div>
              </div>
              {/* Status */}
              <div className="flex items-center justify-start lg:justify-end">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full
                    ${
                      tx.status === "Success"
                        ? "bg-green-500/20 text-green-400"
                        : tx.status === "Failed"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        {/* Rows per page */}
        <div className="flex items-center gap-2 text-xs text-[#ffd700]">
          <span>Rows per page</span>
          <select
            className="bg-black/60 backdrop-blur border border-white/40 rounded-lg px-2 py-1 text-[#ffd700] focus:outline-none"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            {rowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-black">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Page controls */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[#ffd700] hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Prev
          </button>

          <span className="text-[#ffd700]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[#ffd700] hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
