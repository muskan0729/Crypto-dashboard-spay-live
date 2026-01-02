import { useState, useEffect } from "react";
import Table from "../components/Table";
import { useGet } from "../hooks/useGet";
import { MONTH_NAMES, REPORT_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";
import CryptoAmount from "../components/CryptoAmounts";

const CryptoStatement = () => {
  const [upiData, setUpiData] = useState([]);

  const { data, loading, error } = useGet("/reportrecords-List?product=CRYPTO");

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
        sqno: (
          <div className="flex flex-col text-left">
            <span className="font-semibold text-slate-200">{index + 1}</span>
            <span className="text-slate-400 text-xs">
              {new Date(item.created_at).getDate()}{" "}
              {MONTH_NAMES[new Date(item.created_at).getMonth()]}{" "}
              {new Date(item.created_at).getFullYear()} <br />
              {new Date(item.created_at).toLocaleTimeString()}
            </span>
          </div>
        ),
        id: item.id,
        user_id: item.user_id,
        product_type: item.product ?? "N/A",
        merchant_details: item.user.name ?? "N/A",
        txnid: (
          <div className="flex flex-col text-left text-slate-200 text-sm">
            <span>Payee VPA: <b>{item.payee_vpa ?? "null"}</b></span>
            <span>Payee Name: <b>{item.payer_name ?? "null"}</b></span>
            <span className="cursor-pointer" title={item.mytxnid}>Payee Txnid: <b>{item.mytxnid.length > 20 ? item.mytxnid.slice(0, 20) + "..." : item.mytxnid}</b></span>
            <span className="cursor-pointer" title={item.txnid}>Txnid: <b>{item.txnid.length > 20 ? item.txnid.slice(0, 20) + "..." : item.txnid}</b></span>
          </div>
        ),
        amount: (
          <div className="flex flex-col text-left text-slate-200 text-sm">
            <span>Amount: <b><CryptoAmount amount={item.amount} symbol="₹" /></b></span>
            <span>GST: <b><CryptoAmount amount={item.gst} symbol="₹" /></b></span>
            <span>Charges: <b><CryptoAmount amount={item.charge} symbol="₹" /></b></span>
            <span>Payin Rolling Amount: <b><CryptoAmount amount={item.payin_rolling_amount} symbol="₹" /></b></span>
          </div>
        ),
        numericAmount: parseFloat(item.amount) || 0,
        date: new Date(item.created_at).toISOString(),
        status: item.status,
        showstatus: (
 <span
  className={`text-xs font-semibold px-3 py-1 rounded-full
    ${statusClasses[item.status] ?? "bg-green-500/20 text-green-400"}`}
>
  {item?.status
    ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
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
    { header: "Amount/ Commission", accessor: "amount" },
    { header: "Status", accessor: "showstatus" },
  ];

  return (
    <div className="w-full min-h-screen p-4 space-y-6 bg-black relative">
      {/* Gradient Glow Effects */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-radial from-red-600 via-orange-500 to-yellow-400 blur-[120px] opacity-20 -z-10 rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-yellow-400 via-orange-500 to-red-600 blur-[150px] opacity-10 -z-10 rounded-full" />

      {/* Header Card */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-6 flex justify-between items-center">
        <h4 className="font-bold text-[#ffd700] text-xl sm:text-2xl">Crypto Statement</h4>
      </div>

      {/* Table Section */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500 font-medium">Error: {error}</div>
      ) : (
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-4">
          <Table
            columns={upiColumn}
            data={upiData}
            showStatusFilter={true}
            showExport={true}
            showSearch={false}
            showDeleteColumn={false}
            showSelectUserFilter={true}
            statusList={REPORT_STATUSES}
            requiredExport={true}
          />
        </div>
      )}
    </div>
  );
};

export default CryptoStatement;
