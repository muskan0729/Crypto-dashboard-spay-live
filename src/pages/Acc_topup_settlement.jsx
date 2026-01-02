import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const Acc_topup_settlement = () => {
  const [topupPayoutData, setTopupPayoutData] = useState([]);

  const { data, loading, error } = useGet(
    "/reportrecords-List?product[]=topup_payout&product[]=take_back_from_wallet"
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
        txnid: item.txnid,
        date:
          new Date(item.created_at).getDate() +
          " " +
          MONTH_NAMES[new Date(item.created_at).getMonth()] +
          " " +
          new Date(item.created_at).getFullYear() +
          " - " +
          new Date(item.created_at).toLocaleTimeString(),
        amount: item.amount ?? "N/A",
        numericAmount: parseFloat(item.amount) || 0,
        status: item.status,
        payout_closing_balance: item.payout_closing_balance ?? "0.0",
        payout_opening_balance: item.payout_opening_balance ?? "0.0",
        showstatus: (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${statusClasses[item.status] ?? "bg-gray-100 text-gray-800"}`}
          >
            {item?.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : "N/A"}
          </span>
        ),
      }));
      setTopupPayoutData(formattedData);
    }
  }, [data]);

  const topupPayoutColumn = [
    { header: "SQ NO", accessor: "sqno" },
    { header: "Id", accessor: "id" },
    { header: "User Id", accessor: "user_id" },
    { header: "Product Type", accessor: "product_type" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Transaction Id", accessor: "txnid" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
    { header: "Date", accessor: "date" },
    { header: "Opening Bal", accessor: "payout_opening_balance" },
    { header: "Closing Bal", accessor: "payout_closing_balance" },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex justify-between items-center p-4">
        {/* Ambient Glow */}
        <div className="absolute -z-10 w-40 h-40 top-[-1rem] left-[-1rem] bg-gradient-to-r from-red-500/30 via-orange-400/20 to-yellow-400/20 blur-[120px] rounded-full"></div>
        <h4 className="font-bold text-[#ffd700] text-xl z-10">
          Topup Settlement Statement
        </h4>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500">Error: {error}</div>
      ) : (
        <Table
        requiredExport={true}
          columns={topupPayoutColumn}
          data={topupPayoutData}
          showStatusFilter={true}
          showExport={true}
          showSearch={false}
          showSelectUserFilter={true}
          showDeleteColumn={false}
          statusList={REPORT_STATUSES}
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden"
          rowClassName={(rowIndex) =>
            rowIndex % 2 === 0
              ? "bg-white/10 hover:bg-white/20 transition"
              : "bg-white/5 hover:bg-white/20 transition"
          }
          paginationClassName="flex justify-end gap-2 mt-4"
          previousClassName="bg-[#ffd700]/30 hover:bg-[#ffd700]/50 text-[#ffd700] px-3 py-1 rounded-xl shadow-sm cursor-pointer transition"
          nextClassName="bg-[#ffd700]/30 hover:bg-[#ffd700]/50 text-[#ffd700] px-3 py-1 rounded-xl shadow-sm cursor-pointer transition"
        />
      )}
    </div>
  );
};

export default Acc_topup_settlement;
