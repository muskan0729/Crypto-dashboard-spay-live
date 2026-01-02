import { useEffect, useMemo, useState, useRef } from "react";
import useAutoFetch from "../hooks/useAutoFetch";
import { MONTH_NAMES } from "../constants/Constants";
import DashboardSkeleton from "../components/DashboardSkeleton";
import "../css/dashboard.css";
import ApexCharts from "apexcharts";
import TransactionTable from "../components/TransactionTable";
import { areaOptions1, areaOptions2 } from "../components/chartOptions";
import TransactionsChart from "../components/TransactionAreaChart";
import DashboardSummary from "../components/DashboardSummary";

export const Dashboard = () => {
  const [role] = useState(atob(localStorage.getItem("role")) || "admin");
  // Get role from localStorage
  //const [role] = useState(atob(localStorage.getItem("role")) || "admin");

  const [transactionData, setTransactionData] = useState([]);
  const [largeTransactionData, setLargeTransactionData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [donutChart, setDonutChart] = useState(null);
  const [today, setToday] = useState(false);

  const { data: cardData, loading: recordLoading } =
    useAutoFetch("/collection-record");
  const { data: tableData } = useAutoFetch(
    "/reportrecords-List"
  );
  // const { data: cryptotableData } = useAutoFetch(
  //   "/crypto-reportrecords-list?status=success"
  // );
  const [chartDataArea, setchartDataArea] = useState(null);

  const initialDataOfTransactions = tableData?.data;
  //const cryptoinitialDataOfTransactions = cryptotableData?.data;

  // console.log("Table Data:", tableData);
  // console.log("Crypto Table Data:", cryptotableData);

  // Process table data
  const processTableData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [initialDataOfTransactions]);

  // Process top 4 largest transactions
  const processLargeTransactionData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [initialDataOfTransactions]);

  // Format transaction & large transaction data
  useEffect(() => {
    const tableSource = processTableData;
    const largeSource = processLargeTransactionData;

    const formattedTableData = tableSource.map((item, index) => {
      const date = new Date(item.created_at);
      const formattedDate = `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
      const formattedTime = date.toLocaleTimeString();

      return {
        sq: index + 1,
        txn: item.txnid,
        trimmedTxn:
          item.txnid.length > 20
            ? item.txnid.slice(0, 20) + "..."
            : item.txnid,
        name: item.user.name,
        type: item.product,
        amount: item.amount,
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        //  status:(<span
        //     className={`px-2 py-1 rounded-full text-sm font-medium ${statusClasses[item.status] ?? "bg-gray-100 text-gray-800"}`}
        //   >
        //     {item?.status
        //       ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
        //       : "N/A"}
        //   </span>),
        datetime: formattedDate + " " + formattedTime,
      };
    }); 
    setTransactionData(formattedTableData);

    const formattedLargeTransactionData = largeSource.map((item) => ({
      name: item.user.name,
      amount: item.amount,
    }));
    setLargeTransactionData(formattedLargeTransactionData);
  }, [
    processTableData,
    processLargeTransactionData
  ]);

  useEffect(() => {
    if (!recordLoading && cardData) {
      setInitialLoad(false);
    }
    setDonutChart(cardData?.transactionStatusCounts);
  }, [recordLoading, cardData]);

  useEffect(() => {
    if (!cardData) return;

    const transformedData = {
      Total: {
        PayIn: { amount: [cardData.total_payin_amount], count: [cardData.total_payin_count] },
        PayOut: { amount: [cardData.total_payout_amount], count: [cardData.total_payout_count] },
      },
      Today: {
        PayIn: { amount: [cardData.today_payin_amount], count: [cardData.today_payin_count] },
        PayOut: { amount: [cardData.today_payout_amount], count: [cardData.today_payout_count] },
      },
    };
    setchartDataArea(transformedData);
  }, [cardData]);

  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);

  useEffect(() => {
    if (initialLoad) return;

    const chart1 = chartRef1.current ? new ApexCharts(chartRef1.current, areaOptions1) : null;
    const chart2 = chartRef2.current ? new ApexCharts(chartRef2.current, areaOptions2) : null;

    chart1?.render();
    chart2?.render();

    return () => {
      chart1?.destroy();
      chart2?.destroy();
    };
  }, [initialLoad]);

  const normalCards = {
    totalPayIn: cardData?.total_payin_amount || 0,
    totalPayOut: cardData?.total_payout_amount || 0,
    todayPayIn: cardData?.today_payin || 0,
    todayPayOut: cardData?.today_payout || 0,
  };

  return (
    <>
      {initialLoad ? (
        <DashboardSkeleton />
      ) : (
        <div className="relative w-full flex justify-center py-10 bg-black overflow-hidden">
          {/* Fixed Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff4d4d]/40 via-[#ffb84d]/20 to-[#b33c00] bg-fixed"></div>

          {/* Ambient Glow */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-[#ff4d4d]/30 to-[#ffb84d]/30 blur-3xl rounded-full"></div>

          {/* Content Wrapper */}
          <div className="relative w-full max-w-[1140px] px-4 lg:px-6 z-10">
            {/* -------- TOP CARDS + DONUT/LINE CHART -------- */}
            <div className="mb-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6">
                <DashboardSummary
                  today={today}
                  setToday={setToday}
                  showPassword={showPassword}
                  role={role}
                  donutChart={donutChart}
                  normalCards={normalCards}
                  chartRef1={chartRef1}
                  chartRef2={chartRef2}
                />
              </div>
            </div>

            {/* -------- CHART + TABLE -------- */}
            <div className="space-y-6">
              {chartDataArea && (
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6">
                  <h2 className="mb-4 text-sm font-medium text-[#ffd700]">
                    Transactions Overview
                  </h2>
                  <TransactionsChart chartData={chartDataArea} />
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6">
                {/* <h2 className="mb-4 text-sm font-medium text-[#ffd700]">
                  Recent Transactions
                </h2> */}
                <TransactionTable transactions={transactionData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};