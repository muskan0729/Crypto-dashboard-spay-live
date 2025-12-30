import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const PayoutStatement = () => {
  const [payoutData, setPayoutData] = useState([]);

  const { data, loading, error } = useGet("/reportrecords-List?product=payout");

  const formatDateLikeTopup = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    const time = d.toLocaleTimeString();
    return `${day} ${month} ${year} - ${time}`;
  };

  useEffect(() => {
    const statusClasses = {
      pending: "bg-yellow-500/20 text-yellow-300",
      initiated: "bg-blue-500/20 text-blue-300",
      success: "bg-green-500/20 text-green-300",
      complete: "bg-green-500/20 text-green-300",
      failed: "bg-red-500/20 text-red-300",
      reversed: "bg-red-500/20 text-red-300",
      refunded: "bg-gray-500/20 text-gray-300",
    };

    if (data?.data) {
      const formattedData = data.data.map((item, index) => ({
        sqno: (
          <div className="flex flex-col text-left text-white/80">
            <span className="font-semibold text-white">
              {index + 1}
            </span>
            <span className="text-xs">
              {new Date(item.created_at).getDate()}{" "}
              {MONTH_NAMES[new Date(item.created_at).getMonth()]}{" "}
              {new Date(item.created_at).getFullYear()} -{" "}
              {new Date(item.created_at).toLocaleTimeString()}
            </span>
          </div>
        ),
        id: item.id,
        user_id: item.user_id,
        product_type: item.product ?? "N/A",
        merchant_details: (
          <span className="text-white/80">
            {item.user?.name ?? "N/A"}
          </span>
        ),
        txnid: (
          <div className="flex flex-col text-left text-xs text-white/80 space-y-0.5">
            <span>Mode: <b>{item.payout_mode ?? "N/A"}</b></span>
            <span>Account: <b>{item.payer_acc_no}</b></span>
            <span>Holder: <b>{item.payer_name}</b></span>
            <span>IFSC: <b>{item.payer_ifsc}</b></span>
            <span>UPI: <b>{item.payer_upi ?? "N/A"}</b></span>
            <span>Mobile: <b>{item.payer_mobile}</b></span>
          </div>
        ),
        reference_details: (
          <div className="flex flex-col text-left text-xs text-white/80 space-y-0.5">
            <span>Ref No: <b>{item.refno ?? "N/A"}</b></span>
            <span>Order ID: <b>{item.mytxnid}</b></span>
            <span>Txn ID: <b>{item.txnid}</b></span>
          </div>
        ),
        amount: (
          <div className="flex flex-col text-left text-xs text-white/80 space-y-0.5">
            <span>Opening: <b>{item.payout_opening_balance ?? 0}</b></span>
            <span>Pay: <b>{item.payout_amount}</b></span>
            <span>Charges: <b>{item.payer_charges ?? 0}</b></span>
            <span>Debited: <b>{item.total_debit ?? 0}</b></span>
            <span>Closing: <b>{item.payout_closing_balance ?? 0}</b></span>
            <span>Note: <b>{item.note ?? "-"}</b></span>
          </div>
        ),
        numericAmount: parseFloat(item.payout_amount) || 0,
        date: formatDateLikeTopup(item.created_at),
        status: item.status,
        showstatus: (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              statusClasses[item.status] ??
              "bg-gray-500/20 text-gray-300"
            }`}
          >
            {item.status
              ? item.status.charAt(0).toUpperCase() +
                item.status.slice(1)
              : "N/A"}
          </span>
        ),
      }));

      setPayoutData(formattedData);
    }
  }, [data]);

  const upiColumn = [
    { header: "Order / Date", accessor: "sqno" },
    { header: "User Details", accessor: "merchant_details" },
    { header: "Bank Details", accessor: "txnid" },
    { header: "Reference Details", accessor: "reference_details" },
    { header: "Amount / Charges", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
  ];

  return (
    <div className="min-h-screen bg-black p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-2xl" />
        <h4 className="relative font-bold text-[#ffd700] text-xl">
          Payout Statement
        </h4>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="text-center py-6 text-red-400">
            Error: {error}
          </div>
        ) : (
          <Table
            columns={upiColumn}
            data={payoutData}
            showStatusFilter={true}
            showExport={true}
            showSearch={false}
            showSelectUserFilter={true}
            showDeleteColumn={false}
            statusList={REPORT_STATUSES}
            className="rounded-xl overflow-hidden"
          />
        )}
      </div>
    </div>
  );
};

export default PayoutStatement;
