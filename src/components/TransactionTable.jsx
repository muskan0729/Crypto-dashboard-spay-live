import React, { useState } from "react";
import CryptoAmount from "./CryptoAmounts";

export default function TransactionTable({
  transactions,
  rowsPerPageOptions = [10, 50, 100, 150],
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [statusFilter, setStatusFilter] = useState("All");

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredTransactions =
    statusFilter === "All"
      ? transactions
      : transactions.filter(
          (tx) => tx.status.toLowerCase() === statusFilter.toLowerCase()
        );

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Status colors
  const statusColors = {
    Success: "bg-green-500/20 text-green-400",
    Failed: "bg-red-500/20 text-red-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
    Refund: "bg-purple-500/20 text-purple-400",
    Initiated: "bg-blue-500/20 text-blue-400",
    Reversed: "bg-orange-500/20 text-orange-400",
    Completed: "bg-teal-500/20 text-teal-400",
    All: "bg-gray-700 text-white",
  };

  const glowClass = {
    Success: "focus:ring-green-400",
    Failed: "focus:ring-red-400",
    Pending: "focus:ring-yellow-400",
    Refund: "focus:ring-purple-400",
    Initiated: "focus:ring-blue-400",
    Reversed: "focus:ring-orange-400",
    Completed: "focus:ring-teal-400",
    All: "focus:ring-gray-400",
  };

  return (
    <div className="relative space-y-6">
      {/* Neon Ambient Glow */}

      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-sm font-semibold text-cyan-300 tracking-wide uppercase">
          Recent Transactions
        </h2>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className={`bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-gray-700 outline-none transition focus:ring-2 ${glowClass[statusFilter]}`}
        >
          {Object.keys(statusColors).map((status) => (
            <option
              key={status}
              value={status}
              className={`bg-gray-900 ${statusColors[status]}`}
            >
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions List */}
      <div className="relative space-y-4">
        {currentTransactions.map((tx) => (
          <div
            key={tx.txn}
            className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-400/20 shadow-[0_0_30px_rgba(56,189,248,0.2)] p-4 transition-transform duration-300 hover:scale-[1.01] hover:shadow-[0_0_60px_rgba(56,189,248,0.4)]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-cyan-300">
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
                  TXN:{" "}
                  <span title={tx.txn} className="cursor-pointer text-white">
                    {tx.trimmedTxn}
                  </span>
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
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    statusColors[tx.status] || "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* No transactions */}
        {currentTransactions.length === 0 && (
          <div className="text-center text-white/80 py-8">
            No transactions found for "{statusFilter}"
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-cyan-300">
          <span>Rows per page</span>
          <select
            className="bg-black/60 backdrop-blur border border-cyan-400/20 rounded-lg px-2 py-1 text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
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

        <div className="flex items-center gap-3 text-xs text-cyan-300">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-white/5 border border-cyan-400/20 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-white/5 border border-cyan-400/20 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
