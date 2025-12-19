import { useEffect, useMemo, useState, useRef } from "react";
import { DonutChart } from "../components/DonutChart";
import { LineChart } from "../components/LineChart";
import Table from "../components/Table";
import useAutoFetch from "../hooks/useAutoFetch";
import { MONTH_NAMES } from "../constants/Constants";
import DashboardSkeleton from "../components/DashboardSkeleton";
import "../css/dashboard.css";
import ApexCharts from "apexcharts";
import TransactionStatusPie from "../components/TransactionStatusPie";
import TransactionLineChart from "../components/TransactionLineChart";
import TransactionTable from "../components/TransactionTable";
import { areaOptions1, areaOptions2 } from "../components/chartOptions";
import DashboardCards from "../components/DashboardTopCards";
import TransactionsChart from "../components/TransactionAreaChart";
// import largesttxn from "../images/largesttxn.jpg";

export const Dashboard = () => {
  // Get role from localStorage
  const [role] = useState(atob(localStorage.getItem("role")) || "admin");

  const [transactionData, setTransactionData] = useState([]);
  const [largeTransactionData, setLargeTransactionData] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Fetch data
  const { data: cardData, loading: recordLoading } = useAutoFetch("/collection-record");
  const { data: tableData } = useAutoFetch("/reportrecords-List?status=success");
  const { data: cryptotableData } = useAutoFetch("/crypto-reportrecords-list?status=success");

  const [chartDataArea, setchartDataArea] = useState(null);
  
  const initialDataOfTransactions = tableData?.data;
  const cryptoinitialDataOfTransactions = cryptotableData?.data;

  // console.log("Table Data:", tableData);
  // console.log("Crypto Table Data:", cryptotableData);

  // Process table data
  const processTableData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [initialDataOfTransactions]);

  const cryptoprocessTableData = useMemo(() => {
    if (!cryptoinitialDataOfTransactions) return [];
    return [...cryptoinitialDataOfTransactions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [cryptoinitialDataOfTransactions]);

  // Process top 4 largest transactions
  const processLargeTransactionData = useMemo(() => {
    if (!initialDataOfTransactions) return [];
    return [...initialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [initialDataOfTransactions]);

  const cryptoprocessLargeTransactionData = useMemo(() => {
    if (!cryptoinitialDataOfTransactions) return [];
    return [...cryptoinitialDataOfTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [cryptoinitialDataOfTransactions]);

  // Format transaction & large transaction data
  useEffect(() => {
    const tableSource =
      role === "crypto" ? cryptoprocessTableData : processTableData;

    const largeSource =
      role === "crypto" ? cryptoprocessLargeTransactionData : processLargeTransactionData;

    // Format table data
    const formattedTableData = tableSource.map((item, index) => {
      const date = new Date(item.created_at);
      const formattedDate = `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
      const formattedTime = date.toLocaleTimeString();

      return {
        sq: index + 1,
        txn: item.txnid,
        name: item.user.name,
        type: item.product,
        amount: item.amount,
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        datetime: formattedDate + ' ' + formattedTime
      };
    });
    setTransactionData(formattedTableData);

    // Format large transactions
    const formattedLargeTransactionData = largeSource.map((item) => ({
      name: item.user.name,
      amount: item.amount,
    }));

    setLargeTransactionData(formattedLargeTransactionData);
  }, [
    role,
    processTableData,
    processLargeTransactionData,
    cryptoprocessTableData,
    cryptoprocessLargeTransactionData,
  ]);

  // Table columns
  const transactioncolumn = [
    { header: "SQ No.", accessor: "sqno" },
    { header: "TXN Id", accessor: "txnid" },
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
    { header: "Date/Time", accessor: "time" },
  ];

  useEffect(() => {
    if (!recordLoading && cardData) setInitialLoad(false);
    console.log(cardData);
  }, [recordLoading, cardData]);

useEffect(() => {
    if (!cardData) return;

    // Transform API data to chart format
    // Assuming cardData has these fields: total_payin_amount, total_payin_count, etc.
    const transformedData = {
      Total: {
        PayIn: {
          amount: [cardData.total_payin_amount], // you can expand by months if needed
          count: [cardData.total_payin_count],
        },
        PayOut: {
          amount: [cardData.total_payout_amount],
          count: [cardData.total_payout_count],
        },
      },
      Today: {
        PayIn: {
          amount: [cardData.today_payin_amount],
          count: [cardData.today_payin_count],
        },
        PayOut: {
          amount: [cardData.today_payout_amount],
          count: [cardData.today_payout_count],
        },
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

  // cleanup on unmount
  return () => {
    chart1?.destroy();
    chart2?.destroy();
  };
}, [initialLoad]);

  // normalCards data prepared in Dashboard.jsx
  const normalCards = [
  {
    type: "payin",
    totalTitle: "Total Pay-IN Collection",
    todayTitle: "Today Pay-IN Collection",
    value: cardData?.total_payin_amount ?? 0,
    todayValue: cardData?.today_payin ?? 0,
    ref: chartRef1,
  },
  {
    type: "payout",
    totalTitle: "Total Pay-OUT Collection",
    todayTitle: "Today Pay-OUT Collection",
    value: cardData?.total_payout_amount ?? 0,
    todayValue: cardData?.today_payout ?? 0,
    ref: chartRef2,
  },
  ];

  console.log(cardData?.transactionStatusCounts);
  return (
    <>
      {initialLoad ? (
        <DashboardSkeleton />
      ) : (
        <div className="w-full flex justify-center py-8">
          <div className="w-full max-w-[1140px] px-4 lg:px-6">
            
            {/* -------- TOP CARDS + DONUT/LINE CHART -------- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

              {/* Cards */}
              {/* Charts */}
            {(role === "admin" || role === "user") && (
  <>
    <div className="flex justify-center items-start">
      <div className="w-full max-w-[380px] p-6 rounded-xl backdrop-blur-xl shadow-[0_4px_20px_rgba(255,192,203,0.25)]">
        {/* <DonutChart data={cardData?.transactionStatusCounts} /> */}
        <TransactionStatusPie
          success={200}
          failed={15}
          pending={35}
        />
      </div>
    </div>

    <div>
      {/* Pass the cards to the new component */}
      <DashboardCards cards={normalCards} />
    </div>

  </>
)}
              {role === "crypto" && (
                <>
                  <div className="flex justify-center items-start">
                    <div className="w-full max-w-[380px] p-6 rounded-xl backdrop-blur-xl shadow-[0_4px_20px_rgba(255,192,203,0.25)]">
                      {/* <DonutChart data={cardData?.cryptoTransactionStatusCounts} /> */}
                    </div>
                  </div>
                  <div className="lg:col-span-2 p-6 rounded-xl backdrop-blur-xl shadow-[0_4px_20px_rgba(144,238,144,0.25)]">
                    {/* <LineChart data={cardData?.cryptoMonthWiseStatusCounts} className="h-[260px]" /> */}
                  </div>
                </>
              )}
              {/* Large Transactions */}
            </div>
            {/* -------- TABLE -------- */}
            <div className="mt-8 mb-4">
              <div className="p-4">
                {/* <TransactionLineChart dates={dates} height={350} /> */}
                {/* Add your chart here */}
                {chartDataArea && <TransactionsChart chartData={chartDataArea} />}
                
              </div>
              <TransactionTable transactions={transactionData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};