// GoldTransactionTable.jsx
import React, { useState } from 'react';

export default function TransactionTable({ transactions, rowsPerPageOptions = [5, 10, 20] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTransactions = transactions.slice(startIndex, startIndex + rowsPerPage);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // reset to first page
  };

  return (
    <div className="space-y-4">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-[#CDA434]">Transaction Details</h2>

      {currentTransactions.map((tx) => (
        <div
          key={tx.txn}
          className="bg-black rounded-xl p-4 shadow-[0_0_20px_rgba(205,164,52,0.3)] border border-[#CDA434] text-[#CDA434]"
        >
          <div className="grid grid-cols-4 gap-4 text-sm">
            {/* First Column: SQ and Type */}
            <div className="space-y-1">
              <div>SQ: <span className="text-white">{tx.sq}</span></div>
              <div>Type: <span className="text-white">{tx.type}</span></div>
            </div>

            {/* Second Column: Amount and TXN */}
            <div className="space-y-1">
              <div>Amount: <span className="text-white">₹{tx.amount.toFixed(2)}</span></div>
              <div>TXN: <span className="text-white">{tx.txn}</span></div>
            </div>

            {/* Third Column: Name and Date/Time */}
            <div className="space-y-1">
              <div>Name: <span className="text-white">{tx.name}</span></div>
              <div>Date/Time: <span className="text-white">{tx.datetime}</span></div>
            </div>

            {/* Fourth Column: Status right aligned */}
            <div className="flex items-center justify-end">
              <span className={`font-semibold ${
                tx.status === "Success" ? "text-green-500" :
                tx.status === "Failed" ? "text-red-500" :
                "text-yellow-400"
              }`}>{tx.status}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
        {/* Rows per page dropdown on left */}
        <div className="flex items-center space-x-2">
          <span className="text-[#CDA434]">Rows per page:</span>
          <select
            className="bg-black text-[#CDA434] border border-[#CDA434] rounded px-2 py-1"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            {rowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Pagination buttons on right */}
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 bg-[#CDA434] text-black rounded"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >Prev</button>
          <span className="text-[#CDA434]">Page {currentPage} of {totalPages}</span>
          <button
            className="px-3 py-1 bg-[#CDA434] text-black rounded"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >Next</button>
        </div>
      </div>
    </div>
  );
}