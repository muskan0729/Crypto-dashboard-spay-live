import { useEffect, useMemo, useState, useRef } from "react";
import useAutoFetch from "../hooks/useAutoFetch";
import { MONTH_NAMES } from "../constants/Constants";
import DashboardSkeleton from "../components/DashboardSkeleton";
import ApexCharts from "apexcharts";
import TransactionTable from "../components/TransactionTable";
import { areaOptions1, areaOptions2 } from "../components/chartOptions";
import TransactionsChart from "../components/TransactionAreaChart";
import DashboardSummary from "../components/DashboardSummary";

export const Dashboard = () => {
  const [role] = useState(atob(localStorage.getItem("role")) || "admin");

  const [transactionData, setTransactionData] = useState([]);
  const [largeTransactionData, setLargeTransactionData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [donutChart, setDonutChart] = useState(null);
  const [today, setToday] = useState(false);

  const { data: cardData, loading: recordLoading } = useAutoFetch("/collection-record");
  const { data: tableData } = useAutoFetch("/reportrecords-List");

  const [chartDataArea, setChartDataArea] = useState(null);

  const initialDataOfTransactions = tableData?.data;

  const processTableData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [initialDataOfTransactions]);

  const processLargeTransactionData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [initialDataOfTransactions]);

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
          item.txnid.length > 20 ? item.txnid.slice(0, 20) + "..." : item.txnid,
        name: item.user.name,
        type: item.product,
        amount: item.amount,
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        datetime: formattedDate + " " + formattedTime,
      };
    });
    setTransactionData(formattedTableData);

    const formattedLargeTransactionData = largeSource.map((item) => ({
      name: item.user.name,
      amount: item.amount,
    }));
    setLargeTransactionData(formattedLargeTransactionData);
  }, [processTableData, processLargeTransactionData]);

  useEffect(() => {
    if (!recordLoading && cardData) setInitialLoad(false);
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
    setChartDataArea(transformedData);
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
        <div className="relative w-full flex justify-center py-10 min-h-screen bg-[#020617] overflow-hidden">
          {/* Background Layers */}
          <div className="absolute inset-0 bg-[#020617] -z-40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_65%)] -z-30"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/80 via-[#020617]/60 to-[#020617]/90 -z-20"></div>
          <div className="absolute w-[520px] h-[520px] bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-transparent blur-3xl rounded-full top-[-140px] right-[-140px] -z-10"></div>

          {/* Content Wrapper */}
          <div className="relative w-full px-4 lg:px-6 z-10">
            {/* -------- Top Cards + Donut/Line Chart -------- */}
            <div className="mb-8">
              <div className="relative rounded-2xl border border-cyan-400/20 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(56,189,248,0.15)] p-6 transition-all duration-300 hover:shadow-[0_0_90px_rgba(56,189,248,0.3)]">
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none"></div>
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

            {/* -------- Chart + Table -------- */}
            <div className="space-y-6">
              {chartDataArea && (
                <div className="relative rounded-2xl border border-cyan-400/20 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(56,189,248,0.15)] p-6 transition-all duration-300 hover:shadow-[0_0_90px_rgba(56,189,248,0.3)]">
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none"></div>
                  <h2 className="mb-4 text-sm font-semibold tracking-wide text-cyan-300 uppercase">
                    Transactions Overview
                  </h2>
                  <TransactionsChart chartData={chartDataArea} />
                </div>
              )}

              <div className="relative rounded-2xl border border-cyan-400/20 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(56,189,248,0.15)] p-6 transition-all duration-300 hover:shadow-[0_0_90px_rgba(56,189,248,0.3)]">
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none"></div>
                <TransactionTable transactions={transactionData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
