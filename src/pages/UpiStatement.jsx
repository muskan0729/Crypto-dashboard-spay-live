import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const UpiStatement = () => {
  const [upiData, setUpiData] = useState([]);

  const { data, loading, error } = useGet("/reportrecords-List?product=UPI");

  // 🔥 Same date format as ACC_TOPUP_SETTLEMENT.jsx
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
      pending: "bg-yellow-400/20 text-yellow-300",
      initiated: "bg-blue-400/20 text-blue-300",
      success: "bg-green-400/20 text-green-300",
      complete: "bg-green-400/20 text-green-300",
      failed: "bg-red-400/20 text-red-300",
      reversed: "bg-red-400/20 text-red-300",
      refunded: "bg-gray-400/20 text-gray-300",
    };

    if (data?.data) {
      const formattedData = data.data.map((item, index) => ({
        sqno: (
          <div className="flex flex-col text-left text-sm text-white/80">
            <span className="font-semibold text-white">{index + 1}</span>
            <span>
              {new Date(item.created_at).getDate()}{" "}
              {MONTH_NAMES[new Date(item.created_at).getMonth()]}{" "}
              {new Date(item.created_at).getFullYear()}
              <br />
              {new Date(item.created_at).toLocaleTimeString()}
            </span>
          </div>
        ),

        id: item.id,
        user_id: item.user_id,
        product_type: item.product ?? "N/A",
        merchant_details: (
          <span className="text-white/90 font-medium">
            {item.user.name ?? "N/A"}
          </span>
        ),

        txnid: (
          <div className="flex flex-col text-left text-sm text-white/80 space-y-0.5">
            <span>
              Payee VPA: <b className="text-white">{item.payee_vpa ?? "null"}</b>
            </span>
            <span>
              Payee Name: <b className="text-white">{item.payer_name ?? "null"}</b>
            </span>
            <span>
              Payee Txnid: <b className="text-white">{item.mytxnid}</b>
            </span>
            <span>
              TxnId: <b className="text-white">{item.txnid}</b>
            </span>
          </div>
        ),

        amount: (
          <div className="flex flex-col text-left text-sm text-white/80 space-y-0.5">
            <span>
              Amount: <b className="text-white">{item.amount}</b>
            </span>
            <span>
              GST: <b className="text-white">{item.gst}</b>
            </span>
            <span>
              Charges: <b className="text-white">{item.charge}</b>
            </span>
            <span>
              Rolling Amt:{" "}
              <b className="text-white">{item.payin_rolling_amount}</b>
            </span>
          </div>
        ),

        numericAmount: parseFloat(item.amount) || 0,
        date: formatDateLikeTopup(item.created_at),
        status: item.status,

        showstatus: (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusClasses[item.status] ?? "bg-gray-400/20 text-gray-300"
            }`}
          >
            {item?.status
              ? item.status.charAt(0).toUpperCase() +
                item.status.slice(1)
              : "N/A"}
          </span>
        ),
      }));

      setUpiData(formattedData);
    }
  }, [data]);

  const upiColumn = [
    { header: "SQ NO", accessor: "sqno" },
    { header: "Merchant Details", accessor: "merchant_details" },
    { header: "Payer-Payee Details", accessor: "txnid" },
    { header: "Amount / Commission", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
  ];

  return (
    <div className="min-h-screen bg-black p-4 md:p-6 space-y-6">
      {/* Header Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-5">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-2xl" />
        <h4 className="relative font-bold text-[#ffd700] text-xl">
          UPI Statement
        </h4>
      </div>

      {/* Table Card */}
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
            data={upiData}
            showStatusFilter={true}
            showExport={true}
            showSearch={false}
            showDeleteColumn={false}
            showSelectUserFilter={true}
            statusList={REPORT_STATUSES}
          />
        )}
      </div>
    </div>
  );
};

export default UpiStatement;
