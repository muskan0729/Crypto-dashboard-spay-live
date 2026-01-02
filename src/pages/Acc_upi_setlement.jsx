import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";
import CryptoAmount from "../components/CryptoAmounts";

const Acc_upi_setlement = () => {
  const [payinSettlementData, setPayinSettlementData] = useState([]);

  const { data, loading, error } = useGet(
    "/reportrecords-List?product=payin_settlement"
  );

  useEffect(() => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      initiated: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
      complete: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      reversed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };

    if (data?.data) {
      const formattedData = data.data.map((item, index) => ({
        sqno: index + 1,
        id: item.id,
        user_id: item.user_id,
        product_type: item.product ?? "N/A",
        merchant_details: item.user.name ?? "N/A",
        txnid: item.txnid ? <span title={item.txnid} className="cursor-pointer">{item.txnid.length > 20 ? item.txnid.slice(0, 20) + "..." : item.txnid}</span> : "N/A",
        amount: item.amount ? <CryptoAmount amount={item.amount} symbol="₹" /> : "N/A",
        numericAmount: parseFloat(item.amount) || 0,
        date:
          new Date(item.created_at).getDate() +
          " " +
          MONTH_NAMES[new Date(item.created_at).getMonth()] +
          " " +
          new Date(item.created_at).getFullYear() +
          " - " +
          new Date(item.created_at).toLocaleTimeString(),
        status: item.status,
        showstatus: (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              statusClasses[item.status] ?? "bg-gray-100 text-gray-800"
            }`}
          >
            {item?.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : "N/A"}
          </span>
        ),
      }));
      setPayinSettlementData(formattedData);
    }
  }, [data]);

  const payinSettlementColumn = [
    { header: "SQ NO", accessor: "sqno" },
    { header: "Id", accessor: "id" },
    { header: "User Id", accessor: "user_id" },
    { header: "Product Type", accessor: "product_type" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Transaction Id", accessor: "txnid" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
    { header: "Date", accessor: "date" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4 flex justify-between items-center relative overflow-hidden">
        {/* Gradient glow */}
        <div className="absolute -z-10 w-48 h-48 top-[-2rem] right-[-2rem] bg-gradient-to-tr from-red-500/30 via-orange-400/20 to-yellow-400/20 blur-[120px] rounded-full"></div>
 {/* Ambient Glow */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-[#ff4d4d]/30 to-[#ffb84d]/30 blur-3xl rounded-full"></div>

        <h4 className="font-bold text-[#ffd700] text-lg sm:text-xl">
          Payin Settlement Statement
        </h4>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500 text-sm sm:text-base">
          Error: {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
          requiredExport={true}
            columns={payinSettlementColumn}
            data={payinSettlementData}
            showStatusFilter={true}
            showExport={true}
            showSearch={false}
            showSelectUserFilter={true}
            showDateFilter={true}
            showDeleteColumn={false}
            statusList={REPORT_STATUSES}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl min-w-[700px] sm:min-w-full overflow-hidden"
            rowClassName={(rowIndex) =>
              rowIndex % 2 === 0
                ? "bg-white/10 hover:bg-white/20 transition"
                : "bg-white/5 hover:bg-white/20 transition"
            }
          />
        </div>
      )}
    </div>
  );
};

export default Acc_upi_setlement;
